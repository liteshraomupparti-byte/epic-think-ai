/**
 * Epic Think AI - LangGraph Reasoner Node
 * 
 * Invokes the AIModelRouter (Groq, OpenRouter, Gemini) with current context,
 * tools, scratchpad observations, and plan state.
 * Emits real-time tokens and tool dispatch events.
 */

import { SafeLogger } from '../../../plugins/core/SafeLogger.js';

export async function reasonerNode(state, config = {}) {
  const router = config.configurable?.router;
  const emit = config.configurable?.emit || (() => {});
  const signal = config.configurable?.signal;

  const {
    userPrompt,
    messages,
    tools,
    modelPreset,
    scratchpad,
    iteration,
    maxIterations,
    mapCardBlock
  } = state;

  emit('graph:node:start', { node: 'reasoner', iteration: iteration + 1 });

  if (!router) {
    throw new Error('AIModelRouter instance must be provided in config.configurable.router');
  }

  // Build working messages array with scratchpad observations
  const currentMessages = [...messages];
  if (scratchpad && scratchpad.length > 0) {
    const scratchpadSummary = scratchpad.slice(-4).join('\n');
    currentMessages.push({
      role: 'system',
      content: `[AGENT SCRATCHPAD OBSERVATIONS]:\n${scratchpadSummary}`
    });
  }

  emit('graph:thinking', {
    thought: `LangGraph: Reasoner cycle ${iteration + 1}/${maxIterations} planning next action...`
  });

  const availableTools = (tools && tools.length > 0 && iteration < maxIterations) ? tools : undefined;
  const isStreamingRun = typeof emit === 'function';

  let fullText = '';
  let toolCalls = [];
  let providerUsed = '';
  let modelUsed = '';

  try {
    const aiResult = await router.execute({
      userPrompt,
      messages: currentMessages,
      preset: modelPreset,
      tools: availableTools,
      signal,
      streaming: isStreamingRun,
      onChunk: (chunk) => {
        const delta = typeof chunk === 'string' ? chunk : (chunk.delta || chunk.content || chunk.text || '');
        if (delta) {
          fullText += delta;
          emit('ai:chunk', { content: delta, text: delta });
        }
      }
    });

    fullText = aiResult.text || fullText;
    toolCalls = aiResult.toolCalls || [];
    providerUsed = aiResult.provider;
    modelUsed = aiResult.model;

  } catch (err) {
    SafeLogger.error('Graph: Reasoner execution error', { error: err.message });
    return {
      scratchpad: [`Reasoner cycle ${iteration + 1} encountered error: ${err.message}`],
      iteration: iteration + 1,
      finalAnswer: `I encountered an unexpected issue while reasoning: ${err.message}`
    };
  }

  emit('graph:node:end', {
    node: 'reasoner',
    hasToolCalls: toolCalls.length > 0,
    toolCount: toolCalls.length
  });

  return {
    toolCalls,
    finalAnswer: toolCalls.length === 0 ? fullText : '',
    iteration: iteration + 1,
    metadata: {
      provider: providerUsed,
      model: modelUsed
    }
  };
}
