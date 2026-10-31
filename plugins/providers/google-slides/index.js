/**
 * Epic Think AI - Official Google Slides (PPT) Plugin Entrypoint
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BasePlugin } from '../../core/BasePlugin.js';
import { googleSlidesTools } from './tools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.resolve(__dirname, './manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

export class GoogleSlidesPlugin extends BasePlugin {
  constructor() {
    super(manifest);
    for (const tool of googleSlidesTools) {
      this.registerTool(tool);
    }
  }
}

export const googleSlidesPlugin = new GoogleSlidesPlugin();

