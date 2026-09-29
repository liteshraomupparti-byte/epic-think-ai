/**
 * Epic Think AI - Plugin System API Routes
 * 
 * Provides:
 * - GET /api/plugins (List all plugins with user-specific lifecycle state)
 * - POST /api/plugins/:id/install
 * - POST /api/plugins/:id/enable
 * - POST /api/plugins/:id/disable
 * - DELETE /api/plugins/:id/disconnect
 * - GET /api/plugins/:id/oauth/authorize
 * - GET /api/plugins/:id/oauth/callback
 * - POST /api/plugins/:id/bot-token
 */

import express from 'express';
import { requireAuth } from '../services/firebaseAuthService.js';
import { registry } from '../plugins/index.js';
import { OAuthManager } from '../plugins/core/OAuthManager.js';
import { PermissionManager } from '../plugins/core/PermissionManager.js';
import { SafeLogger } from '../plugins/core/SafeLogger.js';

const router = express.Router();

/**
 * List all available plugins and user-specific lifecycle states
 * GET /api/plugins
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const plugins = registry.getAllPlugins();

    const results = await Promise.all(
      plugins.map(async (plugin) => {
        const state = await registry.getUserPluginState(uid, plugin.id);
        return {
          id: plugin.id,
          name: plugin.name,
          version: plugin.version,
          description: plugin.description,
          category: plugin.category,
          authType: plugin.authType,
          icon: plugin.manifest.icon || 'puzzle',
          state, // 'AVAILABLE' | 'INSTALLED' | 'CONNECTED' | 'ENABLED' | 'DISABLED' | 'DISCONNECTED'
          status: state.toLowerCase(),
          tools: plugin.getTools().map(tool => ({
            name: tool.name,
            description: tool.description,
            permissionTier: tool.permissionTier,
            permissionDescription: PermissionManager.describeToolPermission(tool),
            requiresConfirmation: PermissionManager.requiresConfirmation(tool)
          }))
        };
      })
    );

    res.json({
      success: true,
      plugins: results
    });
  } catch (err) {
    SafeLogger.error('Failed to list plugins', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Install a plugin
 * POST /api/plugins/:id/install
 */
router.post('/:id/install', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const result = await registry.installPlugin(uid, id);
    res.json({ success: true, pluginId: id, state: result.state });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * Enable a plugin
 * POST /api/plugins/:id/enable
 */
router.post('/:id/enable', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const result = await registry.enablePlugin(uid, id);
    res.json({ success: true, pluginId: id, state: result.state });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * Disable a plugin
 * POST /api/plugins/:id/disable
 */
router.post('/:id/disable', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const result = await registry.disablePlugin(uid, id);
    res.json({ success: true, pluginId: id, state: result.state });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * Disconnect plugin and revoke credentials
 * DELETE /api/plugins/:id/disconnect
 */
router.delete('/:id/disconnect', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    await OAuthManager.disconnectPlugin({ uid, pluginId: id });
    res.json({ success: true, pluginId: id, state: 'DISCONNECTED' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * Get OAuth Authorization URL
 * GET /api/plugins/:id/oauth/authorize
 */
router.get('/:id/oauth/authorize', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;
    const redirectUri = req.query.redirectUri || `${req.protocol}://${req.get('host')}/api/plugins/${id}/oauth/callback`;

    const authUrl = OAuthManager.getAuthorizationUrl({
      uid,
      pluginId: id,
      redirectUri
    });

    res.json({
      success: true,
      authUrl
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * OAuth Callback Handler
 * GET /api/plugins/:id/oauth/callback
 */
router.get('/:id/oauth/callback', async (req, res) => {
  const { id } = req.params;
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`/chat?pluginError=${encodeURIComponent(error)}`);
  }

  try {
    // In OAuth callback, state contains the signed user context
    const callbackResult = await OAuthManager.handleCallback({
      code,
      stateToken: state,
      expectedPluginId: id
    });

    // Auto-enable plugin after successful OAuth
    await registry.enablePlugin(callbackResult.uid || OAuthManager.verifyState(state).uid, id);

    res.redirect(`/chat?pluginConnected=${encodeURIComponent(id)}`);
  } catch (err) {
    SafeLogger.error('OAuth callback failed', { plugin: id, error: err.message });
    res.redirect(`/chat?pluginError=${encodeURIComponent(err.message)}`);
  }
});

/**
 * Connect Bot Token (Telegram, Discord, WhatsApp)
 * POST /api/plugins/:id/bot-token
 */
router.post('/:id/bot-token', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required.' });
    }

    const result = await OAuthManager.connectBotToken({
      uid,
      pluginId: id,
      token
    });

    // Auto-enable after valid token connection
    await registry.enablePlugin(uid, id);

    res.json({
      success: true,
      pluginId: id,
      state: 'ENABLED',
      accountBinding: result.accountBinding
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
