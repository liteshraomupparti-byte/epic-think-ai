/**
 * Epic Think AI - UsageMeter & Budget Control Service (Upgraded v2.0)
 * 
 * Powered by QuotaTrackingService:
 * 1. Strict monthly spending limit (Default: ₹1,000, configurable ₹500 - ₹1,500).
 * 2. Daily spending limit (Default: ₹50).
 * 3. Separate tracking for Text, Image, Video, Builder, and Memory.
 * 4. Per-user concurrency limits and in-flight request deduplication.
 * 5. Persistent usage audit in MongoDB with resilient offline fallback.
 * 6. 100% backwards-compatible with existing media and builder pipelines.
 */

import crypto from 'crypto';
import { SafeLogger } from '../../plugins/core/SafeLogger.js';
import {
  QuotaTrackingService,
  DEFAULT_MONTHLY_BUDGET_INR,
  DEFAULT_DAILY_BUDGET_INR,
  USD_TO_INR_RATE,
  USER_TIERS
} from '../usage/QuotaTrackingService.js';

export { DEFAULT_MONTHLY_BUDGET_INR, DEFAULT_DAILY_BUDGET_INR, USD_TO_INR_RATE, USER_TIERS };

// Legacy Cost lookup in INR per unit (Maintained for full backward compatibility)
export const ESTIMATED_COSTS_INR = {
  text: {
    'groq': 0, // Free / ultra-low
    'local_qwen': 0,
    'gemini': 0, // Free tier
    'openrouter': 0.05 // ~₹0.05 per standard generation
  },
  image: {
    'pollinations-free': 0,
    'pollinations-flux': 0,
    'pollinations-turbo': 0,
    'pollinations-pro': 2.0, // ~₹2.00 per FLUX.2 Pro generation
    'gemini-image': 2.50     // ~₹2.50 per image when paid tier active
  },
  video: {
    'pollinations-wan': 4.50, // ~₹4.50 per 5s draft
    'pollinations-veo': 28.0, // ~₹28.00 per Veo 3.1 clip
    'storyboard': 0
  }
};

export class UsageMeter {
  // Retain references for any direct callers
  static inFlightRequests = QuotaTrackingService.inFlightLocks;
  static memoryLedger = QuotaTrackingService.memoryLedger;

  /**
   * Compute fingerprint for deduplication
   */
  static getRequestFingerprint(uid, type, prompt, options = {}) {
    return QuotaTrackingService.getRequestFingerprint(uid, type, prompt, options);
  }

  /**
   * Acquire concurrency lock and deduplicate rapid identical submissions
   * @param {string} fingerprint
   * @param {number} [ttlMs=30000]
   * @returns {boolean} true if acquired, false if duplicate in-flight
   */
  static acquireLock(fingerprint, ttlMs = 30000) {
    return QuotaTrackingService.acquireLock(fingerprint, ttlMs);
  }

  /**
   * Release in-flight lock
   */
  static releaseLock(fingerprint) {
    return QuotaTrackingService.releaseLock(fingerprint);
  }

  /**
   * Check if user is within spending limits
   * @param {string} uid
   * @param {'text'|'image'|'video'} type
   * @param {number} [estimatedCostInr=0]
   * @returns {{ allowed: boolean, reason?: string, currentDailyInr: number, currentMonthlyInr: number }}
   */
  static checkBudget(uid, type, estimatedCostInr = 0) {
    const tier = QuotaTrackingService.resolveUserTier(uid);
    const quotaCheck = QuotaTrackingService.checkQuota(uid, tier, type, estimatedCostInr, 0);

    const summary = QuotaTrackingService.getUsageSummary(uid);

    if (!quotaCheck.allowed) {
      return {
        allowed: false,
        reason: quotaCheck.reason,
        errorCode: quotaCheck.errorCode,
        currentDailyInr: summary.todayTotalInr,
        currentMonthlyInr: summary.monthTotalInr
      };
    }

    return {
      allowed: true,
      currentDailyInr: summary.todayTotalInr,
      currentMonthlyInr: summary.monthTotalInr
    };
  }

  /**
   * Record a completed generation
   */
  static async recordUsage({ uid, type, provider, model, costInr = 0, metadata = {} }) {
    return await QuotaTrackingService.recordUsageEvent({
      uid,
      type,
      provider,
      model,
      durationMs: metadata?.durationMs || 0,
      metadata: {
        ...metadata,
        explicitCostInr: costInr
      }
    });
  }

  /**
   * Get formatted usage breakdown
   */
  static getUsageSummary(uid = null) {
    return QuotaTrackingService.getUsageSummary(uid);
  }
}
