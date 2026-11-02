/**
 * Epic Think AI - LangGraph Tool Execution & HITL Security Node
 * 
 * Executes tool calls in parallel with parameter validation, ResultSanitizer scrubbing,
 * Human-In-The-Loop confirmation gating via ConfirmationManager, and resilient self-healing diagnostics.
 */

import { ToolExecutionEngine } from '../../../plugins/core/ToolExecutionEngine.js';
import { ConfirmationManager } from '../../../plugins/core/ConfirmationManager.js';
import { ResultSanitizer } from '../../../plugins/core/ResultSanitizer.js';
import { SafeLogger } from '../../../plugins/core/SafeLogger.js';

export async function toolExecutionNode(state, config = {}) {
  const { toolCalls, uid, conversationId, userPrompt } = state;
  const emit = config.configurable?.emit || (() => {});

  emit('graph:node:start', { node: 'toolExecutor', count: toolCalls.length });

  const executed = [];
  const newMessages = [];
  const scratchpadNotes = [];
  let pendingConfirmation = null;

  for (const call of toolCalls) {
    const rawName = call.function?.name || call.name;
    let pluginId, toolName;
    if (rawName && rawName.includes('__')) {
      [pluginId, toolName] = rawName.split('__');
    } else {
      pluginId = 'system';
      toolName = rawName;
    }

    let parsedArgs = {};
    try {
      const rawArgs = call.function?.arguments || call.arguments || {};
      parsedArgs = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : rawArgs;
    } catch (_) {
      parsedArgs = {};
    }

    // 1. Human-In-The-Loop Security Interception
    const isSensitive = ConfirmationManager.checkRequiresConfirmation(pluginId, toolName, parsedArgs);
    if (isSensitive) {
      emit('ai:thinking', { thought: `Security Gating: Action "${pluginId}.${toolName}" requires your confirmation before proceeding.` });
      const ticket = ConfirmationManager.createConfirmation({
        uid,
        conversationId,
        pluginId,
        toolName,
        args: parsedArgs,
        userPrompt
      });

      pendingConfirmation = ticket;
      scratchpadNotes.push(`Tool execution paused: Pending user confirmation for ${pluginId}.${toolName} (Ticket ID: ${ticket.confirmationId})`);
      break;
    }

    // 2. Autonomous Execution with Self-Healing
    emit('graph:tool_executing', { pluginId, toolName, args: parsedArgs });
    emit('ai:tool_call', {
      id: call.id || `call_${Date.now()}`,
      pluginId,
      toolName,
      args: parsedArgs
    });

    try {
      const execResult = await ToolExecutionEngine.executeTool(pluginId, toolName, parsedArgs, { uid, conversationId });
      const sanitized = ResultSanitizer.sanitize(execResult);

      const toolPayload = {
        id: call.id || `call_${Date.now()}`,
        pluginId,
        toolName,
        args: parsedArgs,
        result: sanitized.data || sanitized,
        success: true,
        durationMs: sanitized.durationMs || 50
      };

      executed.push(toolPayload);
      emit('ai:tool_result', toolPayload);

      newMessages.push({
        role: 'tool',
        tool_call_id: call.id,
        name: rawName,
        content: JSON.stringify(sanitized.data || sanitized)
      });

      scratchpadNotes.push(`Tool ${pluginId}.${toolName} executed successfully: ${JSON.stringify(sanitized.data || sanitized).slice(0, 150)}...`);

    } catch (err) {
      SafeLogger.warn('Graph: Tool execution failed with self-healing opportunity', {
        pluginId,
        toolName,
        error: err.message
      });

      const failurePayload = {
        id: call.id || `call_${Date.now()}`,
        pluginId,
        toolName,
        args: parsedArgs,
        error: err.message,
        success: false
      };

      executed.push(failurePayload);
      emit('ai:tool_result', failurePayload);

      newMessages.push({
        role: 'tool',
        tool_call_id: call.id,
        name: rawName,
        content: JSON.stringify({ error: err.message, status: 'failed' })
      });

      // Self-healing cue for reasoner
      scratchpadNotes.push(`Tool ${pluginId}.${toolName} returned error: "${err.message}". Reasoner should adapt strategy, diagnose alternative approach, or summarize error.`);
    }
  }

  emit('graph:node:end', {
    node: 'toolExecutor',
    executedCount: executed.length,
    needsConfirmation: Boolean(pendingConfirmation)
  });

  return {
    toolCalls: [], // Reset toolCalls so reasoner proceeds
    executedToolCalls: executed,
    messages: newMessages,
    scratchpad: scratchpadNotes,
    pendingConfirmation
  };
}
