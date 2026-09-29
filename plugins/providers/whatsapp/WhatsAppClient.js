/**
 * Epic Think AI - WhatsApp Cloud API Client
 */

export class WhatsAppClient {
  constructor(apiKey, phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || 'me') {
    if (!apiKey) {
      throw new Error('WhatsAppClient requires an authenticated API Key / Access Token.');
    }
    this.apiKey = apiKey;
    this.phoneNumberId = phoneNumberId;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      let errBody;
      try {
        errBody = await response.json();
      } catch (_) {
        errBody = { message: response.statusText };
      }
      throw new Error(`WhatsApp API Error [${response.status}]: ${errBody.error?.message || response.statusText}`);
    }

    return await response.json();
  }

  async getBusinessProfile() {
    return await this._request(`/${this.phoneNumberId}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites`);
  }

  async sendMessage({ to, message }) {
    if (!to || !message) {
      throw new Error('Recipient "to" and "message" are required.');
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/[^0-9]/g, ''),
      type: 'text',
      text: { body: message.slice(0, 4000) }
    };

    const data = await this._request(`/${this.phoneNumberId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return {
      messageId: data.messages?.[0]?.id,
      recipient: to,
      status: 'dispatched'
    };
  }
}
