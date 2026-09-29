/**
 * Epic Think AI - Official GitHub Plugin Entrypoint
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BasePlugin } from '../../core/BasePlugin.js';
import { githubTools } from './tools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.resolve(__dirname, './manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

export class GitHubPlugin extends BasePlugin {
  constructor() {
    super(manifest);

    // Register all official tools
    for (const tool of githubTools) {
      this.registerTool(tool);
    }
  }

  async onEnable(uid) {
    // Optional plugin-specific enablement hook
    return true;
  }

  async onDisconnect(uid) {
    // Optional plugin-specific cleanup
    return true;
  }
}

// Export default singleton
export const githubPlugin = new GitHubPlugin();
