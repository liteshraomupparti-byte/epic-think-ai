/**
 * Epic Think AI - WhatsApp Tool Definitions & Handlers
 */

import { RiskTiers } from '../../core/PermissionManager.js';
import { WhatsAppClient } from './WhatsAppClient.js';

export const whatsappTools = [
  {
    name: 'get_business_profile',
    description: 'Retrieve verified profile information from the connected WhatsApp account.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {}
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new WhatsAppClient(credentials.accessToken);
        return await client.getBusinessProfile();
      });
    }
  },
  {
    name: 'send_message',
    description: 'Send a message to a WhatsApp phone number. (Requires human confirmation).',
    permissionTier: RiskTiers.EXTERNAL_ACTION,
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient phone number with country code (e.g. +14155552671)' },
        message: { type: 'string', description: 'Message body' }
      },
      required: ['to', 'message']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new WhatsAppClient(credentials.accessToken);
        return await client.sendMessage(args);
      });
    }
  }
];
