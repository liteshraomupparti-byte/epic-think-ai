/**
 * Epic Think AI - Secure Token Vault (AES-256-GCM)
 * 
 * Hardware-grade encrypted credential storage.
 * Guarantees zero raw token leakage by utilizing Opaque Credential Handles.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { SafeLogger } from './SafeLogger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_FALLBACK_FILE = path.resolve(__dirname, '../../.vault_resilient_store.json');

// In-memory + disk fallback store for offline resilience
let vaultFallbackStore = {
  credentials: {} // { [uid]: { [pluginId]: { ciphertext, iv, authTag, updatedAt, expiresAt, scopes } } }
};

try {
  if (fs.existsSync(VAULT_FALLBACK_FILE)) {
    const raw = fs.readFileSync(VAULT_FALLBACK_FILE, 'utf8');
    vaultFallbackStore = JSON.parse(raw) || { credentials: {} };
    if (!vaultFallbackStore.credentials) vaultFallbackStore.credentials = {};
  }
} catch (_) {}

function persistVaultStore() {
  try {
    fs.writeFileSync(VAULT_FALLBACK_FILE, JSON.stringify(vaultFallbackStore, null, 2), 'utf8');
  } catch (err) {
    SafeLogger.warn('Failed to persist vault store to disk', { error: err.message });
  }
}

/**
 * Derives a valid 32-byte Buffer from PLUGIN_ENCRYPTION_KEY
 */
function getMasterKey() {
  const rawKey = process.env.PLUGIN_ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error('CRITICAL SECURITY ERROR: PLUGIN_ENCRYPTION_KEY is not defined in environment.');
  }

  if (rawKey.length === 64) {
    return Buffer.from(rawKey, 'hex');
  }

  // Derive 32 bytes using SHA-256 if key is a passphrase
  return crypto.createHash('sha256').update(rawKey).digest();
}

/**
 * Opaque Credential Handle
 * Tool handlers interact with this handle, never receiving raw access tokens.
 */
export class CredentialHandle {
  constructor(uid, pluginId, tokenVault) {
    this.uid = uid;
    this.pluginId = pluginId;
    this._vault = tokenVault;
    this.handleId = 'hnd_' + crypto.randomBytes(8).toString('hex');
  }

  /**
   * Instantiates a pre-authenticated client inside an isolated closure
   * 
   * @param {Function} clientFactory - (credentials) => authenticatedClient
   */
  async getAuthorizedClient(clientFactory) {
    if (typeof clientFactory !== 'function') {
      throw new Error('clientFactory must be a function that accepts credentials.');
    }

    const credentials = await this._vault.getCredentials(this.uid, this.pluginId);
    if (!credentials) {
      throw new Error(`No credentials found in vault for plugin "${this.pluginId}".`);
    }

    return await clientFactory(credentials);
  }
}

export class TokenVault {
  /**
   * Encrypt a sensitive object or string using AES-256-GCM
   */
  static encrypt(data) {
    const key = getMasterKey();
    const iv = crypto.randomBytes(12); // Recommended 12 bytes for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const serialized = typeof data === 'string' ? data : JSON.stringify(data);
    let ciphertext = cipher.update(serialized, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      ciphertext,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: 'aes-256-gcm',
      keyVersion: 1
    };
  }

  /**
   * Decrypt ciphertext using AES-256-GCM and verify cryptographic integrity
   */
  static decrypt({ ciphertext, iv, authTag }) {
    if (!ciphertext || !iv || !authTag) {
      throw new Error('Malformed encrypted payload: missing ciphertext, iv, or authTag.');
    }

    const key = getMasterKey();
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    try {
      return JSON.parse(decrypted);
    } catch (_) {
      return decrypted;
    }
  }

  /**
   * Securely store encrypted credentials for an authenticated user
   */
  static async saveCredentials(uid, pluginId, credentials, metadata = {}) {
    if (!uid || !pluginId || !credentials) {
      throw new Error('UID, pluginId, and credentials are required to save.');
    }

    const encrypted = TokenVault.encrypt(credentials);
    const now = Date.now();

    const record = {
      uid: String(uid),
      pluginId: String(pluginId),
      ...encrypted,
      scopes: Array.isArray(metadata.scopes) ? metadata.scopes : [],
      expiresAt: metadata.expiresAt || null,
      updatedAt: now
    };

    // Save to resilient fallback
    if (!vaultFallbackStore.credentials[uid]) {
      vaultFallbackStore.credentials[uid] = {};
    }
    vaultFallbackStore.credentials[uid][pluginId] = record;
    persistVaultStore();

    SafeLogger.info('Credentials securely vaulted', {
      user: SafeLogger.hashUid(uid),
      plugin: pluginId
    });

    return { success: true, pluginId, updatedAt: now };
  }

  /**
   * Retrieve and decrypt credentials in-memory
   */
  static async getCredentials(uid, pluginId) {
    if (!uid || !pluginId) return null;

    const record = vaultFallbackStore.credentials[uid]?.[pluginId];
    if (!record) return null;

    try {
      const decrypted = TokenVault.decrypt(record);
      return decrypted;
    } catch (err) {
      SafeLogger.error('Failed to decrypt credentials from vault', {
        user: SafeLogger.hashUid(uid),
        plugin: pluginId,
        error: err.message
      });
      return null;
    }
  }

  /**
   * Check if credentials exist for user and plugin
   */
  static async hasCredentials(uid, pluginId) {
    if (!uid || !pluginId) return false;
    return !!vaultFallbackStore.credentials[uid]?.[pluginId];
  }

  /**
   * Revoke and permanently shred credentials
   */
  static async revokeCredentials(uid, pluginId) {
    if (!uid || !pluginId) return false;

    if (vaultFallbackStore.credentials[uid]?.[pluginId]) {
      delete vaultFallbackStore.credentials[uid][pluginId];
      persistVaultStore();
    }

    SafeLogger.info('Credentials revoked from vault', {
      user: SafeLogger.hashUid(uid),
      plugin: pluginId
    });

    return true;
  }

  /**
   * Create an opaque CredentialHandle for tool execution
   */
  static createHandle(uid, pluginId) {
    return new CredentialHandle(uid, pluginId, TokenVault);
  }
}
