/**
 * Epic Think AI - LangGraph Agent State Definition
 * 
 * Defines channels, state reducers, and initial defaults for the
 * stateful multi-step agent reasoning graph.
 */

import { Annotation } from '@langchain/langgraph';

export const AgentState = Annotation.Root({
  // Core user identification and input
  userPrompt: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => ''
  }),
  uid: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => 'guest_user'
  }),
  conversationId: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => null
  }),
  modelPreset: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => 'Epic Think 4o'
  }),
  location: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => null
  }),

  // Message sequence (appends updates)
  messages: Annotation({
    reducer: (curr, update) => {
      if (!update) return curr;
      const toAdd = Array.isArray(update) ? update : [update];
      return [...curr, ...toAdd];
    },
    default: () => []
  }),

  // Hindsight semantic memory & user personalization
  recalledMemories: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => []
  }),
  recalledPromptContext: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => ''
  }),
  userProfile: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => null
  }),

  // Task analysis, intent & planning
  intent: Annotation({
    reducer: (curr, update) => (update ? { ...(curr || {}), ...update } : curr),
    default: () => ({
      type: 'CHAT',
      complexity: 'LOW',
      isGreeting: false,
      needsWebSearch: false,
      needsSeoAudit: false,
      needsBuilder: false
    })
  }),
  plan: Annotation({
    reducer: (curr, update) => (update ? { ...(curr || {}), ...update } : curr),
    default: () => null
  }),

  // Active tools & execution channels
  tools: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => []
  }),
  toolCalls: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => []
  }),
  executedToolCalls: Annotation({
    reducer: (curr, update) => {
      if (!update) return curr;
      const toAdd = Array.isArray(update) ? update : [update];
      return [...curr, ...toAdd];
    },
    default: () => []
  }),

  // Scratchpad for observations, self-healing diagnostics & intermediate steps
  scratchpad: Annotation({
    reducer: (curr, update) => {
      if (!update) return curr;
      const toAdd = Array.isArray(update) ? update : [update];
      return [...curr, ...toAdd];
    },
    default: () => []
  }),

  // Human-In-The-Loop confirmation ticket (if a dangerous tool was intercepted)
  pendingConfirmation: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => null
  }),

  // Self-reflection & verification score
  reflection: Annotation({
    reducer: (curr, update) => (update ? { ...(curr || {}), ...update } : curr),
    default: () => ({
      score: 1.0,
      passed: true,
      feedback: '',
      attempts: 0
    })
  }),

  // Graph cycle protection
  iteration: Annotation({
    reducer: (curr, update) => (typeof update === 'number' ? update : (curr + 1)),
    default: () => 0
  }),
  maxIterations: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => 5
  }),

  // Synthesized outputs
  finalAnswer: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => ''
  }),
  builderProject: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => null
  }),
  webSearchContext: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => ''
  }),
  mapCardBlock: Annotation({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => ''
  }),

  // Telemetry metadata
  metadata: Annotation({
    reducer: (curr, update) => (update ? { ...(curr || {}), ...update } : curr),
    default: () => ({
      provider: '',
      model: '',
      startTime: Date.now(),
      durationMs: 0
    })
  })
});
