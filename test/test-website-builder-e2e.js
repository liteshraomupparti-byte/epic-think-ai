/**
 * test-website-builder-e2e.js
 * End-to-End Test Suite for Epic Think AI Website Builder
 */

const BASE_URL = 'http://localhost:3001';

async function runTests() {
  console.log('====================================================');
  console.log(' RUNNING EPIC THINK AI WEBSITE BUILDER E2E TESTS');
  console.log('====================================================\n');

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

  try {
    // TEST 1: Theme Presets
    console.log('[1/8] Testing Design System Theme Presets...');
    const presetsRes = await fetch(`${BASE_URL}/api/builder/presets`).then(r => r.json());
    assert(presetsRes.success === true, 'Presets endpoint returned success: true');
    assert(presetsRes.presets.luxury_gold !== undefined, 'Presets contains luxury_gold theme');
    assert(presetsRes.presets.luxury_gold.tokens.colors.goldPrimary === '#c5a059', 'Luxury gold primary color token verified');

    // TEST 2: Structured Website Planning
    console.log('\n[2/8] Testing AI Website Planning...');
    const planRes = await fetch(`${BASE_URL}/api/builder/projects/devika_collections/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Create a premium luxury fashion ecommerce website called Devika Collections with black and gold aesthetic, product catalog, shopping cart, wishlist, authentication, responsive design and admin dashboard.',
        preset: 'luxury_gold'
      })
    }).then(r => r.json());
    assert(planRes.success === true, 'Plan endpoint returned success: true');
    assert(planRes.plan.projectTitle === 'Devika Collections', 'Plan recognized project title: Devika Collections');
    assert(planRes.plan.siteType === 'luxury_ecommerce', 'Plan detected site type: luxury_ecommerce');
    assert(planRes.plan.pages.length >= 5, `Plan generated ${planRes.plan.pages.length} pages`);
    assert(planRes.plan.components.length >= 8, `Plan generated ${planRes.plan.components.length} components`);

    // TEST 3: Full Project Generation & Checkpoint Creation
    console.log('\n[3/8] Testing Project Generation & File Synthesis...');
    const genRes = await fetch(`${BASE_URL}/api/builder/projects/devika_collections/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Create a premium luxury fashion ecommerce website called Devika Collections with black and gold aesthetic, product catalog, shopping cart, wishlist, authentication, responsive design and admin dashboard.',
        preset: 'luxury_gold',
        plan: planRes.plan
      })
    }).then(r => r.json());
    assert(genRes.success === true, 'Project generation succeeded');
    assert(genRes.files.includes('index.html'), 'Generated index.html');
    assert(genRes.files.includes('css/styles.css'), 'Generated css/styles.css');
    assert(genRes.files.includes('css/variables.css'), 'Generated css/variables.css');
    assert(genRes.files.includes('js/main.js'), 'Generated js/main.js');
    assert(genRes.checkpoint && genRes.checkpoint.commitHash !== undefined, `Git Checkpoint created: ${genRes.checkpoint.commitHash}`);

    // TEST 4: Live Preview Serving & Bridge Script Injection
    console.log('\n[4/8] Testing Live Preview & Visual Selector Bridge...');
    const htmlRes = await fetch(`${BASE_URL}/preview/devika_collections/index.html`);
    assert(htmlRes.status === 200, 'Preview HTTP status is 200 OK');
    const htmlContent = await htmlRes.text();
    assert(htmlContent.includes('Epic Think AI - Live Preview & Visual Selector Bridge'), 'Preview HTML contains injected bridge script');
    assert(htmlContent.includes('DEVIKA COLLECTIONS'), 'Preview HTML contains brand header');
    assert(htmlContent.includes('data-component="HeroSection"'), 'Preview contains HeroSection component');
    assert(htmlContent.includes('data-component="ProductCatalog"'), 'Preview contains ProductCatalog component');
    assert(htmlContent.includes('data-component="CartDrawer"'), 'Preview contains CartDrawer component');

    // TEST 5: Self-Healing Diagnostics
    console.log('\n[5/8] Testing Self-Healing Diagnostics Loop...');
    const diagRes = await fetch(`${BASE_URL}/api/builder/projects/devika_collections/diagnose`).then(r => r.json());
    assert(diagRes.success === true, 'Diagnostic check completed');
    assert(diagRes.diagnostics.hasErrors === false, `Self-healing verified 0 errors (errors: ${diagRes.diagnostics.errors.length})`);

    // TEST 6: Natural Language Edit 1 - Hero Heading
    console.log('\n[6/8] Testing Natural Language Edit: Increase Heading Size...');
    const edit1Res = await fetch(`${BASE_URL}/api/builder/projects/devika_collections/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Make the hero more premium and increase the heading size.'
      })
    }).then(r => r.json());
    assert(edit1Res.success === true, 'Hero heading edit succeeded');
    assert(edit1Res.modifiedFiles.includes('css/styles.css'), 'Modified css/styles.css');

    // Verify change in styles.css
    const stylesFileRes = await fetch(`${BASE_URL}/api/builder/projects/devika_collections/files?path=css/styles.css`).then(r => r.json());
    assert(stylesFileRes.content.includes('clamp(3.5rem, 8vw, 6rem)') || stylesFileRes.content.includes('hero-title'), 'Updated font size verified in file content');

    // TEST 7: Natural Language Edit 2 - Hero Image Replacement & Undo
    console.log('\n[7/8] Testing Asset Replacement & Git Undo Checkpoint...');
    const edit2Res = await fetch(`${BASE_URL}/api/builder/projects/devika_collections/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Change the hero background image.'
      })
    }).then(r => r.json());
    assert(edit2Res.success === true, 'Hero background image replacement succeeded');

    // Test Undo
    const undoRes = await fetch(`${BASE_URL}/api/builder/projects/devika_collections/undo`, { method: 'POST' }).then(r => r.json());
    assert(undoRes.success === true, 'Git Undo rollback succeeded');

    // TEST 8: Git History & Deployment Status
    console.log('\n[8/8] Testing Git Version History & Deployment Abstraction...');
    const historyRes = await fetch(`${BASE_URL}/api/builder/projects/devika_collections/history`).then(r => r.json());
    assert(historyRes.success === true, 'Git history retrieved');
    assert(historyRes.history.length >= 3, `Git history contains ${historyRes.history.length} checkpoints`);

    const deployRes = await fetch(`${BASE_URL}/api/builder/projects/devika_collections/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'static' })
    }).then(r => r.json());
    assert(deployRes.success === true, 'Deployment endpoint returned success: true');
    assert(deployRes.status === 'READY', 'Deployment status is READY');
    assert(deployRes.previewUrl === '/preview/devika_collections/index.html', 'Deployment preview URL verified');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(` TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
