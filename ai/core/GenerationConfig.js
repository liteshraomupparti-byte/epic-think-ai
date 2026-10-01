/**
 * Epic Think AI - Centralized Generation Configuration & Token Governor
 * 
 * Manages output token budgets, provider-specific parameter mapping,
 * finish_reason normalization, and seamless response continuation.
 */

export const PRESET_OUTPUT_LIMITS = {
  'epic think fast': 4096,
  'fast': 4096,
  'auto': 4096,
  'epic think 4o': 8192,
  'smartest': 8192,
  'epic think o1': 8192,
  'reasoning': 8192,
  'deep think': 8192,
  'default': 4096
};

export const MODEL_TOKEN_CEILINGS = {
  'qwen/qwen3.8-27b': 950, // Groq on-demand OTPM limit is 1000 tokens (triggers clean finish_reason: length & Continue)
  'openai/gpt-oss-20b': 8192,
  'openai/gpt-oss-120b': 8192,
  'allam-2-7b': 4096,
  'gemini-3.5-flash': 8192,
  'gemini-3.8-flash': 8192,
  'gemini-flash-latest': 8192,
  'gemini-3.7-flash': 8192,
  'meta-llama/llama-3.3-70b-instruct': 8192,
  'deepseek/deepseek-r1': 8192,
  'epic-think-qwen2.5-7b': 4096
};

export class GenerationConfig {
  /**
   * Resolve appropriate max output tokens based on preset, requested limit, and target model
   */
  static resolveMaxOutputTokens({ preset = 'Epic Think 4o', requestedTokens = null, model = null }) {
    if (requestedTokens && typeof requestedTokens === 'number' && requestedTokens > 0) {
      const ceiling = model && MODEL_TOKEN_CEILINGS[model] ? MODEL_TOKEN_CEILINGS[model] : 8192;
      return Math.min(requestedTokens, ceiling);
    }

    const key = (preset || '').toLowerCase().trim();
    let budget = PRESET_OUTPUT_LIMITS[key] || PRESET_OUTPUT_LIMITS['default'];

    if (model && MODEL_TOKEN_CEILINGS[model]) {
      budget = Math.min(budget, MODEL_TOKEN_CEILINGS[model]);
    }

    return budget;
  }

  /**
   * Build provider-specific generation payload options
   */
  static getProviderOptions({ providerId, model, maxTokens, temperature = 0.7 }) {
    const effectiveTokens = this.resolveMaxOutputTokens({ requestedTokens: maxTokens, model });

    if (providerId === 'gemini') {
      return {
        temperature,
        maxOutputTokens: effectiveTokens
      };
    }

    // OpenAI-compatible providers: Groq, OpenRouter, Local
    return {
      temperature,
      max_tokens: effectiveTokens
    };
  }

  /**
   * Normalize provider-specific finish reason codes to standardized domain values:
   * 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'error'
   */
  static normalizeFinishReason(raw) {
    if (!raw) return 'stop';
    const s = String(raw).toLowerCase().trim();

    if (s === 'stop' || s === 'eos' || s === 'end_turn' || s === 'completed') {
      return 'stop';
    }
    if (s === 'length' || s === 'max_tokens' || s === 'token_limit') {
      return 'length';
    }
    if (s === 'tool_calls' || s === 'function_call' || s === 'tool_use') {
      return 'tool_calls';
    }
    if (s === 'content_filter' || s === 'safety' || s === 'recitation' || s === 'blocked') {
      return 'content_filter';
    }
    if (s === 'error' || s === 'timeout' || s === 'cancelled') {
      return 'error';
    }

    return 'stop';
  }

  /**
   * Generate continuation instruction to cleanly resume a truncated response
   */
  static buildContinuationMessages({ userPrompt, partialResponse, history = [] }) {
    const tailSnippet = (partialResponse || '').trim().slice(-300);

    const continuationSystemPrompt = 
      `You are Epic Think AI continuing a response that was paused due to reaching an output token limit. ` +
      `Your task is to continue the response seamlessly from the exact word where it stopped. ` +
      `CRITICAL RULES:\n` +
      `1. DO NOT restart the response or greet the user.\n` +
      `2. DO NOT repeat or echo any words from the previous text.\n` +
      `3. DO NOT apologize or state "Continuing where I left off".\n` +
      `4. Directly produce the remaining text so that appending your output to the previous text forms a single, coherent, complete response.`;

    const messages = [];

    // Include existing conversation history if provided
    if (Array.isArray(history) && history.length > 0) {
      messages.push(...history.slice(-6));
    }

    // Anchor with the user prompt and the tail of the partial response
    messages.push({
      role: 'user',
      content: userPrompt
    });

    messages.push({
      role: 'assistant',
      content: partialResponse
    });

    messages.push({
      role: 'user',
      content: `[SYSTEM: Continue generating the answer above starting from the exact next word after: "${tailSnippet}". Do not repeat anything.]`
    });

    return {
      systemPrompt: continuationSystemPrompt,
      messages
    };
  }
}
