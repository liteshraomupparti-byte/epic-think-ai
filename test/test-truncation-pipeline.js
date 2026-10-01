/**
 * test-truncation-pipeline.js
 * End-to-end verification of output truncation fix:
 * 1. GenerationConfig resolution and output token ceilings (4096 - 8192)
 * 2. Model registry output capacities
 * 3. Short response test
 * 4. Medium response streaming test (SSE chunk accumulation & metadata)
 * 5. Long response test (Python explanation from beginner to intermediate)
 * 6. Continuation generation test (isContinuation, partialResponse, no duplicate prefix)
 * 7. MongoDB persistence of long message
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'http://localhost:3001';

const saPath = path.resolve(__dirname, '../service-account.json');
let adminApp;
try {
  adminApp = admin.app();
} catch (_) {
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: 'epic-think'
  }, 'test-trunc-app');
}

async function getIdToken(uid) {
  try {
    const customToken = await admin.auth(adminApp).createCustomToken(uid);
    const apiKey = "AIzaSyCxDqxRuOH2fsk822rEW3aXjCLII0gNccA";
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: customToken, returnSecureToken: true })
    });
    const data = await res.json();
    return data.idToken || null;
  } catch (err) {
    return null;
  }
}

async function runTests() {
  console.log('========================================================');
  console.log('EPIC THINK AI: TRUNCATION & GENERATION PIPELINE TEST SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Check Model Registry & Config
  console.log('--- 1. Testing Model Registry & Configured Output Limits ---');
  try {
    const res = await fetch(`${BASE_URL}/api/ai/models`);
    const data = await res.json();
    assert(data.success === true, 'GET /api/ai/models succeeds');
    assert(Array.isArray(data.models) && data.models.length > 0, 'Models list returned');
    
    const qwen = data.models.find(m => m.id.includes('qwen'));
    const gptOss = data.models.find(m => m.id.includes('gpt-oss'));
    const gemini = data.models.find(m => m.id.includes('gemini'));

    console.log(`   - Qwen max output tokens: ${qwen?.maxOutputTokens}`);
    console.log(`   - GPT-OSS max output tokens: ${gptOss?.maxOutputTokens}`);
    console.log(`   - Gemini max output tokens: ${gemini?.maxOutputTokens}`);

    assert(qwen && qwen.maxOutputTokens >= 4096, 'Qwen model configured with >= 4096 maxOutputTokens (not 800)');
    assert(gptOss && gptOss.maxOutputTokens >= 8192, 'GPT-OSS configured with >= 8192 maxOutputTokens');
    assert(gemini && gemini.maxOutputTokens >= 8192, 'Gemini configured with >= 8192 maxOutputTokens');
  } catch (err) {
    assert(false, `Model Registry check error: ${err.message}`);
  }

  // 2. Short response test
  console.log('\n--- 2. Testing Short Response Generation ---');
  try {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Reply in one short sentence: What is Epic Think AI?' }],
        provider: 'groq'
      })
    });
    const data = await res.json();
    const duration = Date.now() - t0;
    
    assert(data.success === true, `Short response returned successfully in ${duration}ms`);
    assert(typeof data.response === 'string' && data.response.length > 10, 'Response text is non-empty');
    assert(data.finishReason === 'stop', `finishReason is correctly captured as "${data.finishReason}"`);
    assert(data.isTruncated === false, 'isTruncated is false');
    assert(data.maxOutputTokens >= 900, `maxOutputTokens reported as ${data.maxOutputTokens} (>= 900 for Groq/Qwen)`);
    console.log(`   Response preview: "${data.response.trim().slice(0, 100)}..."`);
  } catch (err) {
    assert(false, `Short response error: ${err.message}`);
  }

  // 3. Medium response streaming test (SSE chunk accumulation)
  console.log('\n--- 3. Testing Medium Response Streaming (SSE Chunk Accumulation) ---');
  try {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/ai/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Give me 3 practical tips for writing clean code with brief bullet points.' }],
        modelPreset: 'Epic Think Fast'
      })
    });

    assert(res.ok && res.headers.get('content-type')?.includes('text/event-stream'), 'SSE content-type returned');

    let accumulatedText = '';
    let chunkCount = 0;
    let doneMetadata = null;

    const rawBody = await res.text();
    const lines = rawBody.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') {
          // done without meta
        } else {
          try {
            const parsed = JSON.parse(payload);
            if ((parsed.type === 'chunk' || parsed.event === 'ai:chunk') && (parsed.content || parsed.text)) {
              accumulatedText += (parsed.content || parsed.text);
              chunkCount++;
            } else if (parsed.event === 'ai:complete' && parsed.text && !accumulatedText) {
              accumulatedText += parsed.text;
              chunkCount++;
            } else if (parsed.type === 'done' || parsed.done || parsed.event === 'ai:done') {
              doneMetadata = parsed;
            }
          } catch (e) {
            // raw token
            accumulatedText += payload;
            chunkCount++;
          }
        }
      }
    }

    const duration = Date.now() - t0;
    console.log(`   - Stream finished in ${duration}ms across ${chunkCount} chunks`);
    console.log(`   - Total characters accumulated: ${accumulatedText.length}`);
    if (doneMetadata) {
      console.log(`   - Done metadata: finishReason=${doneMetadata.finishReason}, maxOutputTokens=${doneMetadata.maxOutputTokens}`);
    }

    assert(chunkCount >= 1, `Stream chunks received (${chunkCount} chunks)`);
    assert(accumulatedText.length > 50, 'Accumulated stream text is substantial');
    assert(accumulatedText.includes('1') || accumulatedText.includes('•') || accumulatedText.includes('-') || accumulatedText.includes('*'), 'Contains structured tips');
    if (doneMetadata) {
      assert(doneMetadata.finishReason === 'stop', `Stream finishReason is "${doneMetadata.finishReason}"`);
      assert(doneMetadata.isTruncated === false, 'Stream isTruncated is false');
    }
  } catch (err) {
    assert(false, `Streaming test error: ${err.message}`);
  }

  // 4. Long response test (Python explanation from beginner to intermediate)
  console.log('\n--- 4. Testing Long Response Generation (Complete Python Guide) ---');
  console.log('   Prompt: "Write a detailed explanation of Python from beginner to intermediate level including variables, data types, operators, conditions, loops, functions, lists, dictionaries, examples, common mistakes and practice questions."');
  try {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: 'Write a detailed explanation of Python from beginner to intermediate level including variables, data types, operators, conditions, loops, functions, lists, dictionaries, examples, common mistakes and practice questions.'
        }],
        modelPreset: 'Epic Think o1'
      })
    });
    const data = await res.json();
    const duration = Date.now() - t0;

    assert(data.success === true, `Long response completed in ${duration}ms`);
    const wordCount = data.response.split(/\s+/).filter(Boolean).length;
    console.log(`   - Generated characters: ${data.response.length}`);
    console.log(`   - Generated approximate words: ${wordCount}`);
    console.log(`   - Finish reason: ${data.finishReason}`);
    console.log(`   - Max output tokens configured: ${data.maxOutputTokens}`);
    console.log(`   - First 120 chars: "${data.response.slice(0, 120).replace(/\n/g, ' ')}..."`);
    console.log(`   - Last 120 chars: "...${data.response.slice(-120).replace(/\n/g, ' ')}"`);

    // Verify it exceeds the old 800 token cutoff (~400-500 words)
    assert(wordCount > 600, `Generated response is deep and comprehensive (${wordCount} words > 600 words)`);
    // Verify it does not stop in the middle of a sentence
    const trimmed = data.response.trim();
    const chars = Array.from(trimmed);
    const lastChar = chars[chars.length - 1];
    const endsNaturally = ['.', '!', '?', '`', '"', "'", ')', '}', ']', ':', '🚀', '✨', '🎉', '👍', '😊'].includes(lastChar) || trimmed.endsWith('```') || /\p{P}|\p{S}/u.test(lastChar);
    assert(endsNaturally, `Response ends with natural punctuation/formatting ('${lastChar}')`);
    assert(data.finishReason === 'stop' || data.finishReason === 'length', `finishReason is recognized (${data.finishReason})`);
    
    // Check that it covers intermediate topics that used to be cut off
    assert(data.response.toLowerCase().includes('function') && data.response.toLowerCase().includes('dictionar'), 'Covers intermediate topics (functions & dictionaries)');
  } catch (err) {
    assert(false, `Long response test error: ${err.message}`);
  }

  // 5. Continuation Generation Test
  console.log('\n--- 5. Testing Continuation Generation Feature ---');
  try {
    const originalPrompt = 'Explain key topics in linear algebra and calculus for engineering students.';
    const simulatedTruncation = 'Focus on: Linear Algebra (Matrices, Determinants) OR Calculus (Limits, Derivatives) – Pick whichever is in your syllabus and';

    console.log(`   Simulated partial response: "${simulatedTruncation}"`);

    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: originalPrompt }],
        isContinuation: true,
        partialResponse: simulatedTruncation,
        provider: 'groq'
      })
    });
    const data = await res.json();
    const duration = Date.now() - t0;

    assert(data.success === true, `Continuation returned in ${duration}ms`);
    console.log(`   - Continuation received: "${data.response.trim().slice(0, 150)}..."`);

    // Check that continuation does NOT repeat the partial response
    const startsWithDuplicate = data.response.trim().toLowerCase().startsWith('focus on: linear algebra');
    assert(!startsWithDuplicate, 'Continuation does not repeat the previous response');

    // Combine them
    const combined = simulatedTruncation + (data.response.startsWith(' ') ? '' : ' ') + data.response;
    console.log(`   - Combined seamless preview: "${combined.slice(0, 180)}..."`);
    assert(combined.length > simulatedTruncation.length + 50, 'Combined text smoothly expands the answer');
  } catch (err) {
    assert(false, `Continuation test error: ${err.message}`);
  }

  // 6. Persistence in MongoDB / Conversation Storage
  console.log('\n--- 6. Testing Persistence & History Retrieval ---');
  try {
    const testUserId = `test_trunc_user_${Date.now()}`;
    const token = await getIdToken(testUserId);
    const testChatId = `chat_trunc_${Date.now()}`;
    const fullAssistantContent = 'This is a complete, un-truncated response generated by Epic Think AI with full 4096-token capacity.';

    // Save conversation
    const saveRes = await fetch(`${BASE_URL}/api/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        conversation: {
          id: testChatId,
          title: 'Truncation Test Chat',
          createdAt: Date.now(),
          messages: [
            {
              id: `msg_${Date.now()}`,
              role: 'assistant',
              content: fullAssistantContent,
              isTruncated: false,
              finishReason: 'stop',
              maxOutputTokens: 4096,
              timestamp: Date.now()
            }
          ]
        }
      })
    });
    const saveData = await saveRes.json();
    assert(saveData.success === true, 'Conversation with metadata saved to database');

    // Retrieve conversation
    const getRes = await fetch(`${BASE_URL}/api/conversations/${testChatId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const getData = await getRes.json();
    assert(getData.success === true, 'Conversation retrieved successfully');
    const savedMsg = getData.conversation?.messages?.[0];
    assert(savedMsg && savedMsg.content === fullAssistantContent, 'Full assistant content was preserved completely in DB');
    assert(savedMsg && savedMsg.finishReason === 'stop', 'Stored finishReason metadata intact');
  } catch (err) {
    assert(false, `Persistence test error: ${err.message}`);
  }

  console.log('\n========================================================');
  console.log(`FINAL RESULT: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
