/**
 * Epic Think AI - Central Plugin Registry & Lifecycle State Engine
 * 
 * Manages plugin discovery, manifest verification, and multi-tenant lifecycle states:
 * AVAILABLE -> INSTALLED -> CONNECTED -> ENABLED -> DISABLED -> DISCONNECTED
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BasePlugin } from './BasePlugin.js';
import { TokenVault } from './TokenVault.js';
import { SafeLogger } from './SafeLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SETTINGS_FALLBACK_FILE = path.resolve(__dirname, '../../.plugin_settings_store.json');

// In-memory + disk fallback store for user lifecycle settings
let settingsFallbackStore = {
  settings: {} // { [uid]: { [pluginId]: { state: 'ENABLED'|..., settings: {}, updatedAt } } }
};

try {
  if (fs.existsSync(SETTINGS_FALLBACK_FILE)) {
    const raw = fs.readFileSync(SETTINGS_FALLBACK_FILE, 'utf8');
    settingsFallbackStore = JSON.parse(raw) || { settings: {} };
    if (!settingsFallbackStore.settings) settingsFallbackStore.settings = {};
  }
} catch (_) {}

function persistSettingsStore() {
  try {
    fs.writeFileSync(SETTINGS_FALLBACK_FILE, JSON.stringify(settingsFallbackStore, null, 2), 'utf8');
  } catch (err) {
    SafeLogger.warn('Failed to persist plugin settings store', { error: err.message });
  }
}

export class PluginRegistry {
  constructor() {
    this.plugins = new Map(); // pluginId -> BasePlugin instance
  }

  /**
   * Register a plugin into the global registry
   * 
   * @param {BasePlugin} plugin - Plugin instance extending BasePlugin
   */
  register(plugin) {
    if (!(plugin instanceof BasePlugin)) {
      throw new Error(`Cannot register plugin: instance must inherit from BasePlugin.`);
    }

    if (this.plugins.has(plugin.id)) {
      SafeLogger.warn(`Plugin "${plugin.id}" already registered. Overwriting with newer instance.`);
    }

    this.plugins.set(plugin.id, plugin);
    SafeLogger.info(`Registered plugin: ${plugin.id} (v${plugin.version})`, {
      toolsCount: plugin.getTools().length
    });
  }

  normalizeId(id) {
    if (!id || typeof id !== 'string') return id;
    if (this.plugins.has(id)) return id;
    const hyp = id.replace(/_/g, '-');
    if (this.plugins.has(hyp)) return hyp;
    const und = id.replace(/-/g, '_');
    if (this.plugins.has(und)) return und;
    return id;
  }

  hasPlugin(id) {
    const norm = this.normalizeId(id);
    return this.plugins.has(norm);
  }

  getPlugin(id) {
    const norm = this.normalizeId(id);
    return this.plugins.get(norm) || null;
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  /**
   * Determine the current lifecycle state of a plugin for an authenticated user
   */
  async getUserPluginState(uid, rawPluginId) {
    const pluginId = this.normalizeId(rawPluginId);
    if (!uid || !this.plugins.has(pluginId)) {
      return 'AVAILABLE';
    }

    const userSettings = settingsFallbackStore.settings[uid]?.[pluginId] || settingsFallbackStore.settings[uid]?.[rawPluginId];
    const hasCreds = await TokenVault.hasCredentials(uid, pluginId);
    const plugin = this.plugins.get(pluginId);

    // If no record exists yet
    if (!userSettings) {
      // If plugin requires no auth (like web_search), default to ENABLED out of the box
      if (plugin && plugin.authType === 'none') {
        return 'ENABLED';
      }
      return 'AVAILABLE';
    }

    // If user explicitly set state to DISABLED
    if (userSettings.state === 'DISABLED') {
      return 'DISABLED';
    }

    // If user explicitly set state to ENABLED
    if (userSettings.state === 'ENABLED') {
      // Must be authenticated if auth is required
      if (plugin.authType !== 'none' && !hasCreds) {
        return 'INSTALLED'; // Downgrade if credentials were lost/revoked
      }
      return 'ENABLED';
    }

    // If credentials exist but not enabled yet
    if (hasCreds) {
      return 'CONNECTED';
    }

    return userSettings.state || 'INSTALLED';
  }

  /**
   * Transition plugin state for a user
   */
  async setUserPluginState(uid, rawPluginId, state, customSettings = {}) {
    const pluginId = this.normalizeId(rawPluginId);
    if (!uid || !this.plugins.has(pluginId)) {
      throw new Error(`Invalid UID or pluginId "${rawPluginId}".`);
    }

    const validStates = ['AVAILABLE', 'INSTALLED', 'CONNECTED', 'ENABLED', 'DISABLED', 'DISCONNECTED'];
    if (!validStates.includes(state)) {
      throw new Error(`Invalid state "${state}". Expected one of: ${validStates.join(', ')}`);
    }

    if (!settingsFallbackStore.settings[uid]) {
      settingsFallbackStore.settings[uid] = {};
    }

    const current = settingsFallbackStore.settings[uid][pluginId] || {};
    settingsFallbackStore.settings[uid][pluginId] = {
      state,
      settings: { ...current.settings, ...customSettings },
      updatedAt: Date.now()
    };
    persistSettingsStore();

    SafeLogger.info('Plugin lifecycle state updated', {
      user: SafeLogger.hashUid(uid),
      plugin: pluginId,
      state
    });

    return { success: true, pluginId, state };
  }

  /**
   * Install a plugin for a user
   */
  async installPlugin(uid, pluginId) {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) throw new Error(`Plugin "${pluginId}" not found.`);

    await plugin.onInstall(uid);
    // If no auth needed, directly connect & enable
    if (plugin.authType === 'none') {
      return await this.setUserPluginState(uid, pluginId, 'ENABLED');
    }
    return await this.setUserPluginState(uid, pluginId, 'INSTALLED');
  }

  /**
   * Enable an installed/connected plugin
   */
  async enablePlugin(uid, pluginId) {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) throw new Error(`Plugin "${pluginId}" not found.`);

    const hasCreds = await TokenVault.hasCredentials(uid, pluginId);
    if (plugin.authType !== 'none' && !hasCreds) {
      throw new Error(`Cannot enable "${plugin.name}": Please connect your account first.`);
    }

    await plugin.onEnable(uid);
    return await this.setUserPluginState(uid, pluginId, 'ENABLED');
  }

  /**
   * Disable a plugin without revoking credentials
   */
  async disablePlugin(uid, pluginId) {
    const plugin = this.getPlugin(pluginId);
    if (plugin) await plugin.onDisable(uid);
    return await this.setUserPluginState(uid, pluginId, 'DISABLED');
  }

  /**
   * Disconnect and shred credentials
   */
  async disconnectPlugin(uid, pluginId) {
    const plugin = this.getPlugin(pluginId);
    if (plugin) await plugin.onDisconnect(uid);

    await TokenVault.revokeCredentials(uid, pluginId);
    return await this.setUserPluginState(uid, pluginId, 'DISCONNECTED');
  }

  /**
   * Get all active tools currently enabled for the authenticated user
   */
  async getUserActiveTools(uid) {
    if (!uid) return [];

    const activeTools = [];
    for (const plugin of this.plugins.values()) {
      const state = await this.getUserPluginState(uid, plugin.id);
      if (state === 'ENABLED') {
        const tools = plugin.getTools();
        activeTools.push(...tools);
      }
    }

    return activeTools;
  }
}

// Global Registry Singleton
export const registry = new PluginRegistry();
