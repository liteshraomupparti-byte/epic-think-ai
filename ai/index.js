/**
 * Epic Think AI - Unified Multi-Provider AI Engine v2.0
 * 
 * Exposes a single, unified AI interface to the rest of the application.
 * Automatically initializes Groq, OpenRouter, and Gemini providers from environment variables.
 * Integrates LangGraph cyclic resilient reasoning workflows alongside the production orchestrator.
 */

import { GroqProvider } from './providers/GroqProvider.js';
import { OpenRouterProvider } from './providers/OpenRouterProvider.js';
import { GeminiProvider } from './providers/GeminiProvider.js';
import { EpicThinkLocalProvider } from './providers/EpicThinkLocalProvider.js';
import { modelRegistry } from './core/ModelRegistry.js';
import { healthMonitor } from './core/HealthMonitor.js';
import { AIModelRouter } from './core/AIModelRouter.js';
import { AgentOrchestrator } from './core/AgentOrchestrator.js';
import { SafeLogger } from '../plugins/core/SafeLogger.js';
import { executeAgentGraph, getAgentGraph, buildAgentGraph } from './graph/index.js';

import { diagnosticsStore } from './core/GenerationDiagnostics.js';
import { GenerationConfig } from './core/GenerationConfig.js';

// Instantiate Providers
export const groqProvider = new GroqProvider();
export const openRouterProvider = new OpenRouterProvider();
export const geminiProvider = new GeminiProvider();
export const localQwenProvider = new EpicThinkLocalProvider();

export const providers = {
  groq: groqProvider,
  openrouter: openRouterProvider,
  gemini: geminiProvider,
  local_qwen: localQwenProvider
};

// Instantiate Router & Orchestrator
export const aiRouter = new AIModelRouter(providers);
export const agentOrchestrator = new AgentOrchestrator(aiRouter);

export { modelRegistry, healthMonitor, diagnosticsStore, GenerationConfig, executeAgentGraph, getAgentGraph, buildAgentGraph };

/**
 * Initialize engine and discover models in background
 */
export async function initAIEngine() {
  SafeLogger.info('Initializing Multi-Provider AI Engine & LangGraph Brain...', {
    groqConfigured: groqProvider.isConfigured,
    openrouterConfigured: openRouterProvider.isConfigured,
    geminiConfigured: geminiProvider.isConfigured,
    langgraphEnabled: true
  });

  // Background refresh of available models from configured providers
  modelRegistry.refreshFromProviders(providers).catch(() => {});

  return {
    providers,
    router: aiRouter,
    orchestrator: agentOrchestrator,
    graph: getAgentGraph()
  };
}

/**
 * Unified AI Engine Service
 */
export const AIEngine = {
  /**
   * Primary Chat & Agent Execution (Auto-routed across Groq, OpenRouter, Gemini)
   * Supports both standard orchestrator and LangGraph resilient graph brain.
   */
  async chat({
    uid,
    prompt,
    conversationId = null,
    recentMessages = [],
    modelPreset = 'Epic Think 4o',
    confirmationId = null,
    isContinuation = false,
    partialResponse = '',
    maxTokens = null,
    webSearch = false,
    reasoning = false,
    location = null,
    streaming = false,
    useGraph = false,
    workflow = null,
    onEvent = null,
    signal = null
  }) {
    const shouldUseGraph = Boolean(useGraph || workflow === 'langgraph');
    return await agentOrchestrator.run({
      uid,
      userPrompt: prompt,
      conversationId,
      recentMessages,
      modelPreset,
      confirmationId,
      isContinuation,
      partialResponse,
      maxTokens,
      webSearch,
      reasoning,
      location,
      signal,
      onEvent,
      useGraph: shouldUseGraph
    });
  },

  /**
   * Dedicated LangGraph Resilient Brain Execution
   */
  async runGraph({
    uid = 'guest_user',
    prompt,
    conversationId = null,
    recentMessages = [],
    modelPreset = 'Epic Think 4o',
    location = null,
    maxIterations = 5,
    onEvent = null,
    signal = null
  }) {
    return await executeAgentGraph({
      router: aiRouter,
      uid,
      userPrompt: prompt,
      conversationId,
      recentMessages,
      modelPreset,
      location,
      maxIterations,
      signal,
      onEvent
    });
  },

  /**
   * Fast direct generation without tools
   */
  async generate({ prompt, messages, modelPreset = 'Epic Think Fast', systemPrompt, signal }) {
    return await aiRouter.execute({
      userPrompt: prompt,
      messages,
      preset: modelPreset,
      systemPrompt,
      signal
    });
  },

  /**
   * Direct streaming
   */
  async stream({ prompt, messages, modelPreset = 'Epic Think Fast', systemPrompt, signal }, onChunk) {
    return await aiRouter.execute({
      userPrompt: prompt,
      messages,
      preset: modelPreset,
      systemPrompt,
      signal,
      streaming: true,
      onChunk
    });
  },

  /**
   * Safe status endpoint (never returns keys)
   */
  getHealth() {
    return healthMonitor.getAllStatuses(providers);
  },

  /**
   * List configured providers
   */
  getProviders() {
    return Object.entries(providers).map(([id, p]) => ({
      id,
      name: p.name,
      configured: p.isConfigured,
      defaultModel: p.defaultModel
    }));
  },

  /**
   * List available models
   */
  getModels() {
    return modelRegistry.getAllModels();
  },

  /**
   * Metadata describing the LangGraph brain structure
   */
  getGraphInfo() {
    const graph = getAgentGraph();
    return {
      name: 'Epic Think AI LangGraph Brain',
      engine: '@langchain/langgraph',
      version: '1.6.0',
      patterns: [
        'Cyclic Tool Execution Loop',
        'Stateful Channel Reducers',
        'Human-In-The-Loop Confirmation Gating',
        'Self-Healing & Reflection Validation',
        'Hindsight Semantic Memory Integration',
        'Multi-Provider Dynamic Fallback (Groq, OpenRouter, Gemini)'
      ],
      nodes: [
        { id: 'classify_intent', description: 'Intent classification, complexity analysis & tool discovery' },
        { id: 'recall_memory', description: 'Hindsight semantic facts recall & live intelligence gathering' },
        { id: 'decompose_plan', description: 'Step-by-step reasoning plan & context synthesis' },
        { id: 'execute_reasoning', description: 'Multi-provider LLM inference with tool invocation' },
        { id: 'execute_tools', description: 'Parallel tool execution, ResultSanitizer & HITL security gating' },
        { id: 'validate_reflection', description: 'Self-critic verification & completeness evaluation' },
        { id: 'synthesize_response', description: 'Rich markdown synthesis & durable memory persistence' }
      ]
    };
  }
};
