/**
 * Epic Think AI - LangGraph Synthesizer Node
 * 
 * Formats final markdown output, merges rich visual blocks (Leaflet maps, SEO dashboards),
 * and persists durable user preferences/facts into Hindsight semantic memory.
 */

import { retainMemory } from '../../../services/hindsightService.js';
import { AgentOrchestrator } from '../../core/AgentOrchestrator.js';
import { SafeLogger } from '../../../plugins/core/SafeLogger.js';

export async function synthesizerNode(state, config = {}) {
  const {
    finalAnswer,
    mapCardBlock,
    userPrompt,
    uid,
    modelPreset,
    metadata,
    executedToolCalls,
    builderProject,
    pendingConfirmation
  } = state;
  const emit = config.configurable?.emit || (() => {});

  emit('graph:node:start', { node: 'synthesizer' });

  let synthesized = (finalAnswer || '').trim();

  // If pending confirmation, format friendly ticket message
  if (pendingConfirmation) {
    synthesized = `### 🔒 Action Requires Confirmation\n\nI am ready to perform **\`${pendingConfirmation.pluginId}.${pendingConfirmation.toolName}\`** on your behalf.\n\n` +
      `**Parameters:**\n\`\`\`json\n${JSON.stringify(pendingConfirmation.args, null, 2)}\n\`\`\`\n\n` +
      `> Please reply **"Confirm"** or click Approve below to proceed with this action.`;
  }

  // Prepend rich map or audit card block if present and not already embedded
  if (mapCardBlock && !synthesized.includes(mapCardBlock.trim())) {
    synthesized = `${mapCardBlock}\n\n${synthesized}`;
  }

  const durationMs = Date.now() - (metadata?.startTime || Date.now());

  // Background Retain to Hindsight Semantic Memory
  const bankId = `epic-think-user-${uid}`;
  try {
    if (uid && uid !== 'guest_user' && AgentOrchestrator.isDurableMemory(userPrompt)) {
      retainMemory(bankId, userPrompt, { context: 'User preference captured via LangGraph brain' })
        .catch(err => SafeLogger.warn('Hindsight retain failed in LangGraph', { error: err.message }));
    }
  } catch (_) {}

  emit('ai:complete', {
    text: synthesized,
    provider: metadata?.provider || 'Epic Think LangGraph Brain',
    model: metadata?.model || modelPreset,
    durationMs
  });

  emit('graph:node:end', { node: 'synthesizer', durationMs });

  return {
    finalAnswer: synthesized,
    metadata: {
      durationMs,
      completedAt: Date.now()
    }
  };
}
