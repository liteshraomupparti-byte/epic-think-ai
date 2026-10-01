/**
 * Epic Think AI - Intelligent Model Router & Resilient Fallback Engine
 * 
 * Dynamically resolves the optimal provider and model based on:
 * - User preset ('Epic Think Fast', 'Epic Think o1', 'Epic Think 4o')
 * - Task type (CHAT, CODE_GENERATION, REASONING, FAST_RESPONSE, TOOL_EXECUTION)
 * - Provider health & circuit breaker states
 * - Fallback chain (Groq -> OpenRouter -> Gemini -> Graceful error)
 */

import { modelRegistry } from './ModelRegistry.js';
import { healthMonitor } from './HealthMonitor.js';
import { SafeLogger } from '../../plugins/core/SafeLogger.js';
import { AIProviderError, AITimeoutError, AICancellationError } from '../errors/AIErrors.js';
import { GenerationConfig } from './GenerationConfig.js';

export const TaskType = {
  CHAT: 'CHAT',
  CODE_GENERATION: 'CODE_GENERATION',
  CODE_DEBUGGING: 'CODE_DEBUGGING',
  REASONING: 'REASONING',
  RESEARCH: 'RESEARCH',
  FAST_RESPONSE: 'FAST_RESPONSE',
  TOOL_EXECUTION: 'TOOL_EXECUTION',
  IMAGE_UNDERSTANDING: 'IMAGE_UNDERSTANDING'
};

export class AIModelRouter {
  /**
   * @param {object} providers - Map of initialized providers { groq, openrouter, gemini }
   * @param {object} [config]
   */
  constructor(providersOrOptions = {}, config = {}) {
    if (providersOrOptions && providersOrOptions.providers) {
      this.providers = providersOrOptions.providers;
      this.healthMonitor = providersOrOptions.healthMonitor || healthMonitor;
      this.registry = providersOrOptions.registry || modelRegistry;
      this.defaultProvider = providersOrOptions.defaultProvider || config.defaultProvider || process.env.AI_DEFAULT_PROVIDER || 'groq';
      this.defaultModel = providersOrOptions.defaultModel || config.defaultModel || process.env.AI_DEFAULT_MODEL || 'qwen/qwen3.8-27b';
      this.fallbackProvider = providersOrOptions.fallbackProvider || config.fallbackProvider || process.env.AI_FALLBACK_PROVIDER || 'openrouter';
      this.fallbackModel = providersOrOptions.fallbackModel || config.fallbackModel || process.env.AI_FALLBACK_MODEL || 'meta-llama/llama-3.3-70b-instruct';
      this.maxRetries = providersOrOptions.maxRetries || parseInt(process.env.AI_MAX_RETRIES, 10) || 2;
    } else {
      this.providers = providersOrOptions || {};
      this.healthMonitor = config.healthMonitor || healthMonitor;
      this.registry = config.registry || modelRegistry;
      this.defaultProvider = config.defaultProvider || process.env.AI_DEFAULT_PROVIDER || 'groq';
      this.defaultModel = config.defaultModel || process.env.AI_DEFAULT_MODEL || 'qwen/qwen3.8-27b';
      this.fallbackProvider = config.fallbackProvider || process.env.AI_FALLBACK_PROVIDER || 'openrouter';
      this.fallbackModel = config.fallbackModel || process.env.AI_FALLBACK_MODEL || 'meta-llama/llama-3.3-70b-instruct';
      this.maxRetries = parseInt(process.env.AI_MAX_RETRIES, 10) || 2;
    }
  }

  /**
   * Classify task type from prompt content
   */
  classifyTask(prompt = '', tools = []) {
    if (tools && tools.length > 0) return TaskType.TOOL_EXECUTION;

    const lower = (prompt || '').toLowerCase();
    if (/why|prove|step by step|chain of thought|logic puzzle|riddle|compare deeply/i.test(lower)) {
      return TaskType.REASONING;
    }
    if (/write code|function|class|algorithm|implement|build api|create endpoint|typescript|react/i.test(lower)) {
      return TaskType.CODE_GENERATION;
    }
    if (/fix bug|debug|syntax error|stack trace|why does this fail/i.test(lower)) {
      return TaskType.CODE_DEBUGGING;
    }
    if (/quick|fast|summarize in one word|yes or no|briefly/i.test(lower)) {
      return TaskType.FAST_RESPONSE;
    }
    return TaskType.CHAT;
  }

  /**
   * Get active healthy providers
   */
  getHealthyProviders() {
    const available = new Set();
    const monitor = this.healthMonitor || healthMonitor;
    for (const [id, provider] of Object.entries(this.providers)) {
      if (provider && provider.isConfigured && monitor.canExecute(id)) {
        available.add(id);
      }
    }
    return available;
  }

  /**
   * Decide ordered list of execution candidate targets (Primary -> Fallback 1 -> Fallback 2)
   */
  resolveCandidateChain({ preset = 'Epic Think 4o', taskType = null, requestedProvider = null, requestedModel = null }) {
    const healthy = this.getHealthyProviders();
    const candidates = [];
    const registry = this.registry || modelRegistry;
    const monitor = this.healthMonitor || healthMonitor;

    // If explicit provider and model requested
    if (requestedProvider && this.providers[requestedProvider]?.isConfigured) {
      candidates.push({
        providerId: requestedProvider,
        model: requestedModel || this.defaultModel
      });
    }

    // Resolve target based on Epic Think UI Preset
    const resolved = registry.resolvePreset(preset, healthy);
    if (!candidates.some(c => c.providerId === resolved.provider)) {
      candidates.push({
        providerId: resolved.provider,
        model: resolved.model
      });
    }

    // Add Fallback Chain based on configured healthy providers
    const fallbackOrder = ['groq', 'openrouter', 'gemini'];
    for (const pId of fallbackOrder) {
      if (candidates.some(c => c.providerId === pId)) continue;
      const provider = this.providers[pId];
      if (provider && provider.isConfigured && monitor.canExecute(pId)) {
        let m = provider.defaultModel;
        if (pId === 'groq') m = 'qwen/qwen3.8-27b';
        if (pId === 'openrouter') m = 'meta-llama/llama-3.3-70b-instruct';
        if (pId === 'gemini') m = 'gemini-3.5-flash';

        candidates.push({ providerId: pId, model: m });
      }
    }

    // If everything is tripped or unconfigured, include any configured provider as last resort
    if (candidates.length === 0) {
      for (const [pId, p] of Object.entries(this.providers)) {
        if (p && p.isConfigured) {
          candidates.push({ providerId: pId, model: p.defaultModel });
        }
      }
    }

    return candidates;
  }

  /**
   * Determine primary target and fallback chain for a task
   */
  route({ prompt = '', userPrompt = '', modelPreset = 'Epic Think 4o', preset = 'Epic Think 4o', tools = [], requestedProvider = null, requestedModel = null } = {}) {
    const effectivePrompt = prompt || userPrompt;
    const effectivePreset = modelPreset || preset;
    const taskType = this.classifyTask(effectivePrompt, tools);
    const chain = this.resolveCandidateChain({ preset: effectivePreset, taskType, requestedProvider, requestedModel });
    return {
      taskType,
      primary: chain[0] ? { provider: chain[0].providerId, model: chain[0].model } : { provider: this.defaultProvider, model: this.defaultModel },
      fallbacks: chain.slice(1).map(c => ({ provider: c.providerId, model: c.model }))
    };
  }

  /**
   * Execute request with automatic retry, jitter, circuit breaker updates, and fallback
   */
  async execute({
    userPrompt,
    prompt,
    messages,
    preset = 'Epic Think 4o',
    modelPreset,
    tools = [],
    systemPrompt = null,
    temperature = 0.7,
    maxTokens = null,
    signal = null,
    streaming = false,
    onChunk = null
  }) {
    const effectivePrompt = prompt || userPrompt;
    const effectivePreset = modelPreset || preset;
    const taskType = this.classifyTask(effectivePrompt, tools);
    const candidateChain = this.resolveCandidateChain({ preset: effectivePreset, taskType });

    if (candidateChain.length === 0) {
      throw new AIProviderError('No AI providers configured. Please set GROQ_API_KEY, OPENROUTER_API_KEY, or GEMINI_API_KEY in server configuration.');
    }

    let lastError = null;

    for (let i = 0; i < candidateChain.length; i++) {
      const candidate = candidateChain[i];
      const provider = this.providers[candidate.providerId];
      if (!provider) continue;

      const isFallback = i > 0;
      if (isFallback) {
        SafeLogger.info('Router falling back to secondary provider', {
          from: candidateChain[i - 1].providerId,
          to: candidate.providerId,
          model: candidate.model
        });
      }

      // Calculate safe, generous token ceiling based on model and preset (e.g. 4096-8192)
      const effectiveMaxTokens = GenerationConfig.resolveMaxOutputTokens({
        preset: effectivePreset,
        requestedTokens: maxTokens,
        model: candidate.model
      });

      // Retry loop per candidate (exponential backoff with jitter)
      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        if (signal && signal.aborted) {
          throw new AICancellationError('Request cancelled by user');
        }

        const t0 = Date.now();
        try {
          let result;

          if (streaming && typeof onChunk === 'function') {
            result = await provider.stream({
              prompt: effectivePrompt,
              messages,
              model: candidate.model,
              systemPrompt,
              temperature,
              maxTokens: effectiveMaxTokens,
              signal
            }, onChunk);
          } else if (tools && tools.length > 0) {
            result = await provider.generateWithTools({
              prompt: effectivePrompt,
              messages,
              model: candidate.model,
              tools,
              systemPrompt,
              temperature,
              maxTokens: effectiveMaxTokens,
              signal
            });
          } else {
            result = await provider.generate({
              prompt: effectivePrompt,
              messages,
              model: candidate.model,
              systemPrompt,
              temperature,
              maxTokens: effectiveMaxTokens,
              signal
            });
          }

          const latency = Date.now() - t0;
          healthMonitor.recordSuccess(candidate.providerId, latency);

          const finishReason = GenerationConfig.normalizeFinishReason(result.finishReason);
          const isTruncated = finishReason === 'length';

          return {
            success: true,
            ...result,
            finishReason,
            isTruncated,
            canContinue: isTruncated,
            maxOutputTokens: effectiveMaxTokens,
            providerUsed: candidate.providerId,
            modelUsed: candidate.model,
            isFallback,
            attemptCount: attempt + 1
          };
        } catch (err) {
          lastError = err;
          healthMonitor.recordFailure(candidate.providerId, err);

          SafeLogger.warn(`Provider ${candidate.providerId} attempt ${attempt + 1} failed`, {
            model: candidate.model,
            error: err.message,
            statusCode: err.statusCode
          });

          // Non-retryable error (e.g. 401 unauthenticated, 400 bad schema) - do not spin in retry
          if (err.statusCode === 401 || err.statusCode === 403 || err.statusCode === 400) {
            break;
          }

          // If retryable and attempts remaining, apply backoff jitter
          if (attempt < this.maxRetries) {
            const backoffMs = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 4000);
            await new Promise(r => setTimeout(r, backoffMs));
          }
        }
      }
    }

    throw lastError || new AIProviderError('All AI providers in fallback chain failed.');
  }
}
