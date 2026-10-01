/**
 * Epic Think AI - Google Gemini / AI Studio Provider
 * 
 * Native REST integration with Gemini API (generateContent, streamGenerateContent).
 * Supports multimodal reasoning, function declarations, streaming, and model discovery.
 */

import { BaseAIProvider } from './BaseAIProvider.js';
import { AIAuthenticationError, AIModelUnavailableError, AIRateLimitError, AITimeoutError } from '../errors/AIErrors.js';
import { GenerationConfig } from '../core/GenerationConfig.js';

export class GeminiProvider extends BaseAIProvider {
  constructor(config = {}) {
    super({
      id: 'gemini',
      name: 'Google Gemini AI Studio',
      apiKey: config.apiKey || process.env.GEMINI_API_KEY || '',
      baseUrl: config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta',
      timeoutMs: config.timeoutMs || parseInt(process.env.AI_REQUEST_TIMEOUT_MS, 10) || 55000
    });
    this.defaultModel = config.defaultModel || 'gemini-3.5-flash';
  }

  /**
   * Convert normalized tool schemas into Gemini Function Declarations
   */
  convertTools(tools) {
    if (!tools || !Array.isArray(tools) || tools.length === 0) return undefined;

    const declarations = tools.map(t => ({
      name: `${t.pluginId ? t.pluginId + '__' : ''}${t.name}`,
      description: t.description || `Tool ${t.name}`,
      parameters: t.parameters || {
        type: 'OBJECT',
        properties: {},
        required: []
      }
    }));

    return [{ function_declarations: declarations }];
  }

  /**
   * Format messages for Gemini API
   */
  buildContents({ prompt, messages, systemPrompt }) {
    const contents = [];

    if (Array.isArray(messages) && messages.length > 0) {
      for (const m of messages) {
        if (m.role === 'system') continue; // Handled via system_instruction
        const role = m.role === 'assistant' ? 'model' : 'user';
        const parts = [];

        if (typeof m.content === 'string') {
          parts.push({ text: m.content });
        } else if (Array.isArray(m.parts)) {
          parts.push(...m.parts);
        } else {
          parts.push({ text: String(m.content || m.text || '') });
        }

        contents.push({ role, parts });
      }
    } else if (prompt) {
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });
    }

    return contents;
  }

  async generate({ prompt, messages, model, systemPrompt, temperature = 0.7, maxTokens = null, signal }) {
    if (!this.isConfigured) {
      throw new AIAuthenticationError('Gemini API key is not configured.');
    }

    const targetModel = model || this.defaultModel;
    const contents = this.buildContents({ prompt, messages });
    const startTime = Date.now();

    const effectiveMaxTokens = GenerationConfig.resolveMaxOutputTokens({
      requestedTokens: maxTokens,
      model: targetModel
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const effectiveSignal = signal || controller.signal;

    const payload = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: effectiveMaxTokens
      }
    };

    if (systemPrompt) {
      payload.system_instruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const url = `${this.baseUrl}/models/${targetModel}:generateContent?key=${this.apiKey}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
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

      const candidate = data.candidates?.[0] || {};
      const parts = candidate.content?.parts || [];
      const content = parts.map(p => p.text || '').join('');

      return this.normalizeResponse({
        content,
        model: targetModel,
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0
        },
        finishReason: GenerationConfig.normalizeFinishReason(candidate.finishReason),
        latency,
        requestId: data.responseId,
        raw: data
      });
    } catch (err) {
      clearTimeout(timer);
      throw this.mapError(err, targetModel);
    }
  }

  async generateWithTools({ prompt, messages, model, tools, systemPrompt, temperature = 0.5, maxTokens = null, signal }) {
    if (!this.isConfigured) {
      throw new AIAuthenticationError('Gemini API key is not configured.');
    }

    const targetModel = model || this.defaultModel;
    const contents = this.buildContents({ prompt, messages });
    const geminiTools = this.convertTools(tools);
    const startTime = Date.now();

    const effectiveMaxTokens = GenerationConfig.resolveMaxOutputTokens({
      requestedTokens: maxTokens,
      model: targetModel
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const effectiveSignal = signal || controller.signal;

    const payload = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: effectiveMaxTokens
      }
    };

    if (geminiTools) {
      payload.tools = geminiTools;
    }

    if (systemPrompt) {
      payload.system_instruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const url = `${this.baseUrl}/models/${targetModel}:generateContent?key=${this.apiKey}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: effectiveSignal
      });

      const latency = Date.now() - startTime;
      clearTimeout(timer);

      const data = await res.json();
      if (!res.ok) {
        throw this.mapError({ status: res.status, message: data.error?.message || res.statusText }, targetModel);
      }

      const candidate = data.candidates?.[0] || {};
      const parts = candidate.content?.parts || [];
      let content = '';
      const toolCalls = [];

      for (const part of parts) {
        if (part.text) {
          content += part.text;
        }
        if (part.functionCall) {
          const rawName = part.functionCall.name || '';
          let pluginId = null;
          let toolName = rawName;
          if (rawName.includes('__')) {
            const split = rawName.split('__');
            pluginId = split[0];
            toolName = split.slice(1).join('__');
          }

          toolCalls.push({
            id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type: 'function',
            pluginId,
            toolName,
            name: rawName,
            args: part.functionCall.args || {}
          });
        }
      }

      return this.normalizeResponse({
        content,
        toolCalls,
        model: targetModel,
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0
        },
        finishReason: candidate.finishReason?.toLowerCase() || 'stop',
        latency,
        requestId: data.responseId,
        raw: data
      });
    } catch (err) {
      clearTimeout(timer);
      throw this.mapError(err, targetModel);
    }
  }

  async stream({ prompt, messages, model, systemPrompt, temperature = 0.7, maxTokens = null, signal }, onChunk) {
    if (!this.isConfigured) {
      throw new AIAuthenticationError('Gemini API key is not configured.');
    }

    const targetModel = model || this.defaultModel;
    const contents = this.buildContents({ prompt, messages });
    const startTime = Date.now();

    const effectiveMaxTokens = GenerationConfig.resolveMaxOutputTokens({
      requestedTokens: maxTokens,
      model: targetModel
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const effectiveSignal = signal || controller.signal;

    const payload = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: effectiveMaxTokens
      }
    };

    if (systemPrompt) {
      payload.system_instruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const url = `${this.baseUrl}/models/${targetModel}:streamGenerateContent?alt=sse&key=${this.apiKey}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

          if (trimmed.startsWith('data: ')) {
            try {
              const chunkJson = JSON.parse(trimmed.slice(6));
              const candidate = chunkJson.candidates?.[0];
              if (candidate?.finishReason) {
                streamFinishReason = GenerationConfig.normalizeFinishReason(candidate.finishReason);
              }

              const delta = candidate?.content?.parts?.[0]?.text || '';
              if (delta) {
                fullContent += delta;
                if (typeof onChunk === 'function') {
                  onChunk({
                    type: 'delta',
                    delta,
                    fullContent,
                    provider: 'gemini',
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

  async listModels() {
    if (!this.isConfigured) return [];

    try {
      const res = await fetch(`${this.baseUrl}/models?key=${this.apiKey}`);
      if (!res.ok) return [];

      const data = await res.json();
      return (data.models || []).map(m => ({
        id: m.name.replace('models/', ''),
        name: m.displayName || m.name,
        provider: 'gemini',
        inputTokenLimit: m.inputTokenLimit,
        outputTokenLimit: m.outputTokenLimit,
        supportedGenerationMethods: m.supportedGenerationMethods
      }));
    } catch (_) {
      return [];
    }
  }

  async healthCheck() {
    if (!this.isConfigured) {
      return {
        provider: 'gemini',
        configured: false,
        healthy: false,
        error: 'GEMINI_API_KEY is not set'
      };
    }

    const t0 = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/models?key=${this.apiKey}`, {
        signal: AbortSignal.timeout(5000)
      });
      const latency = Date.now() - t0;
      return {
        provider: 'gemini',
        configured: true,
        healthy: res.ok,
        latency,
        status: res.status
      };
    } catch (err) {
      return {
        provider: 'gemini',
        configured: true,
        healthy: false,
        latency: Date.now() - t0,
        error: err.message
      };
    }
  }
}
