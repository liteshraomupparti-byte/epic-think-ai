/**
 * test/test-browser-use-plugin.js
 * 
 * Comprehensive Test Suite for Browser Use Plugin in Epic Think AI
 */

import { initializePlugins, registry } from '../plugins/index.js';
import { ToolExecutionEngine } from '../plugins/core/ToolExecutionEngine.js';
import { browserUseClient } from '../plugins/providers/browser-use/BrowserUseClient.js';
import dotenv from 'dotenv';
dotenv.config();

async function runTests() {
  console.log('========================================================');
  console.log('🌐 Epic Think AI - Browser Use Plugin Test Suite');
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

  // TEST 1: Plugin Registry Registration
  try {
    initializePlugins();
    const plugin = registry.getPlugin('browser_use');
    assert(Boolean(plugin), 'Plugin "browser_use" is registered in PluginRegistry');
    assert(plugin.name.includes('Browser Use'), 'Plugin name reflects Browser Use');
    assert(plugin.category === 'search', 'Plugin category is search');

    const tools = plugin.getTools();
    assert(tools.length === 5, `Plugin exposes all 5 tools (found ${tools.length})`);
    const toolNames = tools.map(t => t.name);
    assert(toolNames.includes('browser_run_task'), 'Exposes browser_run_task');
    assert(toolNames.includes('browser_navigate'), 'Exposes browser_navigate');
    assert(toolNames.includes('browser_extract'), 'Exposes browser_extract');
    assert(toolNames.includes('browser_screenshot'), 'Exposes browser_screenshot');
    assert(toolNames.includes('browser_get_task_status'), 'Exposes browser_get_task_status');
  } catch (err) {
    assert(false, `Test 1 failed: ${err.message}`);
  }

  // TEST 2: Stealth Navigation to Live Webpage
  try {
    console.log('\n--- Running Test 2: Stealth Navigation ---');
    const navResult = await browserUseClient.navigate('https://example.com');
    assert(navResult && navResult.success === true, 'Navigation returned success: true');
    assert(navResult.statusCode === 200, `Status code is 200 (got ${navResult.statusCode})`);
    assert(navResult.title.toLowerCase().includes('example'), `Extracted page title: "${navResult.title}"`);
    assert(navResult.textSnippet.length > 20, 'Extracted text content from page');
    assert(Array.isArray(navResult.headings), 'Extracted headings array');
    console.log(`  Title: ${navResult.title}`);
    console.log(`  Snippet: "${navResult.textSnippet.slice(0, 100)}..."`);
  } catch (err) {
    assert(false, `Test 2 failed: ${err.message}`);
  }

  // TEST 3: Structured Data Extraction
  try {
    console.log('\n--- Running Test 3: Structured Data Extraction ---');
    const extractResult = await browserUseClient.extractData('https://example.com', 'Summary information');
    assert(extractResult && extractResult.success === true, 'Extraction returned success: true');
    assert(extractResult.title.length > 0, 'Extraction captured page title');
    assert(extractResult.content.length > 0, 'Extraction captured content');
  } catch (err) {
    assert(false, `Test 3 failed: ${err.message}`);
  }

  // TEST 4: Screenshot Snapshot URL Generation
  try {
    console.log('\n--- Running Test 4: Visual Screenshot Generation ---');
    const shot = await browserUseClient.captureScreenshot('https://example.com', { width: 1440, height: 900 });
    assert(shot && shot.success === true, 'Screenshot generation succeeded');
    assert(shot.screenshotUrl.includes('image.thum.io'), 'Generated visual snapshot URL');
    assert(shot.width === 1440 && shot.height === 900, 'Custom viewport dimensions applied');
    console.log(`  Snapshot URL: ${shot.screenshotUrl}`);
  } catch (err) {
    assert(false, `Test 4 failed: ${err.message}`);
  }

  // TEST 5: Autonomous Task Execution
  try {
    console.log('\n--- Running Test 5: Autonomous Browser Task ---');
    const taskResult = await browserUseClient.runTask('Navigate to https://example.com and inspect headers');
    assert(taskResult && taskResult.success === true, 'Autonomous task completed successfully');
    assert(taskResult.output && taskResult.output.length > 20, 'Task generated output text');
    console.log(`  Output preview: "${taskResult.output.slice(0, 100)}..."`);
  } catch (err) {
    assert(false, `Test 5 failed: ${err.message}`);
  }

  // TEST 6: ToolExecutionEngine Integration
  try {
    console.log('\n--- Running Test 6: ToolExecutionEngine invocation ---');
    await registry.enablePlugin('test_user_browser', 'browser_use');
    const toolExec = await ToolExecutionEngine.execute({
      uid: 'test_user_browser',
      pluginId: 'browser_use',
      toolName: 'browser_navigate',
      args: { url: 'https://example.com' }
    });

    assert(toolExec && toolExec.status === 'success', 'ToolExecutionEngine executed browser_navigate');
    assert(toolExec.rawOutput && toolExec.rawOutput.title.toLowerCase().includes('example'), 'Tool returned valid title via engine');
  } catch (err) {
    assert(false, `Test 6 failed: ${err.message}`);
  }

  console.log('\n========================================================');
  console.log(`📊 Test Summary: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================');

  if (passed === total) {
    console.log('🎉 All Browser Use integration tests passed flawlessly!');
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
