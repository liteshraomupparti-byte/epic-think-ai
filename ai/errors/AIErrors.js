/**
 * Epic Think AI - Normalized AI Error Hierarchy
 * 
 * Ensures consistent, safe error handling across all AI providers (Groq, OpenRouter, Gemini).
 * Strips raw secrets, tokens, and internal stack details before exposing errors to the frontend.
 */

export class AIProviderError extends Error {
  constructor(message, {
    provider = 'unknown',
    model = 'unknown',
    statusCode = 500,
    isRetryable = false,
    rawError = null,
    requestId = null
  } = {}) {
    super(AIProviderError.sanitizeMessage(message));
    this.name = 'AIProviderError';
    this.provider = provider;
    this.model = model;
    this.statusCode = statusCode;
    this.isRetryable = isRetryable;
    this.requestId = requestId;
    this.timestamp = Date.now();
  }

  static sanitizeMessage(msg) {
    if (!msg || typeof msg !== 'string') return 'An unexpected AI provider error occurred.';
    return msg
      .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, '[REDACTED]')
      .replace(/gsk_[A-Za-z0-9]{30,}/g, '[REDACTED_GROQ_KEY]')
      .replace(/sk-or-v1-[A-Za-z0-9]{50,}/g, '[REDACTED_OPENROUTER_KEY]')
      .replace(/AQ\.[A-Za-z0-9\-_]{40,}/g, '[REDACTED_GEMINI_KEY]')
      .replace(/key=[A-Za-z0-9\-_.]+/gi, 'key=[REDACTED]');
  }

  toJSON() {
    return {
      error: this.message,
      type: this.name,
      provider: this.provider,
      model: this.model,
      statusCode: this.statusCode,
      isRetryable: this.isRetryable,
      requestId: this.requestId
    };
  }
}

export class AIRateLimitError extends AIProviderError {
  constructor(message = 'Rate limit exceeded for AI provider.', options = {}) {
    super(message, { ...options, statusCode: 429, isRetryable: true });
    this.name = 'AIRateLimitError';
    this.retryAfterMs = options.retryAfterMs || 5000;
  }
}

export class AITimeoutError extends AIProviderError {
  constructor(message = 'AI provider request timed out.', options = {}) {
    super(message, { ...options, statusCode: 504, isRetryable: true });
    this.name = 'AITimeoutError';
  }
}

export class AIAuthenticationError extends AIProviderError {
  constructor(message = 'Invalid or missing AI provider API key.', options = {}) {
    super(message, { ...options, statusCode: 401, isRetryable: false });
    this.name = 'AIAuthenticationError';
  }
}

export class AIModelUnavailableError extends AIProviderError {
  constructor(message = 'Requested AI model is currently unavailable.', options = {}) {
    super(message, { ...options, statusCode: 404, isRetryable: true });
    this.name = 'AIModelUnavailableError';
  }
}

export class AIToolCallError extends AIProviderError {
  constructor(message = 'Tool call execution or parameter validation failed.', options = {}) {
    super(message, { ...options, statusCode: 400, isRetryable: false });
    this.name = 'AIToolCallError';
    this.toolName = options.toolName || null;
  }
}

export class AIContextLimitError extends AIProviderError {
  constructor(message = 'Context window limit exceeded.', options = {}) {
    super(message, { ...options, statusCode: 413, isRetryable: false });
    this.name = 'AIContextLimitError';
  }
}

export class AICancellationError extends AIProviderError {
  constructor(message = 'AI generation request was cancelled by user.', options = {}) {
    super(message, { ...options, statusCode: 499, isRetryable: false });
    this.name = 'AICancellationError';
  }
}
