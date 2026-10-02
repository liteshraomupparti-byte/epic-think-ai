/**
 * Epic Think AI - Unified Multi-Provider AI Engine v2.0
 * 
 * Exposes a single, unified AI interface to the rest of the application.
 * Automatically initializes Groq, OpenRouter, and Gemini providers from environment variables.
 * Server starts cleanly even if one or two provider keys are missing.
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

export { modelRegistry, healthMonitor, diagnosticsStore, GenerationConfig };

/**
 * Initialize engine and discover models in background
 */
export async function initAIEngine() {
  SafeLogger.info('Initializing Multi-Provider AI Engine...', {
    groqConfigured: groqProvider.isConfigured,
    openrouterConfigured: openRouterProvider.isConfigured,
    geminiConfigured: geminiProvider.isConfigured
  });

  // Background refresh of available models from configured providers
  modelRegistry.refreshFromProviders(providers).catch(() => {});

  return {
    providers,
    router: aiRouter,
    orchestrator: agentOrchestrator
  };
}

/**
 * Unified AI Engine Service
 */
export const AIEngine = {
  /**
   * Primary Chat & Agent Execution (Auto-routed across Groq, OpenRouter, Gemini)
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
    streaming = false,
    onEvent = null,
    signal = null
  }) {
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
  }
};
