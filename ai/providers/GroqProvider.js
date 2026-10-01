/**
 * Epic Think AI - Groq LPU Provider
 * 
 * High-speed inference using Groq's OpenAI-compatible API endpoint.
 * Delivers sub-150ms token generation for ultra-fast chat and autonomous tool execution.
 */

import { BaseAIProvider } from './BaseAIProvider.js';
import { AIAuthenticationError, AIModelUnavailableError, AIRateLimitError, AITimeoutError } from '../errors/AIErrors.js';
import { GenerationConfig } from '../core/GenerationConfig.js';

export class GroqProvider extends BaseAIProvider {
  constructor(config = {}) {
    super({
      id: 'groq',
      name: 'Groq Cloud LPU',
      apiKey: config.apiKey || process.env.GROQ_API_KEY || '',
      baseUrl: config.baseUrl || 'https://api.groq.com/openai/v1',
      timeoutMs: config.timeoutMs || parseInt(process.env.AI_REQUEST_TIMEOUT_MS, 10) || 55000
    });
    this.defaultModel = config.defaultModel || 'qwen/qwen3.8-27b';
  }

  /**
   * Convert normalized tool schemas to OpenAI/Groq function calling format
   */
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

  /**
   * Build messages array
   */
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

  /**
   * Non-streaming text generation
   */
  async generate({ prompt, messages, model, systemPrompt, temperature = 0.7, maxTokens = null, signal }) {
    if (!this.isConfigured) {
      throw new AIAuthenticationError('Groq API key is not configured.');
    }

    const targetModel = model || this.defaultModel;
    const bodyMessages = this.buildMessages({ prompt, messages, systemPrompt });
    const startTime = Date.now();

    // Centralized generation token governor - removes artificial 800 token truncation cap
    const effectiveMaxTokens = GenerationConfig.resolveMaxOutputTokens({
      requestedTokens: maxTokens,
      model: targetModel
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const effectiveSignal = signal || controller.signal;

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: targetModel,
          messages: bodyMessages,
          temperature,
          max_tokens: effectiveMaxTokens
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
        finishReason: choice.finish_reason || 'stop',
        latency,
        requestId: data.id || data.x_groq?.id,
        raw: data
      });
    } catch (err) {
      clearTimeout(timer);
      throw this.mapError(err, targetModel);
    }
  }

  /**
   * Generation with tool calling support
   */
  async generateWithTools({ prompt, messages, model, tools, systemPrompt, temperature = 0.5, maxTokens = null, signal }) {
    if (!this.isConfigured) {
      throw new AIAuthenticationError('Groq API key is not configured.');
    }

    const targetModel = model || this.defaultModel;
    const bodyMessages = this.buildMessages({ prompt, messages, systemPrompt });
    const groqTools = this.convertTools(tools);
    const startTime = Date.now();

    const effectiveMaxTokens = GenerationConfig.resolveMaxOutputTokens({
      requestedTokens: maxTokens,
      model: targetModel
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const effectiveSignal = signal || controller.signal;

    const payload = {
      model: targetModel,
      messages: bodyMessages,
      temperature,
      max_tokens: effectiveMaxTokens
    };

    if (groqTools && groqTools.length > 0) {
      payload.tools = groqTools;
      payload.tool_choice = 'auto';
    }

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
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

      // Normalize tool calls
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
        requestId: data.id || data.x_groq?.id,
        raw: data
      });
    } catch (err) {
      clearTimeout(timer);
      throw this.mapError(err, targetModel);
    }
  }

  /**
   * Streaming text generation with callback
   */
  async stream({ prompt, messages, model, systemPrompt, temperature = 0.7, maxTokens = null, signal }, onChunk) {
    if (!this.isConfigured) {
      throw new AIAuthenticationError('Groq API key is not configured.');
    }

    const targetModel = model || this.defaultModel;
    const bodyMessages = this.buildMessages({ prompt, messages, systemPrompt });
    const startTime = Date.now();

    const effectiveMaxTokens = GenerationConfig.resolveMaxOutputTokens({
      requestedTokens: maxTokens,
      model: targetModel
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const effectiveSignal = signal || controller.signal;

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: targetModel,
          messages: bodyMessages,
          temperature,
          max_tokens: effectiveMaxTokens,
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
      let streamFinishReason = 'stop';
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
              const choice = chunkJson.choices?.[0];
              const delta = choice?.delta?.content || '';

              if (choice?.finish_reason) {
                streamFinishReason = choice.finish_reason;
              }

              if (delta) {
                fullContent += delta;
                if (typeof onChunk === 'function') {
                  onChunk({
                    type: 'delta',
                    delta,
                    fullContent,
                    provider: 'groq',
                    model: targetModel,
                    finishReason: streamFinishReason
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
        finishReason: streamFinishReason || 'stop',
        latency
      });
    } catch (err) {
      clearTimeout(timer);
      throw this.mapError(err, targetModel);
    }
  }

  /**
   * Dynamically retrieve available models from Groq API
   */
  async listModels() {
    if (!this.isConfigured) return [];

    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (!res.ok) return [];

      const data = await res.json();
      return (data.data || []).map(m => ({
        id: m.id,
        name: m.id,
        provider: 'groq',
        owned_by: m.owned_by,
        context_window: m.context_window || 8192
      }));
    } catch (_) {
      return [];
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    if (!this.isConfigured) {
      return {
        provider: 'groq',
        configured: false,
        healthy: false,
        error: 'GROQ_API_KEY is not set'
      };
    }

    const t0 = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(5000)
      });
      const latency = Date.now() - t0;
      return {
        provider: 'groq',
        configured: true,
        healthy: res.ok,
        latency,
        status: res.status
      };
    } catch (err) {
      return {
        provider: 'groq',
        configured: true,
        healthy: false,
        latency: Date.now() - t0,
        error: err.message
      };
    }
  }
}
