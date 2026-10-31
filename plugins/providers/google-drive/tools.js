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
  },
  {
    name: 'create_spreadsheet',
    description: 'Create a new Google Sheet / Spreadsheet.',
    permissionTier: RiskTiers.WRITE,
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title of the spreadsheet' }
      },
      required: ['title']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.createSpreadsheet(args);
      });
    }
  },
  {
    name: 'read_sheet_data',
    description: 'Read rows and cells from a Google Sheet.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        spreadsheetId: { type: 'string', description: 'Google Spreadsheet ID' },
        range: { type: 'string', description: 'A1 notation range (e.g. "Sheet1!A1:Z50" or "A1:E20")' }
      },
      required: ['spreadsheetId']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.readSpreadsheet(args);
      });
    }
  },
  {
    name: 'append_sheet_row',
    description: 'Append rows of data to an existing Google Sheet.',
    permissionTier: RiskTiers.WRITE,
    parameters: {
      type: 'object',
      properties: {
        spreadsheetId: { type: 'string', description: 'Google Spreadsheet ID' },
        range: { type: 'string', description: 'A1 range or sheet name (e.g. "Sheet1!A1")' },
        values: { 
          type: 'array', 
          description: 'Row values to append, e.g. ["2026-10-30", "Task complete", 100]',
          items: { type: 'string' }
        }
      },
      required: ['spreadsheetId', 'values']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.appendSpreadsheetRows(args);
      });
    }
  }
];
