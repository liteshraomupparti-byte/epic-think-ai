/**
 * Epic Think AI - Google Slides (PPT) Tools Definition & Execution
 */

import { RiskTiers } from '../../core/PermissionManager.js';
import { GoogleWorkspaceClient } from '../google-workspace/GoogleWorkspaceClient.js';

export const googleSlidesTools = [
  {
    name: 'create_presentation',
    description: 'Create a complete multi-slide Google Slides presentation / pitch deck with titles, subtitles, and structured bullet points in high speed.',
    permissionTier: RiskTiers.WRITE,
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the presentation (e.g. "AI Autonomous Agents Pitch Deck")'
        },
        slides: {
          type: 'array',
          description: 'List of slide objects to create. Each slide can have title, bullets (array of strings), body, or subtitle.',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Slide header title' },
              bullets: {
                type: 'array',
                items: { type: 'string' },
                description: 'Key bullet points for the slide'
              },
              subtitle: { type: 'string', description: 'Optional subtitle or summary line' },
              body: { type: 'string', description: 'Optional paragraph body text' }
            },
            required: ['title']
          }
        }
      },
      required: ['title']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.createPresentation(args);
      });
    }
  },
  {
    name: 'add_slide',
    description: 'Add a new slide with custom title and bullet points to an existing Google Slides presentation.',
    permissionTier: RiskTiers.WRITE,
    parameters: {
      type: 'object',
      properties: {
        presentationId: {
          type: 'string',
          description: 'Google Slides presentation ID'
        },
        title: {
          type: 'string',
          description: 'Slide title'
        },
        bullets: {
          type: 'array',
          items: { type: 'string' },
          description: 'Bullet points to place on the slide'
        },
        content: {
          type: 'string',
          description: 'Optional body text if bullets are not provided'
        }
      },
      required: ['presentationId', 'title']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.addSlide(args);
      });
    }
  },
  {
    name: 'read_presentation',
    description: 'Read all slides, text runs, and structure from a Google Slides presentation by ID.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        presentationId: {
          type: 'string',
          description: 'Google Slides presentation ID'
        }
      },
      required: ['presentationId']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.readPresentation(args);
      });
    }
  }
];

