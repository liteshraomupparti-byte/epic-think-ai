/**
 * Epic Think AI - Discord Bot API Client
 */

export class DiscordClient {
  constructor(botToken) {
    if (!botToken) {
      throw new Error('DiscordClient requires an authenticated Bot Token.');
    }
    this.botToken = botToken;
    this.baseUrl = 'https://discord.com/api/v10';
  }

  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bot ${this.botToken}`,
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errBody;
      try {
        errBody = await response.json();
      } catch (_) {
        errBody = { message: response.statusText };
      }
      throw new Error(`Discord API Error [${response.status}]: ${errBody.message || response.statusText}`);
    }

    if (response.status === 204) return null;
    return await response.json();
  }

  async getMe() {
    return await this._request('/users/@me');
  }

  async getChannelMessages({ channelId, limit = 10 }) {
    const count = Math.min(Math.max(1, Number(limit) || 10), 50);
    const data = await this._request(`/channels/${channelId}/messages?limit=${count}`);

    return (data || []).map(msg => ({
      id: msg.id,
      channelId: msg.channel_id,
      author: msg.author?.username,
      content: msg.content,
      timestamp: msg.timestamp
    }));
  }

  async sendMessage({ channelId, content }) {
    if (!channelId || !content) {
      throw new Error('channelId and content are required to send Discord message.');
    }

    const data = await this._request(`/channels/${channelId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.slice(0, 2000) })
    });

    return {
      messageId: data.id,
      channelId: data.channel_id,
      timestamp: data.timestamp,
      status: 'sent'
    };
  }
}
