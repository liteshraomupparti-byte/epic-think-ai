/**
 * Epic Think AI - Telegram Tool Definitions & Handlers
 */

import { RiskTiers } from '../../core/PermissionManager.js';
import { TelegramClient } from './TelegramClient.js';

export const telegramTools = [
  {
    name: 'get_bot_info',
    description: 'Retrieve verified information about the connected Telegram bot account.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {}
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new TelegramClient(credentials.accessToken);
        return await client.getMe();
      });
    }
  },
  {
    name: 'get_updates',
    description: 'Fetch recent messages and updates received by the Telegram bot.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'integer', description: 'Max updates to fetch (default: 10)' }
      }
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new TelegramClient(credentials.accessToken);
        return await client.getUpdates(args);
      });
    }
  },
  {
    name: 'send_message',
    description: 'Send a message to a Telegram chat ID or group. (Requires human confirmation).',
    permissionTier: RiskTiers.EXTERNAL_ACTION,
    parameters: {
      type: 'object',
      properties: {
        chatId: { type: 'string', description: 'Telegram chat ID or @username' },
        text: { type: 'string', description: 'Message text to send' }
      },
      required: ['chatId', 'text']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new TelegramClient(credentials.accessToken);
        return await client.sendMessage(args);
      });
    }
  }
];
