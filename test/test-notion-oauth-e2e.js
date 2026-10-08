/**
 * Epic Think AI - Dedicated Notion OAuth End-to-End Verification Test
 */

import assert from 'assert';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import express from 'express';
import admin from 'firebase-admin';
import { OAuthManager } from '../plugins/core/OAuthManager.js';
import { NotionOAuthAdapter } from '../plugins/oauth-adapters/NotionOAuthAdapter.js';
import { registry } from '../plugins/core/PluginRegistry.js';
import { TokenVault } from '../plugins/core/TokenVault.js';
import { initializePlugins } from '../plugins/index.js';
import pluginRoutes from '../routes/pluginRoutes.js';

dotenv.config();

console.log('====================================================');
console.log('EPIC THINK AI - NOTION OAUTH E2E VERIFICATION SUITE');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function check(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// Initialize Firebase Admin for authenticating test requests
let adminApp;
const saPath = path.resolve(process.cwd(), 'service-account.json');
try {
  adminApp = admin.app('test-notion-oauth-app');
} catch (_) {
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: 'epic-think'
  }, 'test-notion-oauth-app');
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

async function runTests() {
  // 1. Environment Variables
  console.log('[1/5] Verifying Notion Environment Variables...');
  check(process.env.NOTION_CLIENT_ID === '3f3d872b-594c-81be-9261-003761500dc0', 'NOTION_CLIENT_ID matches user credential');
  check(Boolean(process.env.NOTION_CLIENT_SECRET && process.env.NOTION_CLIENT_SECRET.startsWith('secret_')), 'NOTION_CLIENT_SECRET is configured in env');
  check(process.env.NOTION_REDIRECT_URI === 'https://epic-think-ai.vercel.app/api/plugins/notion/oauth/callback', 'NOTION_REDIRECT_URI matches production callback');

  // 2. Notion Adapter
  console.log('\n[2/5] Testing NotionOAuthAdapter Configuration...');
  const adapter = new NotionOAuthAdapter();
  check(adapter.isConfigured() === true, 'Adapter reports configured');
  check(adapter.getClientId() === '3f3d872b-594c-81be-9261-003761500dc0', 'Adapter clientId resolved correctly');
  check(adapter.getClientSecret() === process.env.NOTION_CLIENT_SECRET, 'Adapter clientSecret resolved correctly');
  check(adapter.resolveEffectiveRedirectUri() === 'https://epic-think-ai.vercel.app/api/plugins/notion/oauth/callback', 'Adapter effective redirect URI matches');

  const testState = 'secure_hmac_state_12345';
  const authUrl = adapter.getAuthorizationUrl({ state: testState });
  const parsedUrl = new URL(authUrl);
  check(parsedUrl.origin === 'https://api.notion.com', 'Auth URL origin is api.notion.com');
  check(parsedUrl.pathname === '/v1/oauth/authorize', 'Auth URL pathname is /v1/oauth/authorize');
  check(parsedUrl.searchParams.get('client_id') === '3f3d872b-594c-81be-9261-003761500dc0', 'Auth URL client_id matches user credential');
  check(parsedUrl.searchParams.get('response_type') === 'code', 'Auth URL response_type is code');
  check(parsedUrl.searchParams.get('owner') === 'user', 'Auth URL owner is user');
  check(parsedUrl.searchParams.get('redirect_uri') === 'https://epic-think-ai.vercel.app/api/plugins/notion/oauth/callback', 'Auth URL redirect_uri matches exactly');
  check(parsedUrl.searchParams.get('state') === testState, 'Auth URL state param is present');

  // 3. OAuthManager Integration
  console.log('\n[3/5] Testing OAuthManager Integration for Notion...');
  const retrievedAdapter = OAuthManager.getAdapter('notion');
  check(retrievedAdapter !== null, 'OAuthManager retrieves Notion adapter');

  const testUid = `user_notion_${Date.now()}`;
  const managerAuthUrl = OAuthManager.getAuthorizationUrl({
    uid: testUid,
    pluginId: 'notion'
  });
  const parsedManagerUrl = new URL(managerAuthUrl);
  check(parsedManagerUrl.searchParams.get('client_id') === '3f3d872b-594c-81be-9261-003761500dc0', 'OAuthManager URL has client_id');
  const generatedState = parsedManagerUrl.searchParams.get('state');
  check(Boolean(generatedState && generatedState.includes('.')), 'OAuthManager generated cryptographically signed state');

  const verifiedState = OAuthManager.verifyState(generatedState, testUid, 'notion');
  check(verifiedState.uid === testUid, 'Verified state contains correct UID');
  check(verifiedState.pluginId === 'notion', 'Verified state contains pluginId: notion');

  // 4. Plugin Registry & Tools Lifecycle
  console.log('\n[4/5] Testing Notion Plugin Lifecycle in Registry...');
  initializePlugins();
  const notionPlugin = registry.getPlugin('notion');
  check(notionPlugin !== null, 'Notion plugin registered in registry');
  check(notionPlugin.manifest.authType === 'oauth2', 'Notion authType is oauth2');
  
  const tools = notionPlugin.getTools();
  check(tools.length === 4, 'Notion exposes 4 tools');
  check(tools.some(t => t.name === 'search_pages'), 'Notion tool search_pages registered');
  check(tools.some(t => t.name === 'read_content'), 'Notion tool read_content registered');
  check(tools.some(t => t.name === 'query_database'), 'Notion tool query_database registered');
  check(tools.some(t => t.name === 'create_page'), 'Notion tool create_page registered');

  let stateBefore = await registry.getUserPluginState(testUid, 'notion');
  check(stateBefore === 'AVAILABLE', 'Notion is initially AVAILABLE');

  // Vault mock OAuth token & enable plugin
  await TokenVault.saveCredentials(testUid, 'notion', {
    accessToken: 'ntn_mock_access_token_abc123',
    workspaceId: 'ws_mock_999',
    workspaceName: 'Test Workspace'
  });
  await registry.enablePlugin(testUid, 'notion');

  let stateAfter = await registry.getUserPluginState(testUid, 'notion');
  check(stateAfter === 'ENABLED', 'Notion transitions to ENABLED');

  const activeTools = await registry.getUserActiveTools(testUid);
  const activeToolNames = activeTools.map(t => `${t.pluginId}.${t.name}`);
  check(activeToolNames.includes('notion.search_pages'), 'notion.search_pages is active for user');
  check(activeToolNames.includes('notion.read_content'), 'notion.read_content is active for user');
  check(activeToolNames.includes('notion.query_database'), 'notion.query_database is active for user');
  check(activeToolNames.includes('notion.create_page'), 'notion.create_page is active for user');

  // 5. REST Route Verification with Authenticated ID Token
  console.log('\n[5/5] Testing REST API endpoint GET /api/plugins/notion/oauth/authorize...');
  const app = express();
  app.use(express.json());
  app.use('/api/plugins', pluginRoutes);

  const server = app.listen(0);
  const port = server.address().port;

  try {
    const idToken = await getIdToken(testUid);
    const res = await fetch(`http://localhost:${port}/api/plugins/notion/oauth/authorize`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    check(res.status === 200, 'GET /api/plugins/notion/oauth/authorize returns 200 OK');
    const data = await res.json();
    check(data.success === true, 'Response success is true');
    check(Boolean(data.authUrl), 'Response contains authUrl');
    check(data.redirectUri === 'https://epic-think-ai.vercel.app/api/plugins/notion/oauth/callback', 'Response redirectUri matches Notion callback');
    
    const parsedApiUrl = new URL(data.authUrl);
    check(parsedApiUrl.searchParams.get('client_id') === '3f3d872b-594c-81be-9261-003761500dc0', 'API returned correct client_id');
    check(parsedApiUrl.searchParams.get('redirect_uri') === 'https://epic-think-ai.vercel.app/api/plugins/notion/oauth/callback', 'API returned correct redirect_uri');
  } finally {
    server.close();
  }

  console.log('\n====================================================');
  console.log(`NOTION E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during Notion E2E test:', err);
  process.exit(1);
});
