/**
 * Epic Think AI - LangGraph Stateful Resilient Agent Graph
 * 
 * Implements a cyclic, self-healing, multi-step directed reasoning graph
 * using @langchain/langgraph.
 * 
 * Graph Flow:
 * START
 *   └─> classify_intent
 *         ├─ [isGreeting] ───────────────> execute_reasoning
 *         └─ [standard/complex] ──────────> recall_memory ─> decompose_plan ─> execute_reasoning
 *                                                                                │
 *            ┌───────────────────────────────────────────────────────────────────┘
 *            ├─ [has toolCalls] ─────────> execute_tools ──> (cycle back to execute_reasoning)
 *            ├─ [pending confirmation] ──> synthesize_response ──> END
 *            ├─ [complex & has answer] ──> validate_reflection
 *            │                                   ├─ [passed] ───────> synthesize_response ──> END
 *            │                                   └─ [needs retry] ──> (cycle back to execute_reasoning)
 *            └─ [ready to synthesize] ───> synthesize_response ──> END
 */

import { StateGraph, START, END, MemorySaver } from '@langchain/langgraph';
import { AgentState } from './AgentState.js';
import { intentClassifierNode } from './nodes/intentClassifierNode.js';
import { memoryRecallNode } from './nodes/memoryRecallNode.js';
import { planDecompositionNode } from './nodes/planDecompositionNode.js';
import { reasonerNode } from './nodes/reasonerNode.js';
import { toolExecutionNode } from './nodes/toolExecutionNode.js';
import { reflectionValidatorNode } from './nodes/reflectionValidatorNode.js';
import { synthesizerNode } from './nodes/synthesizerNode.js';

let compiledGraphInstance = null;
const globalCheckpointer = new MemorySaver();

/**
 * Build and compile the LangGraph workflow
 */
export function buildAgentGraph(options = {}) {
  const checkpointer = options.checkpointer || globalCheckpointer;

  const workflow = new StateGraph(AgentState)
    .addNode('classify_intent', intentClassifierNode)
    .addNode('recall_memory', memoryRecallNode)
    .addNode('decompose_plan', planDecompositionNode)
    .addNode('execute_reasoning', reasonerNode)
    .addNode('execute_tools', toolExecutionNode)
    .addNode('validate_reflection', reflectionValidatorNode)
    .addNode('synthesize_response', synthesizerNode)

    // Entry point: Classify intent and evaluate complexity
    .addEdge(START, 'classify_intent')

    // Conditional branch after Intent
    .addConditionalEdges('classify_intent', (state) => {
      if (state.intent?.isGreeting) {
        return 'execute_reasoning';
      }
      return 'recall_memory';
    }, ['execute_reasoning', 'recall_memory'])

    // Sequential preparation: Recall Memory -> Decompose Plan -> Execute Reasoning
    .addEdge('recall_memory', 'decompose_plan')
    .addEdge('decompose_plan', 'execute_reasoning')

    // Conditional branch after Reasoning
    .addConditionalEdges('execute_reasoning', (state) => {
      // 1. Tool execution needed
      if (state.toolCalls && state.toolCalls.length > 0) {
        return 'execute_tools';
      }
      // 2. Interrupted for HITL confirmation
      if (state.pendingConfirmation) {
        return 'synthesize_response';
      }
      // 3. High complexity: validate via self-reflection loop
      if (state.intent?.complexity !== 'LOW' && state.finalAnswer && (state.reflection?.attempts || 0) < 1) {
        return 'validate_reflection';
      }
      // 4. Default: Synthesize
      return 'synthesize_response';
    }, ['execute_tools', 'synthesize_response', 'validate_reflection'])

    // Conditional branch after Tool Execution (cyclic reasoning loop)
    .addConditionalEdges('execute_tools', (state) => {
      if (state.pendingConfirmation) {
        return 'synthesize_response';
      }
      return 'execute_reasoning';
    }, ['synthesize_response', 'execute_reasoning'])

    // Conditional branch after Reflection (self-correcting refinement loop)
    .addConditionalEdges('validate_reflection', (state) => {
      if (state.reflection?.passed || state.iteration >= state.maxIterations) {
        return 'synthesize_response';
      }
      return 'execute_reasoning';
    }, ['synthesize_response', 'execute_reasoning'])

    // Output node
    .addEdge('synthesize_response', END);

  return workflow.compile({ checkpointer });
}

/**
 * Get or initialize singleton compiled graph
 */
export function getAgentGraph() {
  if (!compiledGraphInstance) {
    compiledGraphInstance = buildAgentGraph();
  }
  return compiledGraphInstance;
}

/**
 * Execute LangGraph workflow with streaming and event telemetry
 */
export async function executeAgentGraph({
  router,
  uid = 'guest_user',
  userPrompt = '',
  conversationId = null,
  recentMessages = [],
  modelPreset = 'Epic Think 4o',
  location = null,
  maxIterations = 5,
  signal = null,
  onEvent = null
}) {
  const startTime = Date.now();
  const graph = getAgentGraph();

  const emit = (event, data = {}) => {
    if (typeof onEvent === 'function') {
      onEvent({ event, timestamp: Date.now(), ...data });
    }
  };

  emit('graph:start', { prompt: userPrompt, preset: modelPreset });

  const initialState = {
    userPrompt,
    uid,
    conversationId,
    modelPreset,
    location,
    messages: recentMessages,
    maxIterations,
    iteration: 0,
    metadata: {
      startTime,
      provider: '',
      model: modelPreset
    }
  };

  const threadId = conversationId || `conv_${uid}_${Date.now()}`;
  const config = {
    configurable: {
      thread_id: threadId,
      router,
      emit,
      signal
    },
    recursionLimit: 25
  };

  try {
    const finalState = await graph.invoke(initialState, config);

    const durationMs = Date.now() - startTime;
    const responseText = finalState.finalAnswer || '';

    return {
      success: true,
      text: responseText,
      response: responseText,
      provider: finalState.metadata?.provider || 'Epic Think LangGraph Brain',
      model: finalState.metadata?.model || modelPreset,
      finishReason: 'stop',
      isTruncated: false,
      canContinue: false,
      durationMs,
      latency: durationMs,
      recalledMemoriesCount: finalState.recalledMemories?.length || 0,
      executedToolCalls: finalState.executedToolCalls || [],
      requiresConfirmation: Boolean(finalState.pendingConfirmation),
      confirmationTicket: finalState.pendingConfirmation,
      plan: finalState.plan,
      reflection: finalState.reflection,
      intent: finalState.intent,
      graphMetadata: {
        cycles: finalState.iteration,
        scratchpadCount: finalState.scratchpad?.length || 0,
        threadId
      }
    };
  } catch (err) {
    emit('graph:error', { error: err.message });
    throw err;
  }
}
