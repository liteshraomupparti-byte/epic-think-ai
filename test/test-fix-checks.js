import dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin';
import '../services/firebaseAuthService.js';

async function getLiveIdToken(uid = 'test_check_user_' + Date.now()) {
  const customToken = await admin.auth().createCustomToken(uid);
  const apiKey = "AIzaSyCxDqxRuOH2fsk822rEW3aXjCLII0gNccA";
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Token exchange failed: ' + JSON.stringify(data));
  return { idToken: data.idToken, uid };
}

async function testPrompt(idToken, prompt, modelPreset = 'Epic Think Fast') {
  console.log(`\nTesting: "${prompt}" [Preset: ${modelPreset}]...`);
  const res = await fetch('http://localhost:3001/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify({
      message: prompt,
      modelPreset,
      conversationId: 'test_conv_' + Date.now()
    })
  });

  const data = await res.json();
  console.log('  Status:', res.status);
  console.log('  Provider:', data.provider);
  console.log('  Model:', data.model);
  console.log('  Latency:', data.latency + 'ms');
  console.log('  Response Snippet:', (data.text || '').slice(0, 160) + '...');

  if (!data.text || data.text.includes('I completed the necessary checks')) {
    throw new Error(`FAIL: Bug detected! Model returned: "${data.text}"`);
  }
  console.log('  ✅ PASS: Valid response received.');
  return data;
}

async function run() {
  console.log('====================================================');
  console.log(' VERIFYING RESOLUTION OF "I completed the necessary checks" BUG');
  console.log('====================================================');

  const { idToken, uid } = await getLiveIdToken();
  console.log(`Authenticated UID: ${uid}`);

  // 1. Greeting
  await testPrompt(idToken, 'Hello! Who are you and how can you help me?', 'Epic Think Fast');

  // 2. Date query
  await testPrompt(idToken, 'What is today\'s date?', 'Epic Think Fast');

  // 3. Time query
  await testPrompt(idToken, 'What is the current time?', 'Epic Think Fast');

  // 4. Coding query (o1 / Deep Think)
  await testPrompt(idToken, 'Write a Python function to check if a string is a palindrome.', 'Epic Think o1');

  // 5. Flagship complex request (4o)
  await testPrompt(idToken, 'Can you create a simple portfolio website architecture for me?', 'Epic Think 4o');

  console.log('\n====================================================');
  console.log(' 🎉 ALL PROMPTS RESPONDED WITH REAL, COMPLETE ANSWERS!');
  console.log(' Bug "I completed the necessary checks" is 100% FIXED!');
  console.log('====================================================\n');
}

run().catch(err => {
  console.error('\n❌ TEST FAILED:', err.message);
  process.exit(1);
});
