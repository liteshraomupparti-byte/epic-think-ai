/**
 * Epic Think AI - Official Google Calendar Plugin Entrypoint
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BasePlugin } from '../../core/BasePlugin.js';
import { googleCalendarTools } from './tools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.resolve(__dirname, './manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

export class GoogleCalendarPlugin extends BasePlugin {
  constructor() {
    super(manifest);
    for (const tool of googleCalendarTools) {
      this.registerTool(tool);
    }
  }
}

export const googleCalendarPlugin = new GoogleCalendarPlugin();
