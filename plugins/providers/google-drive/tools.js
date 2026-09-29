/**
 * Epic Think AI - Google Drive Tool Definitions & Handlers
 */

import { RiskTiers } from '../../core/PermissionManager.js';
import { GoogleWorkspaceClient } from '../google-workspace/GoogleWorkspaceClient.js';

export const googleDriveTools = [
  {
    name: 'search_files',
    description: 'Search files in Google Drive by filename or content keywords.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term or filename query' },
        pageSize: { type: 'integer', description: 'Max files to return (default: 10)' }
      }
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.searchFiles(args);
      });
    }
  },
  {
    name: 'read_file',
    description: 'Read the contents of a text/JSON file in Google Drive by fileId.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'Google Drive File ID' }
      },
      required: ['fileId']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.readFile(args);
      });
    }
  },
  {
    name: 'list_folders',
    description: 'List folders and directories in Google Drive.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        pageSize: { type: 'integer', description: 'Max folders to return (default: 10)' }
      }
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.listFolders(args);
      });
    }
  },
  {
    name: 'upload_file',
    description: 'Upload a text document or asset to Google Drive.',
    permissionTier: RiskTiers.WRITE,
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name of the file including extension (e.g. "report.txt")' },
        content: { type: 'string', description: 'File content' },
        folderId: { type: 'string', description: 'Optional parent folder ID' }
      },
      required: ['name', 'content']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.uploadFile(args);
      });
    }
  }
];
