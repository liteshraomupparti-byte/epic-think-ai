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
import { TokenVault } from '../plugins/core/TokenVault.js';
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
 * Helper to resolve the correct, environment-aware OAuth Redirect URI
 */
function resolveOAuthRedirectUri(req, pluginId) {
  if (req.query.redirectUri) {
    return req.query.redirectUri;
  }

  const isGooglePlugin = ['google', 'gmail', 'google-drive', 'google_drive', 'google-calendar', 'google_calendar'].includes(String(pluginId).toLowerCase());

  // Detect host and protocol reliably (supporting Vercel edge proxies and local dev)
  const forwardedProto = req.headers['x-forwarded-proto'];
  const forwardedHost = req.headers['x-forwarded-host'];
  const host = forwardedHost || req.get('host') || 'localhost:3001';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const protocol = isLocalhost ? (req.protocol || 'http') : (forwardedProto || 'https');

  if (isGooglePlugin) {
    // Check both standard environment variable names
    const configuredUri = process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_CALLBACK_URL;

    if (configuredUri) {
      // If we are on localhost, only use configuredUri if it is a localhost URI
      if (isLocalhost && (configuredUri.includes('localhost') || configuredUri.includes('127.0.0.1'))) {
        return configuredUri;
      }
      // If we are in production, only use configuredUri if it is an HTTPS URI
      if (!isLocalhost && configuredUri.startsWith('https://')) {
        return configuredUri;
      }
    }

    // Dynamic canonical fallback:
    // Local: http://localhost:3001/api/plugins/google/oauth/callback
    // Prod:  https://hink-ai.vercel.app/api/plugins/google/oauth/callback
    return `${protocol}://${host}/api/plugins/google/oauth/callback`;
  }

  if (pluginId === 'notion') {
    return process.env.NOTION_REDIRECT_URI || 'https://epic-think-ai.vercel.app/api/plugins/notion/oauth/callback';
  }

  // Non-Google plugins (e.g. github)
  return `${protocol}://${host}/api/plugins/${pluginId}/oauth/callback`;
}

/**
 * Get OAuth Authorization URL
 * GET /api/plugins/:id/oauth/authorize
 */
router.get('/:id/oauth/authorize', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;
    const redirectUri = resolveOAuthRedirectUri(req, id);

    const authUrl = OAuthManager.getAuthorizationUrl({
      uid,
      pluginId: id,
      redirectUri
    });

    res.json({
      success: true,
      authUrl,
      redirectUri
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
    return res.redirect(`/?plugin_oauth_error=${encodeURIComponent(error)}&pluginError=${encodeURIComponent(error)}`);
  }

  try {
    // In OAuth callback, state contains the signed user context
    const callbackResult = await OAuthManager.handleCallback({
      code,
      stateToken: state,
      expectedPluginId: id
    });

    const targetPluginId = callbackResult.pluginId || id;
    const targetUid = callbackResult.uid;

    // Auto-enable plugin after successful OAuth
    if (targetUid) {
      const isGoogleFamily = ['google', 'gmail', 'google-drive', 'google_drive', 'google-calendar', 'google_calendar'].includes(String(targetPluginId).toLowerCase());

      if (isGoogleFamily) {
        // Single Google OAuth grant covers Gmail, Google Drive, and Google Calendar
        const creds = await TokenVault.getCredentials(targetUid, targetPluginId);
        if (creds) {
          const googlePlugins = ['gmail', 'google-calendar', 'google_calendar', 'google-drive', 'google_drive'];
          for (const gPlugin of googlePlugins) {
            try {
              await TokenVault.saveCredentials(targetUid, gPlugin, creds);
              if (registry.getPlugin(gPlugin)) {
                await registry.enablePlugin(targetUid, gPlugin);
              }
            } catch (_) {}
          }
        }
      } else if (registry.getPlugin(targetPluginId)) {
        await registry.enablePlugin(targetUid, targetPluginId);
      }
    }

    res.redirect(`/?plugin_oauth_success=${encodeURIComponent(targetPluginId)}&pluginConnected=${encodeURIComponent(targetPluginId)}#plugins`);
  } catch (err) {
    SafeLogger.error('OAuth callback failed', { plugin: id, error: err.message });
    res.redirect(`/?plugin_oauth_error=${encodeURIComponent(err.message)}&pluginError=${encodeURIComponent(err.message)}#plugins`);
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
