/**
 * Epic Think AI - Local Fine-Tuned Qwen Provider
 * 
 * Directly serves the custom fine-tuned Qwen LoRA / QLoRA model from
 * the local FastAPI inference engine or vLLM server.
 * Streams real-time <think> CoT reasoning and executes agentic tools.
 */

import { BaseAIProvider } from './BaseAIProvider.js';
import { AIAuthenticationError, AIModelUnavailableError, AIRateLimitError, AITimeoutError, AIProviderError } from '../errors/AIErrors.js';

export class EpicThinkLocalProvider extends BaseAIProvider {
  constructor(config = {}) {
    const baseUrl = config.baseUrl || process.env.EPIC_THINK_LOCAL_URL || 'http://127.0.0.1:8001/v1';
    super({
      id: 'local_qwen',
      name: 'Epic Think Local Qwen (Fine-Tuned)',
      apiKey: config.apiKey || 'local-token',
      baseUrl: baseUrl,
      timeoutMs: config.timeoutMs || parseInt(process.env.AI_REQUEST_TIMEOUT_MS, 10) || 60000
    });
    this.defaultModel = config.defaultModel || 'epic-think-qwen2.5-7b';
    this.isConfigured = true; // Local service can be queried directly
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

  async healthCheck() {
    try {
      const rootUrl = this.baseUrl.replace(/\/v1\/?$/, '');
      const resp = await fetch(`${rootUrl}/health`, { signal: AbortSignal.timeout(3000) });
      if (resp.ok) {
        const data = await resp.json();
        return { ok: true, engine: data.engine, model: data.model_id };
      }
      return { ok: false, error: `HTTP ${resp.status}` };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async generate({ prompt, messages, model, systemPrompt, temperature = 0.6, maxTokens = 4096, signal }) {
    const targetModel = model || this.defaultModel;
    const body = {
      model: targetModel,
      messages: this.buildMessages({ prompt, messages, systemPrompt }),
      temperature,
      max_tokens: maxTokens,
      stream: false
    };

    try {
      const resp = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body),
        signal: signal || AbortSignal.timeout(this.timeoutMs)
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new AIProviderError(`Local Qwen API Error (${resp.status}): ${errorText}`, this.id, resp.status);
      }

      const data = await resp.json();
      const choice = data.choices && data.choices[0];
      const message = choice ? choice.message : {};

      return {
        text: message.content || '',
        reasoningContent: message.reasoning_content || null,
        usage: data.usage || {},
        model: data.model || targetModel,
        provider: this.id
      };
    } catch (err) {
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        throw new AITimeoutError(`Local Qwen request timed out after ${this.timeoutMs}ms`, this.id);
      }
      throw err;
    }
  }

  async stream({ prompt, messages, model, systemPrompt, temperature = 0.6, maxTokens = 4096, signal }, onChunk) {
    const targetModel = model || this.defaultModel;
    const body = {
      model: targetModel,
      messages: this.buildMessages({ prompt, messages, systemPrompt }),
      temperature,
      max_tokens: maxTokens,
      stream: true
    };

    let response;
    try {
      response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body),
        signal: signal || AbortSignal.timeout(this.timeoutMs)
      });
    } catch (err) {
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        throw new AITimeoutError(`Local Qwen stream timed out`, this.id);
      }
      throw err;
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new AIProviderError(`Local Qwen stream error (${response.status}): ${errText}`, this.id, response.status);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullText = '';
    let fullReasoning = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const delta = parsed.choices?.[0]?.delta || {};

              if (delta.reasoning_content) {
                fullReasoning += delta.reasoning_content;
                if (typeof onChunk === 'function') {
                  onChunk({
                    text: '',
                    reasoning: delta.reasoning_content,
                    isReasoning: true,
                    fullText,
                    fullReasoning
                  });
                }
              }

              if (delta.content) {
                fullText += delta.content;
                if (typeof onChunk === 'function') {
                  onChunk({
                    text: delta.content,
                    reasoning: '',
                    isReasoning: false,
                    fullText,
                    fullReasoning
                  });
                }
              }
            } catch (_) {}
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return {
      text: fullText,
      reasoningContent: fullReasoning,
      provider: this.id,
      model: targetModel
    };
  }
}
