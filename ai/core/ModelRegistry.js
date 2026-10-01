/**
 * Epic Think AI - Centralized Model Registry
 * 
 * Stores canonical definitions, capabilities, latency classes, and provider mappings.
 * Supports dynamic provider discovery and mappings to Epic Think AI presets:
 * - Epic Think Fast (Ultra Fast)
 * - Epic Think o1 (Deep Think / Reasoning)
 * - Epic Think 4o (Smartest / High Intelligence Flagship)
 */

import { GenerationConfig } from './GenerationConfig.js';

export class ModelRegistry {
  constructor() {
    this.models = new Map();
    this.initDefaultModels();
  }

  initDefaultModels() {
    // -------------------------------------------------------------
    // LOCAL FINE-TUNED EPIC THINK MODELS (LoRA / QLoRA)
    // -------------------------------------------------------------
    this.register({
      id: 'epic-think-qwen2.5-7b',
      provider: 'local_qwen',
      name: 'Epic Think Qwen 2.5 7B (Fine-Tuned LoRA/QLoRA)',
      capabilities: { text: true, vision: false, tools: true, streaming: true, reasoning: true },
      speedClass: 'ultra',
      qualityClass: 'flagship',
      contextWindow: 16384,
      presetMapping: ['Epic Think o1', 'Reasoning', 'Custom Local', 'Epic Think Local']
    });

    // -------------------------------------------------------------
    // GROQ ULTRA-FAST LPU MODELS
    // -------------------------------------------------------------
    this.register({
      id: 'qwen/qwen3.8-27b',
      provider: 'groq',
      name: 'Qwen 3.8 27B (Groq LPU)',
      capabilities: { text: true, vision: false, tools: true, streaming: true, reasoning: true },
      speedClass: 'fast',
      qualityClass: 'high',
      contextWindow: 32768,
      presetMapping: ['Epic Think Fast', 'Fast', 'Auto']
    });

    this.register({
      id: 'openai/gpt-oss-20b',
      provider: 'groq',
      name: 'GPT OSS 20B (Groq LPU)',
      capabilities: { text: true, vision: false, tools: true, streaming: true, reasoning: true },
      speedClass: 'fast',
      qualityClass: 'high',
      contextWindow: 16384,
      presetMapping: ['Epic Think o1', 'Reasoning']
    });

    this.register({
      id: 'openai/gpt-oss-120b',
      provider: 'groq',
      name: 'GPT OSS 120B Flagship (Groq LPU)',
      capabilities: { text: true, vision: false, tools: true, streaming: true, reasoning: true },
      speedClass: 'balanced',
      qualityClass: 'flagship',
      contextWindow: 32768,
      presetMapping: ['Epic Think 4o', 'Smartest']
    });

    this.register({
      id: 'allam-2-7b',
      provider: 'groq',
      name: 'Allam 2 7B (Groq LPU)',
      capabilities: { text: true, vision: false, tools: true, streaming: true, reasoning: false },
      speedClass: 'fast',
      qualityClass: 'standard',
      contextWindow: 8192,
      presetMapping: []
    });

    // -------------------------------------------------------------
    // OPENROUTER MULTI-MODEL GATEWAY
    // -------------------------------------------------------------
    this.register({
      id: 'meta-llama/llama-3.3-70b-instruct',
      provider: 'openrouter',
      name: 'Llama 3.3 70B Instruct (OpenRouter)',
      capabilities: { text: true, vision: false, tools: true, streaming: true, reasoning: true },
      speedClass: 'balanced',
      qualityClass: 'flagship',
      contextWindow: 131072,
      presetMapping: ['Epic Think 4o', 'Smartest', 'Quality']
    });

    this.register({
      id: 'deepseek/deepseek-r1',
      provider: 'openrouter',
      name: 'DeepSeek R1 Reasoning (OpenRouter)',
      capabilities: { text: true, vision: false, tools: true, streaming: true, reasoning: true },
      speedClass: 'balanced',
      qualityClass: 'flagship',
      contextWindow: 65536,
      presetMapping: ['Epic Think o1', 'Reasoning']
    });

    // -------------------------------------------------------------
    // GOOGLE GEMINI AI STUDIO
    // -------------------------------------------------------------
    this.register({
      id: 'gemini-3.5-flash',
      provider: 'gemini',
      name: 'Gemini 3.5 Flash',
      capabilities: { text: true, vision: true, tools: true, streaming: true, reasoning: true },
      speedClass: 'fast',
      qualityClass: 'flagship',
      contextWindow: 1048576,
      maxOutputTokens: 8192,
      presetMapping: ['Epic Think 4o', 'Smartest', 'Epic Think Fast', 'Fast', 'Auto']
    });

    this.register({
      id: 'gemini-3.7-flash',
      provider: 'gemini',
      name: 'Gemini 3.7 Flash',
      capabilities: { text: true, vision: true, tools: true, streaming: true, reasoning: true },
      speedClass: 'balanced',
      qualityClass: 'high',
      contextWindow: 1048576,
      maxOutputTokens: 8192,
      presetMapping: ['Epic Think 4o', 'Smartest']
    });

    this.register({
      id: 'gemini-flash-latest',
      provider: 'gemini',
      name: 'Gemini Flash Latest',
      capabilities: { text: true, vision: true, tools: true, streaming: true, reasoning: true },
      speedClass: 'fast',
      qualityClass: 'high',
      contextWindow: 1048576,
      maxOutputTokens: 8192,
      presetMapping: ['Epic Think Fast']
    });

    this.register({
      id: 'gemini-3.5-flash-lite',
      provider: 'gemini',
      name: 'Gemini 3.5 Flash Lite',
      capabilities: { text: true, vision: true, tools: true, streaming: true, reasoning: false },
      speedClass: 'fast',
      qualityClass: 'standard',
      contextWindow: 1048576,
      maxOutputTokens: 4096,
      presetMapping: ['Fast']
    });
  }

  register(modelDef) {
    if (!modelDef.id || !modelDef.provider) {
      throw new Error('Model definition must include id and provider');
    }
    const maxOutputTokens = modelDef.maxOutputTokens || GenerationConfig.resolveMaxOutputTokens(modelDef.id, modelDef.provider);
    this.models.set(modelDef.id, {
      ...modelDef,
      maxOutputTokens,
      registeredAt: Date.now()
    });
  }

  getModel(id) {
    return this.models.get(id) || null;
  }

  getAllModels() {
    return Array.from(this.models.values());
  }

  getModelsByProvider(provider) {
    return this.getAllModels().filter(m => m.provider === provider);
  }

  /**
   * Resolve an Epic Think UI preset (e.g. 'Epic Think Fast') to a recommended provider and model
   */
  resolvePreset(presetName = 'Epic Think 4o', availableProviders = new Set(['groq', 'openrouter', 'gemini'])) {
    const p = (presetName || '').toLowerCase();

    // 1. ULTRA FAST PRESET -> GROQ (sub-150ms)
    if (p.includes('fast') || p.includes('ultra')) {
      if (availableProviders.has('groq')) {
        return { provider: 'groq', model: 'qwen/qwen3.8-27b' };
      }
      if (availableProviders.has('openrouter')) {
        return { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct' };
      }
      if (availableProviders.has('gemini')) {
        return { provider: 'gemini', model: 'gemini-flash-latest' };
      }
    }

    // 2. REASONING / DEEP THINK PRESET -> GROQ / OPENROUTER
    if (p.includes('o1') || p.includes('reason') || p.includes('deep')) {
      if (availableProviders.has('groq')) {
        return { provider: 'groq', model: 'openai/gpt-oss-20b' };
      }
      if (availableProviders.has('openrouter')) {
        return { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct' };
      }
      if (availableProviders.has('gemini')) {
        return { provider: 'gemini', model: 'gemini-3.7-flash' };
      }
    }

    // 3. SMARTEST / FLAGSHIP PRESET -> OPENROUTER / GROQ / GEMINI
    if (p.includes('4o') || p.includes('smart') || p.includes('flagship')) {
      if (availableProviders.has('openrouter')) {
        return { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct' };
      }
      if (availableProviders.has('groq')) {
        return { provider: 'groq', model: 'openai/gpt-oss-120b' };
      }
      if (availableProviders.has('gemini')) {
        return { provider: 'gemini', model: 'gemini-3.7-flash' };
      }
    }

    // Default Fallback
    if (availableProviders.has('groq')) {
      return { provider: 'groq', model: 'qwen/qwen3.8-27b' };
    }
    if (availableProviders.has('openrouter')) {
      return { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct' };
    }
    return { provider: 'gemini', model: 'gemini-flash-latest' };
  }

  /**
   * Dynamically refresh available models from configured providers
   */
  async refreshFromProviders(providers = {}) {
    for (const [providerId, providerInstance] of Object.entries(providers)) {
      if (!providerInstance || !providerInstance.isConfigured) continue;

      try {
        const remoteModels = await providerInstance.listModels();
        for (const rm of remoteModels) {
          if (!this.models.has(rm.id)) {
            this.register({
              id: rm.id,
              provider: providerId,
              name: rm.name || rm.id,
              capabilities: {
                text: true,
                vision: /vision|multimodal|omni|gemini/i.test(rm.id),
                tools: true,
                streaming: true,
                reasoning: /r1|reason|deep|o1|gpt-oss/i.test(rm.id)
              },
              speedClass: providerId === 'groq' ? 'fast' : 'balanced',
              qualityClass: /70b|120b|pro|sonnet|plus/i.test(rm.id) ? 'flagship' : 'high',
              contextWindow: rm.context_window || rm.context_length || 16384,
              presetMapping: []
            });
          }
        }
      } catch (_) {}
    }
  }
}

export const modelRegistry = new ModelRegistry();
