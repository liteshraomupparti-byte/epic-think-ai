/**
 * Epic Think AI - GitHub Tool Definitions & Handlers
 */

import { RiskTiers } from '../../core/PermissionManager.js';
import { GitHubClient } from './GitHubClient.js';

export const githubTools = [
  {
    name: 'search_repositories',
    description: 'Search GitHub repositories for keywords, topics, or languages.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g. "epic think ai", "react agents", "user:octocat")'
        },
        sort: {
          type: 'string',
          enum: ['stars', 'forks', 'updated'],
          description: 'Sort criterion (default: stars)'
        },
        per_page: {
          type: 'integer',
          description: 'Number of results to return (1-20, default: 5)'
        }
      },
      required: ['query']
    },
    handler: async (args, context) => {
      if (context?.credentialHandle?.getAuthorizedClient) {
        try {
          return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
            const client = new GitHubClient(credentials?.accessToken);
            return await client.searchRepositories(args);
          });
        } catch (_) {}
      }
      const client = new GitHubClient();
      return await client.searchRepositories(args);
    }
  },
  {
    name: 'read_code_file',
    description: 'Read the contents of a code file or list directory contents in a repository.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner (user or organization)'
        },
        repo: {
          type: 'string',
          description: 'Repository name'
        },
        path: {
          type: 'string',
          description: 'Relative file path (e.g. "src/index.js", "README.md")'
        },
        ref: {
          type: 'string',
          description: 'Branch name, commit SHA, or tag (default: repo default branch)'
        }
      },
      required: ['owner', 'repo', 'path']
    },
    handler: async (args, context) => {
      if (context?.credentialHandle?.getAuthorizedClient) {
        try {
          return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
            const client = new GitHubClient(credentials?.accessToken);
            return await client.readCodeFile(args);
          });
        } catch (_) {}
      }
      const client = new GitHubClient();
      return await client.readCodeFile(args);
    }
  },
  {
    name: 'list_pull_requests',
    description: 'List pull requests for a repository with status, author, and branch information.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner'
        },
        repo: {
          type: 'string',
          description: 'Repository name'
        },
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Filter PRs by state (default: open)'
        },
        per_page: {
          type: 'integer',
          description: 'Number of results to return (1-20, default: 5)'
        }
      },
      required: ['owner', 'repo']
    },
    handler: async (args, context) => {
      if (context?.credentialHandle?.getAuthorizedClient) {
        try {
          return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
            const client = new GitHubClient(credentials?.accessToken);
            return await client.listPullRequests(args);
          });
        } catch (_) {}
      }
      const client = new GitHubClient();
      return await client.listPullRequests(args);
    }
  },
  {
    name: 'create_issue',
    description: 'Create a new issue in a GitHub repository.',
    permissionTier: RiskTiers.WRITE,
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner'
        },
        repo: {
          type: 'string',
          description: 'Repository name'
        },
        title: {
          type: 'string',
          description: 'Issue title'
        },
        body: {
          type: 'string',
          description: 'Markdown description of the issue'
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
          description: 'Labels to apply to the issue'
        }
      },
      required: ['owner', 'repo', 'title']
    },
    handler: async (args, context) => {
      if (context?.credentialHandle?.getAuthorizedClient) {
        return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
          const client = new GitHubClient(credentials?.accessToken);
          return await client.createIssue(args);
        });
      }
      throw new Error('Connecting your GitHub account is required to create issues.');
    }
  }
];
