/**
 * Epic Think AI - Browser Use Plugin Tools Definition & Handlers
 */

import { browserUseClient } from './BrowserUseClient.js';

export const browserUseTools = [
  {
    name: 'browser_run_task',
    description: 'Execute an autonomous multi-step browser task (e.g. search, click, extract, fill forms, check flights, find products) using Browser Use Cloud or stealth browser.',
    permissionTier: 'EXTERNAL_ACTION',
    parameters: {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'The natural language instruction for the browser agent (e.g. "Go to github.com/trending, find top 3 trending JS repositories and their stars").'
        },
        wait: {
          type: 'boolean',
          description: 'Whether to wait for task completion (default: true). Set false for long-running asynchronous jobs.'
        },
        timeoutMs: {
          type: 'integer',
          description: 'Timeout in milliseconds (default: 40000).'
        }
      },
      required: ['task']
    },
    handler: async (args, context) => {
      return await browserUseClient.runTask(args.task, {
        wait: args.wait !== false,
        timeoutMs: args.timeoutMs,
        uid: context?.uid
      });
    }
  },
  {
    name: 'browser_navigate',
    description: 'Navigate to any URL using stealth browser settings, extracting clean page content, title, headings, and links.',
    permissionTier: 'READ',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The HTTP/HTTPS URL of the target webpage to open and read.'
        },
        timeoutMs: {
          type: 'integer',
          description: 'Maximum time in milliseconds to wait for page load.'
        }
      },
      required: ['url']
    },
    handler: async (args) => {
      return await browserUseClient.navigate(args.url, {
        timeoutMs: args.timeoutMs
      });
    }
  },
  {
    name: 'browser_extract',
    description: 'Extract structured text, tables, articles, key links, or schemas from any target webpage.',
    permissionTier: 'READ',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The target webpage URL to extract data from.'
        },
        query: {
          type: 'string',
          description: 'What data to extract (e.g. "top 5 articles", "pricing table", "contact emails").'
        }
      },
      required: ['url']
    },
    handler: async (args) => {
      return await browserUseClient.extractData(args.url, args.query);
    }
  },
  {
    name: 'browser_screenshot',
    description: 'Capture a visual snapshot or screenshot of any webpage with customizable viewport width and height.',
    permissionTier: 'READ',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL of the webpage to capture.'
        },
        width: {
          type: 'integer',
          description: 'Viewport width in pixels (default: 1280).'
        },
        height: {
          type: 'integer',
          description: 'Viewport height in pixels (default: 800).'
        }
      },
      required: ['url']
    },
    handler: async (args) => {
      return await browserUseClient.captureScreenshot(args.url, {
        width: args.width,
        height: args.height
      });
    }
  },
  {
    name: 'browser_get_task_status',
    description: 'Retrieve step-by-step logs, live browser view URL, and progress of an active Browser Use task.',
    permissionTier: 'READ',
    parameters: {
      type: 'object',
      properties: {
        runId: {
          type: 'string',
          description: 'The unique task or run ID returned by browser_run_task.'
        }
      },
      required: ['runId']
    },
    handler: async (args) => {
      return await browserUseClient.getTaskStatus(args.runId);
    }
  }
];
