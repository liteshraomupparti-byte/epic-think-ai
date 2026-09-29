/**
 * Epic Think AI - Discord Tool Definitions & Handlers
 */

import { RiskTiers } from '../../core/PermissionManager.js';
import { DiscordClient } from './DiscordClient.js';

export const discordTools = [
  {
    name: 'get_current_user',
    description: 'Get verified bot user details and connected guilds from Discord.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {}
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new DiscordClient(credentials.accessToken);
        return await client.getMe();
      });
    }
  },
  {
    name: 'get_channel_messages',
    description: 'Read recent message history from a specific Discord text channel.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord Channel Snowflake ID' },
        limit: { type: 'integer', description: 'Number of messages (default: 10)' }
      },
      required: ['channelId']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new DiscordClient(credentials.accessToken);
        return await client.getChannelMessages(args);
      });
    }
  },
  {
    name: 'send_message',
    description: 'Send a message to a Discord text channel. (Requires human confirmation).',
    permissionTier: RiskTiers.EXTERNAL_ACTION,
    parameters: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord Channel Snowflake ID' },
        content: { type: 'string', description: 'Message content to post' }
      },
      required: ['channelId', 'content']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new DiscordClient(credentials.accessToken);
        return await client.sendMessage(args);
      });
    }
  }
];
