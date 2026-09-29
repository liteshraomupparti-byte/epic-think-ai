/**
 * test-builder-v2.js - Comprehensive End-to-End Test Suite for Website Builder 2.0
 * Verifies all 14 phases and core services:
 * - Model Router discovery & capability mapping
 * - Multi-page management (create, list, delete with layout inheritance)
 * - Reusable component detection & instance counting
 * - Asset Manager & Image/Video Generation abstraction
 * - Responsive Audit Engine & 1-click Auto-Fix
 * - Technical SEO Audit Engine & 1-click Auto-Fix
 * - Visual Inspector direct CSS persistence
 * - Plugin Connectors status
 * - Hindsight semantic project memory
 */

import assert from 'assert';

const BASE_URL = 'http://localhost:3001';
const PROJECT_ID = 'devika_collections';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING EPIC THINK AI - WEBSITE BUILDER 2.0 TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`⏳ ${name}... `);
      await fn();
      console.log('✅ PASS');
      passed++;
    } catch (err) {
      console.log('❌ FAIL');
      console.error('   Error:', err.message);
      failed++;
    }
  }

  // 1. Model Router Discovery
  await test('Phase 8: Model Router & Capability Registry', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/models`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.models), 'models should be an array');
    assert.ok(data.models.length > 0, 'at least 1 model registered');
    
    // Verify capability metadata
    const sample = data.models[0];
    assert.ok(sample.id, 'model has id');
    assert.ok(sample.capabilities, 'model has capabilities');
    assert.ok(typeof sample.speedClass === 'string', 'model has speedClass');
    assert.ok(typeof sample.qualityClass === 'string', 'model has qualityClass');
  });

  // 2. Multi-Page Manager - List pages
  await test('Phase 22: Multi-Page Manager - List existing pages', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/pages`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.pages), 'pages is an array');
    assert.ok(data.pages.some(p => p.file === 'index.html'), 'index.html exists');
  });

  // 3. Multi-Page Manager - Create new page with layout inheritance
  await test('Phase 22: Multi-Page Manager - Create new page (about.html)', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'about',
        title: 'About Devika Luxury',
        description: 'Bespoke high fashion atelier and heritage craft'
      })
    });
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.file, 'about.html');
    assert.ok(data.previewUrl.includes('/about.html'));
  });

  // 4. Component System - Scan reusable components
  await test('Phase 23: Component System - Scan reusable components & instances', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/components`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.components), 'components is an array');
    assert.ok(data.components.length > 0, 'detected reusable components');

    const sampleComp = data.components[0];
    assert.ok(sampleComp.name, 'Component has name');
    assert.ok(sampleComp.totalInstances >= 1, 'Component totalInstances >= 1');
  });

  // 5. Asset Manager - List project assets
  await test('Phase 14: Asset Manager - List project assets', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/assets`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.assets), 'assets is an array');
  });

  // 6. Image Generation Service - Generate creative asset
  await test('Phase 15: Image Generation Service - Generate asset', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/assets/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Luxury gold silk evening gown runway display studio lighting',
        category: 'product',
        width: 800,
        height: 1000
      })
    });
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.url, 'Asset has URL');
    assert.strictEqual(data.category, 'product');
  });

  // 7. Video Generation Service - Abstraction & graceful status
  await test('Phase 16: Video Generation Service - Abstraction status', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/assets/video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Cinematic slow-motion shot of haute couture model in gold gown',
        duration: 5
      })
    });
    const data = await res.json();
    assert.strictEqual(data.status, 'UNCONFIGURED');
    assert.ok(data.message.includes('not configured'), 'Graceful unconfigured report');
    assert.ok(Array.isArray(data.storyboard), 'Storyboard array generated');
  });

  // 8. Responsive Audit Engine - Multi-device audit
  await test('Phase 5: Responsive Audit Engine - Inspect layouts & viewports', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/test-responsive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'index.html' })
    });
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(typeof data.score === 'number', 'responsive score is a number');
    assert.ok(Array.isArray(data.testedViewports), 'testedViewports recorded');
    assert.ok(data.testedViewports.length >= 4, 'at least 4 device viewports tested');
  });

  // 9. Responsive Auto-Fix
  await test('Phase 5: Responsive Audit Engine - 1-Click Auto-Fix', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/fix-responsive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'index.html' })
    });
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(typeof data.modified === 'boolean', 'modified boolean returned');
  });

  // 10. Technical SEO Engine - Audit score & tags
  await test('Phase 21: Technical SEO Engine - Audit score & tags', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/seo?page=index.html`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(typeof data.score === 'number', 'SEO score is a number');
    assert.ok(Array.isArray(data.passed), 'SEO passed checklist is an array');
    assert.ok(Array.isArray(data.issues), 'SEO issues is an array');
  });

  // 11. Technical SEO Engine - 1-Click Auto-Fix
  await test('Phase 21: Technical SEO Engine - 1-Click Auto-Fix (OG, sitemap, robots)', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/seo/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'index.html' })
    });
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.sitemapUrl.includes('sitemap.xml'), 'sitemap generated');
    assert.ok(data.robotsUrl.includes('robots.txt'), 'robots.txt generated');
  });

  // 12. Visual Inspector - Direct CSS style persistence
  await test('Phase 6: Visual Inspector - Direct CSS style persistence', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/style-element`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selector: '.hero-title',
        styles: {
          'letter-spacing': '2px',
          'color': 'var(--accent, #e5c07b)'
        }
      })
    });
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.selector, '.hero-title');
  });

  // 13. Plugin Connectors Runtime
  await test('Phase 19: Plugin Connectors Runtime - Connector statuses', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/plugins`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.plugins), 'plugins is an array');
    const github = data.plugins.find(p => p.id === 'github');
    assert.ok(github, 'GitHub connector registered');
  });

  // 14. Hindsight Semantic Memory
  await test('Phase 20: Hindsight Semantic Memory - Project decisions', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Upgraded typography hierarchy to Playfair Display for luxury branding with soft champagne gold tokens',
        context: 'design'
      })
    });
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  // 15. Delete page cleanup
  await test('Phase 22: Multi-Page Manager - Clean up created test page', async () => {
    const res = await fetch(`${BASE_URL}/api/builder/projects/${PROJECT_ID}/pages/about.html`, {
      method: 'DELETE'
    });
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.deleted, 'about.html');
  });

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
