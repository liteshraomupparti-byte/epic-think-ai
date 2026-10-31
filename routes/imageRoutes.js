/**
 * Epic Think AI - Dedicated Image Generation & Editing API Routes
 * 
 * Endpoints:
 * - POST /api/image/generate (Secure image generation with Pollinations & Gemini, deduplication, budget control)
 * - GET  /api/image/capabilities (Supported models, modes, resolutions, aspect ratios)
 * - GET  /api/image/models (Alias for capabilities)
 * - GET  /api/image/usage (Current monthly and daily spending against ₹500–₹1,500 budget)
 */

import express from 'express';
import { requireAuth } from '../services/firebaseAuthService.js';
import { ImageStudioService } from '../services/imageGeneration/ImageStudioService.js';
import { ImageModelRouter } from '../services/imageGeneration/ImageModelRouter.js';
import { UsageMeter } from '../services/media/UsageMeter.js';
import { QuotaTrackingService } from '../services/usage/QuotaTrackingService.js';

const router = express.Router();

// Memory-based sliding rate limiter (Max 15 generations per 60 seconds per user/IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 15;

const checkRateLimit = (key) => {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + RATE_LIMIT_WINDOW;
    rateLimitMap.set(key, entry);
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetInSeconds: Math.ceil((entry.resetTime - now) / 1000) };
  }

  entry.count++;
  rateLimitMap.set(key, entry);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - entry.count };
};

// Periodic cleanup of stale rate limits
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);
if (cleanupTimer.unref) cleanupTimer.unref();

// Authentication helper: verifies Firebase token if present, assigns safe guest ID if not
const authenticateOrGuest = async (req, res, next) => {
  if (req.headers.authorization) {
    return requireAuth(req, res, next);
  }
  req.user = { uid: 'guest_user', email: 'guest@epicthink.ai' };
  next();
};

/**
 * GET /api/image/capabilities
 */
router.get(['/capabilities', '/models'], async (req, res) => {
  try {
    const meta = await ImageStudioService.getStudioMetadata();
    const routerCaps = ImageModelRouter.getCapabilities();
    const usage = UsageMeter.getUsageSummary(req.user?.uid);
    res.json({
      success: true,
      ...meta,
      routerCapabilities: routerCaps,
      usage
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/image/usage
 */
router.get('/usage', authenticateOrGuest, (req, res) => {
  const summary = UsageMeter.getUsageSummary(req.user?.uid);
  res.json({
    success: true,
    ...summary
  });
});

/**
 * GET /api/image/quota-status
 */
router.get('/quota-status', async (req, res) => {
  const { GeminiImageProvider } = await import('../services/imageGeneration/GeminiImageProvider.js');
  res.json({ success: true, ...GeminiImageProvider.getQuotaStatus() });
});

/**
 * POST /api/image/quota-reset
 */
router.post('/quota-reset', async (req, res) => {
  const { GeminiImageProvider } = await import('../services/imageGeneration/GeminiImageProvider.js');
  GeminiImageProvider.resetCircuit();
  res.json({ success: true, message: 'Gemini quota circuit breaker reset.', ...GeminiImageProvider.getQuotaStatus() });
});

/**
 * POST /api/image/generate
 */
router.post('/generate', authenticateOrGuest, QuotaTrackingService.createMiddleware({ type: 'image', estimatedCostInr: 0 }), async (req, res) => {
  // 1. Rate Limiting Check
  const verifiedUid = req.user?.uid || 'guest_user';
  const rateLimitKey = verifiedUid !== 'guest_user' ? verifiedUid : (req.ip || 'global');
  const rateCheck = checkRateLimit(rateLimitKey);

  if (!rateCheck.allowed) {
    return res.status(429).json({
      success: false,
      error: `Rate limit reached. Please wait ${rateCheck.resetInSeconds} seconds before generating more images.`,
      errorCode: 'RATE_LIMIT_EXCEEDED'
    });
  }

  // 2. Extract and Validate Input
  const {
    prompt,
    mode = 'AUTO',
    model = 'AUTO',
    quality = 'HIGH',
    resolution = '1K',
    aspectRatio = '1:1',
    style = 'photorealistic',
    enhance = true,
    referenceImages = [],
    seed,
    forceLiveCheck = false
  } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      error: 'A prompt is required for image generation.',
      errorCode: 'INVALID_PROMPT'
    });
  }

  // 3. Duplicate Request Protection (Deduplication Lock)
  const fingerprint = UsageMeter.getRequestFingerprint(verifiedUid, 'image', prompt, {
    mode,
    model,
    resolution,
    aspectRatio
  });

  const acquired = UsageMeter.acquireLock(fingerprint, 20000);
  if (!acquired) {
    return res.status(429).json({
      success: false,
      error: 'A generation request with identical parameters is already in progress. Please wait for it to complete.',
      errorCode: 'DUPLICATE_REQUEST_PENDING'
    });
  }

  try {
    const result = await ImageStudioService.generateImage({
      prompt: prompt.trim(),
      mode,
      model,
      quality,
      resolution,
      aspectRatio,
      style,
      enhance: enhance !== false,
      referenceImages,
      seed,
      forceLiveCheck: Boolean(forceLiveCheck),
      firebaseUid: verifiedUid
    });

    if (!result.success) {
      return res.status(502).json({
        success: false,
        error: result.error || 'Image generation failed.',
        errorCode: result.errorCode,
        requestId: result.requestId,
        primaryProvider: result.primaryProvider,
        primaryFailed: result.primaryFailed,
        primaryError: result.primaryError,
        fallbackUsed: result.fallbackUsed,
        fallbackError: result.fallbackError
      });
    }

    res.json({
      success: true,
      imageUrl: result.imageUrl,
      directCdnUrl: result.directCdnUrl,
      provider: result.provider,
      model: result.model,
      modelTitle: result.modelTitle,
      enhancementModel: result.enhancementModel,
      generationProvider: result.generationProvider,
      generationModel: result.generationModel,
      requestedModel: result.requestedModel,
      actualModelUsed: result.actualModelUsed,
      primaryProvider: result.primaryProvider,
      primaryFailed: result.primaryFailed,
      primaryError: result.primaryError,
      primaryErrorCode: result.primaryErrorCode,
      fallbackUsed: result.fallbackUsed,
      fallbackNote: result.fallbackNote,
      requestedResolution: result.requestedResolution,
      actualResolution: result.actualResolution,
      width: result.width,
      height: result.height,
      is4K: result.is4K,
      is2K: result.is2K,
      aspectRatio: result.aspectRatio,
      originalPrompt: result.originalPrompt,
      enhancedPrompt: result.enhancedPrompt,
      dimensionsReasoned: result.dimensionsReasoned,
      durationMs: result.durationMs,
      watermarked: result.watermarked,
      watermarkNote: result.watermarkNote,
      isEditing: result.isEditing,
      requestId: result.requestId
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      errorCode: err.code || 'INTERNAL_ERROR'
    });
  } finally {
    UsageMeter.releaseLock(fingerprint);
  }
});

export default router;
