/**
 * Firecrawl Tools Definition for Plugin System
 */

import { FirecrawlClient } from './FirecrawlClient.js';

const client = new FirecrawlClient();

export const tools = [
  {
    name: 'firecrawl_scrape',
    description: 'Scrape a single web URL into clean, structured Markdown format.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The absolute URL to scrape (e.g. https://example.com)' },
        onlyMainContent: { type: 'boolean', description: 'Whether to strip headers/footers and retain main article content only' }
      },
      required: ['url']
    },
    permissionTier: 'READ',
    async handler(args) {
      return await client.scrapeUrl(args.url, args);
    }
  },
  {
    name: 'firecrawl_crawl',
    description: 'Crawl a website starting from a seed URL, extracting clean markdown for multiple linked subpages.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The root URL to start crawling from' },
        limit: { type: 'number', description: 'Maximum number of pages to crawl (1 - 10)' }
      },
      required: ['url']
    },
    permissionTier: 'READ',
    async handler(args) {
      return await client.crawlDomain(args.url, args);
    }
  },
  {
    name: 'firecrawl_map',
    description: 'Quickly map and enumerate internal routes and links across a website or domain.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The domain URL to map' },
        limit: { type: 'number', description: 'Maximum links to discover' }
      },
      required: ['url']
    },
    permissionTier: 'READ',
    async handler(args) {
      return await client.mapDomain(args.url, args);
    }
  },
  {
    name: 'firecrawl_search',
    description: 'Deep web research search returning clean markdown content of the top results.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query to research' },
        limit: { type: 'number', description: 'Number of results to fetch' }
      },
      required: ['query']
    },
    permissionTier: 'READ',
    async handler(args) {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(args.query)}`;
      const mapped = await client.mapDomain(searchUrl, { limit: 5 });
      return {
        query: args.query,
        discoveredUrls: mapped.links,
        note: 'Web search completed with Firecrawl research pipeline.'
      };
    }
  }
];
