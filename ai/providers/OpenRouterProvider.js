/**
 * Epic Think AI - OpenRouter Provider
 * 
 * Provides access to hundreds of open-source and proprietary models through a single OpenAI-compatible interface.
 * Implements tool calling, streaming, custom routing, and fallback.
 */

import { BaseAIProvider } from './BaseAIProvider.js';
import { AIAuthenticationError, AIModelUnavailableError, AIRateLimitError, AITimeoutError } from '../errors/AIErrors.js';

export class OpenRouterProvider extends BaseAIProvider {
  constructor(config = {}) {
    super({
      id: 'openrouter',
      name: 'OpenRouter Multi-Model Gateway',
      apiKey: config.apiKey || process.env.OPENROUTER_API_KEY || '',
      baseUrl: config.baseUrl || 'https://openrouter.ai/api/v1',
      timeoutMs: config.timeoutMs || parseInt(process.env.AI_REQUEST_TIMEOUT_MS, 10) || 30000
    });
    this.defaultModel = config.defaultModel || process.env.AI_FALLBACK_MODEL || 'meta-llama/llama-3.3-70b-instruct';
  }

  /**
   * OpenRouter specific headers
   */
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://epicthink.ai',
      'X-Title': 'Epic Think AI Platform'
    };
  }

  convertTools(tools) {
    if (!tools || !Array.isArray(tools) || tools.length === 0) return undefined;

    return tools.map(t => ({
      type: 'function',
      function: {
        name: `${t.pluginId ? t.pluginId + '__' : ''}${t.name}`,
        description: t.description || `Tool ${t.name}`,
        parameters: t.parameters || {
          type: 'object',
          properties: {},
          required: []
        }
      }
    }));
  }

  buildMessages({ prompt, messages, systemPrompt }) {
    const formatted = [];
    if (systemPrompt) {
      formatted.push({ role: 'system', content: systemPrompt });
    }
    if (Array.isArray(messages) && messages.length > 0) {
      formatted.push(...messages);
    } else if (prompt) {
      formatted.push({ role: 'user', content: prompt });
    }
    return formatted;
  }

  async generate({ prompt, messages, model, systemPrompt, temperature = 0.7, maxTokens = 2048, signal }) {
    if (!this.isConfigured) {
      throw new AIAuthenticationError('OpenRouter API key is not configured.');
    }

    const targetModel = model || this.defaultModel;
    const bodyMessages = this.buildMessages({ prompt, messages, systemPrompt });
    const startTime = Date.now();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const effectiveSignal = signal || controller.signal;

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: targetModel,
          messages: bodyMessages,
          temperature,
          max_tokens: maxTokens
        }),
        signal: effectiveSignal
      });

      const latency = Date.now() - startTime;
      clearTimeout(timer);

      const data = await res.json();
      if (!res.ok) {
        throw this.mapError({ status: res.status, message: data.error?.message || res.statusText }, targetModel);
      }

      const choice = data.choices?.[0] || {};
      const content = choice.message?.content || '';

      return this.normalizeResponse({
        content,
        model: data.model || targetModel,
        usage: data.usage,
        finishReason: choice.finish_reason,
        latency,
        requestId: data.id,
        raw: data
      });
    } catch (err) {
      clearTimeout(timer);
      throw this.mapError(err, targetModel);
    }
  }

  async generateWithTools({ prompt, messages, model, tools, systemPrompt, temperature = 0.5, maxTokens = 2048, signal }) {
    if (!this.isConfigured) {
      throw new AIAuthenticationError('OpenRouter API key is not configured.');
    }

    const targetModel = model || this.defaultModel;
    const bodyMessages = this.buildMessages({ prompt, messages, systemPrompt });
    const orTools = this.convertTools(tools);
    const startTime = Date.now();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const effectiveSignal = signal || controller.signal;

    const payload = {
      model: targetModel,
      messages: bodyMessages,
      temperature,
      max_tokens: maxTokens
    };

    if (orTools && orTools.length > 0) {
      payload.tools = orTools;
      payload.tool_choice = 'auto';
    }

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
        signal: effectiveSignal
      });

      const latency = Date.now() - startTime;
      clearTimeout(timer);

      const data = await res.json();
      if (!res.ok) {
        throw this.mapError({ status: res.status, message: data.error?.message || res.statusText }, targetModel);
      }

      const choice = data.choices?.[0] || {};
      const msg = choice.message || {};
      const content = msg.content || '';

      const toolCalls = (msg.tool_calls || []).map(tc => {
        let args = {};
        try {
          args = typeof tc.function?.arguments === 'string'
            ? JSON.parse(tc.function.arguments)
            : (tc.function?.arguments || {});
        } catch (_) {
          args = { raw: tc.function?.arguments };
        }

        const rawName = tc.function?.name || '';
        let pluginId = null;
        let toolName = rawName;
        if (rawName.includes('__')) {
          const parts = rawName.split('__');
          pluginId = parts[0];
          toolName = parts.slice(1).join('__');
        }

        return {
          id: tc.id,
          type: 'function',
          pluginId,
          toolName,
          name: rawName,
          args
        };
      });

      return this.normalizeResponse({
        content,
        toolCalls,
        model: data.model || targetModel,
        usage: data.usage,
        finishReason: choice.finish_reason,
        latency,
        requestId: data.id,
        raw: data
      });
    } catch (err) {
      clearTimeout(timer);
      throw this.mapError(err, targetModel);
    }
  }

  async stream({ prompt, messages, model, systemPrompt, temperature = 0.7, maxTokens = 2048, signal }, onChunk) {
    if (!this.isConfigured) {
      throw new AIAuthenticationError('OpenRouter API key is not configured.');
    }

    const targetModel = model || this.defaultModel;
    const bodyMessages = this.buildMessages({ prompt, messages, systemPrompt });
    const startTime = Date.now();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const effectiveSignal = signal || controller.signal;

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: targetModel,
          messages: bodyMessages,
          temperature,
          max_tokens: maxTokens,
          stream: true
        }),
        signal: effectiveSignal
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw this.mapError({ status: res.status, message: errJson.error?.message || res.statusText }, targetModel);
      }

      let fullContent = '';
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;
          if (trimmed === 'data: [DONE]') break;

          if (trimmed.startsWith('data: ')) {
            try {
              const chunkJson = JSON.parse(trimmed.slice(6));
              const delta = chunkJson.choices?.[0]?.delta?.content || '';
              if (delta) {
                fullContent += delta;
                if (typeof onChunk === 'function') {
                  onChunk({
                    type: 'delta',
                    delta,
                    fullContent,
                    provider: 'openrouter',
                    model: targetModel
                  });
                }
              }
            } catch (_) {}
          }
        }
      }

      const latency = Date.now() - startTime;
      return this.normalizeResponse({
        content: fullContent,
        model: targetModel,
        latency
      });
    } catch (err) {
      clearTimeout(timer);
      throw this.mapError(err, targetModel);
    }
  }

  async listModels() {
    if (!this.isConfigured) return [];

    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: this.getHeaders()
      });
      if (!res.ok) return [];

      const data = await res.json();
      return (data.data || []).map(m => ({
        id: m.id,
        name: m.name || m.id,
        provider: 'openrouter',
        context_length: m.context_length || 4096,
        pricing: m.pricing
      }));
    } catch (_) {
      return [];
    }
  }

  async healthCheck() {
    if (!this.isConfigured) {
      return {
        provider: 'openrouter',
        configured: false,
        healthy: false,
        error: 'OPENROUTER_API_KEY is not set'
      };
    }

    const t0 = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000)
      });
      const latency = Date.now() - t0;
      return {
        provider: 'openrouter',
        configured: true,
        healthy: res.ok,
        latency,
        status: res.status
      };
    } catch (err) {
      return {
        provider: 'openrouter',
        configured: true,
        healthy: false,
        latency: Date.now() - t0,
        error: err.message
      };
    }
  }
}
