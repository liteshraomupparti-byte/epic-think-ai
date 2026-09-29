/**
 * Epic Think AI - Production Agent Planner & Core Memory Bridge
 * 
 * Orchestrates autonomous multi-step reasoning, tool dispatch, and memory integration:
 * 1. Firebase Auth UID multi-tenant isolation
 * 2. Pre-planning Hindsight semantic memory recall
 * 3. Dynamic active tool discovery (only ENABLED plugin tools for authenticated user)
 * 4. Iteration loop capped at MAX_ITERATIONS = 5 (prevents infinite autonomous agent runaway)
 * 5. Anti-looping duplicate-call detection
 * 6. Hard timeout enforcement (25 seconds)
 * 7. Human confirmation gating (EXTERNAL_ACTION / DESTRUCTIVE tools)
 * 8. Untrusted data boundary containment via ResultSanitizer
 * 9. Post-response Hindsight memory retention with strict PII/credential filtering
 */

import { registry } from './PluginRegistry.js';
import { ToolExecutionEngine } from './ToolExecutionEngine.js';
import { ConfirmationManager } from './ConfirmationManager.js';
import { ResultSanitizer } from './ResultSanitizer.js';
import { SafeLogger } from './SafeLogger.js';
import { recallMemory, retainMemory } from '../../services/hindsightService.js';

export const MAX_ITERATIONS = 5;
export const EXECUTION_TIMEOUT_MS = 25000;

export class AgentPlanner {
  /**
   * Filter sensitive secrets, tokens, passwords, and private keys before memory retention
   */
  static filterSensitiveData(text) {
    if (!text || typeof text !== 'string') return '';

    return text
      // Mask bearer tokens and authorization headers
      .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, '[REDACTED_BEARER_TOKEN]')
      // Mask explicit token/key assignments
      .replace(/(?:api[_-]?key|secret|password|auth[_-]?token|access[_-]?token|refresh[_-]?token|private[_-]?key)\s*(?:[:=]|\bis\b)\s*['"]?[^\s'"]+['"]?/gi, '[REDACTED_CREDENTIAL]')
      // Mask OpenAI / standard sk- style API keys
      .replace(/\bsk-[A-Za-z0-9_-]{16,}\b/g, '[REDACTED_API_KEY]')
      // Mask GitHub personal access tokens
      .replace(/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b/g, '[REDACTED_GITHUB_TOKEN]')
      // Mask credit/debit card numbers
      .replace(/\b(?:\d{4}[- ]?){3}\d{4}\b/g, '[REDACTED_CARD_NUMBER]')
      // Mask PEM private keys
      .replace(/-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g, '[REDACTED_PRIVATE_KEY]')
      .trim();
  }

  /**
   * Determine whether text contains durable facts or preferences worth retaining
   */
  static isDurableMemory(text) {
    if (!text || typeof text !== 'string' || text.length < 10) return false;

    const durablePatterns = [
      /\b(?:i prefer|always use|never use|remember that|my name is|note that)\b/i,
      /\b(?:my project is|we are using|i am using|i want to use|our stack is)\b/i,
      /\b(?:database is|tech stack|default to|framework is|my client is|client rules)\b/i,
      /\b(?:coding style|architecture rule|primary language|preferred library)\b/i
    ];

    return durablePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Main Agent Planner Execution Flow
   * 
   * @param {object} params
   * @param {string} params.uid - Authenticated Firebase UID
   * @param {string} params.userPrompt - User input message
   * @param {string} [params.conversationId] - Chat ID
   * @param {string} [params.confirmationId] - Approved confirmation ID if re-executing
   * @param {object} [params.options] - Custom options (e.g. timeoutMs)
   */
  static async planAndExecute({
    uid,
    userPrompt,
    conversationId = null,
    confirmationId = null,
    options = {}
  }) {
    const startTime = Date.now();
    const timeoutMs = options.timeoutMs || EXECUTION_TIMEOUT_MS;

    if (!uid) {
      throw new Error('Unauthorized: Valid Firebase UID is required by AgentPlanner.');
    }

    if (!userPrompt || typeof userPrompt !== 'string' || !userPrompt.trim()) {
      throw new Error('Missing or empty userPrompt.');
    }

    const trimmedPrompt = userPrompt.trim();
    const bankId = `epic-think-user-${uid}`;

    SafeLogger.info('AgentPlanner started', {
      user: SafeLogger.hashUid(uid),
      conversationId,
      promptPreview: trimmedPrompt.slice(0, 50)
    });

    // -----------------------------------------------------------------
    // STEP 1: Hindsight Semantic Memory Recall (Core Memory Layer)
    // -----------------------------------------------------------------
    let recalledMemories = [];
    let recalledPromptContext = '';

    try {
      const memoryRecall = await recallMemory(bankId, trimmedPrompt, { maxTokens: 2048 });
      recalledMemories = memoryRecall.results || [];
      recalledPromptContext = memoryRecall.promptContext || '';
    } catch (err) {
      // Memory failure must NEVER crash chat (Approved Architecture Requirement)
      SafeLogger.warn('Hindsight memory recall failed gracefully', {
        user: SafeLogger.hashUid(uid),
        error: err.message
      });
    }

    // -----------------------------------------------------------------
    // STEP 2: Discover Active Tools for Authenticated User
    // -----------------------------------------------------------------
    const activeTools = await registry.getUserActiveTools(uid);
    const availableToolNames = activeTools.map(t => `${t.pluginId}.${t.name}`);

    // If confirmationId is provided, handle resumed execution directly
    if (confirmationId) {
      return await AgentPlanner.resumeConfirmedAction({
        uid,
        conversationId,
        confirmationId,
        userPrompt: trimmedPrompt,
        recalledMemories
      });
    }

    // Auto-detect natural language affirmative or negative response for pending confirmation tickets
    const isAffirmative = /^(?:yes|yep|yeah|sure|confirm|confirmed|approve|approved|proceed|send|send\s+it|do\s+it|go\s+ahead|okay|ok|i\s+approve|please\s+send)\b/i.test(trimmedPrompt);
    const isNegative = /^(?:no|nope|cancel|cancelled|reject|rejected|abort|stop|don'?t|do\s+not)\b/i.test(trimmedPrompt);

    if (isAffirmative || isNegative) {
      const pendingTickets = ConfirmationManager.getPendingForUser(uid);
      const ticket = (conversationId && pendingTickets.find(t => t.conversationId === conversationId)) || pendingTickets[pendingTickets.length - 1];
      if (ticket) {
        if (isAffirmative) {
          return await AgentPlanner.resumeConfirmedAction({
            uid,
            conversationId,
            confirmationId: ticket.confirmationId,
            userPrompt: trimmedPrompt,
            recalledMemories
          });
        } else {
          ConfirmationManager.resolveConfirmation(ticket.confirmationId, 'rejected', uid);
          return {
            success: true,
            text: `I have cancelled the execution of \`${ticket.pluginId}.${ticket.toolName}\` as requested.`,
            thoughts: '[CONFIRMATION: User rejected action ticket]',
            recalledMemoriesCount: 0,
            executedToolCalls: [],
            requiresConfirmation: false,
            confirmationTicket: null
          };
        }
      }
    }

    // -----------------------------------------------------------------
    // STEP 3: Planner Execution Loop (Max 5 Iterations)
    // -----------------------------------------------------------------
    const executedToolCalls = [];
    const toolCallSignatures = new Set();
    const intermediateThoughts = [];
    let finalAnswer = '';
    let requiresConfirmationTicket = null;

    for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
      // Check timeout
      if (Date.now() - startTime > timeoutMs) {
        SafeLogger.warn('AgentPlanner reached timeout limit', {
          user: SafeLogger.hashUid(uid),
          iteration,
          elapsedMs: Date.now() - startTime
        });
        intermediateThoughts.push(`[TIMEOUT: Halting autonomous tool loop after ${Math.round((Date.now() - startTime) / 1000)}s]`);
        break;
      }

      // Check if prompt requires tool assistance
      const matchedAction = AgentPlanner.selectNextTool({
        prompt: trimmedPrompt,
        activeTools,
        executedCalls: executedToolCalls,
        iteration
      });

      if (!matchedAction) {
        // No further tools needed: formulate final synthesis
        break;
      }

      const { pluginId, toolName, args, thought } = matchedAction;
      intermediateThoughts.push(thought);

      // Anti-Looping Protection: Check duplicate signature
      const callSignature = `${pluginId}.${toolName}:${JSON.stringify(args)}`;
      if (toolCallSignatures.has(callSignature)) {
        SafeLogger.warn('Duplicate tool call detected, aborting loop', {
          user: SafeLogger.hashUid(uid),
          signature: callSignature
        });
        intermediateThoughts.push(`[LOOP_GUARD: Detected repetitive execution of ${pluginId}.${toolName}. Breaking loop.]`);
        break;
      }
      toolCallSignatures.add(callSignature);

      // Execute tool via ToolExecutionEngine
      try {
        const execResult = await ToolExecutionEngine.execute({
          uid,
          pluginId,
          toolName,
          args,
          conversationId
        });

        // Check if Human Confirmation is required
        if (execResult.status === 'requires_confirmation') {
          requiresConfirmationTicket = execResult.confirmationTicket;
          finalAnswer = `This action requires your confirmation before proceeding:\n\n**Action:** \`${pluginId}.${toolName}\`\n**Summary:** ${execResult.confirmationTicket.summary}\n\n:::action-ticket\n${JSON.stringify(execResult.confirmationTicket)}\n:::\n\nPlease review and approve the action ticket below, or simply reply **"yes"** / **"confirm"** in the chat.`;
          break;
        }

        executedToolCalls.push({
          iteration,
          pluginId,
          toolName,
          args,
          output: execResult.rawOutput,
          contextString: execResult.contextString
        });

      } catch (toolErr) {
        SafeLogger.warn('Tool execution failed inside planner loop', {
          user: SafeLogger.hashUid(uid),
          pluginId,
          toolName,
          error: toolErr.message
        });

        executedToolCalls.push({
          iteration,
          pluginId,
          toolName,
          args,
          error: toolErr.message,
          contextString: ResultSanitizer.formatForAgentContext(pluginId, toolName, { error: toolErr.message })
        });
      }
    }

    // -----------------------------------------------------------------
    // STEP 4: Formulate Final Response Synthesis
    // -----------------------------------------------------------------
    if (!finalAnswer) {
      finalAnswer = AgentPlanner.synthesizeResponse({
        prompt: trimmedPrompt,
        recalledMemories,
        executedToolCalls
      });
    }

    // -----------------------------------------------------------------
    // STEP 5: Post-Response Hindsight Memory Retention
    // -----------------------------------------------------------------
    if (AgentPlanner.isDurableMemory(trimmedPrompt)) {
      const sanitizedForMemory = AgentPlanner.filterSensitiveData(trimmedPrompt);
      if (sanitizedForMemory && sanitizedForMemory.length >= 10) {
        // Asynchronously retain without blocking user response
        retainMemory(bankId, sanitizedForMemory, 'user_preference', ['preference', 'chat-auto'])
          .then(res => {
            if (res && res.success) {
              SafeLogger.info('Durable preference retained to Hindsight', {
                user: SafeLogger.hashUid(uid)
              });
            }
          })
          .catch(err => {
            SafeLogger.warn('Failed to retain memory post-response', {
              user: SafeLogger.hashUid(uid),
              error: err.message
            });
          });
      }
    }

    const totalDurationMs = Date.now() - startTime;

    return {
      success: true,
      text: finalAnswer,
      thoughts: intermediateThoughts.join('\n'),
      recalledMemoriesCount: recalledMemories.length,
      recalledMemories,
      executedToolCalls,
      requiresConfirmation: !!requiresConfirmationTicket,
      confirmationTicket: requiresConfirmationTicket,
      durationMs: totalDurationMs
    };
  }

  /**
   * Resume tool execution after human confirmation is granted
   */
  static async resumeConfirmedAction({
    uid,
    conversationId,
    confirmationId,
    userPrompt,
    recalledMemories
  }) {
    const ticket = ConfirmationManager.getTicket(confirmationId);
    if (!ticket) {
      throw new Error('Confirmation ticket not found or expired.');
    }

    const execResult = await ToolExecutionEngine.execute({
      uid,
      pluginId: ticket.pluginId,
      toolName: ticket.toolName,
      args: ticket.parameters,
      conversationId,
      confirmationId
    });

    const responseText = `Action approved and executed successfully:\n\n**Tool:** \`${ticket.pluginId}.${ticket.toolName}\`\n\n\`\`\`json\n${JSON.stringify(execResult.rawOutput, null, 2)}\n\`\`\``;

    return {
      success: true,
      text: responseText,
      thoughts: `[CONFIRMATION_RESUME: Action ticket ${confirmationId} verified and executed.]`,
      recalledMemoriesCount: (recalledMemories || []).length,
      recalledMemories: recalledMemories || [],
      executedToolCalls: [{
        iteration: 1,
        pluginId: ticket.pluginId,
        toolName: ticket.toolName,
        args: ticket.parameters,
        output: execResult.rawOutput
      }],
      requiresConfirmation: false,
      confirmationTicket: null
    };
  }

  /**
   * Tool Selection Logic: Matches user prompt intent to available enabled tools
   */
  static selectNextTool({ prompt, activeTools, executedCalls, iteration }) {
    if (!activeTools || activeTools.length === 0) return null;
    if (iteration > 2 && executedCalls.length > 0) return null; // Avoid over-triggering

    const p = prompt.toLowerCase();

    // Check GitHub tools
    const ghSearch = activeTools.find(t => t.pluginId === 'github' && t.name === 'search_repositories');
    if (ghSearch && !executedCalls.some(c => c.toolName === 'search_repositories')) {
      const match = p.match(/(?:search|find|lookup|show|explore)\s+(?:github|repo|repositories)\s*(?:for)?\s*([a-zA-Z0-9_\-\s]+)?/i);
      if (match || p.includes('github repo') || p.includes('search repositories')) {
        const query = (match && match[1]) ? match[1].trim() : 'ai agent';
        return {
          pluginId: 'github',
          toolName: 'search_repositories',
          args: { query },
          thought: `Searching GitHub repositories for query "${query}"...`
        };
      }
    }

    // Check Web Search tools
    const webSearch = activeTools.find(t => t.pluginId === 'web_search' && t.name === 'search');
    if (webSearch && !executedCalls.some(c => c.toolName === 'search')) {
      if (/(?:search (?:the )?web|web search|browse|latest news|look up|find online)/i.test(p) || (p.includes('search') && p.includes('web'))) {
        return {
          pluginId: 'web_search',
          toolName: 'search',
          args: { query: prompt },
          thought: `Querying web search engine for "${prompt.slice(0, 40)}"...`
        };
      }
    }

    return null;
  }

  /**
   * Synthesize final user-facing response from recalled memories and tool outputs
   */
  static synthesizeResponse({ prompt, recalledMemories, executedToolCalls }) {
    const p = prompt.toLowerCase();

    // If tool calls were executed, format their output neatly
    if (executedToolCalls.length > 0) {
      let resultText = `Here is what I gathered using your enabled plugins:\n\n`;

      for (const call of executedToolCalls) {
        resultText += `### Results from \`${call.pluginId}.${call.toolName}\`\n\n`;
        if (call.error) {
          resultText += `> ⚠️ **Tool execution note**: ${call.error}\n\n`;
        } else if (typeof call.output === 'object') {
          resultText += `\`\`\`json\n${JSON.stringify(call.output, null, 2)}\n\`\`\`\n\n`;
        } else {
          resultText += `${call.output}\n\n`;
        }
      }

      if (recalledMemories.length > 0) {
        resultText += `*(Synthesized with ${recalledMemories.length} relevant memories from Hindsight)*`;
      }

      return resultText;
    }

    // If memories were recalled for preference/summarization questions
    if (/summar|know so far|remember|memory|recall|what are my preferences|my stack|what is my/i.test(p)) {
      if (recalledMemories.length > 0) {
        return `Here are the details I've recalled from your **Hindsight Long-Term Memory Bank**:\n\n` +
          recalledMemories.map((m, i) => `${i + 1}. **${m.text}**${m.timestamp ? ` *(Saved ${m.timestamp})*` : ''}`).join('\n') +
          `\n\nI continuously factor these facts into our work.`;
      } else {
        return `I currently do not have any specific preferences or context saved in my memory bank yet.\n\nFeel free to share details such as your tech stack, coding style preferences, client names, or project objectives!`;
      }
    }

    // Default intelligent assistant response
    if (recalledMemories.length > 0) {
      return `Understood. I have integrated that with your existing context (*${recalledMemories.length} relevant memories recalled from Hindsight*). How would you like to proceed? I can draft code, execute enabled plugin tools, or provide structured breakdowns.`;
    }

    return `I'm ready to help you think through this. We can explore solutions, execute plugin actions, or write clean code. What angle would you like to explore first?`;
  }
}
