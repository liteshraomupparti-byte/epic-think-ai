/**
 * Epic Think AI - LangGraph Plan Decomposition Node
 * 
 * Analyzes complex problems and synthesizes a step-by-step strategy for the Reasoner node,
 * assembling the initial system prompt and conversational message context.
 */

import { ContextManager } from '../../core/ContextManager.js';

export async function planDecompositionNode(state, config = {}) {
  const {
    userPrompt,
    messages,
    recalledMemories,
    recalledPromptContext,
    userProfile,
    modelPreset,
    intent,
    webSearchContext,
    builderProject
  } = state;
  const emit = config.configurable?.emit || (() => {});

  emit('graph:node:start', { node: 'planDecomposition' });

  // 1. Build Base Context
  const builtContext = ContextManager.buildContext({
    userPrompt,
    recentMessages: messages,
    recalledMemories,
    recalledPromptContext,
    activeModelPreset: modelPreset,
    builderProject,
    userProfile
  });

  let systemPrompt = builtContext.systemPrompt;
  const assembledMessages = [...builtContext.messages];

  // 2. Synthesize Plan for Non-Trivial Tasks
  let plan = null;
  if (intent.complexity !== 'LOW' || modelPreset.toLowerCase().includes('o1') || intent.type === 'RESEARCH') {
    const steps = [];
    if (intent.needsWebSearch) {
      steps.push('1. Review real-time verified search sources and citations.');
    }
    if (state.tools && state.tools.length > 0) {
      steps.push(`2. Select and coordinate tools from ${state.tools.length} active integrations.`);
    }
    steps.push('3. Conduct multi-step chain-of-thought analysis and formulate solution.');
    steps.push('4. Verify against user constraints, code requirements, and edge cases.');
    steps.push('5. Synthesize clean, structured, and actionable response.');

    plan = {
      complexity: intent.complexity,
      steps,
      currentStep: 0,
      createdAt: Date.now()
    };

    emit('graph:plan', { plan });
  }

  // 3. Inject Search Context into System / User Messages if available
  if (webSearchContext) {
    systemPrompt += `\n\n[VERIFIED REAL-TIME INTELLIGENCE]:\n${webSearchContext}`;
    assembledMessages.push({
      role: 'user',
      content: `[VERIFIED REAL-TIME INTELLIGENCE]:\n${webSearchContext}\n\nPlease address my prompt using the verified data above: "${userPrompt}"`
    });
  }

  emit('graph:node:end', { node: 'planDecomposition', hasPlan: Boolean(plan) });

  return {
    plan,
    messages: assembledMessages,
    scratchpad: plan ? [`Plan initialized with ${plan.steps.length} strategy steps.`] : []
  };
}
