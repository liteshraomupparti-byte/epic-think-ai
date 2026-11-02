/**
 * Epic Think AI - Unified LLM & Tool Cost Tracker (LiteLLM Inspired)
 * 
 * Accurately tracks token counts, operation pricing, and cumulative costs in USD
 * across Groq, OpenRouter, Gemini, Pollinations, and Browser Use.
 */

export const MODEL_PRICING_TABLE = {
  // Groq Models (Price per 1M tokens)
  'qwen/qwen3.8-27b': { promptPerM: 0.20, completionPerM: 0.20, provider: 'groq' },
  'llama-3.3-70b-versatile': { promptPerM: 0.59, completionPerM: 0.79, provider: 'groq' },
  'llama-3.1-8b-instant': { promptPerM: 0.05, completionPerM: 0.08, provider: 'groq' },
  'mixtral-8x7b-32768': { promptPerM: 0.24, completionPerM: 0.24, provider: 'groq' },

  // Gemini Models (Price per 1M tokens)
  'gemini-2.5-flash': { promptPerM: 0.075, completionPerM: 0.30, provider: 'gemini' },
  'gemini-3.5-flash': { promptPerM: 0.075, completionPerM: 0.30, provider: 'gemini' },
  'gemini-2.5-pro': { promptPerM: 1.25, completionPerM: 5.00, provider: 'gemini' },

  // OpenRouter Models
  'meta-llama/llama-3.3-70b-instruct': { promptPerM: 0.40, completionPerM: 0.40, provider: 'openrouter' },
  'openai/gpt-4o': { promptPerM: 2.50, completionPerM: 10.00, provider: 'openrouter' },
  'openai/gpt-4o-mini': { promptPerM: 0.15, completionPerM: 0.60, provider: 'openrouter' },
  'anthropic/claude-3.5-sonnet': { promptPerM: 3.00, completionPerM: 15.00, provider: 'openrouter' },

  // Browser Use Cloud Agent
  'browser-use/v4': { flatRate: 0.02, maxCostUsd: 1.0, provider: 'browser_use' },
  'bu-ultrafast': { flatRate: 0.02, maxCostUsd: 1.0, provider: 'browser_use' },

  // Pollinations Image Generation
  'pollinations/flux': { flatRate: 0.0, provider: 'pollinations' },
  'gemini/imagen-3': { flatRate: 0.03, provider: 'gemini' }
};

export class CostTracker {
  /**
   * Calculate cost in USD for a completion
   */
  static calculateLlmCost({ model, promptTokens = 0, completionTokens = 0, provider = null }) {
    const key = (model || '').toLowerCase();
    const match = MODEL_PRICING_TABLE[key] || 
      Object.entries(MODEL_PRICING_TABLE).find(([k]) => key.includes(k.toLowerCase()))?.[1] ||
      { promptPerM: 0.20, completionPerM: 0.50, provider: provider || 'unknown' };

    const promptCost = (promptTokens / 1_000_000) * (match.promptPerM || 0);
    const completionCost = (completionTokens / 1_000_000) * (match.completionPerM || 0);
    const totalCost = promptCost + completionCost;

    return {
      totalCostUsd: Number(totalCost.toFixed(6)),
      promptCostUsd: Number(promptCost.toFixed(6)),
      completionCostUsd: Number(completionCost.toFixed(6)),
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      model,
      provider: match.provider || provider
    };
  }

  /**
   * Calculate cost for an image/video generation job
   */
  static calculateMediaCost({ provider, model, count = 1 }) {
    let costPerUnit = 0;
    if (provider === 'gemini') costPerUnit = 0.03;
    else if (provider === 'pollinations') costPerUnit = 0.0;
    else if (provider === 'comfyui') costPerUnit = 0.005;

    const total = costPerUnit * count;
    return {
      totalCostUsd: Number(total.toFixed(4)),
      provider,
      model,
      count
    };
  }

  /**
   * Calculate cost for a browser run
   */
  static calculateBrowserCost({ costUsd = 0, durationSeconds = 0 }) {
    // Browser Use is capped at $1 per run
    const actualCost = Math.min(costUsd > 0 ? costUsd : (durationSeconds / 3600) * 0.02, 1.0);
    return {
      totalCostUsd: Number(actualCost.toFixed(4)),
      provider: 'browser_use'
    };
  }
}
