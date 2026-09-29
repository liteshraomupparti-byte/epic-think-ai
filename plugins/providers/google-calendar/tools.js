/**
 * Epic Think AI - Google Calendar Tool Definitions & Handlers
 */

import { RiskTiers } from '../../core/PermissionManager.js';
import { GoogleWorkspaceClient } from '../google-workspace/GoogleWorkspaceClient.js';

export const googleCalendarTools = [
  {
    name: 'list_events',
    description: 'List upcoming events from primary Google Calendar.',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        timeMin: { type: 'string', description: 'ISO 8601 start time (default: now)' },
        timeMax: { type: 'string', description: 'ISO 8601 end time' },
        maxResults: { type: 'integer', description: 'Max events to return (default: 10)' }
      }
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.listEvents(args);
      });
    }
  },
  {
    name: 'find_free_slots',
    description: 'Find available meeting slots for a given date during working hours (9 AM - 6 PM).',
    permissionTier: RiskTiers.READ,
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Target date (YYYY-MM-DD)' },
        durationMinutes: { type: 'integer', description: 'Required meeting duration in minutes (default: 30)' }
      }
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.findFreeSlots(args);
      });
    }
  },
  {
    name: 'schedule_event',
    description: 'Schedule a new calendar event with summary, description, time range, and attendees. (Requires human confirmation).',
    permissionTier: RiskTiers.EXTERNAL_ACTION,
    parameters: {
      type: 'object',
      properties: {
        summary: { type: 'string', description: 'Event title' },
        description: { type: 'string', description: 'Event details / agenda' },
        start: { type: 'string', description: 'ISO 8601 start datetime (e.g. 2026-10-01T10:00:00Z)' },
        end: { type: 'string', description: 'ISO 8601 end datetime (e.g. 2026-10-01T11:00:00Z)' },
        attendees: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of attendee email addresses'
        }
      },
      required: ['summary', 'start', 'end']
    },
    handler: async (args, context) => {
      return await context.credentialHandle.getAuthorizedClient(async (credentials) => {
        const client = new GoogleWorkspaceClient(credentials.accessToken);
        return await client.createEvent(args);
      });
    }
  }
];
