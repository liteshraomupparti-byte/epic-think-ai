/**
 * Epic Think AI - Image Model Router & Specification Abstraction
 * 
 * Target Abstraction:
 * IMAGE_GENERATION:
 *   provider
 *   model
 *   prompt
 *   negativePrompt
 *   width
 *   height
 *   aspectRatio
 *   quality
 *   seed
 *   referenceImages
 *   outputFormat
 */

import { PollinationsCatalog } from './PollinationsCatalog.js';

export const QUALITY_TIERS = {
  STANDARD: 'STANDARD',
  HIGH: 'HIGH',
  ULTRA: 'ULTRA'
};

export const MODEL_ALIASES = {
  AUTO: 'AUTO',
  FLUX_2_PRO: 'FLUX_2_PRO',
  FLUX_2_MAX: 'FLUX_2_MAX',
  FLUX_2_FLEX: 'FLUX_2_FLEX'
};

export const MODEL_MAP = {
  FLUX_2_PRO: 'black-forest-labs/flux.2-pro',
  FLUX_2_MAX: 'black-forest-labs/flux.2-max',
  FLUX_2_FLEX: 'black-forest-labs/flux.2-flex'
};

export class ImageModelRouter {
  /**
   * Resolve dimensions adhering to aspect ratio, quality tier, and 16-pixel alignment
   * @param {string} aspectRatio
   * @param {string} quality
   * @returns {{ width: number, height: number, tier: string }}
   */
  static resolveDimensions(aspectRatio = '1:1', quality = QUALITY_TIERS.HIGH) {
    const tier = (quality || QUALITY_TIERS.HIGH).toUpperCase();
    const ratio = aspectRatio || '1:1';

    // Dimensions calibrated to exact multiples of 16 (required by Flux.2 architectures)
    const DIMENSION_MATRIX = {
      '1:1': {
        STANDARD: { width: 1024, height: 1024 }, // 1.05 MP
        HIGH:     { width: 1440, height: 1440 }, // 2.07 MP
        ULTRA:    { width: 2048, height: 2048 }  // 4.19 MP
      },
      '16:9': {
        STANDARD: { width: 1280, height: 720 },  // 720p HD
        HIGH:     { width: 1920, height: 1088 }, // 1080p FHD (1088 is 68*16)
        ULTRA:    { width: 2560, height: 1440 }  // 1440p QHD
      },
      '9:16': {
        STANDARD: { width: 720, height: 1280 },  // Vertical 720p
        HIGH:     { width: 1088, height: 1920 }, // Vertical 1080p
        ULTRA:    { width: 1440, height: 2560 }  // Vertical 1440p
      },
      '4:3': {
        STANDARD: { width: 1024, height: 768 },
        HIGH:     { width: 1440, height: 1088 },
        ULTRA:    { width: 2048, height: 1536 }
      }
    };

    const ratioMap = DIMENSION_MATRIX[ratio] || DIMENSION_MATRIX['1:1'];
    const dims = ratioMap[tier] || ratioMap.HIGH;

    return {
      width: dims.width,
      height: dims.height,
      tier
    };
  }

  /**
   * Resolve requested model into canonical model identifier
   * @param {string} requestedModel - 'AUTO' | 'FLUX_2_PRO' | 'FLUX_2_MAX' | 'FLUX_2_FLEX' | custom string
   * @param {boolean} hasApiKey - Whether an API key is available
   * @returns {Promise<{ canonicalModel: string, modelTier: string, isPaid: boolean, title: string, metadata: Object|null }>}
   */
  static async resolveModel(requestedModel = 'AUTO', hasApiKey = false) {
    const rawKey = (requestedModel || 'AUTO').toUpperCase().trim();
    let targetId = MODEL_MAP[rawKey];

    if (!targetId) {
      if (rawKey === 'AUTO') {
        // AUTO selection: picks suitable currently available high-quality model
        if (hasApiKey) {
          targetId = 'black-forest-labs/flux.2-pro';
        } else {
          // In unauthenticated mode, select the optimal available working model
          targetId = 'flux'; // Pollinations resolves this to fast high-quality flux / sana
        }
      } else {
        targetId = requestedModel;
      }
    }

    // Query live catalog metadata
    const metadata = await PollinationsCatalog.findModel(targetId);

    return {
      canonicalModel: targetId,
      modelTier: rawKey,
      isPaid: !!metadata?.paid_only,
      title: metadata?.title || targetId,
      metadata: metadata || null
    };
  }

  /**
   * Construct standard IMAGE_GENERATION payload
   */
  static async createSpecification({
    provider = 'pollinations',
    model = 'AUTO',
    prompt,
    negativePrompt = null,
    aspectRatio = '1:1',
    quality = 'HIGH',
    seed = null,
    referenceImages = [],
    outputFormat = 'jpeg',
    hasApiKey = false
  }) {
    if (!prompt) {
      throw new Error('Image generation prompt is required.');
    }

    const { width, height, tier } = this.resolveDimensions(aspectRatio, quality);
    const resolvedModel = await this.resolveModel(model, hasApiKey);
    const generatedSeed = (typeof seed === 'number' && seed >= 0) ? seed : Math.floor(Math.random() * 2147483647);

    return {
      provider,
      model: resolvedModel.canonicalModel,
      modelAlias: resolvedModel.modelTier,
      modelTitle: resolvedModel.title,
      isPaid: resolvedModel.isPaid,
      prompt,
      negativePrompt: negativePrompt || '',
      width,
      height,
      aspectRatio,
      quality: tier,
      seed: generatedSeed,
      referenceImages: Array.isArray(referenceImages) ? referenceImages : [],
      outputFormat: outputFormat || 'jpeg'
    };
  }
}
