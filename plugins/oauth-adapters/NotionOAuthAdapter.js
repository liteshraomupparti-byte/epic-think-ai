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

  getAuthorizationUrl({ state, redirectUri }) {
    if (!this.clientId) {
      throw new Error('NOTION_CLIENT_ID is not configured in server environment.');
    }

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      owner: 'user',
      state: state
    });

    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
  }

  async exchangeCode({ code, redirectUri }) {
    if (!this.clientSecret) {
      throw new Error('NOTION_CLIENT_SECRET is not configured in server environment.');
    }

    const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
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
        redirect_uri: redirectUri
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
      accountBinding: {
        providerAccountId: data.workspace_id,
        workspaceName: data.workspace_name,
        botId: data.bot_id
      }
    };
  }
}
