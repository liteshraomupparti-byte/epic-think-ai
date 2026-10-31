/**
 * Epic Think AI - Production OAuth Manager
 * 
 * Cryptographically secure OAuth state generation, CSRF defense, account swapping prevention,
 * token exchange, automated token refresh, and vaulted credential lifecycle management.
 */

import crypto from 'crypto';
import { TokenVault } from './TokenVault.js';
import { registry } from './PluginRegistry.js';
import { SafeLogger } from './SafeLogger.js';
import { GitHubOAuthAdapter } from '../oauth-adapters/GitHubOAuthAdapter.js';
import { GoogleOAuthAdapter } from '../oauth-adapters/GoogleOAuthAdapter.js';
import { NotionOAuthAdapter } from '../oauth-adapters/NotionOAuthAdapter.js';
import { BotTokenAdapter } from '../oauth-adapters/BotTokenAdapter.js';

const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes state validity
const consumedNonces = new Set();

function getHmacSecret() {
  const secret = process.env.PLUGIN_ENCRYPTION_KEY || 'epic-think-oauth-state-secret-fallback';
  return crypto.createHash('sha256').update(secret).digest();
}

export class OAuthManager {
  static adapters = {
    google: new GoogleOAuthAdapter(),
    github: new GitHubOAuthAdapter(),
    gmail: new GoogleOAuthAdapter(),
    google_drive: new GoogleOAuthAdapter(),
    'google-drive': new GoogleOAuthAdapter(),
    google_calendar: new GoogleOAuthAdapter(),
    'google-calendar': new GoogleOAuthAdapter(),
    notion: new NotionOAuthAdapter()
  };

  static getAdapter(pluginId) {
    if (!pluginId) return null;
    return OAuthManager.adapters[pluginId]
      || OAuthManager.adapters[pluginId.replace(/-/g, '_')]
      || OAuthManager.adapters[pluginId.replace(/_/g, '-')]
      || null;
  }

  /**
   * Register a custom provider adapter
   */
  static registerAdapter(pluginId, adapter) {
    OAuthManager.adapters[pluginId] = adapter;
  }

  /**
   * Generate cryptographically signed, CSRF-resistant OAuth state token
   * Bound to: Firebase UID, Plugin ID, Nonce, Timestamp, Redirect URI
   */
  static generateState({ uid, pluginId, redirectUri }) {
    if (!uid || !pluginId) {
      throw new Error('UID and pluginId are required to generate OAuth state.');
    }

    const nonce = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();

    const payload = JSON.stringify({
      uid: String(uid),
      pluginId: String(pluginId),
      redirectUri: redirectUri || '',
      nonce,
      timestamp
    });

    const signature = crypto
      .createHmac('sha256', getHmacSecret())
      .update(payload)
      .digest('hex');

    const stateToken = Buffer.from(payload).toString('base64url') + '.' + signature;

    SafeLogger.info('Generated secure OAuth state', {
      user: SafeLogger.hashUid(uid),
      plugin: pluginId
    });

    return stateToken;
  }

  /**
   * Validate state token and enforce anti-account-swapping security
   */
  static verifyState(stateToken, currentUid, expectedPluginId) {
    if (!stateToken || typeof stateToken !== 'string') {
      throw new Error('Missing or invalid OAuth state parameter.');
    }

    const parts = stateToken.split('.');
    if (parts.length !== 2) {
      throw new Error('Malformed OAuth state format.');
    }

    const [b64Payload, signature] = parts;
    const rawPayload = Buffer.from(b64Payload, 'base64url').toString('utf8');

    // Verify HMAC signature
    const expectedSig = crypto
      .createHmac('sha256', getHmacSecret())
      .update(rawPayload)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSig, 'hex'))) {
      throw new Error('SECURITY VIOLATION: Tampered or invalid OAuth state signature.');
    }

    const parsed = JSON.parse(rawPayload);

    // Enforce 10-minute expiration
    if (Date.now() - parsed.timestamp > STATE_TTL_MS) {
      throw new Error('OAuth authorization session expired. Please try connecting again.');
    }

    // Enforce single-use nonce (anti-replay)
    if (consumedNonces.has(parsed.nonce)) {
      throw new Error('SECURITY VIOLATION: OAuth state has already been consumed (replay attack blocked).');
    }
    consumedNonces.add(parsed.nonce);

    // Prevent memory leaks: prune old nonces periodically
    if (consumedNonces.size > 1000) {
      consumedNonces.clear();
    }

    // Enforce Anti-Account-Swapping: Authenticated Firebase UID MUST match state UID
    if (currentUid && parsed.uid !== String(currentUid)) {
      SafeLogger.warn('SECURITY ALERT: OAuth account swapping attempt detected and blocked', {
        sessionUid: SafeLogger.hashUid(currentUid),
        stateUid: SafeLogger.hashUid(parsed.uid)
      });
      throw new Error('SECURITY VIOLATION: Cannot link OAuth credentials to a different user session (Account swapping blocked).');
    }

    // Enforce plugin match (allow cross-compatibility across Google-family services)
    const isGoogleFamily = (id) => ['google', 'gmail', 'google-drive', 'google_drive', 'google-calendar', 'google_calendar'].includes(String(id).toLowerCase());
    if (expectedPluginId && parsed.pluginId !== String(expectedPluginId)) {
      if (!(isGoogleFamily(expectedPluginId) && isGoogleFamily(parsed.pluginId))) {
        throw new Error(`State plugin mismatch: expected ${expectedPluginId}, got ${parsed.pluginId}.`);
      }
    }

    return parsed;
  }

  /**
   * Get Authorization URL for initiating OAuth flow
   */
  static getAuthorizationUrl({ uid, pluginId, redirectUri, codeChallenge }) {
    const adapter = OAuthManager.getAdapter(pluginId);
    if (!adapter) {
      throw new Error(`No OAuth adapter found for plugin "${pluginId}".`);
    }

    const state = OAuthManager.generateState({ uid, pluginId, redirectUri });
    return adapter.getAuthorizationUrl({ state, redirectUri, codeChallenge });
  }

  /**
   * Handle OAuth Callback, perform token exchange, and securely vault credentials
   */
  static async handleCallback({ code, stateToken, currentUid, expectedPluginId, redirectUri, codeVerifier }) {
    // 1. Verify and consume state
    const state = OAuthManager.verifyState(stateToken, currentUid, expectedPluginId);
    const { uid, pluginId } = state;

    const adapter = OAuthManager.getAdapter(pluginId);
    if (!adapter) {
      throw new Error(`No OAuth adapter found for plugin "${pluginId}".`);
    }

    // 2. Exchange authorization code with provider
    const effectiveRedirectUri = redirectUri
      || state.redirectUri
      || (adapter instanceof GoogleOAuthAdapter ? process.env.GOOGLE_REDIRECT_URI : null)
      || (adapter instanceof NotionOAuthAdapter ? (process.env.NOTION_REDIRECT_URI || 'https://epic-think-ai.vercel.app/api/plugins/notion/oauth/callback') : null);
    const tokenResult = await adapter.exchangeCode({
      code,
      redirectUri: effectiveRedirectUri,
      codeVerifier
    });

    // 3. Securely vault encrypted credentials (Hardware-grade AES-256-GCM)
    await TokenVault.saveCredentials(uid, pluginId, tokenResult, {
      scopes: tokenResult.scopes || [],
      expiresAt: tokenResult.expiresAt || null
    });

    // 4. Update lifecycle state to CONNECTED (or ENABLED)
    await registry.setUserPluginState(uid, pluginId, 'CONNECTED', {
      accountBinding: tokenResult.accountBinding || null
    });

    SafeLogger.info('OAuth flow completed successfully and credentials vaulted', {
      user: SafeLogger.hashUid(uid),
      plugin: pluginId
    });

    return {
      success: true,
      uid,
      pluginId,
      accountBinding: tokenResult.accountBinding || null
    };
  }

  /**
   * Connect direct Bot Token (e.g. Telegram / Discord)
   */
  static async connectBotToken({ uid, pluginId, token }) {
    if (!uid || !pluginId || !token) {
      throw new Error('UID, pluginId, and token are required.');
    }

    const verification = await BotTokenAdapter.verifyToken(pluginId, token);

    await TokenVault.saveCredentials(uid, pluginId, verification);
    await registry.setUserPluginState(uid, pluginId, 'CONNECTED', {
      accountBinding: verification.accountBinding
    });

    return {
      success: true,
      pluginId,
      accountBinding: verification.accountBinding
    };
  }

  /**
   * Disconnect plugin and revoke credentials
   */
  static async disconnectPlugin({ uid, pluginId }) {
    if (!uid || !pluginId) return false;

    const adapter = OAuthManager.getAdapter(pluginId);
    if (adapter) {
      const creds = await TokenVault.getCredentials(uid, pluginId);
      if (creds && creds.accessToken) {
        try {
          await adapter.revokeToken(creds.accessToken);
        } catch (_) {}
      }
    }

    await registry.disconnectPlugin(uid, pluginId);
    return true;
  }
}
