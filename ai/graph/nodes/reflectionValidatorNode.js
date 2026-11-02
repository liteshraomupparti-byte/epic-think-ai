/**
 * Epic Think AI - LangGraph Reflection & Validation Node
 * 
 * Inspects candidate responses, verifies completeness against user instructions,
 * and enables self-correcting refinement loops when necessary.
 */

export async function reflectionValidatorNode(state, config = {}) {
  const { finalAnswer, userPrompt, executedToolCalls, reflection, iteration, maxIterations } = state;
  const emit = config.configurable?.emit || (() => {});

  emit('graph:node:start', { node: 'reflectionValidator' });

  const attempts = (reflection?.attempts || 0) + 1;
  let passed = true;
  let score = 1.0;
  let feedback = '';

  const answer = (finalAnswer || '').trim();

  // 1. Guard against empty or truncated responses
  if (!answer || answer.length < 15) {
    passed = false;
    score = 0.2;
    feedback = 'Response is empty or too short. Provide a comprehensive, helpful answer.';
  }

  // 2. Guard against missing tool synthesis
  if (executedToolCalls.length > 0 && !answer.toLowerCase().includes('result') && answer.length < 50) {
    passed = false;
    score = 0.5;
    feedback = 'Tools were executed but their observations were not clearly integrated into the answer.';
  }

  // 3. Prevent infinite loops: cap reflections at 2 attempts or when iterations near max
  if (attempts >= 2 || iteration >= maxIterations) {
    passed = true; // Force pass to finalize output
    feedback = 'Maximum refinement attempts reached; accepting best candidate.';
  }

  emit('graph:thinking', {
    thought: `LangGraph: Reflection evaluation (Attempt ${attempts}): ${passed ? 'Verified complete' : 'Refinement required (' + feedback + ')'}`
  });

  emit('graph:node:end', {
    node: 'reflectionValidator',
    passed,
    score,
    feedback
  });

  return {
    reflection: {
      score,
      passed,
      feedback,
      attempts
    },
    scratchpad: passed ? [] : [`Reflection critique (Attempt ${attempts}): ${feedback}`]
  };
}
