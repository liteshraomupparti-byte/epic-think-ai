/**
 * Epic Think AI - Production Multi-Provider AI Client Service
 * 
 * Provides unified communication with backend Multi-Provider AI Router,
 * supporting Groq, OpenRouter, Google Gemini, image/video generation tools,
 * model health monitoring, and tool calling.
 */

import { getIdToken } from "./authService.js";

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') return '';
    if (window.location.port === '3001') return '';
  }
  return 'http://localhost:3001';
};

async function fetchWithAuth(endpoint, options = {}) {
  let token = null;
  try {
    token = await getIdToken();
  } catch (_) {}

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBase()}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export class AiService {
  /**
   * Send a chat request through the Multi-Provider AI Router
   * 
   * @param {Object} params
   * @param {string} params.message - Current user prompt
   * @param {string} [params.conversationId]
   * @param {string} [params.modelPreset] - 'Epic Think 4o', 'Epic Think o1 (Reasoning)', 'Epic Think Fast', 'auto', etc.
   * @param {string} [params.provider]
   * @param {string} [params.model]
   * @param {Array}  [params.history]
   * @param {boolean} [params.reasoning]
   * @param {boolean} [params.webSearch]
   * @param {string} [params.confirmationId]
   */
  static async chat(params) {
    return await fetchWithAuth('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  /**
   * Stream a chat response via Server-Sent Events (SSE) from the Multi-Provider AI Router.
   * Progressively consumes chunks and accumulates them into full text.
   *
   * @param {Object} params
   * @param {string} params.prompt
   * @param {string} [params.conversationId]
   * @param {string} [params.modelPreset]
   * @param {Array}  [params.recentMessages]
   * @param {boolean} [params.isContinuation]
   * @param {string} [params.partialResponse]
   * @param {number} [params.maxTokens]
   * @param {AbortSignal} [params.signal]
   * @param {Object} callbacks
   * @param {Function} [callbacks.onChunk] - ({ text, content, accumulated }) => void
   * @param {Function} [callbacks.onThinking] - ({ content }) => void
   * @param {Function} [callbacks.onComplete] - (completeData) => void
   * @param {Function} [callbacks.onDone] - (doneData) => void
   * @param {Function} [callbacks.onError] - (error) => void
   */
  static async stream(params, callbacks = {}) {
    let token = null;
    try {
      token = await getIdToken();
    } catch (_) {}

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = {
      prompt: params.prompt || params.message || '',
      conversationId: params.conversationId,
      modelPreset: params.modelPreset,
      recentMessages: params.recentMessages || params.history || [],
      isContinuation: Boolean(params.isContinuation),
      partialResponse: params.partialResponse || '',
      maxTokens: params.maxTokens || null
    };

    const response = await fetch(`${getApiBase()}/api/ai/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: params.signal
    });

    if (!response.ok) {
      let errText = `HTTP error ${response.status}`;
      try {
        const errJson = await response.json();
        errText = errJson.error || errText;
      } catch (_) {}
      const err = new Error(errText);
      if (callbacks.onError) callbacks.onError(err);
      throw err;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulatedText = '';
    let streamDoneData = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop(); // keep remainder

        for (const part of parts) {
          const trimmed = part.trim();
          if (!trimmed) continue;

          let eventName = 'message';
          let dataStr = '';

          const lines = trimmed.split('\n');
          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              dataStr = line.slice(5).trim();
            }
          }

          if (!dataStr) continue;

          let dataObj = null;
          try {
            dataObj = JSON.parse(dataStr);
          } catch (_) {
            dataObj = { raw: dataStr };
          }

          if (eventName === 'chunk' || eventName === 'ai:chunk') {
            const chunkText = dataObj.content || dataObj.text || '';
            if (chunkText) {
              accumulatedText += chunkText;
              if (callbacks.onChunk) {
                callbacks.onChunk({ text: chunkText, content: chunkText, accumulated: accumulatedText });
              }
            }
          } else if (eventName === 'ai:thinking') {
            if (callbacks.onThinking) callbacks.onThinking(dataObj);
          } else if (eventName === 'ai:complete') {
            if (callbacks.onComplete) callbacks.onComplete(dataObj);
          } else if (eventName === 'ai:done') {
            streamDoneData = dataObj;
            if (callbacks.onDone) callbacks.onDone(dataObj);
          } else if (eventName === 'ai:error') {
            const err = new Error(dataObj.error || 'Stream error');
            if (callbacks.onError) callbacks.onError(err);
            throw err;
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return {
          text: accumulatedText,
          interrupted: true,
          finishReason: 'interrupted',
          isTruncated: false,
          canContinue: false
        };
      }
      if (callbacks.onError) callbacks.onError(err);
      throw err;
    }

    return {
      text: accumulatedText,
      ...(streamDoneData || {}),
      finishReason: streamDoneData?.finishReason || 'stop',
      isTruncated: Boolean(streamDoneData?.isTruncated),
      canContinue: Boolean(streamDoneData?.canContinue)
    };
  }

  /**
   * Fetch developer diagnostics for AI generations
   */
  static async getDiagnostics() {
    return await fetchWithAuth('/api/ai/diagnostics');
  }

  /**
   * Fetch connected providers readiness status
   */
  static async getProviders() {
    return await fetchWithAuth('/api/ai/providers');
  }

  /**
   * Fetch available models catalog with presets
   */
  static async getModels() {
    return await fetchWithAuth('/api/ai/models');
  }

  /**
   * Fetch provider health and circuit breaker metrics
   */
  static async getHealth() {
    return await fetchWithAuth('/api/ai/health');
  }

  /**
   * Generate an image using AI Image Studio
   * 
   * @param {Object} params
   * @param {string} params.prompt
   * @param {string} [params.style]
   * @param {string} [params.aspectRatio]
   */
  static async generateImage(params) {
    return await fetchWithAuth('/api/ai/image', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  /**
   * Generate video prompt package and storyboard
   * 
   * @param {Object} params
   * @param {string} params.prompt
   * @param {number} [params.durationSeconds]
   * @param {string} [params.style]
   */
  static async generateVideo(params) {
    return await fetchWithAuth('/api/ai/video', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }
}
