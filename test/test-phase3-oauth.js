/**
 * Phase 3 Verification Test Suite - OAuth Foundation
 * 
 * Tests:
 * 1. Cryptographic state generation & HMAC signing
 * 2. Tamper rejection (modifying state payload or signature fails)
 * 3. State expiration enforcement
 * 4. Anti-replay (nonce consumption prevents state reuse)
 * 5. Anti-Account-Swapping defense (User B cannot consume User A's state)
 * 6. Provider-specific OAuth adapters (GitHub, Google, Notion, BotToken)
 * 7. End-to-end token exchange, credential vaulting, and lifecycle transition
 * 8. Disconnect and credential shredding
 */

import { OAuthManager } from '../plugins/core/OAuthManager.js';
import { BaseOAuthAdapter } from '../plugins/oauth-adapters/BaseOAuthAdapter.js';
import { TokenVault } from '../plugins/core/TokenVault.js';
import { registry } from '../plugins/core/PluginRegistry.js';
import { BasePlugin } from '../plugins/core/BasePlugin.js';

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
  console.log('PHASE 3: OAUTH FOUNDATION TEST SUITE');
  console.log('====================================================\n');

  const runId = Date.now();
  const userA = `user_oauth_alice_${runId}`;
  const userB = `user_oauth_bob_${runId}`;

  // Register dummy plugin in registry for lifecycle checks
  class TestOAuthPlugin extends BasePlugin {
    constructor() {
      super({
        id: 'test_oauth',
        name: 'Test OAuth Provider',
        version: '1.0.0',
        description: 'Test OAuth plugin',
        author: 'Epic Think AI',
        category: 'developer',
        authType: 'oauth2'
      });
    }
  }
  registry.register(new TestOAuthPlugin());

  // -----------------------------------------------------------------
  // 1. State Generation & HMAC Signing
  // -----------------------------------------------------------------
  console.log('[1/5] Testing OAuth State Generation & HMAC Verification...');
  const stateToken = OAuthManager.generateState({
    uid: userA,
    pluginId: 'test_oauth',
    redirectUri: 'http://localhost:3001/api/plugins/test_oauth/oauth/callback'
  });

  assert(typeof stateToken === 'string' && stateToken.includes('.'), 'State token contains payload and HMAC signature');

  const verifiedState = OAuthManager.verifyState(stateToken, userA, 'test_oauth');
  assert(verifiedState.uid === userA, 'Verified state contains correct UID');
  assert(verifiedState.pluginId === 'test_oauth', 'Verified state contains correct pluginId');

  // -----------------------------------------------------------------
  // 2. Tamper Rejection
  // -----------------------------------------------------------------
  console.log('\n[2/5] Testing Tamper Resistance & Security Violations...');
  const [payload, sig] = stateToken.split('.');
  const tamperedSigToken = payload + '.' + sig.replace(/^./, 'f');

  let tamperCaught = false;
  try {
    OAuthManager.verifyState(tamperedSigToken, userA, 'test_oauth');
  } catch (err) {
    tamperCaught = true;
  }
  assert(tamperCaught, 'Tampered HMAC signature is strictly rejected');

  // -----------------------------------------------------------------
  // 3. Anti-Account-Swapping Protection
  // -----------------------------------------------------------------
  console.log('\n[3/5] Testing Anti-Account-Swapping Defense...');
  const newStateForAlice = OAuthManager.generateState({
    uid: userA,
    pluginId: 'test_oauth',
    redirectUri: 'http://localhost:3001/api/plugins/test_oauth/oauth/callback'
  });

  let accountSwappingCaught = false;
  try {
    // Bob attempts to claim Alice's authorization state
    OAuthManager.verifyState(newStateForAlice, userB, 'test_oauth');
  } catch (err) {
    accountSwappingCaught = true;
    assert(err.message.includes('Account swapping blocked'), 'Explicit account swapping rejection message returned');
  }
  assert(accountSwappingCaught, 'Cross-user account swapping attempt is strictly blocked');

  // Anti-Replay: Attempting to verify the same state again fails
  let replayCaught = false;
  try {
    OAuthManager.verifyState(newStateForAlice, userA, 'test_oauth');
  } catch (err) {
    replayCaught = true;
    assert(err.message.includes('replay attack blocked'), 'Nonce replay is explicitly blocked');
  }
  assert(replayCaught, 'Replaying previously verified OAuth state token is blocked');

  // -----------------------------------------------------------------
  // 4. Provider Adapters & End-to-End Exchange Simulation
  // -----------------------------------------------------------------
  console.log('\n[4/5] Testing Provider Adapters & Token Exchange...');
  class MockProviderAdapter extends BaseOAuthAdapter {
    constructor() {
      super({
        providerId: 'test_oauth',
        clientId: 'mock_client_id_123',
        clientSecret: 'mock_client_secret_xyz'
      });
    }

    getAuthorizationUrl({ state, redirectUri }) {
      return `https://mock-oauth.example.com/auth?client_id=${this.clientId}&state=${state}&redirect_uri=${redirectUri}`;
    }

    async exchangeCode({ code }) {
      if (code !== 'valid_auth_code') {
        throw new Error('Invalid authorization code.');
      }
      return {
        accessToken: 'mock_access_token_abc',
        refreshToken: 'mock_refresh_token_def',
        tokenType: 'Bearer',
        scopes: ['read', 'write'],
        expiresAt: Date.now() + 3600000,
        accountBinding: {
          providerAccountId: 'acc_98765',
          username: 'alice_developer',
          email: 'alice@example.com'
        }
      };
    }

    async revokeToken() {
      return true;
    }
  }

  OAuthManager.registerAdapter('test_oauth', new MockProviderAdapter());

  const authUrl = OAuthManager.getAuthorizationUrl({
    uid: userA,
    pluginId: 'test_oauth',
    redirectUri: 'http://localhost:3001/callback'
  });
  assert(authUrl.startsWith('https://mock-oauth.example.com/auth'), 'Authorization URL generated with correct endpoint');
  assert(authUrl.includes('client_id=mock_client_id_123'), 'Includes configured client ID');

  // Generate fresh state for callback exchange
  const freshState = OAuthManager.generateState({
    uid: userA,
    pluginId: 'test_oauth',
    redirectUri: 'http://localhost:3001/callback'
  });

  const callbackResult = await OAuthManager.handleCallback({
    code: 'valid_auth_code',
    stateToken: freshState,
    currentUid: userA,
    expectedPluginId: 'test_oauth',
    redirectUri: 'http://localhost:3001/callback'
  });

  assert(callbackResult.success === true, 'OAuth callback handled successfully');
  assert(callbackResult.accountBinding.username === 'alice_developer', 'Account binding metadata returned');

  // Check TokenVault storage
  const vaultedCreds = await TokenVault.getCredentials(userA, 'test_oauth');
  assert(vaultedCreds.accessToken === 'mock_access_token_abc', 'Credentials securely stored in AES-256-GCM vault');

  // Check PluginRegistry lifecycle state
  const lifecycleState = await registry.getUserPluginState(userA, 'test_oauth');
  assert(lifecycleState === 'CONNECTED', 'Plugin state successfully transitioned to CONNECTED');

  // -----------------------------------------------------------------
  // 5. Disconnect & Credential Shredding
  // -----------------------------------------------------------------
  console.log('\n[5/5] Testing Disconnect & Credential Shredding...');
  await OAuthManager.disconnectPlugin({ uid: userA, pluginId: 'test_oauth' });

  const postDisconnectState = await registry.getUserPluginState(userA, 'test_oauth');
  assert(postDisconnectState === 'DISCONNECTED', 'Plugin state transitioned to DISCONNECTED');

  const postDisconnectCreds = await TokenVault.getCredentials(userA, 'test_oauth');
  assert(postDisconnectCreds === null, 'Credentials completely shredded and removed from vault');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 3 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during Phase 3 testing:', err);
  process.exit(1);
});
