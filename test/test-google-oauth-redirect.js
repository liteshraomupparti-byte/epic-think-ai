import assert from 'assert';
import dotenv from 'dotenv';
dotenv.config();

import { OAuthManager } from '../plugins/core/OAuthManager.js';
import { GoogleOAuthAdapter } from '../plugins/oauth-adapters/GoogleOAuthAdapter.js';

console.log('====================================================');
console.log('VERIFYING GOOGLE OAUTH REDIRECT URI MATCH');
console.log('====================================================');

const expectedRedirectUri = 'http://localhost:3001/api/plugins/google/oauth/callback';

// 1. Verify .env configuration
console.log('[1/4] Checking .env GOOGLE_REDIRECT_URI...');
assert.strictEqual(
  process.env.GOOGLE_REDIRECT_URI,
  expectedRedirectUri,
  `process.env.GOOGLE_REDIRECT_URI (${process.env.GOOGLE_REDIRECT_URI}) must match ${expectedRedirectUri}`
);
console.log(`  ✓ .env GOOGLE_REDIRECT_URI: ${process.env.GOOGLE_REDIRECT_URI}`);

// 2. Test Authorization URL generation
console.log('\n[2/4] Testing Google Authorization URL generation with configured redirect URI...');
const testAdapter = new GoogleOAuthAdapter({
  clientId: 'test-client-id.apps.googleusercontent.com',
  clientSecret: 'test-client-secret'
});

const authUrl = testAdapter.getAuthorizationUrl({
  state: 'test_state_123',
  redirectUri: process.env.GOOGLE_REDIRECT_URI
});

const parsedUrl = new URL(authUrl);
const redirectParam = parsedUrl.searchParams.get('redirect_uri');
assert.strictEqual(
  redirectParam,
  expectedRedirectUri,
  `redirect_uri query parameter (${redirectParam}) must match ${expectedRedirectUri} byte-for-byte`
);
console.log(`  ✓ redirect_uri sent in auth request: ${redirectParam}`);

// 3. Test OAuthManager adapter retrieval for Google-family plugins
console.log('\n[3/4] Testing OAuthManager adapters for Google-family plugins...');
const googleAdapter = OAuthManager.getAdapter('google');
const gmailAdapter = OAuthManager.getAdapter('gmail');
const driveAdapter = OAuthManager.getAdapter('google-drive');
const calAdapter = OAuthManager.getAdapter('google-calendar');

assert(googleAdapter instanceof GoogleOAuthAdapter, 'google adapter must be an instance of GoogleOAuthAdapter');
assert(gmailAdapter instanceof GoogleOAuthAdapter, 'gmail adapter must be an instance of GoogleOAuthAdapter');
assert(driveAdapter instanceof GoogleOAuthAdapter, 'google-drive adapter must be an instance of GoogleOAuthAdapter');
assert(calAdapter instanceof GoogleOAuthAdapter, 'google-calendar adapter must be an instance of GoogleOAuthAdapter');
console.log('  ✓ All Google plugins correctly resolve to GoogleOAuthAdapter');

// 4. Test Cross-Plugin State verification (initiating from gmail/drive/cal and returning to google callback)
console.log('\n[4/4] Testing Cross-Plugin Google Family State verification...');
const uid = 'test-user-123';
const stateToken = OAuthManager.generateState({
  uid,
  pluginId: 'gmail',
  redirectUri: expectedRedirectUri
});

// Should verify even when returning to canonical google callback endpoint
const verified = OAuthManager.verifyState(stateToken, uid, 'google');
assert.strictEqual(verified.uid, uid);
assert.strictEqual(verified.pluginId, 'gmail');
assert.strictEqual(verified.redirectUri, expectedRedirectUri);
console.log('  ✓ State verification allows cross-service callback seamlessly');

console.log('\n====================================================');
console.log('ALL GOOGLE OAUTH REDIRECT URI CHECKS PASSED');
console.log('====================================================');
