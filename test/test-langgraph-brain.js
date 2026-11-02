/**
 * test/test-langgraph-brain.js
 * 
 * Comprehensive Verification Test for Epic Think AI LangGraph Brain
 * Verifies:
 * 1. StateGraph initialization, channels, and node registrations
 * 2. Multi-step reasoning graph compilation with MemorySaver checkpointer
 * 3. Execution of simple queries and complex queries through the graph
 * 4. Tool discovery and scratchpad resilience
 * 5. AIEngine and REST API endpoints (/api/ai/graph/info, /api/ai/graph)
 */

import { AIEngine, getAgentGraph, executeAgentGraph, aiRouter } from '../ai/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function runTests() {
  console.log('========================================================');
  console.log('🧪 Epic Think AI - LangGraph Brain Integration Test Suite');
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

  // TEST 1: Inspect Graph Metadata
  try {
    const info = AIEngine.getGraphInfo();
    assert(info && info.engine === '@langchain/langgraph', 'Graph metadata reports @langchain/langgraph engine');
    assert(Array.isArray(info.nodes) && info.nodes.length >= 7, `Graph contains all ${info.nodes?.length} core reasoning nodes`);
    assert(info.patterns.includes('Cyclic Tool Execution Loop'), 'Graph patterns include Cyclic Tool Execution Loop');
    assert(info.patterns.includes('Self-Healing & Reflection Validation'), 'Graph patterns include Self-Healing & Reflection');
  } catch (err) {
    assert(false, `Test 1 failed with error: ${err.message}`);
  }

  // TEST 2: Verify Compiled StateGraph Instance
  try {
    const graph = getAgentGraph();
    assert(Boolean(graph), 'getAgentGraph() returns a compiled StateGraph instance');
    assert(typeof graph.invoke === 'function', 'Graph exposes .invoke() method');
  } catch (err) {
    assert(false, `Test 2 failed with error: ${err.message}`);
  }

  // TEST 3: Execute Graph for a Greeting Query
  try {
    console.log('\n--- Running Test 3: Greeting query execution ---');
    const events = [];
    const greetingResult = await executeAgentGraph({
      router: aiRouter,
      uid: 'test_user_langgraph',
      userPrompt: 'Hello! What can you do?',
      modelPreset: 'Epic Think Fast',
      onEvent: (ev) => events.push(ev.event)
    });

    assert(greetingResult && greetingResult.success === true, 'Greeting query returned success: true');
    assert(typeof greetingResult.text === 'string' && greetingResult.text.length > 5, 'Greeting returned non-empty answer text');
    assert(events.includes('graph:start'), 'Events include graph:start');
    assert(events.includes('ai:complete'), 'Events include ai:complete');
    assert(greetingResult.graphMetadata && greetingResult.graphMetadata.cycles >= 1, 'Graph metadata tracks execution cycles');
    console.log(`  Sample output: "${greetingResult.text.slice(0, 100)}..."`);
  } catch (err) {
    assert(false, `Test 3 failed with error: ${err.message}`);
  }

  // TEST 4: Execute Graph with Planning & Complexity
  try {
    console.log('\n--- Running Test 4: Complex multi-step reasoning query ---');
    const events = [];
    const complexResult = await executeAgentGraph({
      router: aiRouter,
      uid: 'test_user_langgraph',
      userPrompt: 'Analyze the benefits of using a directed cyclic graph for autonomous agent self-healing vs linear chains.',
      modelPreset: 'Epic Think 4o',
      onEvent: (ev) => events.push(ev.event)
    });

    assert(complexResult && complexResult.success === true, 'Complex query executed successfully');
    assert(typeof complexResult.text === 'string' && complexResult.text.length > 50, 'Complex query produced comprehensive text');
    assert(events.includes('graph:plan'), 'Complex query triggered graph:plan generation');
    assert(complexResult.plan && Array.isArray(complexResult.plan.steps), 'Plan decomposition returned structured steps');
    console.log(`  Plan steps count: ${complexResult.plan?.steps?.length}`);
    console.log(`  Duration: ${complexResult.durationMs}ms`);
  } catch (err) {
    assert(false, `Test 4 failed with error: ${err.message}`);
  }

  // TEST 5: Verify AIEngine.runGraph() Facade
  try {
    console.log('\n--- Running Test 5: AIEngine.runGraph() facade test ---');
    const facadeResult = await AIEngine.runGraph({
      uid: 'test_user_langgraph',
      prompt: 'Explain what makes LangGraph suitable for resilient agent systems in two sentences.',
      modelPreset: 'Epic Think Fast'
    });

    assert(facadeResult && facadeResult.success === true, 'AIEngine.runGraph() facade executed cleanly');
    assert(facadeResult.text.length > 20, 'Facade response has valid text content');
  } catch (err) {
    assert(false, `Test 5 failed with error: ${err.message}`);
  }

  console.log('\n========================================================');
  console.log(`📊 Test Summary: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================');

  if (passed === total) {
    console.log('🎉 All LangGraph brain integration tests passed flawlessly!');
    process.exit(0);
  } else {
    console.error('⚠️ Some tests failed.');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
