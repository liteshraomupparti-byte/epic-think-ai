/**
 * Integration Test Suite: MongoDB & Real-Time WebSocket Sync
 * 
 * Tests:
 * 1. Database status endpoint (/api/conversations/status)
 * 2. Authenticated conversation save & retrieval
 * 3. Strict multi-tenant isolation between different Firebase UIDs
 * 4. Title update, message append, feedback persistence
 * 5. Real-time WebSocket connection, authentication, and live broadcast
 * 6. Conversation deletion and cleanup
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_URL = 'http://localhost:3001';
const WS_URL = 'ws://localhost:3001/ws';

// Ensure Firebase Admin is initialized
const saPath = path.resolve(__dirname, '../service-account.json');
let adminApp;
try {
  adminApp = admin.app();
} catch (_) {
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: 'epic-think'
  }, 'test-mongo-app');
}

async function getCustomToken(uid) {
  return await admin.auth(adminApp).createCustomToken(uid);
}

// Convert custom token to ID token via Firebase REST API
async function getIdToken(uid) {
  const customToken = await getCustomToken(uid);
  const apiKey = "AIzaSyCxDqxRuOH2fsk822rEW3aXjCLII0gNccA";
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });
  const data = await res.json();
  if (!data.idToken) throw new Error('Failed to get idToken: ' + JSON.stringify(data));
  return data.idToken;
}

async function runTests() {
  console.log('===============================================================');
  console.log(' Starting MongoDB & Real-Time Sync Integration Test Suite');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
    }
  }

  // TEST 1: Status endpoint
  console.log('Test 1: MongoDB Service Status Endpoint');
  try {
    const res = await fetch(`${SERVER_URL}/api/conversations/status`);
    const data = await res.json();
    assert(res.ok && data.success === true, 'Public status endpoint returns success: true');
    assert(data.collection === 'conversations', 'Target collection is "conversations"');
    console.log(`    Mode: ${data.mode}, Status: ${data.status}, Total docs: ${data.totalConversations}`);
  } catch (err) {
    assert(false, 'Status endpoint check failed: ' + err.message);
  }

  // Setup test users
  const user1Uid = `test-user-alice-${Date.now()}`;
  const user2Uid = `test-user-bob-${Date.now()}`;
  console.log(`\nGenerating tokens for User 1 (${user1Uid}) and User 2 (${user2Uid})...`);

  const token1 = await getIdToken(user1Uid);
  const token2 = await getIdToken(user2Uid);

  // TEST 2: User 1 saves a new conversation
  console.log('\nTest 2: Real-Time Conversation Save');
  const chat1 = {
    id: `chat_${Date.now()}`,
    title: 'Quantum Computing Intro',
    createdAt: Date.now(),
    messages: [
      {
        id: `msg_1_${Date.now()}`,
        role: 'user',
        text: 'Can you explain quantum superposition?',
        timestamp: Date.now()
      },
      {
        id: `msg_2_${Date.now()}`,
        role: 'assistant',
        text: 'Quantum superposition is a fundamental principle of quantum mechanics...',
        timestamp: Date.now(),
        thoughts: 'Explaining state vectors and qubit probabilities.'
      }
    ]
  };

  try {
    const saveRes = await fetch(`${SERVER_URL}/api/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify({ conversation: chat1 })
    });
    const saveData = await saveRes.json();
    assert(saveRes.ok && saveData.success === true, 'Conversation saved successfully');
    assert(saveData.conversation.title === chat1.title, 'Saved conversation title matches');
    assert(saveData.conversation.messages.length === 2, 'Message count is 2');
  } catch (err) {
    assert(false, 'Save conversation error: ' + err.message);
  }

  // TEST 3: User 1 retrieves conversations
  console.log('\nTest 3: Fetch Conversations for User 1');
  try {
    const getRes = await fetch(`${SERVER_URL}/api/conversations`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const getData = await getRes.json();
    assert(getRes.ok && getData.success === true, 'Conversations fetched successfully');
    assert(getData.conversations.length >= 1, 'Conversations array has at least 1 item');
    assert(getData.conversations.some(c => c.id === chat1.id), 'Contains chat1');
  } catch (err) {
    assert(false, 'Fetch conversations error: ' + err.message);
  }

  // TEST 4: Multi-Tenant Isolation
  console.log('\nTest 4: Strict Multi-Tenant Isolation');
  try {
    const getBobRes = await fetch(`${SERVER_URL}/api/conversations`, {
      headers: { 'Authorization': `Bearer ${token2}` }
    });
    const getBobData = await getBobRes.json();
    assert(getBobRes.ok && getBobData.success === true, 'Bob fetched his conversations');
    assert(getBobData.conversations.length === 0, 'Bob has 0 conversations (isolated from Alice)');
  } catch (err) {
    assert(false, 'Multi-tenant isolation check error: ' + err.message);
  }

  // TEST 5: Title Update
  console.log('\nTest 5: Update Conversation Title');
  const updatedTitle = 'Advanced Quantum Computing';
  try {
    const patchRes = await fetch(`${SERVER_URL}/api/conversations/${chat1.id}/title`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify({ title: updatedTitle })
    });
    const patchData = await patchRes.json();
    assert(patchRes.ok && patchData.success === true, 'Title patched successfully');
    assert(patchData.title === updatedTitle, 'Returned title matches updated string');
  } catch (err) {
    assert(false, 'Title update error: ' + err.message);
  }

  // TEST 6: Real-time Message Append
  console.log('\nTest 6: Real-Time Message Append');
  const msg3 = {
    id: `msg_3_${Date.now()}`,
    role: 'user',
    text: 'What are Shor and Grover algorithms?',
    timestamp: Date.now()
  };
  try {
    const msgRes = await fetch(`${SERVER_URL}/api/conversations/${chat1.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify({ message: msg3 })
    });
    const msgData = await msgRes.json();
    assert(msgRes.ok && msgData.success === true, 'Message appended successfully');

    // Verify conversation now has 3 messages
    const verifyRes = await fetch(`${SERVER_URL}/api/conversations/${chat1.id}`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const verifyData = await verifyRes.json();
    assert(verifyData.conversation.messages.length === 3, 'Conversation now has 3 messages');
  } catch (err) {
    assert(false, 'Message append error: ' + err.message);
  }

  // TEST 7: Feedback Persistence
  console.log('\nTest 7: Message Feedback Persistence');
  try {
    const fbRes = await fetch(`${SERVER_URL}/api/conversations/${chat1.id}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify({
        messageIndex: 1,
        feedback: { rating: 'up', timestamp: Date.now() }
      })
    });
    const fbData = await fbRes.json();
    assert(fbRes.ok && fbData.success === true, 'Feedback saved successfully');
  } catch (err) {
    assert(false, 'Feedback save error: ' + err.message);
  }

  // TEST 8: WebSocket Real-Time Channel & Live Broadcast
  console.log('\nTest 8: WebSocket Real-Time Connection & Live Event Broadcast');
  await new Promise((resolve) => {
    const wsAlice1 = new WebSocket(WS_URL);
    const wsAlice2 = new WebSocket(WS_URL);

    let authCount = 0;

    function handleAuthSuccess() {
      authCount++;
      if (authCount === 2) {
        // Both connected and authenticated. Now wsAlice1 sends a real-time message
        wsAlice1.send(JSON.stringify({
          type: 'save_message',
          chatId: chat1.id,
          message: {
            id: `ws_msg_${Date.now()}`,
            role: 'assistant',
            text: 'Shor algorithm solves prime factorization in polynomial time.',
            timestamp: Date.now()
          }
        }));
      }
    }

    wsAlice1.on('open', () => {
      wsAlice1.send(JSON.stringify({ type: 'auth', token: token1 }));
    });

    wsAlice2.on('open', () => {
      wsAlice2.send(JSON.stringify({ type: 'auth', token: token1 }));
    });

    wsAlice1.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.type === 'auth_success') {
        handleAuthSuccess();
      }
    });

    wsAlice2.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.type === 'auth_success') {
        handleAuthSuccess();
      } else if (msg.type === 'message_saved') {
        assert(msg.chatId === chat1.id, 'wsAlice2 received real-time message_saved broadcast');
        assert(msg.message.text.includes('Shor algorithm'), 'Broadcasted message content verified');

        wsAlice1.close();
        wsAlice2.close();
        resolve();
      }
    });

    setTimeout(() => {
      wsAlice1.close();
      wsAlice2.close();
      resolve();
    }, 5000);
  });

  // TEST 9: Delete Conversation
  console.log('\nTest 9: Delete Conversation');
  try {
    const delRes = await fetch(`${SERVER_URL}/api/conversations/${chat1.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const delData = await delRes.json();
    assert(delRes.ok && delData.success === true, 'Conversation deleted successfully');

    // Verify it is gone
    const checkRes = await fetch(`${SERVER_URL}/api/conversations/${chat1.id}`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    assert(checkRes.status === 404, 'Deleted conversation returns 404');
  } catch (err) {
    assert(false, 'Delete conversation error: ' + err.message);
  }

  console.log('\n===============================================================');
  console.log(` TEST RESULTS: ${passed}/${total} assertions passed (${Math.round((passed/total)*100)}%)`);
  console.log('===============================================================\n');

  if (passed === total) {
    console.log(' All MongoDB and Real-Time persistence tests passed with 100% success!\n');
    process.exit(0);
  } else {
    console.error(' Some tests failed!\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
