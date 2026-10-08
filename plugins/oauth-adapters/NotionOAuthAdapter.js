/**
 * Epic Think AI - Notion OAuth Provider Adapter
 */

import { BaseOAuthAdapter } from './BaseOAuthAdapter.js';

export class NotionOAuthAdapter extends BaseOAuthAdapter {
  constructor(config = {}) {
    super({
      providerId: 'notion',
      clientId: config.clientId || process.env.NOTION_CLIENT_ID || '',
      clientSecret: config.clientSecret || process.env.NOTION_CLIENT_SECRET || '',
      scopes: []
    });
  }

  getClientId() {
    return this.clientId || process.env.NOTION_CLIENT_ID || '';
  }

  getClientSecret() {
    return this.clientSecret || process.env.NOTION_CLIENT_SECRET || '';
  }

  isConfigured() {
    return Boolean(this.getClientId() && this.getClientSecret());
  }

  resolveEffectiveRedirectUri(redirectUri) {
    if (redirectUri) return redirectUri;
    const envUri = process.env.NOTION_REDIRECT_URI || process.env.NOTION_CALLBACK_URL;
    if (envUri) return envUri;
    return 'https://epic-think-ai.vercel.app/api/plugins/notion/oauth/callback';
  }

  getAuthorizationUrl({ state, redirectUri }) {
    const clientId = this.getClientId();
    if (!clientId) {
      throw new Error('NOTION_CLIENT_ID is not configured in server environment.');
    }

    const effectiveRedirect = this.resolveEffectiveRedirectUri(redirectUri);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: effectiveRedirect,
      response_type: 'code',
      owner: 'user',
      state: state
    });

    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
  }

  async exchangeCode({ code, redirectUri }) {
    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();
    if (!clientId) {
      throw new Error('NOTION_CLIENT_ID is not configured in server environment.');
    }
    if (!clientSecret) {
      throw new Error('NOTION_CLIENT_SECRET is not configured in server environment.');
    }

    const effectiveRedirect = this.resolveEffectiveRedirectUri(redirectUri);
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: effectiveRedirect
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`Notion OAuth Error: ${data.error_description || data.error}`);
    }

    return {
      accessToken: data.access_token,
      botId: data.bot_id,
      workspaceId: data.workspace_id,
      workspaceName: data.workspace_name,
      workspaceIcon: data.workspace_icon || null,
      owner: data.owner || null,
      accountBinding: {
        providerAccountId: data.workspace_id,
        workspaceName: data.workspace_name,
        botId: data.bot_id
      }
    };
  }

  async getUserProfile(accessToken) {
    try {
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return {
          id: data.id,
          name: data.name,
          avatarUrl: data.avatar_url,
          type: data.type
        };
      }
    } catch (_) {}
    return { id: 'unknown', username: 'notion-workspace' };
  }

  async revokeToken(_accessToken) {
    // Notion API does not expose a token revocation endpoint;
    // Disconnecting revokes credentials locally in TokenVault.
    return true;
  }
}
