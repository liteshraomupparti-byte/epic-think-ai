/**
 * Epic Think AI - GitHub OAuth Provider Adapter
 */

import { BaseOAuthAdapter } from './BaseOAuthAdapter.js';

export class GitHubOAuthAdapter extends BaseOAuthAdapter {
  constructor(config = {}) {
    super({
      providerId: 'github',
      clientId: config.clientId || process.env.GITHUB_CLIENT_ID || '',
      clientSecret: config.clientSecret || process.env.GITHUB_CLIENT_SECRET || '',
      scopes: config.scopes || ['repo', 'read:user']
    });
  }

  getAuthorizationUrl({ state, redirectUri }) {
    if (!this.clientId) {
      throw new Error('GITHUB_CLIENT_ID is not configured in server environment.');
    }

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: this.scopes.join(' '),
      state: state
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async exchangeCode({ code, redirectUri }) {
    if (!this.clientSecret) {
      throw new Error('GITHUB_CLIENT_SECRET is not configured in server environment.');
    }

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`GitHub OAuth Error: ${data.error_description || data.error}`);
    }

    // Fetch user profile for account binding verification
    const profile = await this.getUserProfile(data.access_token);

    return {
      accessToken: data.access_token,
      tokenType: data.token_type || 'bearer',
      scopes: data.scope ? data.scope.split(',') : this.scopes,
      accountBinding: {
        providerAccountId: String(profile.id),
        username: profile.login,
        email: profile.email || null
      }
    };
  }

  async getUserProfile(accessToken) {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Epic-Think-AI/1.0.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub profile: ${response.statusText}`);
    }

    return await response.json();
  }

  async revokeToken(accessToken) {
    if (!this.clientId || !this.clientSecret) return true;

    try {
      const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      await fetch(`https://api.github.com/applications/${this.clientId}/grant`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ access_token: accessToken })
      });
      return true;
    } catch (_) {
      return false;
    }
  }
}
