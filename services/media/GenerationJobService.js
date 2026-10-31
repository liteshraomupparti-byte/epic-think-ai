/**
 * Epic Think AI - Asynchronous Generation Job Service
 * 
 * Manages provider-neutral async media generation lifecycles:
 * QUEUED → SUBMITTED → PROCESSING → COMPLETED
 * Terminal States: FAILED, CANCELLED, TIMED_OUT
 * 
 * Prevents serverless request timeouts and supports status polling.
 */

import crypto from 'crypto';
import { SafeLogger } from '../../plugins/core/SafeLogger.js';

export const JOB_STATUSES = {
  QUEUED: 'QUEUED',
  SUBMITTED: 'SUBMITTED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  TIMED_OUT: 'TIMED_OUT'
};

export const MAX_JOB_DURATION_MS = 5 * 60 * 1000; // 5 minutes max
export const JOB_RETENTION_MS = 60 * 60 * 1000; // 1 hour in-memory retention

export class GenerationJobService {
  static jobs = new Map();

  /**
   * Create a new generation job record
   */
  static createJob({ uid = 'guest_user', type = 'video', prompt, provider, model, params = {} }) {
    const jobId = `job_${type}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const job = {
      jobId,
      uid,
      type,
      prompt,
      provider: provider || 'unconfigured',
      model: model || 'auto',
      status: JOB_STATUSES.QUEUED,
      progress: 0,
      params,
      result: null,
      error: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null
    };

    this.jobs.set(jobId, job);
    SafeLogger.info('[GenerationJobService] Created job', { jobId, type, uid, provider });
    return job;
  }

  /**
   * Update status or fields of a job
   */
  static updateJob(jobId, updates = {}) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    Object.assign(job, updates, { updatedAt: Date.now() });

    if (
      updates.status === JOB_STATUSES.COMPLETED ||
      updates.status === JOB_STATUSES.FAILED ||
      updates.status === JOB_STATUSES.CANCELLED ||
      updates.status === JOB_STATUSES.TIMED_OUT
    ) {
      job.completedAt = Date.now();
    }

    this.jobs.set(jobId, job);
    return job;
  }

  /**
   * Retrieve a job by ID
   */
  static getJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    // Check for timeout
    if (
      (job.status === JOB_STATUSES.QUEUED || job.status === JOB_STATUSES.PROCESSING || job.status === JOB_STATUSES.SUBMITTED) &&
      (Date.now() - job.createdAt > MAX_JOB_DURATION_MS)
    ) {
      job.status = JOB_STATUSES.TIMED_OUT;
      job.error = 'Job timed out after exceeding 5-minute processing ceiling.';
      job.updatedAt = Date.now();
      job.completedAt = Date.now();
      this.jobs.set(jobId, job);
    }

    return job;
  }

  /**
   * Cancel an active job
   */
  static cancelJob(jobId, uid = null) {
    const job = this.getJob(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    if (uid && job.uid !== uid && uid !== 'admin') {
      return { success: false, error: 'Unauthorized: cannot cancel another user job' };
    }

    if (job.status === JOB_STATUSES.COMPLETED) {
      return { success: false, error: 'Cannot cancel a completed job' };
    }

    this.updateJob(jobId, {
      status: JOB_STATUSES.CANCELLED,
      error: 'Job cancelled by user.'
    });

    return { success: true, job: this.getJob(jobId) };
  }

  /**
   * List jobs for a specific user
   */
  static listUserJobs(uid, limit = 20) {
    const list = Array.from(this.jobs.values())
      .filter(j => !uid || j.uid === uid)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);

    return list;
  }
}

// Background cleanup of stale jobs
const reaperTimer = setInterval(() => {
  const now = Date.now();
  for (const [id, job] of GenerationJobService.jobs.entries()) {
    if (now - job.createdAt > JOB_RETENTION_MS) {
      GenerationJobService.jobs.delete(id);
    }
  }
}, 10 * 60 * 1000);
if (reaperTimer.unref) reaperTimer.unref();
