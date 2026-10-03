/**
 * Epic Think AI - Unified Image Generation Studio Service
 * 
 * Orchestrates target pipeline:
 * User Prompt
 * ──> Image Prompt Enhancer
 * ──> Image Model Router
 * ──> High-Quality Image Model (Pollinations with explicit model & key handling)
 * ──> Optional Image Upscaler & Resolution Verifier
 * ──> Final Image + Structured Audit Logging
 */

import crypto from 'crypto';
import { ImagePromptEnhancer } from './ImagePromptEnhancer.js';
import { ImageModelRouter, QUALITY_TIERS, MODEL_ALIASES } from './ImageModelRouter.js';
import { PollinationsImageProvider } from './PollinationsImageProvider.js';
import { ImageUpscaler } from './ImageUpscaler.js';
import { PollinationsCatalog } from './PollinationsCatalog.js';

// In-memory generated image cache for resilient preview rendering
const imageCache = new Map();

export class ImageStudioService {
  /**
   * Structured audit logger - strictly sanitized (no secrets or sensitive data logged)
   */
  static logAudit({ requestId, provider, model, resolution, duration, status, errorCode }) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId,
      provider: provider || 'unknown',
      model: model || 'unknown',
      resolution: resolution || 'unknown',
      durationMs: duration || 0,
      status: status || 'unknown',
      errorCode: errorCode || null
    };

    console.log(`[IMAGE_STUDIO_AUDIT] ${JSON.stringify(logEntry)}`);
    return logEntry;
  }

  /**
   * Main Generation Pipeline
   * @param {Object} options
   * @param {string} options.prompt - Raw user prompt
   * @param {string} [options.model='AUTO'] - 'AUTO' | 'FLUX_2_PRO' | 'FLUX_2_MAX' | 'FLUX_2_FLEX'
   * @param {string} [options.quality='HIGH'] - 'STANDARD' | 'HIGH' | 'ULTRA'
   * @param {string} [options.aspectRatio='1:1'] - '1:1' | '16:9' | '9:16' | '4:3'
   * @param {string} [options.style='photorealistic'] - Art style
   * @param {boolean} [options.enhance=true] - Whether to apply prompt enhancer
   * @param {number} [options.seed] - Seed
   * @returns {Promise<Object>} Final result
   */
  static async generateImage({
    prompt,
    model = MODEL_ALIASES.AUTO,
    quality = QUALITY_TIERS.HIGH,
    aspectRatio = '1:1',
    style = 'photorealistic',
    enhance = true,
    seed = null
  }) {
    const requestId = `img_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const startTime = Date.now();

    if (!prompt || typeof prompt !== 'string') {
      const duration = Date.now() - startTime;
      this.logAudit({
        requestId,
        provider: 'pollinations',
        model: 'none',
        resolution: 'none',
        duration,
        status: 'error',
        errorCode: 'INVALID_PROMPT'
      });
      throw new Error('Prompt is required for image generation.');
    }

    const hasApiKey = PollinationsImageProvider.hasApiKey();

    // 1. Step 1: Image Prompt Enhancer
    let enhancedPrompt = prompt.trim();
    let promptMetadata = { enhanced: false, dimensionsReasoned: [] };

    if (enhance) {
      const enhancedResult = await ImagePromptEnhancer.enhance({
        prompt,
        style,
        aspectRatio,
        targetModel: model
      });
      enhancedPrompt = enhancedResult.enhancedPrompt;
      promptMetadata = {
        enhanced: true,
        dimensionsReasoned: enhancedResult.dimensionsReasoned
      };
    }

    // 2. Step 2: Image Model Router
    const spec = await ImageModelRouter.createSpecification({
      provider: 'pollinations',
      model,
      prompt: enhancedPrompt,
      aspectRatio,
      quality,
      seed,
      hasApiKey
    });

    // 3. Step 3: High-Quality Image Model Generation
    const genResult = await PollinationsImageProvider.generate(spec);

    const totalDuration = Date.now() - startTime;

    if (!genResult.success) {
      this.logAudit({
        requestId,
        provider: 'pollinations',
        model: spec.model,
        resolution: spec.width ? `${spec.width}x${spec.height}` : 'unknown',
        duration: totalDuration,
        status: 'error',
        errorCode: genResult.errorCode || 'GENERATION_FAILED'
      });

      return {
        success: false,
        requestId,
        error: genResult.error || 'Failed to generate visual from image model provider.',
        errorCode: genResult.errorCode,
        provider: 'pollinations',
        requestedModel: spec.model,
        durationMs: totalDuration
      };
    }

    // 4. Step 4: Optional Image Upscaler & Dimension Verifier
    const upscalerResult = ImageUpscaler.process({
      width: genResult.width,
      height: genResult.height,
      requestedResolution: spec.width ? `${spec.width}x${spec.height}` : '1024x1024',
      quality
    });

    // Store in cache for reliable serving
    imageCache.set(requestId, {
      dataUri: genResult.dataUri,
      mimeType: genResult.format === 'png' ? 'image/png' : 'image/jpeg',
      timestamp: Date.now()
    });

    // Clean up cache entries older than 30 minutes
    const THIRTY_MINUTES = 30 * 60 * 1000;
    for (const [id, entry] of imageCache.entries()) {
      if (Date.now() - entry.timestamp > THIRTY_MINUTES) {
        imageCache.delete(id);
      }
    }

    // 5. Step 5: Structured Audit Logging
    this.logAudit({
      requestId,
      provider: genResult.provider,
      model: genResult.actualModelUsed || spec.model,
      resolution: upscalerResult.finalResolution,
      duration: totalDuration,
      status: 'success',
      errorCode: null
    });

    return {
      success: true,
      requestId,
      imageUrl: genResult.dataUri, // Guaranteed non-broken base64 data URI
      directCdnUrl: genResult.imageUrl,
      provider: 'pollinations',
      requestedModel: spec.model,
      actualModelUsed: genResult.actualModelUsed,
      modelTier: spec.modelAlias,
      modelTitle: spec.modelTitle,
      requestedResolution: `${spec.width}x${spec.height}`,
      actualResolution: upscalerResult.finalResolution,
      is4K: upscalerResult.is4K,
      is2K: upscalerResult.is2K,
      qualityTier: spec.quality,
      aspectRatio: spec.aspectRatio,
      originalPrompt: prompt,
      enhancedPrompt,
      dimensionsReasoned: promptMetadata.dimensionsReasoned,
      durationMs: totalDuration,
      watermarked: genResult.watermarked,
      watermarkNote: genResult.watermarkNote,
      resolutionNote: upscalerResult.notes
    };
  }

  /**
   * Retrieve cached image buffer
   */
  static getCachedImage(requestId) {
    return imageCache.get(requestId) || null;
  }

  /**
   * Get dynamic model list and current provider capabilities
   */
  static async getStudioMetadata() {
    const catalog = await PollinationsCatalog.getCatalog();
    const config = PollinationsImageProvider.getPublicConfig();

    return {
      provider: config.provider,
      watermarkPolicy: config.watermarkPolicy,
      hasApiKey: config.hasApiKey,
      supportedModels: [
        { id: 'AUTO', title: 'Auto (Optimal High-Quality Model)', model: 'AUTO' },
        { id: 'FLUX_2_PRO', title: 'FLUX.2 Pro (High Fidelity)', model: 'black-forest-labs/flux.2-pro' },
        { id: 'FLUX_2_MAX', title: 'FLUX.2 Max (Ultra Precision)', model: 'black-forest-labs/flux.2-max' },
        { id: 'FLUX_2_FLEX', title: 'FLUX.2 Flex (Speed & Versatility)', model: 'black-forest-labs/flux.2-flex' }
      ],
      qualityTiers: [
        { id: 'STANDARD', title: 'Standard (1024px)' },
        { id: 'HIGH', title: 'High Definition (1440px / 1080p)' },
        { id: 'ULTRA', title: 'Ultra High Definition (2048px / 2K)' }
      ],
      aspectRatios: ['1:1', '16:9', '9:16', '4:3']
    };
  }
}
