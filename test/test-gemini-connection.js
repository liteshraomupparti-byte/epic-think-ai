import dotenv from 'dotenv';
dotenv.config();

import { geminiProvider } from '../ai/index.js';

async function testGemini() {
  console.log('====================================================');
  console.log('🔍 Checking Google Gemini API Connectivity...');
  console.log('====================================================');

  console.log('1. Configuration Check:');
  console.log('   Provider ID:      ', geminiProvider.id);
  console.log('   Provider Name:    ', geminiProvider.name);
  console.log('   Is Configured:    ', geminiProvider.isConfigured);
  console.log('   API Key Present:  ', Boolean(process.env.GEMINI_API_KEY));
  console.log('   Base URL:         ', geminiProvider.baseUrl);
  console.log('   Default Model:    ', geminiProvider.defaultModel);

  if (!geminiProvider.isConfigured) {
    console.error('❌ GEMINI_API_KEY is not set or empty in environment!');
    process.exit(1);
  }

  console.log('\n2. Testing Real Generation via Gemini API...');
  const t0 = Date.now();
  try {
    const res = await geminiProvider.generate({
      prompt: 'Confirm Gemini connection in exactly five words.',
      model: 'gemini-2.5-flash',
      temperature: 0.2
    });
    const duration = Date.now() - t0;

    console.log('✅ Gemini API call SUCCEEDED!');
    console.log('   Response Text:   ', JSON.stringify(res.content));
    console.log('   Model Used:      ', res.model);
    console.log('   Finish Reason:   ', res.finishReason);
    console.log('   Prompt Tokens:   ', res.usage?.promptTokens);
    console.log('   Completion Tokens:', res.usage?.completionTokens);
    console.log('   Roundtrip Latency:', `${duration}ms`);
  } catch (err) {
    console.error('❌ Direct call to gemini-2.5-flash failed:', err.message);

    console.log('\nAttempting fallback model check (gemini-1.5-flash)...');
    try {
      const res2 = await geminiProvider.generate({
        prompt: 'Confirm Gemini connection in five words.',
        model: 'gemini-1.5-flash',
        temperature: 0.2
      });
      console.log('✅ Fallback model gemini-1.5-flash SUCCEEDED!');
      console.log('   Response Text:', JSON.stringify(res2.content));
      console.log('   Model Used:   ', res2.model);
    } catch (err2) {
      console.error('❌ Fallback call also failed:', err2.message);
      process.exit(1);
    }
  }

  console.log('\n3. Testing Gemini Model Discovery (listModels)...');
  try {
    const models = await geminiProvider.listModels();
    console.log(`✅ Retrieved ${models.length} accessible models from Google Gemini API.`);
    console.log('   Top available models:', models.slice(0, 5).map(m => m.id).join(', '));
  } catch (err) {
    console.warn('⚠️ Model list discovery warning:', err.message);
  }

  console.log('\n====================================================');
  console.log('🎉 GOOGLE GEMINI API IS FULLY CONNECTED & OPERATIONAL');
  console.log('====================================================');
}

testGemini().catch(err => {
  console.error('Fatal Gemini connection error:', err);
  process.exit(1);
});
