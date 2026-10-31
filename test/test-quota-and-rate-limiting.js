/**
 * test/test-quota-and-rate-limiting.js
 * 
 * Comprehensive Test Suite for Epic Think AI:
 * User Quota, Usage Tracking, Rate Limiting & Cost Protection System
 */

import {
  QuotaTrackingService,
  USER_TIERS,
  PRICING_TABLE,
  getTodayKey,
  getMonthKey,
  getSecondsUntilMidnight,
  getSecondsUntilMonthEnd,
  DEFAULT_MONTHLY_BUDGET_INR,
  DEFAULT_DAILY_BUDGET_INR
} from '../services/usage/QuotaTrackingService.js';
import { UsageMeter } from '../services/media/UsageMeter.js';
import {
  recordUsageToDb,
  getUserQuotaDoc,
  updateUserQuotaDoc,
  getUserDetailedUsage,
  updateUserTier,
  getUserUsageStats
} from '../services/mongoService.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log(' EPIC THINK AI - QUOTA, RATE LIMITING & COST PROTECTION TESTS');
  console.log('================================================================\n');

  // ------------------------------------------------------------------------
  // TEST GROUP 1: TIER CONFIGURATIONS & CAPACITIES
  // ------------------------------------------------------------------------
  console.log('[TEST GROUP 1] User Tiers & Capacity Definitions');
  assert(USER_TIERS.guest !== undefined, 'Guest tier defined');
  assert(USER_TIERS.free !== undefined, 'Free account tier defined');
  assert(USER_TIERS.pro !== undefined, 'Pro tier defined');
  assert(USER_TIERS.admin !== undefined, 'Admin tier defined');

  assert(USER_TIERS.guest.dailyQuotas.textRequests === 25, 'Guest daily text limit is 25 requests');
  assert(USER_TIERS.free.dailyQuotas.textRequests === 250, 'Free tier daily text limit is 250 requests');
  assert(USER_TIERS.pro.dailyQuotas.textRequests === 2000, 'Pro tier daily text limit is 2,000 requests');

  assert(USER_TIERS.free.dailyQuotas.imageGenerations === 50, 'Free tier daily image limit is 50');
  assert(USER_TIERS.free.dailyQuotas.videoGenerations === 8, 'Free tier daily video limit is 8');
  assert(USER_TIERS.free.dailyQuotas.builderGenerations === 40, 'Free tier daily builder limit is 40');

  // Resolve user tiers
  const guestResolved = QuotaTrackingService.resolveUserTier('guest_user');
  assert(guestResolved.id === 'guest', 'guest_user correctly resolves to guest tier');
  const userResolved = QuotaTrackingService.resolveUserTier('firebase_user_abc123');
  assert(userResolved.id === 'free', 'Standard user UID resolves to free tier by default');
  const proResolved = QuotaTrackingService.resolveUserTier('firebase_user_pro', { tier: 'pro' });
  assert(proResolved.id === 'pro', 'Profile with tier: "pro" resolves to pro tier');

  // ------------------------------------------------------------------------
  // TEST GROUP 2: FINANCIAL PRICING ENGINE
  // ------------------------------------------------------------------------
  console.log('\n[TEST GROUP 2] Accurate Cost Calculation Engine (USD & INR)');
  const textCostGroq = QuotaTrackingService.calculateCost({
    type: 'text',
    provider: 'groq',
    model: 'qwen/qwen3.8-27b',
    promptTokens: 1000,
    completionTokens: 1000
  });
  assert(textCostGroq.costInr >= 0, `Groq 2000 tokens computed to ₹${textCostGroq.costInr}`);
  assert(textCostGroq.costUsd >= 0, `Groq 2000 tokens computed to $${textCostGroq.costUsd}`);

  const imageCostFree = QuotaTrackingService.calculateCost({
    type: 'image',
    provider: 'Pollinations.ai',
    model: 'flux'
  });
  assert(imageCostFree.costInr === 0, 'Pollinations Flux free tier is ₹0.00');

  const imageCostPro = QuotaTrackingService.calculateCost({
    type: 'image',
    provider: 'Pollinations.ai',
    model: 'flux-pro'
  });
  assert(imageCostPro.costInr === 2.00, `Pollinations Flux Pro is ₹${imageCostPro.costInr}`);

  const imageCostGemini = QuotaTrackingService.calculateCost({
    type: 'image',
    provider: 'Google Gemini',
    model: 'gemini-3-pro-image-preview'
  });
  assert(imageCostGemini.costInr === 2.50, `Gemini Image generation is ₹${imageCostGemini.costInr}`);

  const videoCostVeo = QuotaTrackingService.calculateCost({
    type: 'video',
    provider: 'Pollinations.ai',
    model: 'google/veo-3.1-fast'
  });
  assert(videoCostVeo.costInr === 28.00, `Veo 3.1 video clip is ₹${videoCostVeo.costInr}`);

  // ------------------------------------------------------------------------
  // TEST GROUP 3: SLIDING WINDOW RATE LIMITER
  // ------------------------------------------------------------------------
  console.log('\n[TEST GROUP 3] Sliding Window Rate Limiting');
  const testClient = `test_client_${Date.now()}`;
  const guestTier = USER_TIERS.guest; // 10 text/min, 20 global/min

  // Execute 10 requests rapidly
  let lastRateResult = null;
  for (let i = 0; i < 10; i++) {
    lastRateResult = QuotaTrackingService.checkRateLimit(testClient, 'text', guestTier);
    assert(lastRateResult.allowed === true, `Burst request #${i + 1} allowed (remaining: ${lastRateResult.remaining})`);
  }

  // 11th request must be rejected with 429 rate limit exceeded
  const blockedRateResult = QuotaTrackingService.checkRateLimit(testClient, 'text', guestTier);
  assert(blockedRateResult.allowed === false, '11th text request in 60s window was blocked');
  assert(blockedRateResult.remaining === 0, 'Remaining allowance is 0');
  assert(blockedRateResult.resetInSeconds > 0, `Reset countdown active: ${blockedRateResult.resetInSeconds}s`);

  // ------------------------------------------------------------------------
  // TEST GROUP 4: IN-FLIGHT CONCURRENCY & DEDUPLICATION LOCK
  // ------------------------------------------------------------------------
  console.log('\n[TEST GROUP 4] In-Flight Concurrency & Deduplication Locking');
  const testUid = `user_concurrency_${Date.now()}`;
  const testPrompt = 'Build an autonomous landing page for Devika Collections';
  const fp = QuotaTrackingService.getRequestFingerprint(testUid, 'builder', testPrompt);

  const lock1 = QuotaTrackingService.acquireLock(fp, 10000);
  assert(lock1 === true, 'Acquired in-flight lock for submission');

  const lockDuplicate = QuotaTrackingService.acquireLock(fp, 10000);
  assert(lockDuplicate === false, 'Duplicate rapid submission blocked while previous is in-flight');

  QuotaTrackingService.releaseLock(fp);
  const lockReacquired = QuotaTrackingService.acquireLock(fp, 10000);
  assert(lockReacquired === true, 'Lock successfully re-acquired after release');
  QuotaTrackingService.releaseLock(fp);

  // ------------------------------------------------------------------------
  // TEST GROUP 5: DAILY & MONTHLY QUOTA ENFORCEMENT
  // ------------------------------------------------------------------------
  console.log('\n[TEST GROUP 5] Daily & Monthly Quota Enforcement');
  const quotaUid = `user_quota_test_${Date.now()}`;
  const quotaDoc = QuotaTrackingService.getOrInitUserQuota(quotaUid, USER_TIERS.guest);

  assert(quotaDoc.dayUsage.textRequests === 0, 'Initial daily text count is 0');
  const checkInitial = QuotaTrackingService.checkQuota(quotaUid, USER_TIERS.guest, 'text');
  assert(checkInitial.allowed === true, 'Fresh guest account allowed to generate text');

  // Simulate reaching the daily limit of 25
  quotaDoc.dayUsage.textRequests = 25;
  const checkExceeded = QuotaTrackingService.checkQuota(quotaUid, USER_TIERS.guest, 'text');
  assert(checkExceeded.allowed === false, 'Request blocked after hitting daily text limit');
  assert(checkExceeded.errorCode === 'DAILY_TEXT_QUOTA_EXCEEDED', `Correct error code: ${checkExceeded.errorCode}`);
  assert(checkExceeded.resetInSeconds > 0, `Reset countdown: ${checkExceeded.resetInSeconds}s`);

  // Image limit check
  quotaDoc.dayUsage.imageGenerations = 6;
  const checkImageExceeded = QuotaTrackingService.checkQuota(quotaUid, USER_TIERS.guest, 'image');
  assert(checkImageExceeded.allowed === false, 'Request blocked after hitting daily image limit');
  assert(checkImageExceeded.errorCode === 'DAILY_IMAGE_QUOTA_EXCEEDED', `Correct image error code: ${checkImageExceeded.errorCode}`);

  // Financial spend limit check
  quotaDoc.dayUsage.costInr = 15.0;
  const checkSpendExceeded = QuotaTrackingService.checkQuota(quotaUid, USER_TIERS.guest, 'video', 5.0);
  assert(checkSpendExceeded.allowed === false, 'Request blocked after hitting daily spend ceiling');
  assert(checkSpendExceeded.errorCode === 'DAILY_USER_SPEND_LIMIT_REACHED', `Correct spend error code: ${checkSpendExceeded.errorCode}`);

  // ------------------------------------------------------------------------
  // TEST GROUP 6: USAGE RECORDING & TELEMETRY PERSISTENCE
  // ------------------------------------------------------------------------
  console.log('\n[TEST GROUP 6] Usage Recording & Dual Persistence');
  const trackedUid = `user_track_${Date.now()}`;
  const record = await QuotaTrackingService.recordUsageEvent({
    uid: trackedUid,
    email: 'test@epicthink.ai',
    tier: 'free',
    type: 'text',
    provider: 'groq',
    model: 'qwen/qwen3.8-27b',
    promptTokens: 150,
    completionTokens: 350,
    totalTokens: 500,
    durationMs: 420
  });

  assert(record.id.startsWith('rec_'), 'Record assigned unique identifier');
  assert(record.totalTokens === 500, '500 total tokens recorded');
  assert(record.costInr > 0, `Recorded INR cost: ₹${record.costInr}`);

  const userSummary = QuotaTrackingService.getUsageSummary(trackedUid);
  assert(userSummary.counts.text >= 1, 'Summary reflects 1 text generation event');
  assert(userSummary.tokens.total >= 500, 'Summary reflects 500 tokens');
  assert(userSummary.userQuota.day.textRequests >= 1, 'Atomic quota dayUsage text counter incremented');

  // Verify detailed usage retrieval
  const detailed = await getUserDetailedUsage(trackedUid, 10);
  assert(detailed.count >= 1, 'getUserDetailedUsage retrieved recorded event from store');
  assert(detailed.records[0].model === 'qwen/qwen3.8-27b', 'Detailed record contains truthful model attribution');

  // ------------------------------------------------------------------------
  // TEST GROUP 7: USER TIER UPGRADES & ELEVATIONS
  // ------------------------------------------------------------------------
  console.log('\n[TEST GROUP 7] User Tier Upgrades');
  const upgradedUser = await updateUserTier(trackedUid, 'pro');
  assert(upgradedUser.tier === 'pro', 'User tier successfully upgraded to "pro"');
  const proSummary = QuotaTrackingService.getUsageSummary(trackedUid, 'pro');
  assert(proSummary.tier === 'pro', 'Summary reflects updated Pro Tier');
  assert(proSummary.userQuota.dailyLimits.textRequests === 2000, 'Daily limit elevated to 2,000 prompts');

  // ------------------------------------------------------------------------
  // TEST GROUP 8: USAGE METER BACKWARD COMPATIBILITY
  // ------------------------------------------------------------------------
  console.log('\n[TEST GROUP 8] UsageMeter Backward Compatibility');
  const usageStatus = UsageMeter.getUsageSummary();
  assert(usageStatus.monthlyLimitInr === 1000, 'Monthly budget is ₹1,000');
  assert(usageStatus.dailyLimitInr === 50, 'Daily budget is ₹50');
  assert(usageStatus.counts !== undefined && usageStatus.counts.image !== undefined, 'Image count metrics intact');
  assert(usageStatus.counts !== undefined && usageStatus.counts.video !== undefined, 'Video count metrics intact');
  assert(usageStatus.spends !== undefined && usageStatus.spends.image !== undefined, 'Image spend metrics intact');

  const budgetCheck = UsageMeter.checkBudget(trackedUid, 'image', 0);
  assert(budgetCheck.allowed === true, 'UsageMeter.checkBudget returned allowed: true');

  // ------------------------------------------------------------------------
  // TEST GROUP 9: EXPRESS MIDDLEWARE GENERATOR
  // ------------------------------------------------------------------------
  console.log('\n[TEST GROUP 9] Express Quota & Rate Limit Middleware');
  const middleware = QuotaTrackingService.createMiddleware({ type: 'text', estimatedCostInr: 0.01 });
  let nextCalled = false;
  const mockReq = {
    user: { uid: `mid_user_${Date.now()}`, tier: 'free' },
    ip: '127.0.0.1',
    headers: {}
  };
  const mockHeaders = {};
  const mockRes = {
    setHeader: (k, v) => { mockHeaders[k] = v; },
    status: (code) => ({
      json: (data) => ({ statusCode: code, data })
    })
  };

  await middleware(mockReq, mockRes, () => { nextCalled = true; });
  assert(nextCalled === true, 'Middleware allowed compliant request through to handler');
  assert(mockHeaders['X-RateLimit-Limit'] !== undefined, 'X-RateLimit-Limit header set');
  assert(mockHeaders['X-RateLimit-Remaining'] !== undefined, 'X-RateLimit-Remaining header set');
  assert(mockHeaders['X-User-Tier'] === 'free', 'X-User-Tier header accurately set to free');

  console.log('\n================================================================');
  console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
