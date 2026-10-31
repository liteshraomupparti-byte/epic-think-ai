/**
 * Epic Think AI - Dedicated Video Generation & Job Lifecycle API Routes
 * 
 * Endpoints:
 * - POST /api/video/generate (Asynchronous video job submission)
 * - GET  /api/video/jobs/:id (Job status polling)
 * - POST /api/video/jobs/:id/cancel (Cancel active job)
 * - GET  /api/video/capabilities (Supported models, durations, aspect ratios)
 * - GET  /api/video/usage (Spending and job count tracking)
 */

import express from 'express';
import { requireAuth } from '../services/firebaseAuthService.js';
import { PollinationsVideoProvider } from '../services/media/VideoGenerationProvider.js';
import { GenerationJobService, JOB_STATUSES } from '../services/media/GenerationJobService.js';
import { UsageMeter } from '../services/media/UsageMeter.js';
import { QuotaTrackingService } from '../services/usage/QuotaTrackingService.js';

const router = express.Router();
const videoProvider = new PollinationsVideoProvider();

// Helper to authenticate or assign safe guest ID
const authenticateOrGuest = async (req, res, next) => {
  if (req.headers.authorization) {
    return requireAuth(req, res, next);
  }
  req.user = { uid: 'guest_user', email: 'guest@epicthink.ai' };
  next();
};

/**
 * GET /api/video/capabilities
 */
router.get('/capabilities', (req, res) => {
  const caps = videoProvider.getCapabilities();
  const usage = UsageMeter.getUsageSummary(req.user?.uid);
  res.json({
    success: true,
    ...caps,
    usage
  });
});

/**
 * GET /api/video/usage
 */
router.get('/usage', authenticateOrGuest, (req, res) => {
  const summary = UsageMeter.getUsageSummary(req.user?.uid);
  res.json({
    success: true,
    ...summary
  });
});

/**
 * POST /api/video/generate
 */
router.post('/generate', authenticateOrGuest, QuotaTrackingService.createMiddleware({ type: 'video', estimatedCostInr: 4.5 }), async (req, res) => {
  const verifiedUid = req.user?.uid || 'guest_user';
  const {
    prompt,
    imageUrl = null,
    model = 'google/veo-3.1-fast',
    duration = 4,
    aspectRatio = '16:9',
    resolution = '720p'
  } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Prompt is required for video generation.',
      errorCode: 'INVALID_PROMPT'
    });
  }

  // Deduplication check
  const fingerprint = UsageMeter.getRequestFingerprint(verifiedUid, 'video', prompt, {
    model,
    duration,
    aspectRatio
  });

  const acquired = UsageMeter.acquireLock(fingerprint, 30000);
  if (!acquired) {
    return res.status(429).json({
      success: false,
      error: 'A video generation job with identical parameters is already in progress.',
      errorCode: 'DUPLICATE_JOB_PENDING'
    });
  }

  try {
    const job = await videoProvider.submitVideoJob({
      uid: verifiedUid,
      prompt: prompt.trim(),
      imageUrl,
      model,
      duration: parseInt(duration, 10) || 4,
      aspectRatio,
      resolution
    });

    res.status(202).json({
      success: true,
      jobId: job.jobId,
      status: job.status,
      provider: job.provider,
      model: job.model,
      prompt: job.prompt,
      progress: job.progress,
      result: job.result,
      error: job.error,
      createdAt: job.createdAt
    });
  } catch (err) {
    const status = err.code === 'BUDGET_EXCEEDED' || err.code === 'CONCURRENCY_LIMIT' ? 429 : 500;
    res.status(status).json({
      success: false,
      error: err.message,
      errorCode: err.code || 'GENERATION_ERROR'
    });
  } finally {
    UsageMeter.releaseLock(fingerprint);
  }
});

/**
 * GET /api/video/jobs/:id
 */
router.get('/jobs/:id', authenticateOrGuest, (req, res) => {
  const { id } = req.params;
  const job = GenerationJobService.getJob(id);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Video job not found or expired.',
      errorCode: 'JOB_NOT_FOUND'
    });
  }

  res.json({
    success: true,
    job
  });
});

/**
 * POST /api/video/jobs/:id/cancel
 */
router.post('/jobs/:id/cancel', authenticateOrGuest, (req, res) => {
  const { id } = req.params;
  const verifiedUid = req.user?.uid || 'guest_user';
  const result = GenerationJobService.cancelJob(id, verifiedUid);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json({
    success: true,
    message: 'Job cancelled successfully.',
    job: result.job
  });
});

/**
 * GET /api/video/jobs
 */
router.get('/jobs', authenticateOrGuest, (req, res) => {
  const verifiedUid = req.user?.uid || 'guest_user';
  const jobs = GenerationJobService.listUserJobs(verifiedUid, 20);
  res.json({
    success: true,
    jobs
  });
});

export default router;
