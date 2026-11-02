/**
 * observabilityRoutes.js
 * Epic Think AI - LLM Cost, Quota, Trace, and Media Observability API
 */

import express from 'express';
import { quotaManager, traceManager, CostTracker } from '../services/observability/index.js';
import { mediaJobQueue } from '../services/media/index.js';
import { requireAuth } from '../services/firebaseAuthService.js';

const router = express.Router();

// Optional auth for development ease
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return requireAuth(req, res, next);
  }
  req.user = { uid: 'dev_user', email: 'dev@epicthink.ai' };
  next();
};

/**
 * Global & User Cost / Usage Statistics
 * GET /api/observability/stats
 */
router.get('/stats', optionalAuth, (req, res) => {
  try {
    const globalQuota = quotaManager.getGlobalStatus();
    const userUsage = req.user?.uid ? quotaManager.getUserUsage(req.user.uid) : null;
    const pricingTable = CostTracker.PRICING;

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      global: globalQuota,
      user: userUsage,
      pricing: pricingTable
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Distributed Traces (Langfuse-compatible)
 * GET /api/observability/traces
 */
router.get('/traces', optionalAuth, (req, res) => {
  try {
    const uid = req.user?.uid;
    const limit = parseInt(req.query.limit, 10) || 50;
    const traces = traceManager.listTraces({ uid, limit });

    res.json({
      success: true,
      count: traces.length,
      traces
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Single Trace Detail
 * GET /api/observability/traces/:traceId
 */
router.get('/traces/:traceId', optionalAuth, (req, res) => {
  try {
    const trace = traceManager.getTrace(req.params.traceId);
    if (!trace) {
      return res.status(404).json({ success: false, error: 'Trace not found' });
    }
    res.json({ success: true, trace });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * User Quota Status
 * GET /api/observability/quota
 */
router.get('/quota', optionalAuth, (req, res) => {
  try {
    const uid = req.user?.uid || 'anonymous';
    const usage = quotaManager.getUserUsage(uid);
    res.json({ success: true, quota: usage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Media Job Creation (Async)
 * POST /api/observability/media/jobs
 */
router.post('/media/jobs', optionalAuth, async (req, res) => {
  try {
    const uid = req.user?.uid || 'anonymous';
    const { type = 'image', prompt, provider, width, height } = req.body || {};

    if (type === 'image') {
      const job = await mediaJobQueue.createImageJob({ uid, prompt, provider, width, height });
      return res.json({ success: true, job });
    } else if (type === 'video') {
      const job = await mediaJobQueue.createVideoJob({ uid, prompt, provider });
      return res.json({ success: true, job });
    } else {
      return res.status(400).json({ success: false, error: `Unsupported media type: ${type}` });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Media Job Status
 * GET /api/observability/media/jobs/:jobId
 */
router.get('/media/jobs/:jobId', optionalAuth, (req, res) => {
  try {
    const job = mediaJobQueue.getJob(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Media job not found' });
    }
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Media Job Cancellation
 * POST /api/observability/media/jobs/:jobId/cancel
 */
router.post('/media/jobs/:jobId/cancel', optionalAuth, (req, res) => {
  try {
    const uid = req.user?.uid;
    const cancelled = mediaJobQueue.cancelJob(req.params.jobId, uid);
    res.json({ success: true, result: cancelled });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
