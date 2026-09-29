/**
 * Epic Think AI - Official WhatsApp Plugin Entrypoint
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BasePlugin } from '../../core/BasePlugin.js';
import { whatsappTools } from './tools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.resolve(__dirname, './manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

export class WhatsAppPlugin extends BasePlugin {
  constructor() {
    super(manifest);
    for (const tool of whatsappTools) {
      this.registerTool(tool);
    }
  }
}

export const whatsappPlugin = new WhatsAppPlugin();
