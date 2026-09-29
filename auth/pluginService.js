/**
 * Epic Think AI - Production Plugin & Agent Client Service
 * 
 * Provides authenticated communication with backend plugin management,
 * OAuth flows, tool discovery, and action confirmation systems.
 */

import { getIdToken } from "./authService.js";

const getApiBase = () => {
  if (window.location.port === '3001') return '';
  return 'http://localhost:3001';
};

async function fetchWithAuth(endpoint, options = {}) {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User is not authenticated with Firebase.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };

  const response = await fetch(`${getApiBase()}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export class PluginService {
  /**
   * Fetch all plugins with user lifecycle state
   */
  static async getPlugins() {
    const data = await fetchWithAuth('/api/plugins');
    return data.plugins || data;
  }

  /**
   * Install a plugin
   */
  static async install(pluginId) {
    return await fetchWithAuth(`/api/plugins/${pluginId}/install`, { method: 'POST' });
  }

  /**
   * Enable an installed plugin
   */
  static async enable(pluginId) {
    return await fetchWithAuth(`/api/plugins/${pluginId}/enable`, { method: 'POST' });
  }

  /**
   * Disable a plugin
   */
  static async disable(pluginId) {
    return await fetchWithAuth(`/api/plugins/${pluginId}/disable`, { method: 'POST' });
  }

  /**
   * Disconnect plugin and revoke vaulted credentials
   */
  static async disconnect(pluginId) {
    return await fetchWithAuth(`/api/plugins/${pluginId}/disconnect`, { method: 'DELETE' });
  }

  /**
   * Get OAuth authorization URL
   */
  static async getOAuthUrl(pluginId) {
    const data = await fetchWithAuth(`/api/plugins/${pluginId}/oauth/authorize`);
    return data.authUrl;
  }

  /**
   * Connect direct Bot Token (Telegram, Discord, WhatsApp)
   */
  static async connectBotToken(pluginId, token) {
    return await fetchWithAuth(`/api/plugins/${pluginId}/bot-token`, {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  /**
   * Get active tools currently enabled for user
   */
  static async getActiveTools() {
    try {
      const data = await fetchWithAuth('/api/agent/active-tools');
      return data.tools || [];
    } catch (_) {
      return [];
    }
  }

  /**
   * Get pending confirmations
   */
  static async getPendingConfirmations() {
    try {
      const data = await fetchWithAuth('/api/confirmations/pending');
      return data.tickets || [];
    } catch (_) {
      return [];
    }
  }

  /**
   * Resolve an action confirmation ticket
   * 
   * @param {string} confirmationId
   * @param {'approved' | 'rejected'} decision
   */
  static async resolveConfirmation(confirmationId, decision) {
    return await fetchWithAuth(`/api/confirmations/${confirmationId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ decision })
    });
  }

  /**
   * Execute chat query through autonomous AgentPlanner
   */
  static async executeAgentChat({ prompt, conversationId, confirmationId }) {
    return await fetchWithAuth('/api/agent/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        conversationId,
        confirmationId
      })
    });
  }
}
