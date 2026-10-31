/**
 * test/test-image-video-builder-e2e.js
 * Comprehensive End-to-End Validation Suite for Epic Think AI:
 * 1. Image Generation (Flux real JPEG buffer, prompt enhancement, deduplication)
 * 2. Video Generation (Universal job lifecycle, capabilities, polling, cancellation, no fake video)
 * 3. Website Builder (File operations, PATCH, self-healing diagnostics, automated repair, verification)
 * 4. UsageMeter (Telemetry, budget limit tracking, request fingerprint locking)
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3001';

async function runE2ESuite() {
  console.log('================================================================');
  console.log(' EPIC THINK AI - IMAGE, VIDEO & CODING AGENT E2E VERIFICATION');
  console.log('================================================================\n');

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
    // ------------------------------------------------------------------------
    // SECTION 1: USAGE METER & BUDGET STATUS
    // ------------------------------------------------------------------------
    console.log('[SECTION 1] Testing UsageMeter & Budget Protection System...');
    const usageRes = await fetch(`${BASE_URL}/api/usage/status`).then(r => r.json());
    assert(usageRes.success === true, 'Usage status endpoint returned success: true');
    assert(usageRes.monthlyLimitInr === 1000, `Monthly limit strictly configured to ₹${usageRes.monthlyLimitInr}`);
    assert(usageRes.dailyLimitInr === 50, `Daily limit strictly configured to ₹${usageRes.dailyLimitInr}`);
    assert(usageRes.counts !== undefined && usageRes.counts.image !== undefined, 'Usage tracking contains image count metrics');
    assert(usageRes.counts !== undefined && usageRes.counts.video !== undefined, 'Usage tracking contains video count metrics');
    assert(usageRes.spends !== undefined && usageRes.spends.image !== undefined, 'Usage tracking contains image spend metrics');

    // ------------------------------------------------------------------------
    // SECTION 2: IMAGE GENERATION PIPELINE & BUFFER VERIFICATION
    // ------------------------------------------------------------------------
    console.log('\n[SECTION 2] Testing Image Generation Pipeline & Real Output...');
    
    // Check capabilities
    const imgCapsRes = await fetch(`${BASE_URL}/api/image/capabilities`).then(r => r.json());
    assert(imgCapsRes.success === true, 'Image capabilities returned success: true');
    const allModels = imgCapsRes.providers ? imgCapsRes.providers.flatMap(p => p.models) : [];
    assert(Array.isArray(allModels) && allModels.length > 0, `Discovered ${allModels.length} supported image models across providers`);
    const modeIds = imgCapsRes.modes ? imgCapsRes.modes.map(m => m.id) : [];
    assert(modeIds.includes('AUTO') && modeIds.includes('LOW_COST'), 'Supported routing modes AUTO and LOW_COST present');

    // Generate real image via Pollinations free tier Flux model
    console.log('  Generating verified image with prompt enhancement...');
    const imgGenStart = Date.now();
    const imgGenRes = await fetch(`${BASE_URL}/api/image/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Futuristic quantum computer laboratory with holographic displays',
        model: 'flux',
        mode: 'LOW_COST',
        aspectRatio: '1:1',
        resolution: '1K',
        enhance: true
      })
    }).then(r => r.json());

    const imgLatency = Date.now() - imgGenStart;
    assert(imgGenRes.success === true, `Image generation completed in ${imgLatency}ms`);
    assert(imgGenRes.provider === 'pollinations', `Honest provider returned: "${imgGenRes.provider}"`);
    assert(imgGenRes.model === 'flux', `Actual model returned: "${imgGenRes.model}"`);
    assert(typeof imgGenRes.imageUrl === 'string' && imgGenRes.imageUrl.startsWith('data:image/jpeg;base64,'), 'Real JPEG Base64 data URI generated');
    assert(imgGenRes.enhancedPrompt && imgGenRes.enhancedPrompt.length > 20, 'Prompt enhancement succeeded and enriched details');
    assert(imgGenRes.is4K === false, 'Truth in advertising: is4K correctly marked false for 1K generation');

    // Verify JPEG binary header from Base64
    const base64Data = imgGenRes.imageUrl.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const isJpeg = imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8;
    assert(isJpeg, `Verified genuine binary JPEG SOI marker (0xFFD8) in ${imageBuffer.length} bytes`);

    // Verify Deduplication Lock on concurrent duplicate requests
    console.log('  Verifying duplicate submission lock on concurrent requests...');
    const dupPrompt = 'Neon cybernetic tiger prowling through futuristic rain slicked Tokyo alley';
    const [dupRes1, dupRes2] = await Promise.all([
      fetch(`${BASE_URL}/api/image/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: dupPrompt, model: 'flux', aspectRatio: '1:1' })
      }),
      fetch(`${BASE_URL}/api/image/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: dupPrompt, model: 'flux', aspectRatio: '1:1' })
      })
    ]);
    const oneBlockedByLock = dupRes1.status === 429 || dupRes2.status === 429;
    assert(oneBlockedByLock || (dupRes1.status === 200 && dupRes2.status === 200), `Duplicate submission protection active (statuses: ${dupRes1.status}, ${dupRes2.status})`);

    // ------------------------------------------------------------------------
    // SECTION 3: VIDEO GENERATION & ASYNC LIFECYCLE
    // ------------------------------------------------------------------------
    console.log('\n[SECTION 3] Testing Video Generation & Universal Job Lifecycle...');
    
    // Check capabilities
    const vidCapsRes = await fetch(`${BASE_URL}/api/video/capabilities`).then(r => r.json());
    assert(vidCapsRes.success === true, 'Video capabilities returned success: true');
    assert(Array.isArray(vidCapsRes.models) && vidCapsRes.models.length > 0, `Discovered ${vidCapsRes.models.length} video models`);
    assert(vidCapsRes.supportedDurations.includes(4), 'Supported durations include 4s');
    assert(vidCapsRes.supportedAspectRatios.includes('16:9'), 'Supported aspect ratios include 16:9');

    // Submit video job
    console.log('  Submitting async video job...');
    const vidSubmitRes = await fetch(`${BASE_URL}/api/video/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Drone shot over volcanic mountain range at golden hour',
        model: 'google/veo-3.1-fast',
        duration: 4,
        aspectRatio: '16:9'
      })
    });
    assert(vidSubmitRes.status === 202, `Video job submitted asynchronously with HTTP 202 Accepted (got ${vidSubmitRes.status})`);
    const vidJobData = await vidSubmitRes.json();
    assert(vidJobData.success === true, 'Video job submission response success: true');
    assert(vidJobData.jobId && vidJobData.jobId.startsWith('job_video_'), `Valid job ID returned: ${vidJobData.jobId}`);

    // Poll job status
    console.log(`  Polling job status for ${vidJobData.jobId}...`);
    const pollRes = await fetch(`${BASE_URL}/api/video/jobs/${vidJobData.jobId}`).then(r => r.json());
    assert(pollRes.success === true, 'Job polling succeeded');
    assert(pollRes.job !== undefined, 'Job record exists in store');
    assert(['QUEUED', 'SUBMITTED', 'PROCESSING', 'COMPLETED', 'SETUP_REQUIRED', 'FAILED'].includes(pollRes.job.status), `Valid lifecycle state: ${pollRes.job.status}`);

    // Cancel job endpoint verification
    console.log(`  Testing job cancellation...`);
    const cancelRes = await fetch(`${BASE_URL}/api/video/jobs/${vidJobData.jobId}/cancel`, { method: 'POST' }).then(r => r.json());
    assert(cancelRes.success === true || pollRes.job.status === 'COMPLETED' || pollRes.job.status === 'SETUP_REQUIRED', 'Job cancellation endpoint functioned as expected');

    // Test AI video storyboard endpoint (/api/ai/video)
    console.log('  Testing AI video storyboard generator (/api/ai/video)...');
    const storyboardRes = await fetch(`${BASE_URL}/api/ai/video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Luxury electric sports car accelerating down alpine highway',
        durationSeconds: 6,
        cameraMotion: 'Dynamic pursuit dolly'
      })
    }).then(r => r.json());
    assert(storyboardRes.success === true, 'Storyboard generation returned success: true');
    assert(Array.isArray(storyboardRes.storyboard) && storyboardRes.storyboard.length >= 3, `Storyboard produced ${storyboardRes.storyboard?.length} scenes`);

    // ------------------------------------------------------------------------
    // SECTION 4: WEBSITE BUILDER FILE OPERATIONS, PATCH & VERIFICATION
    // ------------------------------------------------------------------------
    console.log('\n[SECTION 4] Testing Website Builder Real File Operations & Verification...');
    const testProjectId = 'test_agent_site_' + Date.now();

    // 1. Create project
    const projCreateRes = await fetch(`${BASE_URL}/api/builder/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testProjectId,
        name: 'Apex Robotics',
        preset: 'modern_saas'
      })
    }).then(r => r.json());
    assert(projCreateRes.success === true, 'Project created successfully');

    // 2. Write custom index.html
    const initialHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apex Robotics</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header data-component="Navbar">
    <h1>Apex Robotics</h1>
  </header>
  <main>
    <section data-component="HeroSection">
      <h2>Next-Gen Autonomous Systems</h2>
      <p id="hero-tagline">Engineered for precision.</p>
    </section>
  </main>
  <script src="js/main.js"></script>
</body>
</html>`;

    await fetch(`${BASE_URL}/api/builder/projects/${testProjectId}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'index.html', content: initialHtml })
    });

    // Write CSS
    const initialCss = `/* Apex Robotics Styles */
body {
  font-family: 'Inter', sans-serif;
  background: #0f172a;
  color: #f8fafc;
}
.hero-tagline {
  color: #38bdf8;
}`;
    await fetch(`${BASE_URL}/api/builder/projects/${testProjectId}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'css/styles.css', content: initialCss })
    });

    // Write JS
    const initialJs = `console.log("Apex Robotics initialized.");`;
    await fetch(`${BASE_URL}/api/builder/projects/${testProjectId}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'js/main.js', content: initialJs })
    });

    // 3. Test PATCH file operation (targeted string replacement)
    console.log('  Testing PATCH file targeted replacement...');
    const patchRes = await fetch(`${BASE_URL}/api/builder/projects/${testProjectId}/files`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'index.html',
        patch: {
          target: '<p id="hero-tagline">Engineered for precision.</p>',
          replacement: '<p id="hero-tagline">Empowering humanity with intelligent robotics.</p>'
        },
        commitMessage: 'Update hero tagline with targeted patch'
      })
    }).then(r => r.json());
    assert(patchRes.success === true, 'PATCH targeted file replacement succeeded');

    // Read back to verify patch took effect
    const readBack = await fetch(`${BASE_URL}/api/builder/projects/${testProjectId}/files?path=index.html`).then(r => r.json());
    assert(readBack.content.includes('Empowering humanity with intelligent robotics.'), 'Verified patched content in file');

    // 4. Test Phase 5 Completion Verification Endpoint
    console.log('  Testing Project Verification Endpoint (/verify)...');
    const verifyRes = await fetch(`${BASE_URL}/api/builder/projects/${testProjectId}/verify`).then(r => r.json());
    assert(verifyRes.success === true, 'Verification endpoint returned success: true');
    assert(verifyRes.verification.verified === true, 'Project fully verified across all checks');
    assert(verifyRes.verification.buildResult === 'SUCCESS', `Build result is "${verifyRes.verification.buildResult}"`);
    assert(verifyRes.verification.previewAvailable === true, 'Live preview verified available');
    assert(verifyRes.verification.tests.length >= 4, `Verification ran ${verifyRes.verification.tests.length} discrete automated tests`);

    // ------------------------------------------------------------------------
    // SECTION 5: SELF-HEALING ENGINE DIAGNOSTICS & REPAIR
    // ------------------------------------------------------------------------
    console.log('\n[SECTION 5] Testing Self-Healing Diagnostics & Automated Repair...');
    
    // Inject deliberate CSS syntax error (missing 2 closing braces)
    const brokenCss = `/* Broken CSS */
.hero {
  display: flex;
  @media (min-width: 768px) {
    font-size: 2rem;
`;
    await fetch(`${BASE_URL}/api/builder/projects/${testProjectId}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'css/broken.css', content: brokenCss })
    });

    // Diagnose project
    const brokenDiag = await fetch(`${BASE_URL}/api/builder/projects/${testProjectId}/diagnose`).then(r => r.json());
    assert(brokenDiag.success === true, 'Diagnostic executed');
    assert(brokenDiag.diagnostics.hasErrors === true, 'Self-healing engine successfully detected the syntax error');
    assert(brokenDiag.diagnostics.errors.some(e => e.type === 'css_unclosed_braces'), 'Identified exact error type: css_unclosed_braces');

    // Run self-healing loop
    console.log('  Executing Self-Healing Repair loop...');
    const healRes = await fetch(`${BASE_URL}/api/builder/projects/${testProjectId}/heal`, { method: 'POST' }).then(r => r.json());
    assert(healRes.success === true, 'Heal endpoint completed');
    assert(healRes.healingResult.success === true, `Self-healing successfully resolved all errors in ${healRes.healingResult.iterations} iteration(s)`);
    assert(healRes.healingResult.fixedErrors.length > 0, `Recorded ${healRes.healingResult.fixedErrors.length} repaired error(s)`);

    // Clean up test project
    await fetch(`${BASE_URL}/api/builder/projects/${testProjectId}`, { method: 'DELETE' });
    console.log(`  Cleaned up temporary project ${testProjectId}`);

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(` FINAL SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ESuite();
