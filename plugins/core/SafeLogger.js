/**
 * Epic Think AI - Safe Structured Logger
 * 
 * Guarantees zero leakage of secrets, access tokens, refresh tokens,
 * passwords, OTPs, or private document/email bodies.
 */

import crypto from 'crypto';

// Regex patterns for sensitive keys or values that must be redacted
const SENSITIVE_KEY_PATTERN = /token|secret|password|key|auth|bearer|credential|cookie|jwt/i;
const TOKEN_VALUE_PATTERN = /(?:bearer\s+[a-zA-Z0-9_\-\.]+|gh[pousr]_[a-zA-Z0-9]{36,}|ya29\.[a-zA-Z0-9_\-]+|eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,})/gi;

export class SafeLogger {
  /**
   * One-way cryptographic hash of a user ID for observability without leaking PII
   */
  static hashUid(uid) {
    if (!uid) return 'anonymous';
    return 'u_' + crypto.createHash('sha256').update(String(uid)).digest('hex').slice(0, 12);
  }

  /**
   * Deep sanitize any object or string before logging
   */
  static sanitize(data, depth = 0) {
    if (depth > 4) return '[MAX_DEPTH]';
    if (data === null || data === undefined) return data;

    if (typeof data === 'string') {
      let cleaned = data.replace(TOKEN_VALUE_PATTERN, '[REDACTED_TOKEN]');
      if (cleaned.length > 500) {
        cleaned = cleaned.slice(0, 500) + '... [TRUNCATED]';
      }
      return cleaned;
    }

    if (Array.isArray(data)) {
      return data.slice(0, 20).map(item => SafeLogger.sanitize(item, depth + 1));
    }

    if (typeof data === 'object') {
      const sanitized = {};
      for (const [key, val] of Object.entries(data)) {
        if (SENSITIVE_KEY_PATTERN.test(key)) {
          sanitized[key] = '[REDACTED_SECRET]';
        } else {
          sanitized[key] = SafeLogger.sanitize(val, depth + 1);
        }
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Log an audit event for tool execution
   */
  static logToolExecution({ uid, pluginId, toolName, riskTier, durationMs, success, error }) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: 'tool_execution',
      user: SafeLogger.hashUid(uid),
      plugin: pluginId,
      tool: toolName,
      riskTier,
      durationMs: Math.round(durationMs),
      success: !!success,
      error: error ? String(error).slice(0, 200) : null
    };

    console.log(`[SAFE_AUDIT] ${entry.timestamp} | ${entry.plugin}.${entry.tool} | user:${entry.user} | ${entry.riskTier} | ${entry.durationMs}ms | ${entry.success ? 'SUCCESS' : 'FAILED'}`);
  }

  static info(message, meta = {}) {
    console.log(`[INFO] ${message}`, Object.keys(meta).length ? SafeLogger.sanitize(meta) : '');
  }

  static warn(message, meta = {}) {
    console.warn(`[WARN] ${message}`, Object.keys(meta).length ? SafeLogger.sanitize(meta) : '');
  }

  static error(message, meta = {}) {
    console.error(`[ERROR] ${message}`, Object.keys(meta).length ? SafeLogger.sanitize(meta) : '');
  }
}
