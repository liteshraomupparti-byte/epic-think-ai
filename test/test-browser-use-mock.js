/**
 * test/test-browser-use-mock.js
 * 
 * Strict Mock Verification for Browser Use V4 Integration
 * Validates:
 * 1. Default V4 task omits model and modelParams (GPT-6 Luna with High reasoning)
 * 2. Speed-first task sets model="bu-ultrafast" and omits modelParams
 * 3. Explicit model settings are preserved
 * 4. Run cost is capped at $1 (maxCostUsd: 1.0 / max_cost_usd: 1.0)
 * 5. Ambiguous creates are not retried
 * 6. Abandoned/timed-out runs trigger client.runs.cancel(runId)
 * 7. Browser stop cleanup works
 */

import { BrowserUseClient } from '../plugins/providers/browser-use/BrowserUseClient.js';

async function runMockTests() {
  console.log('========================================================');
  console.log('🧪 Browser Use V4 SDK - Mock Verification Test Suite');
  console.log('========================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // TEST 1: Default V4 task omits model and modelParams, caps cost at $1
  try {
    console.log('--- Test 1: Default V4 Task (GPT-6 Luna High Reasoning) ---');
    let capturedBody = null;
    const mockSdk = {
      runs: {
        create: async (body) => {
          capturedBody = body;
          return { id: 'run_mock_1', status: 'running' };
        },
        waitForCompletion: async (runId) => {
          return {
            id: runId,
            status: 'completed',
            isSuccess: true,
            result: 'Mock Hacker News top story: AI Agents',
            costUsd: 0.04
          };
        },
        cancel: async () => {}
      },
      browsers: {
        stop: async () => ({ success: true })
      }
    };

    const client = new BrowserUseClient({ apiKey: 'bu_mock_key', client: mockSdk });
    const res = await client.runTask('Find the top Hacker News story');

    assert(capturedBody !== null, 'Request body was sent to client.runs.create');
    assert(capturedBody.model === undefined, 'Default V4 task omits model (uses GPT-6 Luna default)');
    assert(capturedBody.modelParams === undefined, 'Default V4 task omits modelParams (uses High reasoning)');
    assert(capturedBody.maxCostUsd === 1.0, 'maxCostUsd is capped at $1.0');
    assert(capturedBody.max_cost_usd === 1.0, 'max_cost_usd is capped at $1.0');
    assert(res.success === true, 'Run completed successfully');
    assert(res.result.includes('Hacker News'), 'Result validated from completed status');
  } catch (err) {
    assert(false, `Test 1 failed: ${err.message}`);
  }

  // TEST 2: Speed-first task sets model="bu-ultrafast" without modelParams
  try {
    console.log('\n--- Test 2: Speed-First Task (bu-ultrafast) ---');
    let capturedBody = null;
    const mockSdk = {
      runs: {
        create: async (body) => {
          capturedBody = body;
          return { id: 'run_mock_speed', status: 'running' };
        },
        waitForCompletion: async () => ({
          status: 'completed',
          isSuccess: true,
          result: 'Ultra fast flight search complete'
        }),
        cancel: async () => {}
      }
    };

    const client = new BrowserUseClient({ apiKey: 'bu_mock_key', client: mockSdk });
    await client.runTask('Search flights from NYC to London', { speedFirst: true });

    assert(capturedBody.model === 'bu-ultrafast', 'Speed-first task sets model="bu-ultrafast"');
    assert(capturedBody.modelParams === undefined, 'bu-ultrafast rejects and omits modelParams');
    assert(capturedBody.maxCostUsd === 1.0, 'Cost capped at $1.0');
  } catch (err) {
    assert(false, `Test 2 failed: ${err.message}`);
  }

  // TEST 3: Preserve explicit model settings
  try {
    console.log('\n--- Test 3: Explicit Model Settings Preserved ---');
    let capturedBody = null;
    const mockSdk = {
      runs: {
        create: async (body) => {
          capturedBody = body;
          return { id: 'run_mock_custom', status: 'running' };
        },
        waitForCompletion: async () => ({ status: 'completed', isSuccess: true, result: 'Done' }),
        cancel: async () => {}
      }
    };

    const client = new BrowserUseClient({ apiKey: 'bu_mock_key', client: mockSdk });
    await client.runTask('Research query', { model: 'bu-fast' });

    assert(capturedBody.model === 'bu-fast', 'Explicit model="bu-fast" preserved');
  } catch (err) {
    assert(false, `Test 3 failed: ${err.message}`);
  }

  // TEST 4: Do not retry ambiguous creates
  try {
    console.log('\n--- Test 4: Do Not Retry Ambiguous Creates ---');
    let createAttempts = 0;
    const mockSdk = {
      runs: {
        create: async () => {
          createAttempts++;
          throw new Error('500 Internal Server Error (ambiguous)');
        }
      }
    };

    const client = new BrowserUseClient({ apiKey: 'bu_mock_key', client: mockSdk });
    let failed = false;
    try {
      await client.runTask('Check ambiguous create');
    } catch (_) {
      failed = true;
    }

    assert(failed === true, 'Ambiguous create threw error');
    assert(createAttempts === 1, 'Did not retry ambiguous create (createAttempts === 1)');
  } catch (err) {
    assert(false, `Test 4 failed: ${err.message}`);
  }

  // TEST 5: Timeout cancels abandoned run
  try {
    console.log('\n--- Test 5: Cancel Abandoned Run on Timeout ---');
    let cancelCalledWith = null;
    const mockSdk = {
      runs: {
        create: async () => ({ id: 'run_abandoned_123', status: 'running' }),
        waitForCompletion: async () => {
          throw new Error('Run run_abandoned_123 did not complete within 1000ms');
        },
        cancel: async (runId) => {
          cancelCalledWith = runId;
          return { success: true };
        }
      }
    };

    const client = new BrowserUseClient({ apiKey: 'bu_mock_key', client: mockSdk });
    let timedOut = false;
    try {
      await client.runTask('Long running task', { timeoutMs: 1000 });
    } catch (_) {
      timedOut = true;
    }

    assert(timedOut === true, 'Task timed out as expected');
    assert(cancelCalledWith === 'run_abandoned_123', 'client.runs.cancel called with run ID to prevent credit drain');
  } catch (err) {
    assert(false, `Test 5 failed: ${err.message}`);
  }

  // TEST 6: Stop Browser cleanup
  try {
    console.log('\n--- Test 6: Stop Managed Browser ---');
    let stoppedBrowserId = null;
    const mockSdk = {
      browsers: {
        stop: async (browserId) => {
          stoppedBrowserId = browserId;
          return { success: true };
        }
      }
    };

    const client = new BrowserUseClient({ apiKey: 'bu_mock_key', client: mockSdk });
    const res = await client.stopBrowser('browser_test_789');

    assert(res === true, 'stopBrowser returned true');
    assert(stoppedBrowserId === 'browser_test_789', 'client.browsers.stop called with browserId');
  } catch (err) {
    assert(false, `Test 6 failed: ${err.message}`);
  }

  console.log('\n========================================================');
  console.log(`📊 Mock Test Summary: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================');

  if (passed === total) {
    console.log('🎉 All Browser Use V4 mock constraint tests passed flawlessly!');
    process.exit(0);
  } else {
    console.error('⚠️ Some tests failed.');
    process.exit(1);
  }
}

runMockTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
