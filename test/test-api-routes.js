/**
 * Plugin & Agent API Integration Test Suite
 * 
 * Tests live HTTP endpoints on port 3001 with verified Firebase Auth tokens.
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure Firebase Admin is initialized
const saPath = path.resolve(__dirname, '../service-account.json');
let adminApp;
try {
  adminApp = admin.app('test-api-app');
} catch (_) {
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: 'epic-think'
  }, 'test-api-app');
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

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('PLUGIN & AGENT REST API INTEGRATION TESTS');
  console.log('====================================================\n');

  const BASE_URL = 'http://localhost:3001';
  const runId = Date.now();
  const testUid = `api_user_${runId}`;
  const token = await getIdToken(testUid);

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // -----------------------------------------------------------------
  // 1. Unauthenticated Request Rejection
  // -----------------------------------------------------------------
  console.log('[1/6] Testing Unauthenticated Request Gating...');
  const unauthRes = await fetch(`${BASE_URL}/api/plugins`);
  assert(unauthRes.status === 401, 'Unauthenticated GET /api/plugins returns 401 Unauthorized');

  // -----------------------------------------------------------------
  // 2. GET /api/plugins (List all 9 plugins)
  // -----------------------------------------------------------------
  console.log('\n[2/6] Testing GET /api/plugins...');
  const pluginsRes = await fetch(`${BASE_URL}/api/plugins`, { headers: authHeaders });
  const pluginsData = await pluginsRes.json();

  assert(pluginsRes.status === 200, 'GET /api/plugins returns 200 OK');
  assert(pluginsData.success === true, 'Response success is true');
  assert(Array.isArray(pluginsData.plugins), 'Plugins is an array');
  assert(pluginsData.plugins.length === 9, 'All 9 plugins returned');

  const pluginIds = pluginsData.plugins.map(p => p.id);
  assert(pluginIds.includes('github'), 'GitHub plugin present');
  assert(pluginIds.includes('gmail'), 'Gmail plugin present');
  assert(pluginIds.includes('google_calendar'), 'Google Calendar plugin present');
  assert(pluginIds.includes('google_drive'), 'Google Drive plugin present');
  assert(pluginIds.includes('notion'), 'Notion plugin present');
  assert(pluginIds.includes('web_search'), 'Web Search plugin present');
  assert(pluginIds.includes('telegram'), 'Telegram plugin present');
  assert(pluginIds.includes('discord'), 'Discord plugin present');
  assert(pluginIds.includes('whatsapp'), 'WhatsApp plugin present');

  // -----------------------------------------------------------------
  // 3. Plugin Lifecycle API (Install, Enable, Disable)
  // -----------------------------------------------------------------
  console.log('\n[3/6] Testing Plugin Lifecycle API Endpoints...');
  // Install web_search (authType: none)
  const installRes = await fetch(`${BASE_URL}/api/plugins/web_search/install`, {
    method: 'POST',
    headers: authHeaders
  });
  const installData = await installRes.json();
  assert(installData.success === true, 'POST /api/plugins/web_search/install succeeds');
  assert(installData.state === 'ENABLED', 'web_search transitions to ENABLED on install');

  // Disable web_search
  const disableRes = await fetch(`${BASE_URL}/api/plugins/web_search/disable`, {
    method: 'POST',
    headers: authHeaders
  });
  const disableData = await disableRes.json();
  assert(disableData.success === true && disableData.state === 'DISABLED', 'POST /api/plugins/web_search/disable succeeds');

  // Re-enable web_search
  const enableRes = await fetch(`${BASE_URL}/api/plugins/web_search/enable`, {
    method: 'POST',
    headers: authHeaders
  });
  const enableData = await enableRes.json();
  assert(enableData.success === true && enableData.state === 'ENABLED', 'POST /api/plugins/web_search/enable succeeds');

  // -----------------------------------------------------------------
  // 4. OAuth Authorize URL Generation
  // -----------------------------------------------------------------
  console.log('\n[4/6] Testing GET /api/plugins/:id/oauth/authorize...');
  const authUrlRes = await fetch(`${BASE_URL}/api/plugins/github/oauth/authorize`, { headers: authHeaders });
  const authUrlData = await authUrlRes.json();

  if (authUrlRes.status === 200) {
    assert(typeof authUrlData.authUrl === 'string' && authUrlData.authUrl.includes('github.com'), 'Returns GitHub OAuth authorization URL');
    assert(authUrlData.authUrl.includes('state='), 'Authorization URL contains signed state');
  } else {
    assert(authUrlRes.status === 400, 'Returns 400 when OAuth client ID is not configured');
    assert(authUrlData.error.includes('GITHUB_CLIENT_ID'), 'Reports required GITHUB_CLIENT_ID environment variable');
  }

  // -----------------------------------------------------------------
  // 5. Active Tools & Confirmation Endpoints
  // -----------------------------------------------------------------
  console.log('\n[5/6] Testing GET /api/agent/active-tools & Confirmations...');
  const activeToolsRes = await fetch(`${BASE_URL}/api/agent/active-tools`, { headers: authHeaders });
  const activeToolsData = await activeToolsRes.json();

  assert(activeToolsRes.status === 200, 'GET /api/agent/active-tools returns 200');
  assert(activeToolsData.success === true, 'Active tools query succeeds');
  assert(activeToolsData.tools.some(t => t.pluginId === 'web_search'), 'web_search tools present in active tools');

  const pendingConfRes = await fetch(`${BASE_URL}/api/confirmations/pending`, { headers: authHeaders });
  const pendingConfData = await pendingConfRes.json();
  assert(pendingConfRes.status === 200, 'GET /api/confirmations/pending returns 200');
  assert(Array.isArray(pendingConfData.tickets), 'Pending tickets array returned');

  // -----------------------------------------------------------------
  // 6. POST /api/agent/chat (AgentPlanner Execution Endpoint)
  // -----------------------------------------------------------------
  console.log('\n[6/6] Testing POST /api/agent/chat (Autonomous Planner)...');
  const chatRes = await fetch(`${BASE_URL}/api/agent/chat`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      prompt: 'Search the web for modern JavaScript frameworks in 2026',
      conversationId: `conv_${runId}`
    })
  });
  const chatData = await chatRes.json();

  assert(chatRes.status === 200, 'POST /api/agent/chat returns 200');
  assert(chatData.success === true, 'Agent chat execution succeeds');
  assert(typeof chatData.text === 'string' && chatData.text.length > 0, 'Agent returns synthesized response text');
  assert(chatData.executedToolCalls.length >= 1, 'Agent autonomously executed enabled web_search tool');

  // Summary
  console.log('\n====================================================');
  console.log(`API ROUTES TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during API test:', err);
  process.exit(1);
});
