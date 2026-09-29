/**
 * test-chat-builder-e2e.js
 * 
 * Verifies end-to-end chat integration:
 * 1. POST /api/ai/chat - Build Prompt ("build a website for gym fitness")
 *    - Verifies builderProject is returned
 *    - Verifies live preview URL is created and accessible via HTTP GET
 *    - Verifies no code block dumping in markdown text
 * 2. POST /api/ai/chat - Modify Prompt ("change the background to navy blue and add contact form")
 *    - Verifies MODIFY_APP intent applies the edit to the project
 *    - Verifies updated preview card and HTTP 200 on preview URL
 */

import assert from 'assert';

const BASE_URL = 'http://localhost:3001';

async function run() {
  console.log('====================================================');
  console.log('🧪 TESTING END-TO-END CHAT BUILDER & PROMPT MODIFICATIONS');
  console.log('====================================================\n');

  const conversationId = `conv_test_${Date.now()}`;

  // 1. Build prompt
  console.log('[1/2] Sending build prompt to POST /api/ai/chat...');
  const buildRes = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'build a website for gym and fitness athletic training',
      conversationId,
      modelPreset: 'Epic Think 4o'
    })
  });

  assert.strictEqual(buildRes.status, 200, 'Chat HTTP status 200');
  const buildData = await buildRes.json();
  assert.strictEqual(buildData.success, true, 'Chat response success true');
  assert.ok(buildData.builderProject, 'builderProject returned in response');
  assert.ok(buildData.builderProject.projectId, 'projectId exists');
  assert.ok(buildData.builderProject.previewUrl, 'previewUrl exists');
  assert.ok(buildData.text.includes(':::builder-card'), 'Text contains :::builder-card');
  assert.ok(!buildData.text.includes('```javascript\n// Backend Service'), 'Does NOT dump raw express code');

  console.log(`  ✓ Project Created: "${buildData.builderProject.title}" (${buildData.builderProject.projectId})`);
  console.log(`  ✓ Preview URL: ${buildData.builderProject.previewUrl}`);

  // Verify preview is served over HTTP
  const previewRes = await fetch(`${BASE_URL}${buildData.builderProject.previewUrl}`);
  assert.strictEqual(previewRes.status, 200, 'Live preview URL returns HTTP 200');
  const previewHtml = await previewRes.text();
  assert.ok(previewHtml.includes('<!DOCTYPE html>'), 'Preview serves valid HTML');
  console.log(`  ✓ Live preview verified via HTTP GET (${previewHtml.length} bytes)`);

  // 2. Modify prompt
  console.log('\n[2/2] Sending prompt modification to POST /api/ai/chat...');
  const modRes = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'change the background to navy blue and add contact form section',
      conversationId,
      modelPreset: 'Epic Think 4o'
    })
  });

  assert.strictEqual(modRes.status, 200, 'Modify HTTP status 200');
  const modData = await modRes.json();
  assert.strictEqual(modData.success, true, 'Modify response success true');
  assert.ok(modData.builderProject, 'builderProject returned for modification');
  assert.strictEqual(modData.builderProject.action, 'modified', 'action is modified');
  assert.ok(modData.text.includes(':::builder-card'), 'Contains updated builder-card');
  console.log(`  ✓ Modification Applied: "${modData.builderProject.description}"`);
  console.log(`  ✓ Modified Files: ${JSON.stringify(modData.builderProject.modifiedFiles)}`);

  // Verify modified HTML or CSS via HTTP
  const updatedPreviewRes = await fetch(`${BASE_URL}${modData.builderProject.previewUrl}`);
  assert.strictEqual(updatedPreviewRes.status, 200, 'Updated preview returns HTTP 200');
  const updatedHtml = await updatedPreviewRes.text();
  assert.ok(updatedHtml.includes('contact') || updatedHtml.includes('Contact'), 'Preview contains updated contact section');
  console.log('  ✓ Updated live preview verified via HTTP GET');

  console.log('\n====================================================');
  console.log('🎉 ALL END-TO-END CHAT & BUILDER TESTS PASSED!');
  console.log('====================================================\n');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
