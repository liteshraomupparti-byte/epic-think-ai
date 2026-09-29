/**
 * Epic Think AI - Notion Tool Definitions & Handlers
 */

import { RiskTiers } from '../../core/PermissionManager.js';
import { NotionClient } from './NotionClient.js';

export const notionTools = [
  {
    name: 'search_pages',
    description: 'Search pages and databases in the user Notion workspace.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keywords or title' },
        pageSize: { type: 'integer', description: 'Max pages to return (default: 10)' }
      }
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new NotionClient(credentials.accessToken);
        return await client.searchPages(args);
      });
    }
  },
  {
    name: 'read_content',
    description: 'Read the text blocks and markdown content of a Notion page.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: 'Notion Page ID' },
        maxBlocks: { type: 'integer', description: 'Max blocks to read (default: 20)' }
      },
      required: ['pageId']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new NotionClient(credentials.accessToken);
        return await client.readContent(args);
      });
    }
  },
  {
    name: 'query_database',
    description: 'Query records and property rows from a Notion database.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        databaseId: { type: 'string', description: 'Notion Database ID' },
        pageSize: { type: 'integer', description: 'Max records to fetch (default: 10)' }
      },
      required: ['databaseId']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new NotionClient(credentials.accessToken);
        return await client.queryDatabase(args);
      });
    }
  },
  {
    name: 'create_page',
    description: 'Create a new document page in Notion under a parent page or database.',
    permissionTier: RiskTiers.WRITE,
    parameters: {
      type: 'object',
      properties: {
        parentId: { type: 'string', description: 'Parent Page ID or Database ID' },
        title: { type: 'string', description: 'Page Title' },
        content: { type: 'string', description: 'Body text for the initial paragraph' },
        isDatabaseParent: { type: 'boolean', description: 'Set to true if parentId is a database' }
      },
      required: ['parentId', 'title']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new NotionClient(credentials.accessToken);
        return await client.createPage(args);
      });
    }
  }
];
