/**
 * Epic Think AI - Dedicated Image Generation & Editing API Routes
 * 
 * Endpoints:
 * - POST /api/image/generate (Secure image generation with Gemini Primary & Pollinations Fallback)
 * - GET  /api/image/capabilities (Supported models, modes, resolutions, aspect ratios)
 * - GET  /api/image/models (Alias for capabilities)
 */

import express from 'express';
import { requireAuth } from '../services/firebaseAuthService.js';
import { ImageStudioService } from '../services/imageGeneration/ImageStudioService.js';

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

// Periodic cleanup of stale rate limits (unref'd to prevent blocking process exit)
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
  // Safe default: do NOT trust client-supplied UID in body
  req.user = { uid: 'guest_user', email: 'guest@epicthink.ai' };
  next();
};

/**
 * GET /api/image/capabilities
 */
router.get(['/capabilities', '/models'], async (req, res) => {
  try {
    const meta = await ImageStudioService.getStudioMetadata();
    res.json({
      success: true,
      ...meta
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/image/generate
 */
router.post('/generate', authenticateOrGuest, async (req, res) => {
  // 1. Rate Limiting Check
  const rateLimitKey = (req.user && req.user.uid !== 'guest_user') ? req.user.uid : (req.ip || 'global');
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
    seed
  } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      error: 'A prompt is required for image generation.',
      errorCode: 'INVALID_PROMPT'
    });
  }

  // 3. Cryptographically Verified Firebase UID (never trust body.uid)
  const verifiedUid = req.user?.uid || 'guest_user';

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
  }
});

export default router;
