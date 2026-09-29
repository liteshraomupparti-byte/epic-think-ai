/**
 * Epic Think AI - Bot Token & API Key Adapter
 * 
 * Manages direct bot token and API key validation for Telegram, Discord, WhatsApp, etc.
 * Validates token connectivity before vaulting.
 */

export class BotTokenAdapter {
  /**
   * Verify and bind a bot token to an authenticated user
   */
  static async verifyToken(providerId, token) {
    if (!token || typeof token !== 'string') {
      throw new Error('Missing bot token.');
    }

    const cleanToken = token.trim();

    if (providerId === 'telegram') {
      // Validate Telegram bot token via getMe
      const res = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
      const data = await res.json();
      if (!data.ok) {
        throw new Error(`Invalid Telegram bot token: ${data.description || 'Verification failed'}`);
      }

      return {
        accessToken: cleanToken,
        accountBinding: {
          providerAccountId: String(data.result.id),
          username: data.result.username,
          botName: data.result.first_name
        }
      };
    }

    if (providerId === 'discord') {
      // Validate Discord bot token
      const res = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
          'Authorization': `Bot ${cleanToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`Invalid Discord bot token: ${data.message || 'Verification failed'}`);
      }

      return {
        accessToken: cleanToken,
        accountBinding: {
          providerAccountId: String(data.id),
          username: data.username,
          discriminator: data.discriminator
        }
      };
    }

    if (providerId === 'whatsapp') {
      return {
        accessToken: cleanToken,
        accountBinding: {
          providerAccountId: 'whatsapp_business',
          configuredAt: Date.now()
        }
      };
    }

    // Generic API Key
    return {
      accessToken: cleanToken,
      accountBinding: {
        providerAccountId: 'api_key_account',
        configuredAt: Date.now()
      }
    };
  }
}
