/**
 * test-autonomous-builder-intent.js
 * 
 * Verifies Lovable / Emergent AI autonomous building and single-line intent understanding:
 * 1. Intent Detection across BUILD_APP, MODIFY_APP, DEBUG_CODE, TECHNICAL_DOUBT, and CONVERSATIONAL
 * 2. Autonomous project generation without asking blocking questions
 * 3. Verified file synthesis, live preview URL, and builder card formatting
 * 4. Natural language prompt modifications and hot-reloaded live preview
 */

import { IntentDispatcher } from '../ai/core/IntentDispatcher.js';
import { ProjectManager } from '../services/websiteBuilder/ProjectManager.js';
import fs from 'fs';
import path from 'path';

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

async function runTests() {
  console.log('====================================================');
  console.log(' RUNNING AUTONOMOUS BUILDER & INTENT ENGINE TESTS');
  console.log('====================================================\n');

  // Test 1: Single-line Intent Detection
  console.log('[1/5] Testing Intent Detection on Single-Line Prompts...');
  
  const test1 = IntentDispatcher.detectIntent('build an application for me');
  assert(test1.intent === 'BUILD_APP', 'Detects direct build: "build an application for me"');

  const test2 = IntentDispatcher.detectIntent('create a healthcare mobile app');
  assert(test2.intent === 'BUILD_APP', 'Detects direct build: "create a healthcare mobile app"');

  const test3 = IntentDispatcher.detectIntent(
    'mobile app, health care, Python, Node.js, React, Flutter, must use a certain DB',
    [{ role: 'assistant', text: 'What kind of app do you want to build?' }]
  );
  assert(test3.intent === 'BUILD_APP', 'Detects follow-up build specs with prior context');

  const test4 = IntentDispatcher.detectIntent('what is event loop in javascript');
  assert(test4.intent === 'TECHNICAL_DOUBT', 'Detects doubt/concept: "what is event loop in javascript"');

  const test5 = IntentDispatcher.detectIntent('why is my code giving TypeError: Cannot read properties of undefined');
  assert(test5.intent === 'DEBUG_CODE', 'Detects debugging: "TypeError: Cannot read properties of undefined"');

  const test6 = IntentDispatcher.detectIntent('hi, how are you?');
  assert(test6.intent === 'CONVERSATIONAL', 'Detects greeting: "hi, how are you?"');

  // Test 1b: Modify App Intent Detection
  console.log('\n[2/5] Testing Modify Application Intent Detection...');
  const modTest1 = IntentDispatcher.detectIntent('change the background to navy blue', [], 'conv_123', 'user_123');
  assert(modTest1.intent === 'MODIFY_APP', 'Detects modify: "change the background to navy blue"');

  const modTest2 = IntentDispatcher.detectIntent('add a contact form section', [], 'conv_123', 'user_123');
  assert(modTest2.intent === 'MODIFY_APP', 'Detects modify: "add a contact form section"');

  const modTest3 = IntentDispatcher.detectIntent('make the navbar sticky', [], 'conv_123', 'user_123');
  assert(modTest3.intent === 'MODIFY_APP', 'Detects modify: "make the navbar sticky"');

  // Test 2: Project Metadata Extraction
  console.log('\n[3/5] Testing Autonomous Project Metadata Extraction...');
  const metaHealth = IntentDispatcher.extractProjectMeta('mobile app, health care, Python, Node.js, React, Flutter');
  assert(metaHealth.title.includes('Health') || metaHealth.title.includes('Care'), `Extracted healthcare title: "${metaHealth.title}"`);
  assert(Boolean(metaHealth.projectId), `Generated clean project ID: "${metaHealth.projectId}"`);

  // Test 3: Autonomous Build Execution (Zero Blocking Questions)
  console.log('\n[4/5] Testing Autonomous Build Execution...');
  const buildResult = await IntentDispatcher.executeAutonomousBuild({
    prompt: 'build a healthcare mobile app for booking doctor appointments and viewing health records',
    uid: 'test_user_autonomous',
    conversationId: 'test_conv_auto'
  });

  assert(buildResult && buildResult.success === true, 'Autonomous build executed successfully');
  assert(Boolean(buildResult.projectId), `Created project: ${buildResult.projectId}`);
  assert(Boolean(buildResult.previewUrl), `Live preview available at: ${buildResult.previewUrl}`);
  assert(buildResult.files.includes('index.html'), 'Synthesized index.html');
  assert(buildResult.files.includes('css/styles.css'), 'Synthesized css/styles.css');
  assert(buildResult.files.includes('js/main.js'), 'Synthesized js/main.js');

  // Verify files physically exist on disk
  const projectDir = ProjectManager.getProjectDir(buildResult.projectId);
  assert(fs.existsSync(path.join(projectDir, 'index.html')), 'index.html physically written to disk');
  assert(fs.existsSync(path.join(projectDir, 'css/styles.css')), 'css/styles.css physically written to disk');
  assert(fs.existsSync(path.join(projectDir, 'js/main.js')), 'js/main.js physically written to disk');

  // Test 4: Natural Language Prompt Modification
  console.log('\n[5/5] Testing Autonomous Edit / Modification via Prompt...');
  const editResult = await IntentDispatcher.executeAutonomousEdit({
    projectId: buildResult.projectId,
    prompt: 'change the background to navy blue and add a contact form section',
    uid: 'test_user_autonomous',
    conversationId: 'test_conv_auto'
  });

  assert(editResult && editResult.success === true, 'Autonomous edit executed successfully');
  assert(editResult.action === 'modified', 'Edit action flagged as modified');
  assert(Boolean(editResult.modifiedFile), `Modified file reported: ${editResult.modifiedFile}`);
  assert(Boolean(editResult.description), `Description returned: "${editResult.description}"`);
  assert(editResult.previewUrl === buildResult.previewUrl, 'Preview URL remains stable');

  // Test Lovable Preview Card Markdown Generation
  const cardMarkdown = IntentDispatcher.formatBuilderCardMarkdown(editResult);
  assert(cardMarkdown.includes(':::builder-card'), 'Contains :::builder-card block');
  assert(cardMarkdown.includes(editResult.projectId), 'Contains projectId');
  assert(cardMarkdown.includes(editResult.previewUrl), 'Contains live preview URL');
  assert(cardMarkdown.includes('Launch Preview'), 'Contains Launch Preview call to action');
  assert(cardMarkdown.includes('Prompt-Based Modifications'), 'Contains Prompt-Based Modifications guidance');

  // Cleanup test project
  try {
    await ProjectManager.deleteProject(buildResult.projectId);
    console.log(`  ✓ Cleaned up test project ${buildResult.projectId}`);
  } catch (_) {}

  console.log('\n====================================================');
  console.log(` TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
