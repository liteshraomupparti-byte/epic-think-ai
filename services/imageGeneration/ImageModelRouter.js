/**
 * Epic Think AI - Intelligent Image Model Router & Provider Dispatcher
 * 
 * Target Architecture:
 * - Routing Modes: AUTO, LOW_COST, HIGH_QUALITY, MANUAL
 * - Providers: PollinationsImageProvider & GeminiImageProvider
 * - Aspect Ratios: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9
 * - Dispatches based on model capabilities, active API keys, and reference image editing
 */

import { GeminiImageProvider } from './GeminiImageProvider.js';
import { PollinationsImageProvider } from './PollinationsImageProvider.js';

export const IMAGE_MODES = {
  AUTO: 'AUTO',
  LOW_COST: 'LOW_COST',
  HIGH_QUALITY: 'HIGH_QUALITY',
  MANUAL: 'MANUAL',
  FAST: 'FAST',
  FALLBACK: 'FALLBACK'
};

export const RESOLUTION_TIERS = {
  RES_1K: '1K',
  RES_2K: '2K',
  RES_4K: '4K'
};

export const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'];

export class ImageModelRouter {
  static geminiProvider = new GeminiImageProvider();
  static pollinationsProvider = new PollinationsImageProvider();

  /**
   * Determine exact pixel dimensions based on aspect ratio and resolution
   */
  static calculatePixelDimensions(aspectRatio = '1:1', resolution = '1K') {
    const res = (resolution || '1K').toUpperCase().trim();
    const ratio = aspectRatio || '1:1';

    const PIXEL_MAP = {
      '1:1': {
        '1K': { width: 1024, height: 1024 },
        '2K': { width: 2048, height: 2048 },
        '4K': { width: 3840, height: 3840 }
      },
      '16:9': {
        '1K': { width: 1280, height: 720 },
        '2K': { width: 2560, height: 1440 },
        '4K': { width: 3840, height: 2160 }
      },
      '9:16': {
        '1K': { width: 720, height: 1280 },
        '2K': { width: 1440, height: 2560 },
        '4K': { width: 2160, height: 3840 }
      },
      '4:3': {
        '1K': { width: 1024, height: 768 },
        '2K': { width: 2048, height: 1536 },
        '4K': { width: 3840, height: 2880 }
      },
      '3:4': {
        '1K': { width: 768, height: 1024 },
        '2K': { width: 1536, height: 2048 },
        '4K': { width: 2880, height: 3840 }
      },
      '21:9': {
        '1K': { width: 1680, height: 720 },
        '2K': { width: 2560, height: 1088 },
        '4K': { width: 3840, height: 1648 }
      }
    };

    const ratioEntry = PIXEL_MAP[ratio] || PIXEL_MAP['1:1'];
    return ratioEntry[res] || ratioEntry['1K'];
  }

  /**
   * Route request to primary and fallback providers
   * @param {Object} options
   * @returns {Object} Routing decision
   */
  /**
   * Route request to primary and fallback providers
   * @param {Object} options
   * @returns {Object} Routing decision
   */
  static route({
    mode = 'AUTO',
    model = 'AUTO',
    quality = 'HIGH',
    resolution = '1K',
    aspectRatio = '1:1',
    referenceImages = [],
    forceLiveCheck = false
  }) {
    const hasGeminiKey = GeminiImageProvider.hasApiKey();
    const hasPollinationsKey = PollinationsImageProvider.hasApiKey();
    const hasReferenceImages = Array.isArray(referenceImages) && referenceImages.length > 0;
    const geminiQuotaStatus = GeminiImageProvider.getQuotaStatus();
    const isGeminiQuotaExhausted = geminiQuotaStatus.circuitOpen;

    let selectedMode = (mode || 'AUTO').toUpperCase().trim();
    const requestedModelUpper = (model || '').toUpperCase().trim();

    // Map legacy aliases
    if (requestedModelUpper === 'GEMINI_HIGH_QUALITY' || requestedModelUpper.includes('GEMINI-3-PRO')) {
      selectedMode = IMAGE_MODES.HIGH_QUALITY;
    } else if (requestedModelUpper === 'GEMINI_FAST' || requestedModelUpper.includes('FLASH')) {
      selectedMode = IMAGE_MODES.FAST;
    } else if (requestedModelUpper === 'POLLINATIONS_FALLBACK' || requestedModelUpper.includes('FLUX')) {
      selectedMode = IMAGE_MODES.LOW_COST;
    }

    // Normalize resolution and aspect ratio
    let normRes = (resolution || '1K').toUpperCase().trim();
    if (normRes === 'ULTRA') normRes = '4K';
    if (normRes === 'HIGH' || normRes === '2K') normRes = '2K';
    if (!['1K', '2K', '4K'].includes(normRes)) normRes = '1K';
    const normRatio = ASPECT_RATIOS.includes(aspectRatio) ? aspectRatio : '1:1';

    let primaryProvider;
    let primaryModelId;
    let fallbackProvider = null;
    let fallbackModelId = null;
    let quotaBypassed = false;
    let fastFallbackReason = null;

    if (selectedMode === IMAGE_MODES.LOW_COST || selectedMode === IMAGE_MODES.FALLBACK) {
      // LOW_COST: Lowest-cost verified option (Pollinations FLUX Schnell = ₹0.00)
      primaryProvider = this.pollinationsProvider;
      primaryModelId = 'flux';
      fallbackProvider = this.pollinationsProvider;
      fallbackModelId = 'turbo';
    } else if (selectedMode === IMAGE_MODES.HIGH_QUALITY) {
      // HIGH_QUALITY:
      if (hasGeminiKey) {
        primaryProvider = this.geminiProvider;
        primaryModelId = GeminiImageProvider.DEFAULT_HIGH_QUALITY_MODEL;
        fallbackProvider = this.pollinationsProvider;
        fallbackModelId = hasPollinationsKey ? 'black-forest-labs/flux.2-pro' : 'flux';
        quotaBypassed = forceLiveCheck;
      } else {
        primaryProvider = this.pollinationsProvider;
        primaryModelId = hasPollinationsKey ? 'black-forest-labs/flux.2-pro' : 'flux';
      }
    } else if (selectedMode === IMAGE_MODES.MANUAL) {
      // MANUAL: Use selected model directly
      if (requestedModelUpper.includes('GEMINI')) {
        primaryProvider = this.geminiProvider;
        primaryModelId = model;
        fallbackProvider = this.pollinationsProvider;
        fallbackModelId = 'flux';
        quotaBypassed = forceLiveCheck;
      } else {
        primaryProvider = this.pollinationsProvider;
        primaryModelId = model || 'flux';
      }
    } else if (selectedMode === IMAGE_MODES.FAST) {
      primaryProvider = this.pollinationsProvider;
      primaryModelId = 'turbo';
      fallbackProvider = this.pollinationsProvider;
      fallbackModelId = 'flux';
    } else {
      // AUTO mode:
      if (hasReferenceImages && hasGeminiKey && (!isGeminiQuotaExhausted || forceLiveCheck)) {
        primaryProvider = this.geminiProvider;
        primaryModelId = GeminiImageProvider.DEFAULT_FAST_MODEL;
        fallbackProvider = this.pollinationsProvider;
        fallbackModelId = 'flux';
      } else if (hasGeminiKey && !isGeminiQuotaExhausted) {
        // Gemini has key and active quota
        primaryProvider = this.geminiProvider;
        primaryModelId = GeminiImageProvider.DEFAULT_HIGH_QUALITY_MODEL;
        fallbackProvider = this.pollinationsProvider;
        fallbackModelId = 'flux';
      } else {
        // Fast, reliable zero-cost generation via Pollinations Flux
        // If Gemini quota is exhausted, note fast circuit break routing
        primaryProvider = this.pollinationsProvider;
        primaryModelId = 'flux';
        if (hasGeminiKey) {
          fallbackProvider = this.geminiProvider;
          fallbackModelId = GeminiImageProvider.DEFAULT_FAST_MODEL;
          if (isGeminiQuotaExhausted) {
            fastFallbackReason = 'GEMINI_FREE_TIER_QUOTA_ZERO';
          }
        }
      }
    }

    const pixelDims = this.calculatePixelDimensions(normRatio, normRes);

    return {
      mode: selectedMode,
      primaryProvider,
      primaryModelId,
      fallbackProvider,
      fallbackModelId,
      resolution: normRes,
      aspectRatio: normRatio,
      pixelDimensions: pixelDims,
      geminiQuotaExhausted: isGeminiQuotaExhausted,
      fastFallbackReason,
      forceLiveCheck: quotaBypassed || forceLiveCheck
    };
  }

  /**
   * Get supported capabilities across all image providers
   */
  static getCapabilities() {
    return {
      providers: [
        this.pollinationsProvider.getCapabilities(),
        this.geminiProvider.getCapabilities()
      ],
      modes: [
        { id: IMAGE_MODES.AUTO, name: 'Auto (Recommended)', description: 'Chooses the most reliable, cost-effective model.' },
        { id: IMAGE_MODES.LOW_COST, name: 'Low Cost (Free Tier)', description: 'FLUX.1 Schnell with zero token costs.' },
        { id: IMAGE_MODES.HIGH_QUALITY, name: 'High Quality', description: 'Highest fidelity generation within spending limits.' },
        { id: IMAGE_MODES.MANUAL, name: 'Manual Selection', description: 'Explicit model selection.' }
      ],
      aspectRatios: ASPECT_RATIOS,
      resolutions: ['1K', '2K', '4K']
    };
  }
}
