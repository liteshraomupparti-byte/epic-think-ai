/**
 * Epic Think AI - Telegram Bot API Client
 */

export class TelegramClient {
  constructor(botToken) {
    if (!botToken) {
      throw new Error('TelegramClient requires an authenticated Bot Token.');
    }
    this.botToken = botToken;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  async _request(method, payload = null) {
    const url = `${this.baseUrl}/${method}`;
    const options = {
      method: payload ? 'POST' : 'GET',
      headers: payload ? { 'Content-Type': 'application/json' } : {}
    };

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Telegram API Error [${data.error_code}]: ${data.description || 'Request failed'}`);
    }

    return data.result;
  }

  async getMe() {
    return await this._request('getMe');
  }

  async getUpdates({ limit = 10 } = {}) {
    const count = Math.min(Math.max(1, Number(limit) || 10), 50);
    return await this._request('getUpdates', { limit: count });
  }

  async sendMessage({ chatId, text }) {
    if (!chatId || !text) {
      throw new Error('chatId and text are required to send Telegram message.');
    }

    const result = await this._request('sendMessage', {
      chat_id: chatId,
      text: text.slice(0, 4000),
      parse_mode: 'Markdown'
    });

    return {
      messageId: result.message_id,
      chatId: result.chat?.id,
      date: result.date,
      status: 'sent'
    };
  }
}
