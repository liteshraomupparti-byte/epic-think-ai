/**
 * Epic Think AI - Plugins Auto-Discovery and Central Registration
 */

import { registry } from './core/PluginRegistry.js';
import { githubPlugin } from './providers/github/index.js';
import { gmailPlugin } from './providers/gmail/index.js';
import { googleCalendarPlugin } from './providers/google-calendar/index.js';
import { googleDrivePlugin } from './providers/google-drive/index.js';
import { notionPlugin } from './providers/notion/index.js';
import { webSearchPlugin } from './providers/web-search/index.js';
import { telegramPlugin } from './providers/telegram/index.js';
import { discordPlugin } from './providers/discord/index.js';
import { whatsappPlugin } from './providers/whatsapp/index.js';
import { SafeLogger } from './core/SafeLogger.js';

let initialized = false;

export function initializePlugins() {
  if (initialized) return registry;

  SafeLogger.info('Initializing Epic Think AI Plugin System v2.0...');

  // Register all official plugins
  registry.register(githubPlugin);
  registry.register(gmailPlugin);
  registry.register(googleCalendarPlugin);
  registry.register(googleDrivePlugin);
  registry.register(notionPlugin);
  registry.register(webSearchPlugin);
  registry.register(telegramPlugin);
  registry.register(discordPlugin);
  registry.register(whatsappPlugin);

  SafeLogger.info('All 9 plugins registered successfully', {
    totalPlugins: registry.getAllPlugins().length
  });

  initialized = true;
  return registry;
}

export { registry };
