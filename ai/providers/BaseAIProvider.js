/**
 * Epic Think AI - Base Unified AI Provider Interface
 * 
 * Defines standard contract for all AI providers (Groq, OpenRouter, Gemini).
 * Normalizes requests, responses, streaming chunks, tool conversions, and health checks.
 */

import {
  AIProviderError,
  AIRateLimitError,
  AITimeoutError,
  AIAuthenticationError,
  AIModelUnavailableError
} from '../errors/AIErrors.js';

export class BaseAIProvider {
  /**
   * @param {object} config
   * @param {string} config.id - Provider identifier (e.g. 'groq', 'openrouter', 'gemini')
   * @param {string} config.name - Display name
   * @param {string} config.apiKey - Provider API secret
   * @param {string} [config.baseUrl] - Base API URL
   * @param {number} [config.timeoutMs] - Default timeout
   */
  constructor({ id, name, apiKey, baseUrl, timeoutMs = 25000 }) {
    this.id = id;
    this.name = name;
    this.apiKey = apiKey || '';
    this.baseUrl = baseUrl || '';
    this.timeoutMs = timeoutMs;
    this.isConfigured = Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Abstract standard non-streaming text generation
   */
  async generate({ prompt, messages, model, systemPrompt, temperature, maxTokens, signal }) {
    throw new Error(`generate() not implemented by ${this.name}`);
  }

  /**
   * Abstract streaming text generation
   */
  async stream({ prompt, messages, model, systemPrompt, temperature, maxTokens, signal }, onChunk) {
    throw new Error(`stream() not implemented by ${this.name}`);
  }

  /**
   * Abstract text generation with declared function/tools
   */
  async generateWithTools({ prompt, messages, model, tools, systemPrompt, temperature, maxTokens, signal }) {
    throw new Error(`generateWithTools() not implemented by ${this.name}`);
  }

  /**
   * Abstract streaming with tools
   */
  async streamWithTools({ prompt, messages, model, tools, systemPrompt, temperature, maxTokens, signal }, onChunk) {
    throw new Error(`streamWithTools() not implemented by ${this.name}`);
  }

  /**
   * List supported models from this provider
   */
  async listModels() {
    return [];
  }

  /**
   * Perform lightweight ping or test to verify provider availability
   */
  async healthCheck() {
    return {
      provider: this.id,
      configured: this.isConfigured,
      healthy: false,
      latency: null,
      error: 'Not implemented'
    };
  }

  /**
   * Convert normalized tools into provider-specific schemas
   */
  convertTools(tools) {
    return tools || [];
  }

  /**
   * Normalize raw response object
   */
  normalizeResponse({
    content = '',
    toolCalls = [],
    model = 'unknown',
    usage = {},
    finishReason = 'stop',
    latency = 0,
    requestId = null,
    raw = null
  } = {}) {
    return {
      provider: this.id,
      model,
      content: content || '',
      toolCalls: Array.isArray(toolCalls) ? toolCalls : [],
      usage: {
        promptTokens: usage?.prompt_tokens || usage?.promptTokens || 0,
        completionTokens: usage?.completion_tokens || usage?.completionTokens || 0,
        totalTokens: usage?.total_tokens || usage?.totalTokens || 0
      },
      finishReason: finishReason || 'stop',
      latency: Math.max(0, Math.round(latency)),
      requestId: requestId || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      raw
    };
  }

  /**
   * Map HTTP / Fetch errors to normalized AIProviderError hierarchy
   */
  mapError(err, model = 'unknown') {
    if (err.name === 'AbortError') {
      return new AITimeoutError(`Request to ${this.name} timed out after ${this.timeoutMs}ms`, {
        provider: this.id,
        model
      });
    }

    const status = err.status || err.statusCode || 500;
    const msg = err.message || 'Unknown provider error';

    if (status === 401 || status === 403 || /unauthorized|invalid api key|forbidden/i.test(msg)) {
      return new AIAuthenticationError(`Authentication failed for ${this.name}: ${msg}`, {
        provider: this.id,
        model,
        statusCode: status
      });
    }

    if (status === 429 || /rate limit|quota exceeded|too many requests/i.test(msg)) {
      return new AIRateLimitError(`Rate limit reached on ${this.name}: ${msg}`, {
        provider: this.id,
        model,
        statusCode: status
      });
    }

    if (status === 404 || /not found|model unavailable|no longer available/i.test(msg)) {
      return new AIModelUnavailableError(`Model "${model}" not available on ${this.name}: ${msg}`, {
        provider: this.id,
        model,
        statusCode: status
      });
    }

    const isRetryable = status === 429 || status === 502 || status === 503 || status === 504 || /high demand|temporarily unavailable|overloaded/i.test(msg);

    return new AIProviderError(msg, {
      provider: this.id,
      model,
      statusCode: status,
      isRetryable,
      rawError: err
    });
  }
}
