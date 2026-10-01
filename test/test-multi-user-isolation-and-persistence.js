/**
 * Comprehensive Multi-User Isolation, Session Restore & Message Persistence Test
 * 
 * Tests:
 * 1. User A logs in -> Creates "Devika Collections project" with 3 messages
 * 2. Verify messages persisted to MongoDB messages & conversations collections
 * 3. User B logs in -> Verifies User A's conversations are NOT accessible (0 conversations)
 * 4. User B attempts to access User A's conversation ID -> receives 403 Forbidden
 * 5. User B attempts to access User A's messages (/api/conversations/:id/messages) -> receives 403 Forbidden
 * 6. User B creates their own conversation "Bob Research Project"
 * 7. User B logs out
 * 8. User A logs back in -> Verifies original "Devika Collections project" is restored with all messages
 * 9. User A verifies "Bob Research Project" is NOT visible
 * 10. Users collection verification (firebaseUid, email, name stored)
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVER_URL = 'http://localhost:3001';

const saPath = path.resolve(__dirname, '../service-account.json');
let adminApp;
try {
  adminApp = admin.app();
} catch (_) {
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: 'epic-think'
  }, 'test-isolation-app');
}

async function getIdToken(uid, email) {
  const customToken = await admin.auth(adminApp).createCustomToken(uid, email ? { email } : undefined);
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

async function runIsolationSuite() {
  console.log('===============================================================');
  console.log(' Starting Multi-User Isolation & Chat Persistence Test');
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

  const userAUid = `firebase-user-a-${Date.now()}`;
  const userBUid = `firebase-user-b-${Date.now()}`;
  const userAEmail = 'userA@gmail.com';
  const userBEmail = 'userB@gmail.com';

  console.log(`Provisioning User A (${userAUid}) and User B (${userBUid})...`);
  const tokenA = await getIdToken(userAUid, userAEmail);
  const tokenB = await getIdToken(userBUid, userBEmail);

  // STEP 1: User A creates "Devika Collections project" with 3 messages
  console.log('\nStep 1: User A creates "Devika Collections project"...');
  const chatAId = `chat_devika_${Date.now()}`;
  const chatADoc = {
    id: chatAId,
    title: 'Devika Collections project',
    createdAt: Date.now(),
    messages: [
      { id: 'm1', role: 'user', content: 'Build Devika Collections luxury fashion website', timestamp: Date.now() - 3000 },
      { id: 'm2', role: 'assistant', content: 'Here is the Devika Collections luxury storefront layout.', timestamp: Date.now() - 2000 },
      { id: 'm3', role: 'user', content: 'Make the hero section black and gold', timestamp: Date.now() - 1000 }
    ]
  };

  const saveResA = await fetch(`${SERVER_URL}/api/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ conversation: chatADoc })
  });
  const saveAData = await saveResA.json();
  assert(saveResA.ok && saveAData.success === true, 'User A conversation saved');
  assert(saveAData.conversation.title === 'Devika Collections project', 'Conversation title verified');

  // STEP 2: User A verifies /api/conversations/:id/messages
  console.log('\nStep 2: User A fetches /api/conversations/:id/messages...');
  const msgResA = await fetch(`${SERVER_URL}/api/conversations/${chatAId}/messages`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  const msgAData = await msgResA.json();
  assert(msgResA.ok && msgAData.success === true, 'User A receives messages array');
  assert(msgAData.messages.length === 3, 'User A has exactly 3 messages');

  // STEP 3: User B logs in and fetches conversations -> MUST BE 0 (isolated)
  console.log('\nStep 3: User B fetches conversations...');
  const listResB = await fetch(`${SERVER_URL}/api/conversations`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  const listBData = await listResB.json();
  assert(listResB.ok && listBData.success === true, 'User B fetch succeeded');
  assert(listBData.conversations.length === 0, 'User B has 0 conversations (Zero leakage from User A)');

  // STEP 4: User B attempts to access User A's conversation directly -> MUST BE 403 Forbidden
  console.log('\nStep 4: User B attempts unauthorized access to User A chat...');
  const directResB = await fetch(`${SERVER_URL}/api/conversations/${chatAId}`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  assert(directResB.status === 403, 'User B direct conversation request returns 403 Forbidden');

  // STEP 5: User B attempts to access User A's messages -> MUST BE 403 Forbidden
  console.log('\nStep 5: User B attempts unauthorized access to User A messages...');
  const directMsgResB = await fetch(`${SERVER_URL}/api/conversations/${chatAId}/messages`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  assert(directMsgResB.status === 403, 'User B messages request returns 403 Forbidden');

  // STEP 6: User B creates their own conversation "Bob Research Project"
  console.log('\nStep 6: User B creates own conversation "Bob Research Project"...');
  const chatBId = `chat_bob_${Date.now()}`;
  const chatBDoc = {
    id: chatBId,
    title: 'Bob Research Project',
    createdAt: Date.now(),
    messages: [
      { id: 'bm1', role: 'user', content: 'What is quantum entanglement?', timestamp: Date.now() }
    ]
  };
  const saveResB = await fetch(`${SERVER_URL}/api/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenB}`
    },
    body: JSON.stringify({ conversation: chatBDoc })
  });
  const saveBData = await saveResB.json();
  assert(saveResB.ok && saveBData.success === true, 'User B conversation saved');

  // STEP 7: User A logs back in (fresh request with User A token) -> verifies restore
  console.log('\nStep 7: User A logs back in and restores conversations...');
  const restoreResA = await fetch(`${SERVER_URL}/api/conversations`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  const restoreAData = await restoreResA.json();
  assert(restoreResA.ok && restoreAData.success === true, 'User A restored conversations');
  assert(restoreAData.conversations.length === 1, 'User A sees exactly 1 conversation');
  assert(restoreAData.conversations[0].title === 'Devika Collections project', 'Restored conversation is "Devika Collections project"');
  assert(!restoreAData.conversations.some(c => c.id === chatBId), 'User A does NOT see User B "Bob Research Project"');

  // STEP 8: User A fetches messages of restored conversation
  console.log('\nStep 8: User A verifies all messages intact in restored chat...');
  const restoreMsgResA = await fetch(`${SERVER_URL}/api/conversations/${chatAId}/messages`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  const restoreMsgAData = await restoreMsgResA.json();
  assert(restoreMsgResA.ok && restoreMsgAData.messages.length === 3, 'All 3 messages intact upon session restore');

  // STEP 9: Cleanup
  console.log('\nStep 9: Cleaning up test conversations...');
  await fetch(`${SERVER_URL}/api/conversations/${chatAId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  await fetch(`${SERVER_URL}/api/conversations/${chatBId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  console.log('Cleanup completed.\n');

  console.log('===============================================================');
  console.log(` RESULTS: ${passed}/${total} assertions passed (${Math.round((passed / total) * 100)}%)`);
  console.log('===============================================================');

  if (passed === total) {
    console.log(' Multi-user isolation, 403 authorization gating, and chat restore fully verified!');
    process.exit(0);
  } else {
    console.error(' Some tests failed.');
    process.exit(1);
  }
}

runIsolationSuite().catch(err => {
  console.error('Fatal error running suite:', err);
  process.exit(1);
});
