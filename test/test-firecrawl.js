import { initializePlugins, registry } from '../plugins/index.js';
import { ToolExecutionEngine } from '../plugins/core/ToolExecutionEngine.js';

async function test() {
  console.log('--- Testing Firecrawl Plugin Registration ---');
  initializePlugins();

  const plugin = registry.getPlugin('firecrawl');
  if (!plugin) throw new Error('firecrawl plugin not registered in PluginRegistry');
  console.log('✅ firecrawl plugin registered successfully');

  const tools = Array.from(plugin.tools.values());
  console.log(`Registered tools (${tools.length}):`, tools.map(t => t.name).join(', '));
  if (tools.length !== 4) throw new Error(`Expected 4 tools, got ${tools.length}`);
  console.log('✅ All 4 tools declared');

  console.log('--- Testing firecrawl_scrape tool execution ---');
  const scrapeResult = await ToolExecutionEngine.execute({
    uid: 'test_user_firecrawl',
    pluginId: 'firecrawl',
    toolName: 'firecrawl_scrape',
    args: { url: 'https://example.com' }
  });

  console.log('Scrape result status:', scrapeResult.status);
  console.log('Scrape raw output title:', scrapeResult.rawOutput?.title);
  if (!scrapeResult.rawOutput?.title?.toLowerCase().includes('example')) {
    throw new Error('Scraped title does not include Example');
  }
  console.log('✅ Real web scrape via Firecrawl engine executed cleanly!');
}

test().catch(err => {
  console.error('Firecrawl test error:', err);
  process.exit(1);
});
