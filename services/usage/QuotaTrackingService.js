/**
 * Epic Think AI - Production User Quota, Usage Tracking, Rate Limiting & Cost Protection Engine
 * 
 * Provides:
 * 1. User Tier System: 'guest', 'free', 'pro', 'admin'
 * 2. Multi-layer Sliding Window Rate Limiting (per IP / per UID)
 * 3. Daily & Monthly Quota Enforcement (Text Prompts, Output Tokens, Image Generations, Video Generations, Builder Projects)
 * 4. Micro-Unit Cost Protection & Financial Guardrails (USD & INR tracking)
 * 5. Global Spending Circuit Breakers (Daily & Monthly System Caps)
 * 6. Dual Persistence: MongoDB 'usage_records' & 'user_quotas' + Local Resilient Store
 * 7. In-flight Concurrency Locking & Deduplication
 * 8. Standardized HTTP 429 Error Payloads with Retry-After and X-RateLimit headers
 */

import crypto from 'crypto';
import dotenv from 'dotenv';
import { SafeLogger } from '../../plugins/core/SafeLogger.js';

dotenv.config();

// Global System Spending Budgets (INR)
export const DEFAULT_MONTHLY_BUDGET_INR = 1000;
export const DEFAULT_DAILY_BUDGET_INR = 50;
export const USD_TO_INR_RATE = 86.5;

/**
 * Unit Costs in INR & USD for accurate billing telemetry
 */
export const PRICING_TABLE = {
  text: {
    // Pricing per 1,000 tokens (Input / Output average)
    'groq': { inrPer1k: 0.005, usdPer1k: 0.000057 }, // High-speed LPU free/ultra-low tier
    'gemini': { inrPer1k: 0.010, usdPer1k: 0.000115 }, // Gemini 1.5/2.0 Flash
    'openrouter': { inrPer1k: 0.045, usdPer1k: 0.000520 }, // Llama 3.3 70B & frontier
    'local_qwen': { inrPer1k: 0, usdPer1k: 0 },
    'default': { inrPer1k: 0.010, usdPer1k: 0.000115 }
  },
  image: {
    // Pricing per generated image
    'pollinations-free': { inr: 0, usd: 0 },
    'pollinations-flux': { inr: 0, usd: 0 },
    'pollinations-turbo': { inr: 0, usd: 0 },
    'pollinations-pro': { inr: 2.00, usd: 0.023 }, // Flux.2 Pro
    'gemini-image': { inr: 2.50, usd: 0.029 },     // Imagen / Gemini Pro Image
    'default': { inr: 0, usd: 0 }
  },
  video: {
    // Pricing per video clip
    'pollinations-wan': { inr: 4.50, usd: 0.052 },  // Wan-2.1 / Luma 5s draft
    'pollinations-veo': { inr: 28.00, usd: 0.323 }, // Google Veo 3.1
    'storyboard': { inr: 0.05, usd: 0.0006 },
    'default': { inr: 4.50, usd: 0.052 }
  },
  builder: {
    'plan': { inr: 0.05, usd: 0.0006 },
    'generate': { inr: 0.15, usd: 0.0017 },
    'edit': { inr: 0.10, usd: 0.0012 }
  },
  memory: {
    'retain': { inr: 0.01, usd: 0.00012 },
    'recall': { inr: 0.01, usd: 0.00012 },
    'reflect': { inr: 0.02, usd: 0.00023 }
  }
};

/**
 * User Tiers & Associated Quota Ceilings
 */
export const USER_TIERS = {
  guest: {
    id: 'guest',
    name: 'Guest / Unregistered',
    badge: 'Guest',
    rateLimitPerMinute: {
      text: 10,
      image: 3,
      video: 1,
      builder: 4,
      memory: 10,
      global: 20
    },
    dailyQuotas: {
      textRequests: 25,
      tokens: 40000,
      imageGenerations: 6,
      videoGenerations: 1,
      builderGenerations: 4,
      memoryOperations: 20,
      maxSpendInr: 15.0
    },
    monthlyQuotas: {
      textRequests: 200,
      tokens: 300000,
      imageGenerations: 30,
      videoGenerations: 3,
      builderGenerations: 15,
      memoryOperations: 100,
      maxSpendInr: 60.0
    },
    maxOutputTokens: 2048
  },
  free: {
    id: 'free',
    name: 'Standard Account',
    badge: 'Free Tier',
    rateLimitPerMinute: {
      text: 35,
      image: 10,
      video: 2,
      builder: 12,
      memory: 30,
      global: 50
    },
    dailyQuotas: {
      textRequests: 250,
      tokens: 600000,
      imageGenerations: 50,
      videoGenerations: 8,
      builderGenerations: 40,
      memoryOperations: 250,
      maxSpendInr: 60.0
    },
    monthlyQuotas: {
      textRequests: 5000,
      tokens: 15000000,
      imageGenerations: 800,
      videoGenerations: 80,
      builderGenerations: 500,
      memoryOperations: 3000,
      maxSpendInr: 800.0
    },
    maxOutputTokens: 8192
  },
  pro: {
    id: 'pro',
    name: 'Epic Think Pro',
    badge: 'Pro Tier',
    rateLimitPerMinute: {
      text: 90,
      image: 30,
      video: 8,
      builder: 40,
      memory: 80,
      global: 150
    },
    dailyQuotas: {
      textRequests: 2000,
      tokens: 4000000,
      imageGenerations: 250,
      videoGenerations: 40,
      builderGenerations: 250,
      memoryOperations: 2000,
      maxSpendInr: 350.0
    },
    monthlyQuotas: {
      textRequests: 45000,
      tokens: 80000000,
      imageGenerations: 5000,
      videoGenerations: 500,
      builderGenerations: 4000,
      memoryOperations: 30000,
      maxSpendInr: 2500.0
    },
    maxOutputTokens: 16384
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    badge: 'Admin',
    rateLimitPerMinute: {
      text: 400,
      image: 100,
      video: 40,
      builder: 100,
      memory: 200,
      global: 500
    },
    dailyQuotas: {
      textRequests: 200000,
      tokens: 200000000,
      imageGenerations: 20000,
      videoGenerations: 2000,
      builderGenerations: 20000,
      memoryOperations: 50000,
      maxSpendInr: 25000.0
    },
    monthlyQuotas: {
      textRequests: 2000000,
      tokens: 2000000000,
      imageGenerations: 200000,
      videoGenerations: 20000,
      builderGenerations: 200000,
      memoryOperations: 500000,
      maxSpendInr: 100000.0
    },
    maxOutputTokens: 32768
  }
};

/**
 * Format today date string: "YYYY-MM-DD"
 */
export function getTodayKey(timestamp = Date.now()) {
  const d = new Date(timestamp);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format current month string: "YYYY-MM"
 */
export function getMonthKey(timestamp = Date.now()) {
  const d = new Date(timestamp);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Milliseconds until next UTC midnight reset
 */
export function getSecondsUntilMidnight() {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  return Math.max(1, Math.ceil((tomorrow.getTime() - now.getTime()) / 1000));
}

/**
 * Milliseconds until 1st of next month UTC
 */
export function getSecondsUntilMonthEnd() {
  const now = new Date();
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
  return Math.max(1, Math.ceil((nextMonth.getTime() - now.getTime()) / 1000));
}

export class QuotaTrackingService {
  // 1. Sliding window rate limit cache: Map<key, number[]> (timestamps of recent requests)
  static rateLimitWindows = new Map();

  // 2. In-flight request deduplication lock: Map<fingerprint, expiryTimestamp>
  static inFlightLocks = new Map();

  // 3. In-memory fast aggregated user quotas cache: Map<uid, object>
  static userQuotaCache = new Map();

  // 4. Memory ledger for rapid budget calculations: array of recent records (trimmed to 3000)
  static memoryLedger = [];

  // Database bridge hooks (populated dynamically from mongoService)
  static _dbHooks = {
    recordUsageToDb: null,
    getUserQuotaDoc: null,
    updateUserQuotaDoc: null,
    getUserDetailedUsage: null,
    getGlobalMetrics: null
  };

  /**
   * Register database hooks from mongoService
   */
  static registerDbHooks(hooks = {}) {
    this._dbHooks = { ...this._dbHooks, ...hooks };
  }

  /**
   * Reset in-memory rate limit windows and cache (used in testing and maintenance)
   */
  static clearInMemoryLedger() {
    this.rateLimitWindows.clear();
    this.inFlightLocks.clear();
    this.userQuotaCache.clear();
    this.memoryLedger = [];
  }

  /**
   * Determine effective user tier
   */
  static resolveUserTier(userOrUid, userProfile = null) {
    if (!userOrUid) return USER_TIERS.guest;
    const uid = typeof userOrUid === 'string' ? userOrUid : userOrUid.uid;

    if (!uid || uid === 'guest_user' || uid.startsWith('guest_') || uid === 'local_dev_user') {
      return USER_TIERS.guest;
    }

    // Check profile tier attribute
    const tierId = userProfile?.tier || (typeof userOrUid === 'object' ? userOrUid.tier : null);
    if (tierId && USER_TIERS[tierId]) {
      return USER_TIERS[tierId];
    }

    // Default authenticated account tier is free
    return USER_TIERS.free;
  }

  /**
   * Generate request fingerprint for in-flight deduplication
   */
  static getRequestFingerprint(uid, type, prompt, options = {}) {
    const payload = `${uid || 'guest'}|${type}|${(prompt || '').trim().toLowerCase()}|${JSON.stringify(options)}`;
    return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 24);
  }

  /**
   * Acquire concurrency lock for a request
   */
  static acquireLock(fingerprint, ttlMs = 30000) {
    const now = Date.now();
    const existing = this.inFlightLocks.get(fingerprint);
    if (existing && existing > now) {
      return false; // Already processing an identical request
    }
    this.inFlightLocks.set(fingerprint, now + ttlMs);
    return true;
  }

  /**
   * Release concurrency lock
   */
  static releaseLock(fingerprint) {
    this.inFlightLocks.delete(fingerprint);
  }

  /**
   * Sliding window rate limit check
   * @param {string} clientKey - UID or Client IP
   * @param {'text'|'image'|'video'|'builder'|'memory'} type
   * @param {object} tier - User tier object
   * @returns {{ allowed: boolean, remaining: number, resetInSeconds: number, limit: number }}
   */
  static checkRateLimit(clientKey, type = 'text', tier = USER_TIERS.free) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 60 seconds sliding window
    const typeKey = `${clientKey}:${type}`;
    const globalKey = `${clientKey}:global`;

    const typeLimit = tier.rateLimitPerMinute[type] || tier.rateLimitPerMinute.global || 20;
    const globalLimit = tier.rateLimitPerMinute.global || 45;

    // Helper to evaluate sliding window timestamps
    const evaluateWindow = (mapKey, limit) => {
      let timestamps = this.rateLimitWindows.get(mapKey) || [];
      // Filter out timestamps outside current 60s window
      timestamps = timestamps.filter(t => now - t < windowMs);
      this.rateLimitWindows.set(mapKey, timestamps);

      if (timestamps.length >= limit) {
        const oldest = timestamps[0];
        const resetInSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
        return { allowed: false, remaining: 0, resetInSeconds, limit };
      }

      return {
        allowed: true,
        remaining: Math.max(0, limit - timestamps.length),
        resetInSeconds: 60,
        limit,
        timestamps
      };
    };

    const typeResult = evaluateWindow(typeKey, typeLimit);
    if (!typeResult.allowed) {
      return typeResult;
    }

    const globalResult = evaluateWindow(globalKey, globalLimit);
    if (!globalResult.allowed) {
      return globalResult;
    }

    // Record this hit in sliding window
    typeResult.timestamps.push(now);
    globalResult.timestamps.push(now);

    return {
      allowed: true,
      remaining: Math.min(typeResult.remaining - 1, globalResult.remaining - 1),
      resetInSeconds: 60,
      limit: typeLimit
    };
  }

  /**
   * Calculate financial cost in INR & USD
   */
  static calculateCost({ type, provider = 'default', model = '', promptTokens = 0, completionTokens = 0, resolution = '1K', duration = 4 }) {
    const totalTokens = (promptTokens || 0) + (completionTokens || 0);

    if (type === 'text') {
      const pKey = provider.toLowerCase();
      let costConfig = PRICING_TABLE.text[pKey] || PRICING_TABLE.text.default;

      // Special overrides based on model family
      if (model.includes('gpt-oss-120b') || model.includes('llama-3.3-70b')) {
        costConfig = { inrPer1k: 0.040, usdPer1k: 0.00046 };
      } else if (model.includes('qwen') || model.includes('flash')) {
        costConfig = { inrPer1k: 0.006, usdPer1k: 0.00007 };
      }

      const inr = (totalTokens / 1000) * costConfig.inrPer1k;
      const usd = inr / USD_TO_INR_RATE;
      return { costInr: parseFloat(inr.toFixed(4)), costUsd: parseFloat(usd.toFixed(6)) };
    }

    if (type === 'image') {
      const mLower = (model || '').toLowerCase();
      const pLower = (provider || '').toLowerCase();

      if (pLower.includes('gemini') || mLower.includes('gemini') || mLower.includes('imagen')) {
        return { costInr: PRICING_TABLE.image['gemini-image'].inr, costUsd: PRICING_TABLE.image['gemini-image'].usd };
      }
      if (mLower.includes('pro') || mLower.includes('flux-pro')) {
        return { costInr: PRICING_TABLE.image['pollinations-pro'].inr, costUsd: PRICING_TABLE.image['pollinations-pro'].usd };
      }
      return { costInr: 0, costUsd: 0 };
    }

    if (type === 'video') {
      const mLower = (model || '').toLowerCase();
      if (mLower.includes('veo')) {
        return { costInr: PRICING_TABLE.video['pollinations-veo'].inr, costUsd: PRICING_TABLE.video['pollinations-veo'].usd };
      }
      return { costInr: PRICING_TABLE.video['pollinations-wan'].inr, costUsd: PRICING_TABLE.video['pollinations-wan'].usd };
    }

    if (type === 'builder') {
      const inr = (totalTokens / 1000) * 0.015;
      return { costInr: parseFloat(inr.toFixed(4)), costUsd: parseFloat((inr / USD_TO_INR_RATE).toFixed(6)) };
    }

    if (type === 'memory') {
      return { costInr: PRICING_TABLE.memory.recall.inr, costUsd: PRICING_TABLE.memory.recall.usd };
    }

    return { costInr: 0, costUsd: 0 };
  }

  /**
   * Retrieve or initialize fast aggregated quota document for user
   */
  static getOrInitUserQuota(uid, tier = USER_TIERS.free) {
    const today = getTodayKey();
    const currentMonth = getMonthKey();
    const cached = this.userQuotaCache.get(uid);

    if (cached) {
      // Check if day rolled over
      if (cached.currentDay !== today) {
        cached.currentDay = today;
        cached.dayUsage = {
          textRequests: 0,
          tokens: 0,
          imageGenerations: 0,
          videoGenerations: 0,
          builderGenerations: 0,
          memoryOperations: 0,
          costInr: 0,
          costUsd: 0
        };
      }
      // Check if month rolled over
      if (cached.currentMonth !== currentMonth) {
        cached.currentMonth = currentMonth;
        cached.monthUsage = {
          textRequests: 0,
          tokens: 0,
          imageGenerations: 0,
          videoGenerations: 0,
          builderGenerations: 0,
          memoryOperations: 0,
          costInr: 0,
          costUsd: 0
        };
      }
      cached.tier = tier.id;
      return cached;
    }

    // Default fresh quota document
    const quotaDoc = {
      firebaseUid: uid,
      tier: tier.id,
      currentDay: today,
      currentMonth: currentMonth,
      dayUsage: {
        textRequests: 0,
        tokens: 0,
        imageGenerations: 0,
        videoGenerations: 0,
        builderGenerations: 0,
        memoryOperations: 0,
        costInr: 0,
        costUsd: 0
      },
      monthUsage: {
        textRequests: 0,
        tokens: 0,
        imageGenerations: 0,
        videoGenerations: 0,
        builderGenerations: 0,
        memoryOperations: 0,
        costInr: 0,
        costUsd: 0
      },
      updatedAt: Date.now()
    };

    this.userQuotaCache.set(uid, quotaDoc);
    return quotaDoc;
  }

  /**
   * Check if user is within daily & monthly quotas and global system budget
   */
  static checkQuota(uid, tier = USER_TIERS.free, type = 'text', estimatedCostInr = 0, estimatedTokens = 0) {
    const quota = this.getOrInitUserQuota(uid, tier);
    const dayUsage = quota.dayUsage;
    const monthUsage = quota.monthUsage;
    const dailyLimits = tier.dailyQuotas;
    const monthlyLimits = tier.monthlyQuotas;

    // 1. Check Global System Budget
    const monthlySystemLimit = parseFloat(process.env.MONTHLY_BUDGET_INR || DEFAULT_MONTHLY_BUDGET_INR);
    const dailySystemLimit = parseFloat(process.env.DAILY_BUDGET_INR || DEFAULT_DAILY_BUDGET_INR);

    let globalDailySpend = 0;
    let globalMonthlySpend = 0;
    const now = Date.now();
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    for (const r of this.memoryLedger) {
      if (r.timestamp >= startOfMonth.getTime()) {
        globalMonthlySpend += (r.costInr || 0);
        if (r.timestamp >= startOfDay.getTime()) {
          globalDailySpend += (r.costInr || 0);
        }
      }
    }

    if (globalDailySpend + estimatedCostInr > dailySystemLimit) {
      // If text generation and free provider available, allow fallback, otherwise enforce cap
      if (type !== 'text') {
        return {
          allowed: false,
          errorCode: 'GLOBAL_DAILY_BUDGET_REACHED',
          reason: `System daily budget paused (₹${globalDailySpend.toFixed(2)}/₹${dailySystemLimit}). Resets at midnight UTC.`,
          resetInSeconds: getSecondsUntilMidnight()
        };
      }
    }

    if (globalMonthlySpend + estimatedCostInr > monthlySystemLimit) {
      if (type !== 'text') {
        return {
          allowed: false,
          errorCode: 'GLOBAL_MONTHLY_BUDGET_REACHED',
          reason: `System monthly budget reached (₹${globalMonthlySpend.toFixed(2)}/₹${monthlySystemLimit}).`,
          resetInSeconds: getSecondsUntilMonthEnd()
        };
      }
    }

    // 2. Check User Daily Quota for Requested Type
    if (type === 'text') {
      if (dayUsage.textRequests + 1 > dailyLimits.textRequests) {
        return {
          allowed: false,
          errorCode: 'DAILY_TEXT_QUOTA_EXCEEDED',
          reason: `Daily AI prompt limit reached (${dayUsage.textRequests}/${dailyLimits.textRequests}). Resets at midnight UTC.`,
          resetInSeconds: getSecondsUntilMidnight()
        };
      }
      if (estimatedTokens > 0 && dayUsage.tokens + estimatedTokens > dailyLimits.tokens) {
        return {
          allowed: false,
          errorCode: 'DAILY_TOKEN_QUOTA_EXCEEDED',
          reason: `Daily token ceiling reached (${dayUsage.tokens.toLocaleString()}/${dailyLimits.tokens.toLocaleString()}). Resets at midnight UTC.`,
          resetInSeconds: getSecondsUntilMidnight()
        };
      }
      if (monthUsage.textRequests + 1 > monthlyLimits.textRequests) {
        return {
          allowed: false,
          errorCode: 'MONTHLY_TEXT_QUOTA_EXCEEDED',
          reason: `Monthly AI prompt quota reached (${monthUsage.textRequests}/${monthlyLimits.textRequests}). Upgrade tier for more capacity.`,
          resetInSeconds: getSecondsUntilMonthEnd()
        };
      }
    } else if (type === 'image') {
      if (dayUsage.imageGenerations + 1 > dailyLimits.imageGenerations) {
        return {
          allowed: false,
          errorCode: 'DAILY_IMAGE_QUOTA_EXCEEDED',
          reason: `Daily image generation limit reached (${dayUsage.imageGenerations}/${dailyLimits.imageGenerations}). Resets at midnight UTC.`,
          resetInSeconds: getSecondsUntilMidnight()
        };
      }
      if (monthUsage.imageGenerations + 1 > monthlyLimits.imageGenerations) {
        return {
          allowed: false,
          errorCode: 'MONTHLY_IMAGE_QUOTA_EXCEEDED',
          reason: `Monthly image generation quota reached (${monthUsage.imageGenerations}/${monthlyLimits.imageGenerations}).`,
          resetInSeconds: getSecondsUntilMonthEnd()
        };
      }
    } else if (type === 'video') {
      if (dayUsage.videoGenerations + 1 > dailyLimits.videoGenerations) {
        return {
          allowed: false,
          errorCode: 'DAILY_VIDEO_QUOTA_EXCEEDED',
          reason: `Daily video generation limit reached (${dayUsage.videoGenerations}/${dailyLimits.videoGenerations}). Resets at midnight UTC.`,
          resetInSeconds: getSecondsUntilMidnight()
        };
      }
      if (monthUsage.videoGenerations + 1 > monthlyLimits.videoGenerations) {
        return {
          allowed: false,
          errorCode: 'MONTHLY_VIDEO_QUOTA_EXCEEDED',
          reason: `Monthly video generation quota reached (${monthUsage.videoGenerations}/${monthlyLimits.videoGenerations}).`,
          resetInSeconds: getSecondsUntilMonthEnd()
        };
      }
    } else if (type === 'builder') {
      if (dayUsage.builderGenerations + 1 > dailyLimits.builderGenerations) {
        return {
          allowed: false,
          errorCode: 'DAILY_BUILDER_QUOTA_EXCEEDED',
          reason: `Daily website builder generation limit reached (${dayUsage.builderGenerations}/${dailyLimits.builderGenerations}). Resets at midnight UTC.`,
          resetInSeconds: getSecondsUntilMidnight()
        };
      }
    } else if (type === 'memory') {
      if (dayUsage.memoryOperations + 1 > dailyLimits.memoryOperations) {
        return {
          allowed: false,
          errorCode: 'DAILY_MEMORY_QUOTA_EXCEEDED',
          reason: `Daily semantic memory operation limit reached (${dayUsage.memoryOperations}/${dailyLimits.memoryOperations}).`,
          resetInSeconds: getSecondsUntilMidnight()
        };
      }
    }

    // 3. Check User Financial Spend Limit
    if (dayUsage.costInr + estimatedCostInr > dailyLimits.maxSpendInr) {
      return {
        allowed: false,
        errorCode: 'DAILY_USER_SPEND_LIMIT_REACHED',
        reason: `Daily account compute budget reached (₹${dayUsage.costInr.toFixed(2)}/₹${dailyLimits.maxSpendInr}). Resets at midnight UTC.`,
        resetInSeconds: getSecondsUntilMidnight()
      };
    }

    if (monthUsage.costInr + estimatedCostInr > monthlyLimits.maxSpendInr) {
      return {
        allowed: false,
        errorCode: 'MONTHLY_USER_SPEND_LIMIT_REACHED',
        reason: `Monthly account compute budget reached (₹${monthUsage.costInr.toFixed(2)}/₹${monthlyLimits.maxSpendInr}).`,
        resetInSeconds: getSecondsUntilMonthEnd()
      };
    }

    return {
      allowed: true,
      tier: tier.id,
      dayUsage,
      monthUsage,
      dailyLimits,
      monthlyLimits
    };
  }

  /**
   * Alias for recordUsageEvent
   */
  static async recordUsage(args) {
    return await this.recordUsageEvent(args);
  }

  /**
   * Record a completed AI operation, increment counters, and persist to MongoDB
   */
  static async recordUsageEvent({
    uid,
    email = null,
    tier = 'free',
    type = 'text',
    provider = 'groq',
    model = '',
    promptTokens = 0,
    completionTokens = 0,
    totalTokens = 0,
    durationMs = 0,
    status = 'success',
    ip = null,
    userAgent = null,
    metadata = {}
  }) {
    const verifiedUid = uid || 'guest_user';
    const computedTokens = totalTokens || (promptTokens + completionTokens);
    const { costInr, costUsd } = this.calculateCost({
      type,
      provider,
      model,
      promptTokens,
      completionTokens,
      resolution: metadata.resolution,
      duration: metadata.duration
    });

    const now = Date.now();
    const today = getTodayKey(now);
    const month = getMonthKey(now);

    const record = {
      id: `rec_${now}_${Math.random().toString(36).substring(2, 9)}`,
      firebaseUid: verifiedUid,
      email,
      tier,
      type,
      provider,
      model,
      promptTokens: promptTokens || 0,
      completionTokens: completionTokens || 0,
      totalTokens: computedTokens,
      costInr,
      costUsd,
      latencyMs: durationMs || 0,
      status,
      ip,
      userAgent,
      date: today,
      month,
      timestamp: now,
      metadata
    };

    // 1. Store in memory ledger
    this.memoryLedger.push(record);
    if (this.memoryLedger.length > 3000) {
      this.memoryLedger.shift();
    }

    // 2. Increment fast user quota counters
    const resolvedTierObj = USER_TIERS[tier] || USER_TIERS.free;
    const quota = this.getOrInitUserQuota(verifiedUid, resolvedTierObj);

    if (type === 'text') {
      quota.dayUsage.textRequests++;
      quota.dayUsage.tokens += computedTokens;
      quota.monthUsage.textRequests++;
      quota.monthUsage.tokens += computedTokens;
    } else if (type === 'image') {
      quota.dayUsage.imageGenerations++;
      quota.monthUsage.imageGenerations++;
    } else if (type === 'video') {
      quota.dayUsage.videoGenerations++;
      quota.monthUsage.videoGenerations++;
    } else if (type === 'builder') {
      quota.dayUsage.builderGenerations++;
      quota.dayUsage.tokens += computedTokens;
      quota.monthUsage.builderGenerations++;
      quota.monthUsage.tokens += computedTokens;
    } else if (type === 'memory') {
      quota.dayUsage.memoryOperations++;
      quota.monthUsage.memoryOperations++;
    }

    quota.dayUsage.costInr = parseFloat((quota.dayUsage.costInr + costInr).toFixed(4));
    quota.dayUsage.costUsd = parseFloat((quota.dayUsage.costUsd + costUsd).toFixed(6));
    quota.monthUsage.costInr = parseFloat((quota.monthUsage.costInr + costInr).toFixed(4));
    quota.monthUsage.costUsd = parseFloat((quota.monthUsage.costUsd + costUsd).toFixed(6));
    quota.updatedAt = now;

    // 3. Asynchronously persist to database hooks if registered
    if (this._dbHooks.recordUsageToDb) {
      this._dbHooks.recordUsageToDb(record).catch(err => {
        SafeLogger.warn('[QuotaService] DB persistence note:', err.message);
      });
    }
    if (this._dbHooks.updateUserQuotaDoc) {
      this._dbHooks.updateUserQuotaDoc(verifiedUid, quota).catch(() => {});
    }

    SafeLogger.info('[QuotaService] Recorded event', {
      uid: verifiedUid,
      type,
      provider,
      model,
      tokens: computedTokens,
      costInr
    });

    return record;
  }

  /**
   * Get formatted usage breakdown for a user or system
   */
  static getUsageSummary(uid = null, userTier = null) {
    const now = Date.now();
    const today = getTodayKey(now);
    const month = getMonthKey(now);

    const monthlyLimit = parseFloat(process.env.MONTHLY_BUDGET_INR || DEFAULT_MONTHLY_BUDGET_INR);
    const dailyLimit = parseFloat(process.env.DAILY_BUDGET_INR || DEFAULT_DAILY_BUDGET_INR);

    const tier = this.resolveUserTier(uid, userTier ? { tier: userTier } : null);
    const userQuota = uid ? this.getOrInitUserQuota(uid, tier) : null;

    let totalSpendInr = 0;
    let todaySpendInr = 0;
    let counts = { text: 0, image: 0, video: 0, builder: 0, memory: 0 };
    let spends = { text: 0, image: 0, video: 0, builder: 0, memory: 0 };
    let tokens = { prompt: 0, completion: 0, total: 0 };

    const records = uid 
      ? this.memoryLedger.filter(r => r.firebaseUid === uid)
      : this.memoryLedger;

    for (const r of records) {
      if (r.month === month) {
        totalSpendInr += (r.costInr || 0);
        if (counts[r.type] !== undefined) counts[r.type]++;
        if (spends[r.type] !== undefined) spends[r.type] += (r.costInr || 0);
        tokens.prompt += (r.promptTokens || 0);
        tokens.completion += (r.completionTokens || 0);
        tokens.total += (r.totalTokens || 0);

        if (r.date === today) {
          todaySpendInr += (r.costInr || 0);
        }
      }
    }

    return {
      currency: 'INR',
      tier: tier.id,
      tierName: tier.name,
      tierBadge: tier.badge,
      monthlyLimitInr: monthlyLimit,
      dailyLimitInr: dailyLimit,
      costProtectionActive: true,
      monthTotalInr: parseFloat(totalSpendInr.toFixed(2)),
      todayTotalInr: parseFloat(todaySpendInr.toFixed(2)),
      remainingMonthlyInr: Math.max(0, parseFloat((monthlyLimit - totalSpendInr).toFixed(2))),
      remainingDailyInr: Math.max(0, parseFloat((dailyLimit - todaySpendInr).toFixed(2))),
      counts,
      tokens,
      spends: {
        text: parseFloat(spends.text.toFixed(2)),
        image: parseFloat(spends.image.toFixed(2)),
        video: parseFloat(spends.video.toFixed(2)),
        builder: parseFloat(spends.builder.toFixed(2)),
        memory: parseFloat(spends.memory.toFixed(2))
      },
      userQuota: userQuota ? {
        day: userQuota.dayUsage,
        month: userQuota.monthUsage,
        dailyLimits: tier.dailyQuotas,
        monthlyLimits: tier.monthlyQuotas,
        remainingDay: {
          textRequests: Math.max(0, tier.dailyQuotas.textRequests - userQuota.dayUsage.textRequests),
          tokens: Math.max(0, tier.dailyQuotas.tokens - userQuota.dayUsage.tokens),
          imageGenerations: Math.max(0, tier.dailyQuotas.imageGenerations - userQuota.dayUsage.imageGenerations),
          videoGenerations: Math.max(0, tier.dailyQuotas.videoGenerations - userQuota.dayUsage.videoGenerations),
          builderGenerations: Math.max(0, tier.dailyQuotas.builderGenerations - userQuota.dayUsage.builderGenerations),
          spendInr: Math.max(0, parseFloat((tier.dailyQuotas.maxSpendInr - userQuota.dayUsage.costInr).toFixed(2)))
        },
        resetSecondsDay: getSecondsUntilMidnight(),
        resetSecondsMonth: getSecondsUntilMonthEnd()
      } : null
    };
  }

  /**
   * Express Middleware Factory for Quotas and Rate Limiting
   */
  static createMiddleware({ type = 'text', estimatedCostInr = 0, estimatedTokens = 500 } = {}) {
    return async (req, res, next) => {
      const uid = req.user?.uid || 'guest_user';
      const isGuest = !req.user || req.user.uid === 'guest_user';
      const clientKey = isGuest ? (req.ip || req.headers['x-forwarded-for'] || 'guest_ip') : uid;

      const tier = QuotaTrackingService.resolveUserTier(uid, req.user);

      // 1. Sliding Window Rate Limit Check
      const rateCheck = QuotaTrackingService.checkRateLimit(clientKey, type, tier);
      res.setHeader('X-RateLimit-Limit', rateCheck.limit);
      res.setHeader('X-RateLimit-Remaining', rateCheck.remaining);
      res.setHeader('X-RateLimit-Reset', rateCheck.resetInSeconds);
      res.setHeader('X-User-Tier', tier.id);

      if (!rateCheck.allowed) {
        res.setHeader('Retry-After', rateCheck.resetInSeconds);
        return res.status(429).json({
          success: false,
          error: `Rate limit reached for ${type}. Please wait ${rateCheck.resetInSeconds}s before retrying.`,
          code: 'RATE_LIMIT_EXCEEDED',
          errorCode: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateCheck.resetInSeconds,
          retryAfterSeconds: rateCheck.resetInSeconds,
          tier: tier.id
        });
      }

      // 2. User & Global Quota Check
      const quotaCheck = QuotaTrackingService.checkQuota(uid, tier, type, estimatedCostInr, estimatedTokens);
      if (!quotaCheck.allowed) {
        res.setHeader('Retry-After', quotaCheck.resetInSeconds || 60);
        return res.status(429).json({
          success: false,
          error: quotaCheck.reason,
          code: quotaCheck.errorCode,
          errorCode: quotaCheck.errorCode,
          retryAfter: quotaCheck.resetInSeconds || 60,
          retryAfterSeconds: quotaCheck.resetInSeconds || 60,
          tier: tier.id
        });
      }

      // Attach context to req for handlers
      req.userTier = tier;
      req.quotaCheck = quotaCheck;

      next();
    };
  }
}
