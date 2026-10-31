/**
 * Epic Think AI - Google Gemini Image Generation & Editing Provider
 * 
 * Target High-Quality Models:
 * - Gemini 3 Pro Image / Nano Banana Pro: `gemini-3-pro-image-preview` (Default Primary)
 * - Gemini Fast Image: `gemini-3.1-flash-image` (Fast Tier)
 * 
 * Features:
 * - Native 1K, 2K, and 4K image generation
 * - Native aspect ratio controls: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9
 * - Native image editing via multimodal reference inputs
 * - Binary header inspection for truthful dimension verification
 * - Strict backend-only secret isolation (GEMINI_API_KEY never leaks)
 */

import { ImageProvider } from './ImageProvider.js';
import { getImageDimensions } from './imageUtils.js';

const quotaCircuitState = {
  circuitOpen: false,
  limitZero: false,
  resetTime: 0,
  reason: null,
  lastError: null,
  lastChecked: 0
};

export class GeminiImageProvider extends ImageProvider {
  static get DEFAULT_HIGH_QUALITY_MODEL() {
    return process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';
  }

  static get DEFAULT_FAST_MODEL() {
    return process.env.GEMINI_FAST_IMAGE_MODEL || 'gemini-3.1-flash-image';
  }

  constructor() {
    super('Google Gemini', 'gemini');
  }

  /**
   * Safe check for server-side API key presence without leaking it
   * @returns {boolean}
   */
  static hasApiKey() {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  }

  /**
   * Return current quota circuit breaker status
   */
  static getQuotaStatus() {
    const now = Date.now();
    const isOpen = quotaCircuitState.circuitOpen && now < quotaCircuitState.resetTime;
    return {
      hasKey: GeminiImageProvider.hasApiKey(),
      circuitOpen: isOpen,
      limitZero: quotaCircuitState.limitZero,
      resetTime: quotaCircuitState.resetTime,
      remainingSeconds: Math.max(0, Math.ceil((quotaCircuitState.resetTime - now) / 1000)),
      reason: quotaCircuitState.reason,
      lastError: quotaCircuitState.lastError,
      lastChecked: quotaCircuitState.lastChecked
    };
  }

  /**
   * Check if Gemini image quota is currently exhausted
   */
  static isQuotaExhausted() {
    const status = GeminiImageProvider.getQuotaStatus();
    return status.circuitOpen;
  }

  /**
   * Manually reset the circuit breaker (e.g. after adding billing or changing keys)
   */
  static resetCircuit() {
    quotaCircuitState.circuitOpen = false;
    quotaCircuitState.limitZero = false;
    quotaCircuitState.resetTime = 0;
    quotaCircuitState.reason = null;
    quotaCircuitState.lastError = null;
    quotaCircuitState.lastChecked = Date.now();
  }

  /**
   * Returns provider capabilities
   */
  getCapabilities() {
    const quotaStatus = GeminiImageProvider.getQuotaStatus();
    return {
      provider: this.name,
      id: this.id,
      hasApiKey: GeminiImageProvider.hasApiKey(),
      quotaStatus,
      models: [
        {
          id: GeminiImageProvider.DEFAULT_HIGH_QUALITY_MODEL,
          alias: 'GEMINI_HIGH_QUALITY',
          name: 'Gemini 3 Pro Image (Nano Banana Pro)',
          tier: 'HIGH_QUALITY',
          supports4K: true,
          supportsEditing: true,
          supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'],
          supportedResolutions: ['1K', '2K', '4K']
        },
        {
          id: GeminiImageProvider.DEFAULT_FAST_MODEL,
          alias: 'GEMINI_FAST',
          name: 'Gemini 3.1 Flash Image',
          tier: 'FAST',
          supports4K: true,
          supportsEditing: true,
          supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'],
          supportedResolutions: ['512', '1K', '2K', '4K']
        }
      ],
      supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'],
      supportedResolutions: ['1K', '2K', '4K'],
      supportsEditing: true,
      watermarked: false
    };
  }

  /**
   * Format reference images for Gemini input
   * @param {Array|string} referenceImages
   * @returns {Array<Object>}
   */
  _formatReferenceInputs(referenceImages) {
    const list = Array.isArray(referenceImages) ? referenceImages : (referenceImages ? [referenceImages] : []);
    const formatted = [];

    for (const item of list) {
      if (!item) continue;

      if (typeof item === 'string') {
        const match = item.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (match) {
          formatted.push({
            type: 'image',
            data: match[2],
            mime_type: match[1]
          });
        } else if (item.startsWith('http://') || item.startsWith('https://')) {
          formatted.push({
            type: 'image',
            uri: item
          });
        } else {
          formatted.push({
            type: 'image',
            data: item,
            mime_type: 'image/jpeg'
          });
        }
      } else if (item.data && item.mimeType) {
        formatted.push({
          type: 'image',
          data: item.data.replace(/^data:[^;]+;base64,/, ''),
          mime_type: item.mimeType
        });
      }
    }

    return formatted;
  }

  /**
   * Map resolution string to valid Gemini image_size enum ('1K', '2K', '4K')
   * @param {string} resolution
   * @returns {string}
   */
  _normalizeResolution(resolution = '1K') {
    const upper = (resolution || '1K').toString().toUpperCase().trim();
    if (upper === '4K' || upper === 'ULTRA') return '4K';
    if (upper === '2K' || upper === 'HIGH') return '2K';
    if (upper === '512' || upper === '0.5K') return '512';
    return '1K';
  }

  /**
   * Normalize aspect ratio
   * @param {string} ratio
   * @returns {string}
   */
  _normalizeAspectRatio(ratio = '1:1') {
    const valid = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '2:3', '3:2', '4:5', '5:4'];
    const r = (ratio || '1:1').trim();
    return valid.includes(r) ? r : '1:1';
  }

  /**
   * Generate image via Google Gemini API with error-aware circuit breaker and bounded backoff
   * @param {Object} params
   */
  async generateImage(params) {
    const startTime = Date.now();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      const err = new Error('GEMINI_API_KEY is not configured in the server environment.');
      err.code = 'MISSING_API_KEY';
      err.canFallback = true;
      throw err;
    }

    const {
      prompt,
      model = GeminiImageProvider.DEFAULT_HIGH_QUALITY_MODEL,
      resolution = '1K',
      aspectRatio = '1:1',
      referenceImages = [],
      forceLiveCheck = false
    } = params;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      const err = new Error('Visual prompt is required for image generation.');
      err.code = 'INVALID_PROMPT';
      err.canFallback = false;
      throw err;
    }

    // Error-Aware Circuit Breaker check: avoid futile repeated retries when quota is known zero
    if (!forceLiveCheck && GeminiImageProvider.isQuotaExhausted()) {
      const status = GeminiImageProvider.getQuotaStatus();
      const err = new Error(status.reason || 'Gemini image generation quota is exhausted (limit: 0 requests/day on Free Tier). Upgrade to Pay-As-You-Go in Google AI Studio.');
      err.code = 'QUOTA_EXCEEDED';
      err.status = 429;
      err.canFallback = true;
      err.limitZero = status.limitZero;
      err.circuitOpen = true;
      throw err;
    }

    // Determine target model
    let targetModel = model;
    if (targetModel === 'AUTO' || targetModel === 'GEMINI_HIGH_QUALITY' || !targetModel) {
      targetModel = GeminiImageProvider.DEFAULT_HIGH_QUALITY_MODEL;
    } else if (targetModel === 'GEMINI_FAST') {
      targetModel = GeminiImageProvider.DEFAULT_FAST_MODEL;
    }

    const normRes = this._normalizeResolution(resolution);
    const normRatio = this._normalizeAspectRatio(aspectRatio);
    const referenceInputs = this._formatReferenceInputs(referenceImages);

    const inputList = [
      ...referenceInputs,
      {
        type: 'text',
        text: prompt.trim()
      }
    ];

    const requestBody = {
      model: targetModel,
      input: inputList,
      response_format: {
        type: 'image',
        mime_type: 'image/jpeg',
        aspect_ratio: normRatio,
        image_size: normRes
      }
    };

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/interactions';

    // Bounded execution with 1 backoff retry for transient network / 5xx errors
    let res;
    let lastNetworkErr = null;
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      try {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        clearTimeout(timeout);

        // If 5xx error and we have an attempt remaining, apply bounded backoff (1.5s)
        if (res.status >= 500 && attempt < maxAttempts) {
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }

        break;
      } catch (fetchErr) {
        clearTimeout(timeout);
        lastNetworkErr = fetchErr;
        if (attempt < maxAttempts) {
          await new Promise(r => setTimeout(r, 1200));
          continue;
        }
      }
    }

    if (!res && lastNetworkErr) {
      const isTimeout = lastNetworkErr.name === 'AbortError';
      const err = new Error(isTimeout ? 'Gemini image generation timed out after 45s.' : `Gemini network error: ${lastNetworkErr.message}`);
      err.code = isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR';
      err.canFallback = true;
      throw err;
    }

    const durationMs = Date.now() - startTime;

    if (!res.ok) {
      let errorData = {};
      try {
        errorData = await res.json();
      } catch (_) {}

      const rawMsg = errorData.error?.message || `HTTP ${res.status} ${res.statusText}`;
      let structuredCode = 'PROVIDER_ERROR';
      let cleanMessage = rawMsg;

      if (res.status === 429) {
        structuredCode = 'QUOTA_EXCEEDED';
        const isLimitZero = rawMsg.includes('Free Tier') || rawMsg.includes('limit: 0') || rawMsg.includes('RESOURCE_EXHAUSTED');

        if (isLimitZero) {
          cleanMessage = `Rate limit exceeded for model ${targetModel} on Free Tier (limit: 0 requests per day on Free Tier). Upgrade to Pay-As-You-Go at https://ai.dev/rate-limit for unmetered Gemini 3 Pro Image generation.`;
          quotaCircuitState.circuitOpen = true;
          quotaCircuitState.limitZero = true;
          quotaCircuitState.resetTime = Date.now() + (30 * 60 * 1000); // 30 min circuit break
          quotaCircuitState.reason = cleanMessage;
          quotaCircuitState.lastError = rawMsg;
          quotaCircuitState.lastChecked = Date.now();
        } else {
          cleanMessage = `Gemini API rate limit or quota exceeded: ${rawMsg}`;
          quotaCircuitState.circuitOpen = true;
          quotaCircuitState.limitZero = false;
          quotaCircuitState.resetTime = Date.now() + (2 * 60 * 1000); // 2 min for transient rate limits
          quotaCircuitState.reason = cleanMessage;
          quotaCircuitState.lastError = rawMsg;
          quotaCircuitState.lastChecked = Date.now();
        }
      } else if (res.status === 401 || res.status === 403) {
        structuredCode = 'INVALID_API_KEY';
        cleanMessage = 'Invalid or unauthorized GEMINI_API_KEY.';
      } else if (res.status === 404) {
        structuredCode = 'MODEL_UNAVAILABLE';
        cleanMessage = `Model ${targetModel} is currently not available on this API key or region.`;
      } else if (res.status === 400) {
        structuredCode = 'UNSUPPORTED_PARAMETER';
      }

      const err = new Error(cleanMessage);
      err.status = res.status;
      err.code = structuredCode;
      err.canFallback = true;
      err.targetModel = targetModel;
      err.limitZero = quotaCircuitState.limitZero;
      throw err;
    }

    // Success! Clear circuit breaker
    GeminiImageProvider.resetCircuit();

    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      const err = new Error('Malformed JSON received from Gemini Interactions API.');
      err.code = 'MALFORMED_RESPONSE';
      err.canFallback = true;
      throw err;
    }

    // Extract generated image
    let imageBase64 = null;
    if (data.output_image?.data) {
      imageBase64 = data.output_image.data;
    } else if (data.outputs && Array.isArray(data.outputs)) {
      for (const out of data.outputs) {
        if (out.type === 'image' && out.data) {
          imageBase64 = out.data;
          break;
        }
      }
    }

    if (!imageBase64) {
      const err = new Error('Gemini API succeeded but returned no image data in output.');
      err.code = 'NO_IMAGE_DATA';
      err.canFallback = true;
      throw err;
    }

    const buffer = Buffer.from(imageBase64, 'base64');
    const { width: actualWidth, height: actualHeight } = getImageDimensions(buffer);

    const is4K = actualWidth >= 3840 || actualHeight >= 3840;
    const is2K = actualWidth >= 2048 || actualHeight >= 2048;

    return {
      success: true,
      provider: this.name,
      model: targetModel,
      modelTitle: targetModel.includes('flash') ? 'Gemini 3.1 Flash Image' : 'Gemini 3 Pro Image (Nano Banana Pro)',
      buffer,
      dataUri: `data:image/jpeg;base64,${imageBase64}`,
      imageUrl: `data:image/jpeg;base64,${imageBase64}`,
      width: actualWidth,
      height: actualHeight,
      actualResolution: `${actualWidth}x${actualHeight}`,
      requestedResolution: normRes,
      aspectRatio: normRatio,
      format: 'jpeg',
      is4K,
      is2K,
      watermarked: false,
      durationMs
    };
  }

  /**
   * Edit an existing image
   * @param {Object} params
   */
  async editImage(params) {
    const { referenceImage, ...rest } = params;
    const referenceImages = referenceImage ? [referenceImage] : (params.referenceImages || []);
    return this.generateImage({
      ...rest,
      referenceImages
    });
  }
}
