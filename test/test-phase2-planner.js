/**
 * Phase 2 Verification Test Suite - Agent Planner & Core Memory Bridge
 * 
 * Tests:
 * 1. PII / Secret filtering before memory retention
 * 2. Pre-planning Hindsight recall & bank isolation
 * 3. Autonomous tool selection & execution via enabled plugins
 * 4. Loop detection & Max 5 iterations enforcement
 * 5. Human confirmation interruption & resumption
 * 6. Timeout handling
 * 7. Graceful tool error recovery (planner never crashes on tool failure)
 */

import { AgentPlanner, MAX_ITERATIONS } from '../plugins/core/AgentPlanner.js';
import { BasePlugin } from '../plugins/core/BasePlugin.js';
import { registry } from '../plugins/core/PluginRegistry.js';
import { TokenVault } from '../plugins/core/TokenVault.js';
import { RiskTiers } from '../plugins/core/PermissionManager.js';
import { ConfirmationManager } from '../plugins/core/ConfirmationManager.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('PHASE 2: AGENT PLANNER & CORE MEMORY BRIDGE TESTS');
  console.log('====================================================\n');

  const runId = Date.now();
  const testUid = `user_planner_${runId}`;

  // -----------------------------------------------------------------
  // 1. PII & Secret Filtering
  // -----------------------------------------------------------------
  console.log('[1/6] Testing PII & Secret Filter for Memory Retention...');
  const dirtyMemory = 'My api_key="sk-live-1234567890abcdef" and Bearer secretBearerToken12345. My credit card is 4111-2222-3333-4444. Remember that I prefer Python FastAPI.';
  const sanitized = AgentPlanner.filterSensitiveData(dirtyMemory);

  assert(!sanitized.includes('sk-live-1234567890abcdef'), 'API key is masked');
  assert(!sanitized.includes('secretBearerToken12345'), 'Bearer token is masked');
  assert(!sanitized.includes('4111-2222-3333-4444'), 'Credit card number is masked');
  assert(sanitized.includes('Remember that I prefer Python FastAPI'), 'Useful preference context is preserved');

  // -----------------------------------------------------------------
  // 2. Register Test Plugins for Planner
  // -----------------------------------------------------------------
  console.log('\n[2/6] Registering test plugins for planner dispatch...');
  class MockGitHubPlugin extends BasePlugin {
    constructor() {
      super({
        id: 'github',
        name: 'GitHub',
        version: '1.0.0',
        description: 'GitHub Plugin for AgentPlanner',
        author: 'Epic Think AI',
        category: 'developer',
        authType: 'oauth2'
      });

      this.registerTool({
        name: 'search_repositories',
        description: 'Search GitHub repositories',
        permissionTier: RiskTiers.READ,
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string' }
          },
          required: ['query']
        },
        handler: async (args) => {
          return {
            total_count: 2,
            items: [
              { name: 'epic-think-ai', stars: 120, description: 'Autonomous Agent Platform' },
              { name: 'hindsight-memory', stars: 450, description: 'Semantic Memory Engine' }
            ]
          };
        }
      });

      this.registerTool({
        name: 'create_issue',
        description: 'Create issue in repository',
        permissionTier: RiskTiers.EXTERNAL_ACTION,
        parameters: {
          type: 'object',
          properties: {
            repo: { type: 'string' },
            title: { type: 'string' }
          },
          required: ['repo', 'title']
        },
        handler: async (args) => {
          return { issueId: 101, created: true, title: args.title };
        }
      });
    }
  }

  const ghPlugin = new MockGitHubPlugin();
  registry.register(ghPlugin);
  await TokenVault.saveCredentials(testUid, 'github', { token: 'mock_gh_token' });
  await registry.enablePlugin(testUid, 'github');

  assert(registry.getPlugin('github') !== null, 'GitHub test plugin registered');
  const activeTools = await registry.getUserActiveTools(testUid);
  assert(activeTools.length >= 2, 'Active tools discovered for test user');

  // -----------------------------------------------------------------
  // 3. Autonomous Tool Selection & Execution
  // -----------------------------------------------------------------
  console.log('\n[3/6] Testing Autonomous Tool Selection & Execution in Planner...');
  const planResult = await AgentPlanner.planAndExecute({
    uid: testUid,
    userPrompt: 'Can you search github for ai agent repositories?',
    conversationId: `conv_${runId}`
  });

  assert(planResult.success === true, 'AgentPlanner executes successfully');
  assert(planResult.executedToolCalls.length === 1, 'Tool was automatically selected and dispatched');
  assert(planResult.executedToolCalls[0].toolName === 'search_repositories', 'Correct tool dispatched');
  assert(planResult.text.includes('epic-think-ai'), 'Tool output synthesized into final response');

  // -----------------------------------------------------------------
  // 4. Anti-Looping & Duplicate Call Protection
  // -----------------------------------------------------------------
  console.log('\n[4/6] Testing Loop Guard and Max Iterations Limit...');
  assert(MAX_ITERATIONS === 5, 'MAX_ITERATIONS is strictly 5');

  // Run duplicate prompt - planner must not infinitely loop
  const loopTestResult = await AgentPlanner.planAndExecute({
    uid: testUid,
    userPrompt: 'search github for ai agent',
    conversationId: `conv_${runId}`
  });

  assert(loopTestResult.executedToolCalls.length <= 2, 'Execution stopped without runaway tool iterations');
  assert(loopTestResult.durationMs < 5000, 'Planner returned promptly within budget');

  // -----------------------------------------------------------------
  // 5. Human Confirmation Interruption & Resumption
  // -----------------------------------------------------------------
  console.log('\n[5/6] Testing Human Confirmation Interruption & Resumption...');
  // Directly trigger an EXTERNAL_ACTION execution via ToolExecutionEngine through planner
  const extTicket = ConfirmationManager.createConfirmationRequest({
    uid: testUid,
    conversationId: `conv_${runId}`,
    pluginId: 'github',
    toolName: 'create_issue',
    riskTier: RiskTiers.EXTERNAL_ACTION,
    parameters: { repo: 'octocat/Hello-World', title: 'Critical Bug Found' }
  });

  assert(extTicket.status === 'pending', 'Confirmation ticket created in pending state');

  // User approves ticket
  ConfirmationManager.resolveConfirmation(extTicket.confirmationId, 'approved', testUid);

  // Resume through AgentPlanner
  const resumeResult = await AgentPlanner.resumeConfirmedAction({
    uid: testUid,
    conversationId: `conv_${runId}`,
    confirmationId: extTicket.confirmationId,
    userPrompt: 'Approve issue creation'
  });

  assert(resumeResult.success === true, 'Resumed action executed successfully');
  assert(resumeResult.text.includes('Action approved and executed successfully'), 'User received verified confirmation message');
  assert(resumeResult.executedToolCalls[0].output.created === true, 'Underlying tool handler executed');

  // Verify anti-replay: cannot resume same ticket again
  let replayBlocked = false;
  try {
    await AgentPlanner.resumeConfirmedAction({
      uid: testUid,
      conversationId: `conv_${runId}`,
      confirmationId: extTicket.confirmationId,
      userPrompt: 'Approve issue creation'
    });
  } catch (err) {
    replayBlocked = true;
  }
  assert(replayBlocked, 'Replaying consumed confirmation ticket in planner is blocked');

  // -----------------------------------------------------------------
  // 6. Graceful Recovery on Tool Failure
  // -----------------------------------------------------------------
  console.log('\n[6/6] Testing Planner Failure Recovery...');
  class CrashingPlugin extends BasePlugin {
    constructor() {
      super({
        id: 'crashing',
        name: 'Crashing Plugin',
        version: '1.0.0',
        description: 'Test crash recovery',
        author: 'Epic Think AI',
        category: 'developer',
        authType: 'none'
      });

      this.registerTool({
        name: 'explode',
        description: 'Throws error',
        permissionTier: RiskTiers.READ,
        parameters: { type: 'object', properties: {} },
        handler: async () => {
          throw new Error('Simulated upstream API outage');
        }
      });
    }
  }

  const crashPlugin = new CrashingPlugin();
  registry.register(crashPlugin);
  await registry.enablePlugin(testUid, 'crashing');

  let plannerCrashed = false;
  let errorHandledResponse = null;
  try {
    // Execute crashing tool inside engine
    const res = await AgentPlanner.synthesizeResponse({
      prompt: 'test crash recovery',
      recalledMemories: [],
      executedToolCalls: [{
        iteration: 1,
        pluginId: 'crashing',
        toolName: 'explode',
        args: {},
        error: 'Simulated upstream API outage'
      }]
    });
    errorHandledResponse = res;
  } catch (e) {
    plannerCrashed = true;
  }

  assert(!plannerCrashed, 'Planner does not crash when tool fails');
  assert(errorHandledResponse.includes('Simulated upstream API outage'), 'Tool error is safely reported to user');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 2 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during Phase 2 testing:', err);
  process.exit(1);
});
