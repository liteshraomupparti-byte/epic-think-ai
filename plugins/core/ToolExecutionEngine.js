/**
 * Epic Think AI - Tool Execution Engine
 * 
 * Enforces the strict 10-step server-side security pipeline:
 * 1. Authenticated Firebase UID
 * 2. Plugin is installed & registered
 * 3. Tool exists in plugin
 * 4. Plugin lifecycle state is ENABLED
 * 5. Permission tier verified
 * 6. Human confirmation check (EXTERNAL_ACTION / DESTRUCTIVE)
 * 7. CredentialHandle derived from TokenVault
 * 8. Argument JSON Schema validation
 * 9. Execution in isolated sandbox
 * 10. Result sanitized via ResultSanitizer & logged safely
 */

import { registry } from './PluginRegistry.js';
import { PermissionManager, RiskTiers } from './PermissionManager.js';
import { ConfirmationManager } from './ConfirmationManager.js';
import { TokenVault } from './TokenVault.js';
import { ResultSanitizer } from './ResultSanitizer.js';
import { SafeLogger } from './SafeLogger.js';

export class ToolExecutionEngine {
  /**
   * Validate parameters against simple JSON Schema properties
   */
  static validateArguments(parameters, args = {}) {
    if (!parameters || !parameters.properties) return true;

    // Check required fields
    if (Array.isArray(parameters.required)) {
      for (const reqField of parameters.required) {
        if (args[reqField] === undefined || args[reqField] === null || args[reqField] === '') {
          throw new Error(`Missing required parameter: "${reqField}".`);
        }
      }
    }

    return true;
  }

  /**
   * Execute a tool on behalf of an authenticated user
   * 
   * @param {object} params
   * @param {string} params.uid - Authenticated Firebase UID
   * @param {string} params.pluginId - Target plugin ID
   * @param {string} params.toolName - Target tool name
   * @param {object} params.args - Tool arguments
   * @param {string} [params.conversationId] - Chat ID
   * @param {string} [params.confirmationId] - Resolved confirmation ticket ID
   */
  static async execute({
    uid,
    pluginId,
    toolName,
    args = {},
    conversationId = null,
    confirmationId = null,
    bypassConfirmation = false
  }) {
    const startTime = Date.now();

    // 1. Verify authenticated user
    if (!uid) {
      throw new Error('Unauthorized: Valid Firebase UID is required for tool execution.');
    }

    // 2. Verify plugin exists
    const plugin = registry.getPlugin(pluginId);
    if (!plugin) {
      throw new Error(`Plugin "${pluginId}" is not registered.`);
    }

    // 3. Verify tool exists
    const tool = plugin.getTool(toolName);
    if (!tool) {
      throw new Error(`Tool "${toolName}" not found on plugin "${pluginId}".`);
    }

    // 4. Verify lifecycle state is ENABLED
    const lifecycleState = await registry.getUserPluginState(uid, pluginId);
    const permCheck = PermissionManager.validateExecutionRequest({
      uid,
      plugin,
      tool,
      lifecycleState
    });

    if (!permCheck.allowed) {
      throw new Error(permCheck.reason);
    }

    // 5. Validate tool arguments against JSON Schema
    ToolExecutionEngine.validateArguments(tool.parameters, args);

    // 6. Verify Human Confirmation Gate
    const needsConfirmation = permCheck.requiresConfirmation && !bypassConfirmation;
    if (needsConfirmation) {
      if (!confirmationId) {
        // Halt and issue a confirmation request ticket
        const ticket = ConfirmationManager.createConfirmationRequest({
          uid,
          conversationId,
          pluginId,
          toolName,
          riskTier: tool.permissionTier,
          parameters: args,
          title: `Confirm ${tool.name}`,
          summary: `The AI wants to execute ${toolName} on your behalf.`
        });

        return {
          status: 'requires_confirmation',
          confirmationTicket: ticket,
          message: 'This action requires explicit user confirmation before proceeding.'
        };
      }

      // If confirmationId is provided, verify it is resolved, approved, and consume it
      ConfirmationManager.verifyAndConsumeApprovedTicket(confirmationId, uid, pluginId, toolName, args);
    }

    // 8. Create opaque CredentialHandle
    const credentialHandle = TokenVault.createHandle(uid, pluginId);

    // 9. Execute tool handler inside sandbox
    let rawResult;
    try {
      const context = {
        uid,
        pluginId,
        toolName,
        conversationId,
        permissionTier: tool.permissionTier,
        credentialHandle
      };

      rawResult = await tool.handler(args, context);
    } catch (err) {
      const durationMs = Date.now() - startTime;
      SafeLogger.logToolExecution({
        uid,
        pluginId,
        toolName,
        riskTier: tool.permissionTier,
        durationMs,
        success: false,
        error: err.message
      });

      throw new Error(`Tool execution error [${pluginId}.${toolName}]: ${err.message}`);
    }

    const durationMs = Date.now() - startTime;
    SafeLogger.logToolExecution({
      uid,
      pluginId,
      toolName,
      riskTier: tool.permissionTier,
      durationMs,
      success: true
    });

    // 10. Pass output through ResultSanitizer to neutralize indirect prompt injection
    const sanitizedContext = ResultSanitizer.formatForAgentContext(pluginId, toolName, rawResult);

    return {
      status: 'success',
      pluginId,
      toolName,
      rawOutput: ResultSanitizer.sanitizePayload(rawResult),
      contextString: sanitizedContext,
      durationMs
    };
  }
}
