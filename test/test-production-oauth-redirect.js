import assert from 'assert';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import express from 'express';
import pluginRoutes from '../routes/pluginRoutes.js';
import { OAuthManager } from '../plugins/core/OAuthManager.js';
import { initializePlugins } from '../plugins/index.js';

dotenv.config();
initializePlugins();

console.log('====================================================');
console.log('TESTING PRODUCTION & LOCAL GOOGLE OAUTH REDIRECT RESOLUTION');
console.log('====================================================');

const prodHost = 'hink-ai.vercel.app';
const prodCanonicalCallback = 'https://hink-ai.vercel.app/api/plugins/google/oauth/callback';
const localCanonicalCallback = 'http://localhost:3001/api/plugins/google/oauth/callback';

// Initialize Firebase Admin for authenticating test requests
let adminApp;
const saPath = path.resolve(process.cwd(), 'service-account.json');
try {
  adminApp = admin.app('test-prod-oauth-app');
} catch (_) {
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: 'epic-think'
  }, 'test-prod-oauth-app');
}

async function getIdToken(uid) {
  const customToken = await admin.auth(adminApp).createCustomToken(uid);
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

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use('/api/plugins', pluginRoutes);

const server = app.listen(0);
const port = server.address().port;

async function runTests() {
  try {
    const testUid = `test_prod_user_${Date.now()}`;
    const idToken = await getIdToken(testUid);
    const authHeaders = {
      'Authorization': `Bearer ${idToken}`
    };

    // 1. Production Simulation - Google Drive Connect
    console.log('[1/6] Testing Production GET /api/plugins/google_drive/oauth/authorize with Vercel headers...');
    const prodDriveRes = await fetch(`http://localhost:${port}/api/plugins/google_drive/oauth/authorize`, {
      headers: {
        ...authHeaders,
        'Host': prodHost,
        'X-Forwarded-Proto': 'https',
        'X-Forwarded-Host': prodHost
      }
    });
    assert.strictEqual(prodDriveRes.status, 200, 'Endpoint should return 200 OK');
    const prodDriveData = await prodDriveRes.json();
    assert.strictEqual(prodDriveData.success, true);
    assert.strictEqual(prodDriveData.redirectUri, prodCanonicalCallback, 'Production Google Drive redirectUri must be canonical https://hink-ai.vercel.app/api/plugins/google/oauth/callback');
    
    const parsedDriveUrl = new URL(prodDriveData.authUrl);
    assert.strictEqual(parsedDriveUrl.origin, 'https://accounts.google.com');
    assert.strictEqual(parsedDriveUrl.searchParams.get('redirect_uri'), prodCanonicalCallback);
    assert.strictEqual(parsedDriveUrl.searchParams.get('response_type'), 'code');
    assert.strictEqual(parsedDriveUrl.searchParams.get('access_type'), 'offline');
    assert.strictEqual(parsedDriveUrl.searchParams.get('prompt'), 'consent');
    console.log(`  ✓ Production Google Drive redirect_uri: ${parsedDriveUrl.searchParams.get('redirect_uri')}`);

    // 2. Production Simulation - Gmail Connect
    console.log('\n[2/6] Testing Production GET /api/plugins/gmail/oauth/authorize with Vercel headers...');
    const prodGmailRes = await fetch(`http://localhost:${port}/api/plugins/gmail/oauth/authorize`, {
      headers: {
        ...authHeaders,
        'Host': prodHost,
        'X-Forwarded-Proto': 'https',
        'X-Forwarded-Host': prodHost
      }
    });
    assert.strictEqual(prodGmailRes.status, 200);
    const prodGmailData = await prodGmailRes.json();
    const parsedGmailUrl = new URL(prodGmailData.authUrl);
    assert.strictEqual(parsedGmailUrl.searchParams.get('redirect_uri'), prodCanonicalCallback, 'Production Gmail redirectUri must match canonical callback');
    console.log(`  ✓ Production Gmail redirect_uri: ${parsedGmailUrl.searchParams.get('redirect_uri')}`);

    // 3. Production Simulation - Google Calendar Connect
    console.log('\n[3/6] Testing Production GET /api/plugins/google_calendar/oauth/authorize with Vercel headers...');
    const prodCalRes = await fetch(`http://localhost:${port}/api/plugins/google_calendar/oauth/authorize`, {
      headers: {
        ...authHeaders,
        'Host': prodHost,
        'X-Forwarded-Proto': 'https',
        'X-Forwarded-Host': prodHost
      }
    });
    assert.strictEqual(prodCalRes.status, 200);
    const prodCalData = await prodCalRes.json();
    const parsedCalUrl = new URL(prodCalData.authUrl);
    assert.strictEqual(parsedCalUrl.searchParams.get('redirect_uri'), prodCanonicalCallback, 'Production Google Calendar redirectUri must match canonical callback');
    console.log(`  ✓ Production Google Calendar redirect_uri: ${parsedCalUrl.searchParams.get('redirect_uri')}`);

    // 4. Local Development Simulation
    console.log('\n[4/6] Testing Local Development GET /api/plugins/google_drive/oauth/authorize with localhost...');
    const localRes = await fetch(`http://localhost:${port}/api/plugins/google_drive/oauth/authorize`, {
      headers: {
        ...authHeaders,
        'Host': 'localhost:3001'
      }
    });
    assert.strictEqual(localRes.status, 200);
    const localData = await localRes.json();
    const parsedLocalUrl = new URL(localData.authUrl);
    assert.strictEqual(parsedLocalUrl.searchParams.get('redirect_uri'), localCanonicalCallback, 'Local development redirectUri must be http://localhost:3001/api/plugins/google/oauth/callback');
    console.log(`  ✓ Local development redirect_uri: ${parsedLocalUrl.searchParams.get('redirect_uri')}`);

    // 5. Cross-Plugin State Verification with Production Redirect URI
    console.log('\n[5/6] Testing Cross-Plugin State Verification with production redirect URI...');
    const uid = 'user_prod_alice_99';
    const stateToken = OAuthManager.generateState({
      uid,
      pluginId: 'google_drive',
      redirectUri: prodCanonicalCallback
    });

    // Callback arrives at canonical google endpoint
    const verified = OAuthManager.verifyState(stateToken, uid, 'google');
    assert.strictEqual(verified.uid, uid);
    assert.strictEqual(verified.pluginId, 'google_drive');
    assert.strictEqual(verified.redirectUri, prodCanonicalCallback);
    console.log('  ✓ Production state token successfully verified on canonical endpoint');

    // 6. Non-Google plugin uses its own specific callback route
    console.log('\n[6/6] Testing Non-Google Plugin (GitHub) in production...');
    const githubAdapter = OAuthManager.getAdapter('github');
    const originalGhId = githubAdapter.clientId;
    githubAdapter.clientId = 'test_mock_github_id';
    const prodGithubRes = await fetch(`http://localhost:${port}/api/plugins/github/oauth/authorize`, {
      headers: {
        ...authHeaders,
        'Host': prodHost,
        'X-Forwarded-Proto': 'https',
        'X-Forwarded-Host': prodHost
      }
    });
    githubAdapter.clientId = originalGhId;
    assert.strictEqual(prodGithubRes.status, 200);
    const prodGithubData = await prodGithubRes.json();
    assert.strictEqual(prodGithubData.redirectUri, 'https://hink-ai.vercel.app/api/plugins/github/oauth/callback');
    console.log(`  ✓ Production GitHub redirect_uri: ${prodGithubData.redirectUri}`);

    console.log('\n====================================================');
    console.log('🎉 ALL PRODUCTION & LOCAL OAUTH REDIRECT TESTS PASSED (6/6)');
    console.log('====================================================');
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
