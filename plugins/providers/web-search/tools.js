/**
 * Epic Think AI - Web Search Tool Definitions & Handlers
 */

import { RiskTiers } from '../../core/PermissionManager.js';
import { WebSearchClient } from './WebSearchClient.js';

export const webSearchTools = [
  {
    name: 'search',
    description: 'Search the live web for technical documentation, tutorials, libraries, and real-time facts.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        maxResults: { type: 'integer', description: 'Max search results (default: 5)' }
      },
      required: ['query']
    },
    handler: async (args) => {
      return await WebSearchClient.search(args);
    }
  },
  {
    name: 'fetch_page',
    description: 'Fetch and parse the readable text of a specific webpage by URL.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Webpage URL starting with http:// or https://' }
      },
      required: ['url']
    },
    handler: async (args) => {
      return await WebSearchClient.fetchPage(args);
    }
  },
  {
    name: 'extract_content',
    description: 'Extract focused body text or article sections from a webpage.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Target webpage URL' },
        selector: { type: 'string', description: 'Target section or heading name' }
      },
      required: ['url']
    },
    handler: async (args) => {
      return await WebSearchClient.extractContent(args);
    }
  },
  {
    name: 'search_news',
    description: 'Search recent news articles and headlines.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'News topic or event name' },
        maxResults: { type: 'integer', description: 'Max news articles (default: 5)' }
      },
      required: ['query']
    },
    handler: async (args) => {
      return await WebSearchClient.searchNews(args);
    }
  }
];
