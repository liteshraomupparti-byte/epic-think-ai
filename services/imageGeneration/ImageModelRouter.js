/**
 * Epic Think AI - Intelligent Image Model Router & Provider Dispatcher
 * 
 * Target Architecture:
 * - Provider Abstraction: GeminiImageProvider (Primary) & PollinationsImageProvider (Fallback)
 * - Modes: AUTO, HIGH_QUALITY, FAST, FALLBACK
 * - Resolutions: 1K, 2K, 4K
 * - Aspect Ratios: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9
 * - Dispatches based on model capabilities, active API keys, and reference image editing
 */

import { GeminiImageProvider } from './GeminiImageProvider.js';
import { PollinationsImageProvider } from './PollinationsImageProvider.js';

export const IMAGE_MODES = {
  AUTO: 'AUTO',
  HIGH_QUALITY: 'HIGH_QUALITY',
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
   * Determine exact pixel dimensions for fallback and rendering based on ratio and resolution
   * @param {string} aspectRatio
   * @param {string} resolution
   * @returns {{ width: number, height: number }}
   */
  static calculatePixelDimensions(aspectRatio = '1:1', resolution = '1K') {
    const res = (resolution || '1K').toUpperCase().trim();
    const ratio = aspectRatio || '1:1';

    // Baseline dimension table (16-pixel aligned)
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
  static route({
    mode = 'AUTO',
    model = 'AUTO',
    quality = 'HIGH',
    resolution = '1K',
    aspectRatio = '1:1',
    referenceImages = []
  }) {
    const hasGeminiKey = GeminiImageProvider.hasApiKey();
    const hasReferenceImages = Array.isArray(referenceImages) && referenceImages.length > 0;

    let selectedMode = (mode || 'AUTO').toUpperCase().trim();
    const requestedModelUpper = (model || '').toUpperCase().trim();

    // Map model selector values to canonical modes
    if (requestedModelUpper === 'GEMINI_HIGH_QUALITY' || requestedModelUpper === 'GEMINI 3 PRO' || requestedModelUpper.includes('GEMINI-3-PRO')) {
      selectedMode = IMAGE_MODES.HIGH_QUALITY;
    } else if (requestedModelUpper === 'GEMINI_FAST' || requestedModelUpper.includes('FLASH')) {
      selectedMode = IMAGE_MODES.FAST;
    } else if (requestedModelUpper === 'POLLINATIONS_FALLBACK' || requestedModelUpper.includes('POLLINATIONS') || requestedModelUpper.includes('FLUX')) {
      selectedMode = IMAGE_MODES.FALLBACK;
    }

    // Normalize resolution
    let normRes = (resolution || '1K').toUpperCase().trim();
    if (normRes === 'ULTRA') normRes = '4K';
    if (normRes === 'HIGH' || normRes === '2K') normRes = '2K';
    if (normRes === 'STANDARD' || normRes === '1K') normRes = '1K';
    if (!['1K', '2K', '4K'].includes(normRes)) normRes = '1K';

    // Normalize aspect ratio
    const normRatio = ASPECT_RATIOS.includes(aspectRatio) ? aspectRatio : '1:1';

    let primaryProvider;
    let primaryModelId;
    let fallbackProvider = null;
    let fallbackModelId = null;

    if (selectedMode === IMAGE_MODES.FALLBACK) {
      // Explicit Pollinations
      primaryProvider = this.pollinationsProvider;
      primaryModelId = (requestedModelUpper.includes('FLUX_2_MAX') || requestedModelUpper.includes('MAX')) 
        ? 'black-forest-labs/flux.2-max' 
        : ((requestedModelUpper.includes('FLUX_2_PRO') || requestedModelUpper.includes('PRO')) 
          ? 'black-forest-labs/flux.2-pro' 
          : 'flux');
    } else if (selectedMode === IMAGE_MODES.FAST) {
      primaryProvider = this.geminiProvider;
      primaryModelId = GeminiImageProvider.DEFAULT_FAST_MODEL;
      fallbackProvider = this.pollinationsProvider;
      fallbackModelId = 'flux';
    } else if (selectedMode === IMAGE_MODES.HIGH_QUALITY) {
      primaryProvider = this.geminiProvider;
      primaryModelId = GeminiImageProvider.DEFAULT_HIGH_QUALITY_MODEL;
      fallbackProvider = this.pollinationsProvider;
      fallbackModelId = 'black-forest-labs/flux.2-pro';
    } else {
      // AUTO mode: Prioritize Google Gemini if API key is present or if editing with reference images
      if (hasGeminiKey || hasReferenceImages) {
        primaryProvider = this.geminiProvider;
        primaryModelId = GeminiImageProvider.DEFAULT_HIGH_QUALITY_MODEL;
        fallbackProvider = this.pollinationsProvider;
        fallbackModelId = 'flux';
      } else {
        primaryProvider = this.pollinationsProvider;
        primaryModelId = 'flux';
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
      hasGeminiKey,
      supportsEditing: primaryProvider === this.geminiProvider
    };
  }

  /**
   * Get dynamic capabilities and option constraints for frontend UI
   */
  static getCapabilities() {
    const hasGeminiKey = GeminiImageProvider.hasApiKey();

    return {
      modes: [
        { id: 'AUTO', name: 'Auto (Best Configured Model)', recommended: true },
        { id: 'HIGH_QUALITY', name: 'Gemini 3 Pro Image (Nano Banana Pro)', disabled: !hasGeminiKey && false },
        { id: 'FAST', name: 'Gemini 3.1 Flash Image', disabled: !hasGeminiKey && false },
        { id: 'FALLBACK', name: 'Pollinations Fallback (FLUX Tier)', disabled: false }
      ],
      resolutions: [
        { id: '1K', label: '1K Standard (1024px)' },
        { id: '2K', label: '2K Quad HD (1440p / 2048px)' },
        { id: '4K', label: '4K Ultra HD (3840px)' }
      ],
      aspectRatios: [
        { id: '1:1', label: '1:1 Square' },
        { id: '16:9', label: '16:9 Landscape' },
        { id: '9:16', label: '9:16 Vertical Reel' },
        { id: '4:3', label: '4:3 Classic' },
        { id: '3:4', label: '3:4 Portrait' },
        { id: '21:9', label: '21:9 Ultrawide Cinematic' }
      ],
      hasGeminiKey,
      primaryModel: GeminiImageProvider.DEFAULT_HIGH_QUALITY_MODEL,
      fastModel: GeminiImageProvider.DEFAULT_FAST_MODEL
    };
  }
}
