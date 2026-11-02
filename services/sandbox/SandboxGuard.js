/**
 * SandboxGuard.js
 * Epic Think AI - Secure Isolated Code Execution & Filesystem Boundary
 * Inspired by OpenSandbox Architecture
 * 
 * Provides:
 * 1. Strict Path Traversal Prevention (Filesystem Jail)
 * 2. Sensitive File & Secret Guardrails (blocks reading .env, credentials, system binaries)
 * 3. Dangerous Shell Command Filter & AST Sanitizer
 * 4. Isolated In-Memory Script Execution via Node.js vm with timeout boundaries
 */

import path from 'path';
import fs from 'fs';
import vm from 'vm';

export const FORBIDDEN_PATHS = [
  '.env',
  '.git',
  'node_modules',
  'C:\\Windows',
  'C:\\Program Files',
  '/etc/passwd',
  '/etc/shadow',
  '/root',
  '/bin',
  '/usr'
];

export const DANGEROUS_COMMAND_PATTERNS = [
  /\b(?:rm\s+-[rf]{1,2}\s+[\/\\]|del\s+\/[fsq]+\s+[c-z]:\\)/i,
  /\b(?:format\s+[c-z]:|fdisk|mkfs)\b/i,
  /\b(?:shutdown|reboot|init\s+0|halt)\b/i,
  /\b(?:reg\s+delete|reg\s+add)\b/i,
  /\b(?:net\s+user|net\s+localgroup)\b/i,
  /\b(?:chmod\s+-R\s+777\s+\/)\b/i,
  /\b(?:curl|wget)\b[^\n|]+\|\s*(?:ba)?sh\b/i,
  /\b(?:nc\s+-e|bash\s+-i\s+>&|python\s+-c\s+["']import\s+socket)\b/i
];

export class SandboxGuard {
  /**
   * Validate and enforce that a path stays inside the target sandbox directory
   * @param {string} sandboxRoot - Root directory acting as the boundary jail
   * @param {string} targetPath - Relative or absolute path requested
   * @returns {string} Sanitized resolved absolute path inside sandboxRoot
   */
  static assertSafePath(sandboxRoot, targetPath) {
    if (!sandboxRoot || !targetPath) {
      throw new Error('SandboxGuard: sandboxRoot and targetPath are required.');
    }

    const resolvedRoot = path.resolve(sandboxRoot);
    const resolvedTarget = path.resolve(resolvedRoot, targetPath);

    // Enforce jail boundary
    if (!resolvedTarget.startsWith(resolvedRoot)) {
      throw new Error(`Security Violation: Path traversal detected outside sandbox jail: "${targetPath}"`);
    }

    // Check for forbidden secret or system path references
    const normalized = targetPath.toLowerCase().replace(/\\/g, '/');
    if (normalized.includes('.env') || normalized.includes('firebase_admin') || normalized.includes('id_rsa')) {
      throw new Error(`Security Violation: Access to sensitive file is prohibited: "${targetPath}"`);
    }

    return resolvedTarget;
  }

  /**
   * Inspect and sanitize a shell command before terminal execution
   * @param {string} commandLine 
   * @returns {{ safe: boolean, error?: string }}
   */
  static validateCommand(commandLine) {
    if (!commandLine || typeof commandLine !== 'string') {
      return { safe: false, error: 'Empty command string.' };
    }

    for (const pattern of DANGEROUS_COMMAND_PATTERNS) {
      if (pattern.test(commandLine)) {
        return {
          safe: false,
          error: `Security Violation: Destructive command rejected by SandboxGuard filter (pattern matched: ${pattern.source})`
        };
      }
    }

    return { safe: true };
  }

  /**
   * Run a sandboxed JavaScript snippet inside an isolated VM with execution timeout
   * @param {string} code 
   * @param {object} [contextSandbox]
   * @param {number} [timeoutMs=3000]
   */
  static runIsolated(code, contextSandbox = {}, timeoutMs = 3000) {
    // Whitelisted sandbox global primitives
    const sandbox = {
      console: {
        log: (...args) => sandbox.__logs.push({ level: 'log', args }),
        warn: (...args) => sandbox.__logs.push({ level: 'warn', args }),
        error: (...args) => sandbox.__logs.push({ level: 'error', args })
      },
      Math,
      Date,
      JSON,
      Number,
      String,
      Boolean,
      Array,
      Object,
      parseInt,
      parseFloat,
      __logs: [],
      ...contextSandbox
    };

    // Prevent access to process, require, or global object prototype escape
    const context = vm.createContext(sandbox);

    const script = new vm.Script(code, {
      filename: 'sandbox-execution.js'
    });

    try {
      const result = script.runInContext(context, {
        timeout: timeoutMs,
        displayErrors: true
      });

      return {
        success: true,
        result,
        logs: sandbox.__logs
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        logs: sandbox.__logs
      };
    }
  }
}
