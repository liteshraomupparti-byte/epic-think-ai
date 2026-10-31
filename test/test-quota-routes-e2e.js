/**
 * Integration Test for Quota, Rate Limiting & Usage Endpoints on Live Express App
 */

import http from 'http';
import app from '../server.js';
import { QuotaTrackingService } from '../services/usage/QuotaTrackingService.js';

async function run() {
  console.log('================================================================');
  console.log(' EPIC THINK AI - QUOTA & RATE LIMIT ROUTE E2E TESTS');
  console.log('================================================================\n');

  const PORT = 3998;
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[TEST SERVER] Running on http://localhost:${PORT}`);

  let passed = 0;
  let failed = 0;

  function assert(cond, msg) {
    if (cond) {
      console.log(`  ✓ [PASS] ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${msg}`);
      failed++;
    }
  }

  try {
    const BASE = `http://localhost:${PORT}`;

    // Test 1: Public /api/usage/status endpoint
    console.log('[SECTION 1] Testing /api/usage/status...');
    const statusRes = await fetch(`${BASE}/api/usage/status`);
    const statusData = await statusRes.json();
    assert(statusRes.status === 200, 'GET /api/usage/status returns 200 OK');
    assert(statusData.success === true, 'Response contains success: true');
    assert(statusData.monthlyLimitInr === 1000, 'Monthly budget limit is ₹1,000');
    assert(statusData.dailyLimitInr === 50, 'Daily budget limit is ₹50');
    assert(typeof statusData.costProtectionActive === 'boolean', 'Cost protection flag present');

    // Test 2: Unauthenticated GET /api/user/quota
    console.log('\n[SECTION 2] Testing /api/user/quota...');
    const quotaRes = await fetch(`${BASE}/api/user/quota`);
    const quotaData = await quotaRes.json();
    assert(quotaRes.status === 200, 'GET /api/user/quota returns 200 OK for guest');
    assert(quotaData.success === true, 'Quota response contains success: true');
    assert(quotaData.tier === 'guest', 'Unauthenticated request correctly identifies as guest tier');
    assert(quotaData.userQuota !== undefined, 'User quota payload present');
    assert(quotaData.monthlyLimitInr === 1000, 'Monthly budget limit is present');
    assert(quotaData.dailyLimitInr === 50, 'Daily budget limit is present');

    // Test 3: Unauthenticated GET /api/user/usage
    console.log('\n[SECTION 3] Testing /api/user/usage...');
    const usageRes = await fetch(`${BASE}/api/user/usage`);
    const usageData = await usageRes.json();
    assert(usageRes.status === 200, 'GET /api/user/usage returns 200 OK');
    assert(usageData.success === true, 'Usage response contains success: true');
    assert(Array.isArray(usageData.records), 'Detailed records array is present');
    assert(usageData.summary !== undefined, 'Summary object is present');

    // Test 4: Rate Limiter on POST /api/ai/chat (guest RPM limit = 10)
    console.log('\n[SECTION 4] Testing Rate Limiting & 429 Header Contract on /api/ai/chat...');
    const testIp = '198.51.100.99';
    // Clear any previous window for this test key
    QuotaTrackingService.clearInMemoryLedger();

    let rateLimited = false;
    let lastStatus = 0;
    let rateLimitHeaders = {};

    for (let i = 0; i < 12; i++) {
      const res = await fetch(`${BASE}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': testIp
        },
        body: JSON.stringify({ message: 'Hello' })
      });

      lastStatus = res.status;
      if (res.status === 429) {
        rateLimited = true;
        rateLimitHeaders = {
          limit: res.headers.get('x-ratelimit-limit'),
          remaining: res.headers.get('x-ratelimit-remaining'),
          tier: res.headers.get('x-user-tier'),
          retryAfter: res.headers.get('retry-after')
        };
        const body = await res.json();
        assert(body.success === false, '429 response has success: false');
        assert(body.code === 'RATE_LIMIT_EXCEEDED', '429 code is RATE_LIMIT_EXCEEDED');
        assert(typeof body.retryAfter === 'number', 'retryAfter in response body is a number');
        break;
      }
    }

    assert(rateLimited, 'Request 11 was blocked with HTTP 429 Too Many Requests');
    assert(rateLimitHeaders.tier === 'guest', 'X-User-Tier header correctly set to guest');
    assert(rateLimitHeaders.retryAfter !== null, 'Retry-After HTTP header is set');
    assert(rateLimitHeaders.remaining === '0', 'X-RateLimit-Remaining is 0');

    // Test 5: Quota Exceeded 429 scenario
    console.log('\n[SECTION 5] Testing Daily Quota Exhaustion...');
    // Artificially record 25 requests for a guest IP
    const quotaIp = '198.51.100.100';
    for (let i = 0; i < 25; i++) {
      await QuotaTrackingService.recordUsage({
        uid: null,
        ip: quotaIp,
        type: 'text',
        provider: 'groq',
        model: 'llama3-8b-8192',
        tokens: 10
      });
    }

    const quotaBlockRes = await fetch(`${BASE}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': quotaIp
      },
      body: JSON.stringify({ message: 'Should be blocked by quota' })
    });

    const quotaBlockBody = await quotaBlockRes.json();
    assert(quotaBlockRes.status === 429, 'Blocked with 429 when daily text quota exhausted');
    assert(quotaBlockBody.code === 'DAILY_TEXT_QUOTA_EXCEEDED', 'Error code is DAILY_TEXT_QUOTA_EXCEEDED');
    assert(quotaBlockBody.tier === 'guest', 'Reports guest tier');

    console.log('\n================================================================');
    console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('Test run error:', err);
    failed++;
  } finally {
    server.close();
    process.exit(failed === 0 ? 0 : 1);
  }
}

run();
