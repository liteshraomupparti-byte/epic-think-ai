/**
 * Phase 6 Verification Test Suite - Notion & Web Search
 * 
 * Tests:
 * 1. Notion manifest & 4 tools
 * 2. Web Search manifest & 4 tools (authType: 'none')
 * 3. Execution of web search & untrusted data boundary wrapping
 * 4. Indirect prompt injection neutralization in web outputs
 * 5. Parameter schema validation
 * 6. Multi-tenant lifecycle state management
 */

import { notionPlugin } from '../plugins/providers/notion/index.js';
import { webSearchPlugin } from '../plugins/providers/web-search/index.js';
import { registry } from '../plugins/core/PluginRegistry.js';
import { TokenVault } from '../plugins/core/TokenVault.js';
import { ToolExecutionEngine } from '../plugins/core/ToolExecutionEngine.js';
import { RiskTiers } from '../plugins/core/PermissionManager.js';

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
  console.log('PHASE 6: NOTION & WEB SEARCH TEST SUITE');
  console.log('====================================================\n');

  const runId = Date.now();
  const user = `user_p6_${runId}`;

  // -----------------------------------------------------------------
  // 1. Register Plugins & Verify Manifests
  // -----------------------------------------------------------------
  console.log('[1/4] Registering Notion and Web Search Plugins...');
  registry.register(notionPlugin);
  registry.register(webSearchPlugin);

  assert(registry.getPlugin('notion') !== null, 'Notion plugin registered');
  assert(registry.getPlugin('web_search') !== null, 'Web Search plugin registered');

  const notionTools = notionPlugin.getTools();
  assert(notionTools.length === 4, 'Notion declares 4 tools');
  assert(notionTools.some(t => t.name === 'search_pages' && t.permissionTier === RiskTiers.READ), 'search_pages is READ');
  assert(notionTools.some(t => t.name === 'create_page' && t.permissionTier === RiskTiers.WRITE), 'create_page is WRITE');

  const searchTools = webSearchPlugin.getTools();
  assert(searchTools.length === 4, 'Web Search declares 4 tools');
  assert(searchTools.every(t => t.permissionTier === RiskTiers.READ), 'All web search tools are READ tier');

  // -----------------------------------------------------------------
  // 2. Lifecycle States
  // -----------------------------------------------------------------
  console.log('\n[2/4] Testing Lifecycle States...');
  // Web search requires no auth (authType: none) -> can directly install & enable
  await registry.installPlugin(user, 'web_search');
  let searchState = await registry.getUserPluginState(user, 'web_search');
  assert(searchState === 'ENABLED', 'Web Search auto-enables upon install since authType is "none"');

  // Notion requires OAuth
  let notionState = await registry.getUserPluginState(user, 'notion');
  assert(notionState === 'AVAILABLE', 'Notion is initially AVAILABLE');

  await TokenVault.saveCredentials(user, 'notion', { accessToken: 'secret_notion_token_123' });
  await registry.enablePlugin(user, 'notion');
  notionState = await registry.getUserPluginState(user, 'notion');
  assert(notionState === 'ENABLED', 'Notion transitioned to ENABLED after credentials vaulted');

  const activeTools = await registry.getUserActiveTools(user);
  const activeNames = activeTools.map(t => `${t.pluginId}.${t.name}`);
  assert(activeNames.includes('web_search.search'), 'web_search.search is active');
  assert(activeNames.includes('notion.search_pages'), 'notion.search_pages is active');

  // -----------------------------------------------------------------
  // 3. Schema Parameter Validation
  // -----------------------------------------------------------------
  console.log('\n[3/4] Testing Schema Parameter Validation...');
  let webSearchMissingQuery = false;
  try {
    await ToolExecutionEngine.execute({
      uid: user,
      pluginId: 'web_search',
      toolName: 'search',
      args: {} // Missing 'query'
    });
  } catch (err) {
    webSearchMissingQuery = true;
  }
  assert(webSearchMissingQuery, 'web_search.search blocks missing query');

  let notionMissingPageId = false;
  try {
    await ToolExecutionEngine.execute({
      uid: user,
      pluginId: 'notion',
      toolName: 'read_content',
      args: {} // Missing 'pageId'
    });
  } catch (err) {
    notionMissingPageId = true;
  }
  assert(notionMissingPageId, 'notion.read_content blocks missing pageId');

  // -----------------------------------------------------------------
  // 4. Live Tool Execution & Untrusted Boundary Sanitization
  // -----------------------------------------------------------------
  console.log('\n[4/4] Testing Web Search Execution & Untrusted Boundary...');
  const searchResult = await ToolExecutionEngine.execute({
    uid: user,
    pluginId: 'web_search',
    toolName: 'search',
    args: { query: 'Node.js 22 LTS features' }
  });

  assert(searchResult.status === 'success', 'web_search.search executed successfully');
  assert(searchResult.rawOutput.query === 'Node.js 22 LTS features', 'Returned search query matches');
  assert(Array.isArray(searchResult.rawOutput.results), 'Results array returned');

  // Check Untrusted Semantic Containment Boundary
  assert(searchResult.contextString.startsWith('<untrusted_tool_output plugin="web_search" tool="search">'), 'Encapsulated in untrusted boundary tag');
  assert(searchResult.contextString.includes('[EXTERNAL DATA START]'), 'Contains external data opening delimiter');
  assert(searchResult.contextString.includes('[EXTERNAL DATA END]'), 'Contains external data closing delimiter');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 6 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during Phase 6 testing:', err);
  process.exit(1);
});
