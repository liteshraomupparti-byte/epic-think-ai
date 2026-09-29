/**
 * Epic Think AI - Unified Google OAuth Provider Adapter
 * 
 * Supports: Gmail, Google Drive, Google Calendar with offline refresh tokens.
 */

import { BaseOAuthAdapter } from './BaseOAuthAdapter.js';

export const GOOGLE_DEFAULT_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/drive.file'
];

export class GoogleOAuthAdapter extends BaseOAuthAdapter {
  constructor(config = {}) {
    super({
      providerId: 'google',
      clientId: config.clientId || process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: config.clientSecret || process.env.GOOGLE_CLIENT_SECRET || '',
      scopes: config.scopes || GOOGLE_DEFAULT_SCOPES
    });
  }

  getAuthorizationUrl({ state, redirectUri, codeChallenge }) {
    if (!this.clientId) {
      throw new Error('GOOGLE_CLIENT_ID is not configured in server environment.');
    }

    const effectiveRedirectUri = redirectUri || process.env.GOOGLE_REDIRECT_URI;
    if (!effectiveRedirectUri) {
      throw new Error('redirect_uri is required for Google OAuth authorization.');
    }

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: effectiveRedirectUri,
      response_type: 'code',
      scope: this.scopes.join(' '),
      access_type: 'offline', // Critical for receiving refresh_token
      prompt: 'consent', // Guarantees refresh_token on initial connection
      state: state
    });

    if (codeChallenge) {
      params.append('code_challenge', codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCode({ code, redirectUri, codeVerifier }) {
    if (!this.clientSecret) {
      throw new Error('GOOGLE_CLIENT_SECRET is not configured in server environment.');
    }

    const effectiveRedirectUri = redirectUri || process.env.GOOGLE_REDIRECT_URI;
    if (!effectiveRedirectUri) {
      throw new Error('redirect_uri is required for Google OAuth code exchange.');
    }

    const bodyParams = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: effectiveRedirectUri,
      grant_type: 'authorization_code'
    };

    if (codeVerifier) {
      bodyParams.code_verifier = codeVerifier;
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(bodyParams).toString()
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`Google OAuth Error: ${data.error_description || data.error}`);
    }

    const profile = await this.getUserProfile(data.access_token);
    const expiresAt = Date.now() + (data.expires_in || 3600) * 1000;

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || null,
      tokenType: data.token_type || 'Bearer',
      expiresAt,
      scopes: data.scope ? data.scope.split(' ') : this.scopes,
      accountBinding: {
        providerAccountId: profile.sub || profile.id,
        email: profile.email,
        name: profile.name
      }
    };
  }

  async refreshToken(refreshToken) {
    if (!refreshToken) throw new Error('Missing refreshToken.');

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }).toString()
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`Google Token Refresh Error: ${data.error_description || data.error}`);
    }

    return {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
      tokenType: data.token_type || 'Bearer'
    };
  }

  async getUserProfile(accessToken) {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      return { sub: 'unknown', email: 'unknown' };
    }

    return await response.json();
  }

  async revokeToken(token) {
    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return true;
    } catch (_) {
      return false;
    }
  }
}
