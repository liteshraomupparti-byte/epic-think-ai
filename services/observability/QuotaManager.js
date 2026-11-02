/**
 * Epic Think AI - Per-User Quota & Cost Protection Engine
 * 
 * Enforces:
 * 1. Rate limiting (e.g. max 30 requests per minute per user)
 * 2. Daily & monthly USD spend caps per user
 * 3. Operation limits (daily browser automation & media generation counts)
 * 4. Global circuit breaker to prevent credit runaways
 */

import { SafeLogger } from '../../plugins/core/SafeLogger.js';

// Default Tiers
const DEFAULT_LIMITS = {
  free: {
    dailyCostCapUsd: 1.50,
    monthlyCostCapUsd: 25.00,
    dailyMediaRuns: 20,
    dailyBrowserRuns: 10,
    maxRequestsPerMin: 30
  },
  pro: {
    dailyCostCapUsd: 10.00,
    monthlyCostCapUsd: 150.00,
    dailyMediaRuns: 100,
    dailyBrowserRuns: 50,
    maxRequestsPerMin: 120
  }
};

class QuotaStore {
  constructor() {
    this.userUsage = new Map(); // uid -> { dailyCost, monthlyCost, dayKey, monthKey, requestTimestamps, mediaRuns, browserRuns }
    this.globalEmergencyCapUsd = parseFloat(process.env.GLOBAL_DAILY_COST_CAP || '50.00');
    this.globalDailySpendUsd = 0;
    this.lastDayKey = this._getDayKey();
  }

  _getDayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  _getMonthKey() {
    return new Date().toISOString().slice(0, 7);
  }

  _getUserRecord(uid) {
    const dayKey = this._getDayKey();
    const monthKey = this._getMonthKey();

    let record = this.userUsage.get(uid);
    if (!record) {
      record = {
        uid,
        dayKey,
        monthKey,
        dailyCost: 0,
        monthlyCost: 0,
        dailyMediaRuns: 0,
        dailyBrowserRuns: 0,
        requestTimestamps: []
      };
      this.userUsage.set(uid, record);
    }

    // Reset daily counters if day rolled over
    if (record.dayKey !== dayKey) {
      record.dayKey = dayKey;
      record.dailyCost = 0;
      record.dailyMediaRuns = 0;
      record.dailyBrowserRuns = 0;
      record.requestTimestamps = [];
    }

    // Reset monthly counters if month rolled over
    if (record.monthKey !== monthKey) {
      record.monthKey = monthKey;
      record.monthlyCost = 0;
    }

    // Reset global daily spend if day rolled over
    if (this.lastDayKey !== dayKey) {
      this.lastDayKey = dayKey;
      this.globalDailySpendUsd = 0;
    }

    return record;
  }

  /**
   * Check if user is within quota before executing a paid operation
   */
  assertWithinQuota(uid, { estimatedCostUsd = 0, type = 'llm', tier = 'free' } = {}) {
    const limits = DEFAULT_LIMITS[tier] || DEFAULT_LIMITS.free;
    const record = this._getUserRecord(uid);
    const now = Date.now();

    // 1. Check Rate Limiter (requests in last 60 seconds)
    record.requestTimestamps = record.requestTimestamps.filter(t => now - t < 60000);
    if (record.requestTimestamps.length >= limits.maxRequestsPerMin) {
      throw new Error(`Rate limit exceeded (${limits.maxRequestsPerMin} requests/min). Please wait a moment before sending another request.`);
    }

    // 2. Check Global Circuit Breaker
    if (this.globalDailySpendUsd + estimatedCostUsd > this.globalEmergencyCapUsd) {
      SafeLogger.error('Global daily cost safety cap reached!', { current: this.globalDailySpendUsd, limit: this.globalEmergencyCapUsd });
      throw new Error('Service temporarily paused: Global daily safety budget reached. Please contact support.');
    }

    // 3. Check Per-User Daily & Monthly USD limits
    if (record.dailyCost + estimatedCostUsd > limits.dailyCostCapUsd) {
      throw new Error(`Daily quota exceeded ($${record.dailyCost.toFixed(2)} / $${limits.dailyCostCapUsd.toFixed(2)}). Quota resets at 00:00 UTC.`);
    }
    if (record.monthlyCost + estimatedCostUsd > limits.monthlyCostCapUsd) {
      throw new Error(`Monthly budget limit reached ($${record.monthlyCost.toFixed(2)} / $${limits.monthlyCostCapUsd.toFixed(2)}).`);
    }

    // 4. Check Operation-specific counters
    if (type === 'browser' && record.dailyBrowserRuns >= limits.dailyBrowserRuns) {
      throw new Error(`Daily browser automation limit reached (${record.dailyBrowserRuns}/${limits.dailyBrowserRuns} runs).`);
    }
    if (type === 'media' && record.dailyMediaRuns >= limits.dailyMediaRuns) {
      throw new Error(`Daily media generation limit reached (${record.dailyMediaRuns}/${limits.dailyMediaRuns} runs).`);
    }

    // Record request timestamp
    record.requestTimestamps.push(now);
    return true;
  }

  /**
   * Commit actual cost and usage after operation completes
   */
  recordUsage(uid, { actualCostUsd = 0, type = 'llm' } = {}) {
    const record = this._getUserRecord(uid);
    const cost = Number(actualCostUsd || 0);

    record.dailyCost = Number((record.dailyCost + cost).toFixed(6));
    record.monthlyCost = Number((record.monthlyCost + cost).toFixed(6));
    this.globalDailySpendUsd = Number((this.globalDailySpendUsd + cost).toFixed(6));

    if (type === 'browser') {
      record.dailyBrowserRuns += 1;
    } else if (type === 'media') {
      record.dailyMediaRuns += 1;
    }

    return {
      uid,
      dailyCost: record.dailyCost,
      monthlyCost: record.monthlyCost,
      globalDailySpend: this.globalDailySpendUsd
    };
  }

  /**
   * Get quota status for a user
   */
  getUserQuotaStatus(uid, tier = 'free') {
    const limits = DEFAULT_LIMITS[tier] || DEFAULT_LIMITS.free;
    const record = this._getUserRecord(uid);

    return {
      uid,
      tier,
      dailySpendUsd: record.dailyCost,
      dailyLimitUsd: limits.dailyCostCapUsd,
      dailyRemainingUsd: Math.max(0, Number((limits.dailyCostCapUsd - record.dailyCost).toFixed(2))),
      monthlySpendUsd: record.monthlyCost,
      monthlyLimitUsd: limits.monthlyCostCapUsd,
      dailyMediaRuns: record.dailyMediaRuns,
      dailyMediaLimit: limits.dailyMediaRuns,
      dailyBrowserRuns: record.dailyBrowserRuns,
      dailyBrowserLimit: limits.dailyBrowserRuns
    };
  }

  getUserUsage(uid, tier = 'free') {
    const status = this.getUserQuotaStatus(uid, tier);
    const record = this._getUserRecord(uid);
    const now = Date.now();
    const activeRequests = (record.requestTimestamps || []).filter(t => now - t < 60000).length;
    return {
      ...status,
      requestsInWindow: activeRequests
    };
  }

  getGlobalStatus() {
    return {
      globalDailySpendUsd: this.globalDailySpendUsd,
      globalEmergencyCapUsd: this.globalEmergencyCapUsd,
      isEmergencyPaused: this.globalDailySpendUsd >= this.globalEmergencyCapUsd
    };
  }
}

export const quotaManager = new QuotaStore();
