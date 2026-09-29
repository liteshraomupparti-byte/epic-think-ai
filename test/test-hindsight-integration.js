/**
 * End-to-End Test Suite for Epic Think AI + Hindsight Long-Term Memory
 * 
 * Verifies:
 * 1. Firebase Authentication token generation & server-side verification
 * 2. User 1 UID extraction & isolation: `epic-think-user-<uid1>`
 * 3. Hindsight memory retain via API endpoint
 * 4. Hindsight memory recall via API endpoint
 * 5. User 2 isolation: User 2 cannot access User 1's memory bank
 * 6. User memory deletion via API endpoint
 * 7. Graceful fallback when memory is empty
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

const API_KEY = "AIzaSyCxDqxRuOH2fsk822rEW3aXjCLII0gNccA";
const SERVER_URL = "http://localhost:3001";

// Initialize admin SDK in test script
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve('./service-account.json'), 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'epic-think'
});

async function getIdTokenForUser(uid) {
  const customToken = await admin.auth().createCustomToken(uid);
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });
  if (!res.ok) {
    throw new Error(`Failed to exchange custom token: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.idToken;
}

async function runTestSuite() {
  console.log('====================================================');
  console.log(' STARTING EPIC THINK AI - HINDSIGHT INTEGRATION TESTS');
  console.log('====================================================\n');

  // Test 1: Service Status Check
  console.log('--- TEST 1: Service Status Check ---');
  const statusRes = await fetch(`${SERVER_URL}/api/memory/status`);
  const statusData = await statusRes.json();
  console.log('Status endpoint response:', statusData);
  if (!statusData.ready) throw new Error('Hindsight service is not ready!');
  console.log('✅ TEST 1 PASSED: Hindsight status is healthy\n');

  // Test 2: Unauthenticated Request Rejection
  console.log('--- TEST 2: Unauthenticated Request Rejection ---');
  const unauthRes = await fetch(`${SERVER_URL}/api/memory/recall`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'test query' })
  });
  console.log('Unauthenticated status code:', unauthRes.status);
  const unauthData = await unauthRes.json();
  console.log('Unauthenticated error:', unauthData.error);
  if (unauthRes.status !== 401) throw new Error('Unauthenticated request was not rejected with 401!');
  console.log('✅ TEST 2 PASSED: Protected endpoint correctly rejected without token\n');

  // Test 3: Authenticated User 1 Retain & Recall
  const uid1 = 'test-uid-alice-' + Date.now();
  console.log(`--- TEST 3: User 1 Retain & Recall (UID: ${uid1}) ---`);
  const token1 = await getIdTokenForUser(uid1);
  console.log('Generated verified Firebase ID token for User 1.');

  // Retain User 1 memory
  const retainRes = await fetch(`${SERVER_URL}/api/memory/retain`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}`
    },
    body: JSON.stringify({
      content: 'User 1 is building an autonomous finance dashboard using Python FastAPI and React Tailwind.',
      context: 'project_architecture'
    })
  });
  const retainData = await retainRes.json();
  console.log('User 1 retain response:', retainData);
  if (!retainData.success) throw new Error('Retain failed for User 1!');
  console.log('Retain successful. Memory bank:', retainData.bankId);

  // Recall User 1 memory
  const recallRes = await fetch(`${SERVER_URL}/api/memory/recall`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}`
    },
    body: JSON.stringify({
      query: 'What framework and styling is User 1 using for their finance project?'
    })
  });
  const recallData = await recallRes.json();
  console.log('User 1 recall results count:', recallData.count);
  console.log('Recalled memory text:', recallData.results?.[0]?.text);
  console.log('Entities extracted by Hindsight:', recallData.entities);
  if (!recallData.results || recallData.results.length === 0) {
    throw new Error('Recall returned 0 memories for User 1!');
  }
  console.log('✅ TEST 3 PASSED: User 1 retained and recalled memory successfully\n');

  // Test 4: Strict User Isolation (User 2 Cannot See User 1's Memories)
  const uid2 = 'test-uid-bob-' + Date.now();
  console.log(`--- TEST 4: User Isolation (User 2 UID: ${uid2}) ---`);
  const token2 = await getIdTokenForUser(uid2);
  console.log('Generated verified Firebase ID token for User 2.');

  const recallUser2Res = await fetch(`${SERVER_URL}/api/memory/recall`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token2}`
    },
    body: JSON.stringify({
      query: 'What framework and styling is being used for the finance dashboard?'
    })
  });
  const recallUser2Data = await recallUser2Res.json();
  console.log('User 2 recall results count:', recallUser2Data.count);
  console.log('User 2 bankId:', recallUser2Data.bankId);
  if (recallUser2Data.count !== 0) {
    throw new Error(`SECURITY BREACH: User 2 was able to access User 1's memory!`);
  }
  console.log('✅ TEST 4 PASSED: User 2 isolated bank returned 0 memories (Strict multi-tenant isolation verified)\n');

  // Test 5: Forget Memory (DELETE /api/memory)
  console.log('--- TEST 5: Memory Deletion / Forget Memory ---');
  const deleteRes = await fetch(`${SERVER_URL}/api/memory`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token1}`
    }
  });
  const deleteData = await deleteRes.json();
  console.log('Delete response:', deleteData);
  if (!deleteData.success) throw new Error('Failed to delete User 1 memory bank!');

  // Verify recall after delete returns 0
  const postDeleteRecall = await fetch(`${SERVER_URL}/api/memory/recall`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}`
    },
    body: JSON.stringify({ query: 'finance dashboard' })
  });
  const postDeleteData = await postDeleteRecall.json();
  console.log('Post-delete recall count:', postDeleteData.count);
  if (postDeleteData.count !== 0) {
    throw new Error('Memory still present after deletion!');
  }
  console.log('✅ TEST 5 PASSED: Memory was securely wiped\n');

  console.log('====================================================');
  console.log(' ALL HINDSIGHT INTEGRATION TESTS PASSED 100%');
  console.log('====================================================');
}

runTestSuite().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
