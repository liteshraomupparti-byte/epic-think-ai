import dotenv from 'dotenv';
dotenv.config();

import { OAuthManager } from '../plugins/core/OAuthManager.js';
import { GoogleOAuthAdapter } from '../plugins/oauth-adapters/GoogleOAuthAdapter.js';

console.log('====================================================');
console.log('EPIC THINK AI - GOOGLE OAUTH DIAGNOSTIC INSPECTION');
console.log('====================================================');

// 1. CLIENT_ID source
const clientId = process.env.GOOGLE_CLIENT_ID;
const maskedClientId = clientId ? `${clientId.slice(0, 15)}...${clientId.slice(-10)}` : 'NOT_CONFIGURED';
console.log('CLIENT_ID source:               process.env.GOOGLE_CLIENT_ID (' + maskedClientId + ')');

// 2. REDIRECT_URI source
const redirectUriEnv = process.env.GOOGLE_REDIRECT_URI;
console.log('REDIRECT_URI source:           process.env.GOOGLE_REDIRECT_URI (' + (redirectUriEnv || 'NOT_CONFIGURED') + ')');

// 3. OAuth start route
console.log('OAuth start route:             GET /api/plugins/:id/oauth/authorize');

// 4. OAuth callback route
console.log('OAuth callback route:          GET /api/plugins/:id/oauth/callback');
console.log('Canonical Google callback:     /api/plugins/google/oauth/callback');

// 5. Vercel environment detection
const isVercel = Boolean(process.env.VERCEL);
console.log('Vercel environment:            ' + (isVercel ? 'Detected (VERCEL=1)' : 'Not detected (local/dev mode)'));

// 6. Test authorization URL generation for google, google_drive, gmail, google_calendar
const pluginsToTest = ['google', 'google_drive', 'gmail', 'google_calendar'];

for (const pId of pluginsToTest) {
  try {
    const adapter = OAuthManager.getAdapter(pId);
    const mockUid = 'diag_user_123';
    const authUrl = OAuthManager.getAuthorizationUrl({
      uid: mockUid,
      pluginId: pId,
      redirectUri: redirectUriEnv
    });

    const parsed = new URL(authUrl);
    console.log(`\nPlugin "${pId}":`);
    console.log('  Auth Endpoint:               ' + parsed.origin + parsed.pathname);
    console.log('  redirect_uri param:          ' + parsed.searchParams.get('redirect_uri'));
    console.log('  response_type:               ' + parsed.searchParams.get('response_type'));
    console.log('  access_type:                 ' + parsed.searchParams.get('access_type'));
    console.log('  prompt:                      ' + parsed.searchParams.get('prompt'));
    console.log('  scope count:                 ' + parsed.searchParams.get('scope').split(' ').length + ' scopes');
    console.log('  state param length:          ' + (parsed.searchParams.get('state')?.length || 0) + ' chars (HMAC-signed)');
  } catch (err) {
    console.error(`  Error generating for ${pId}:`, err.message);
  }
}

console.log('\n====================================================');
