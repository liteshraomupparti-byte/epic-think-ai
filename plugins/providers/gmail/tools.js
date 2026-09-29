/**
 * Epic Think AI - Gmail Tool Definitions & Handlers
 */

import { RiskTiers } from '../../core/PermissionManager.js';
import { GoogleWorkspaceClient } from '../google-workspace/GoogleWorkspaceClient.js';

export const gmailTools = [
  {
    name: 'search_emails',
    description: 'Search user emails with standard Gmail search syntax (e.g. "from:john", "subject:meeting", "is:unread").',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Gmail query string' },
        maxResults: { type: 'integer', description: 'Max emails to return (default: 5)' }
      },
      required: ['query']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.searchEmails(args);
      });
    }
  },
  {
    name: 'read_email',
    description: 'Read the subject, sender, recipients, date, and body of a specific email by ID.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'Gmail Message ID' }
      },
      required: ['messageId']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.readEmail(args);
      });
    }
  },
  {
    name: 'create_draft',
    description: 'Create an email draft in Gmail without sending it.',
    permissionTier: RiskTiers.WRITE,
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject line' },
        body: { type: 'string', description: 'Email message body' }
      },
      required: ['to', 'subject', 'body']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.createDraft(args);
      });
    }
  },
  {
    name: 'send_email',
    description: 'Send an email directly from user Gmail account. (Requires human confirmation).',
    permissionTier: RiskTiers.EXTERNAL_ACTION,
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject line' },
        body: { type: 'string', description: 'Email body' }
      },
      required: ['to', 'subject', 'body']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.sendEmail(args);
      });
    }
  }
];
