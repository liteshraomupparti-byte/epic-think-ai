// test/test-mobile-chat-ui.js
// Automated verification suite for mobile chat layout, responsiveness, and bug fixes

import fs from 'fs';
import assert from 'assert';

console.log('====================================================');
console.log('📱 TESTING MOBILE CHAT UI & RESPONSIVENESS FIXES');
console.log('====================================================\n');

const files = ['index.html', 'Epic Think AI.html'];

files.forEach(fileName => {
  console.log(`Checking ${fileName}...`);
  const content = fs.readFileSync(fileName, 'utf8');

  // 1. Verify Top Navigation Layout (Two-Tier Structure)
  assert(content.includes('class="top-nav-main-bar"'), `${fileName} missing .top-nav-main-bar`);
  assert(content.includes('class="top-nav-badges-strip"'), `${fileName} missing .top-nav-badges-strip`);
  assert(content.includes('id="mobileNewChatBtn"'), `${fileName} missing #mobileNewChatBtn`);
  console.log(`  ✓ Two-tier header markup & mobile new chat button verified in ${fileName}`);

  // 2. Verify Model Selector Non-Wrapping Rules
  assert(content.includes('white-space: nowrap !important;'), `${fileName} missing white-space: nowrap on mobile`);
  assert(content.includes('text-overflow: ellipsis !important;'), `${fileName} missing text-overflow: ellipsis on mobile`);
  console.log(`  ✓ Single-line non-wrapping model selector verified in ${fileName}`);

  // 3. Verify Badges Horizontal Touch Scrolling
  assert(content.includes('overflow-x: auto !important;'), `${fileName} missing horizontal overflow on mobile badges`);
  assert(content.includes('-webkit-overflow-scrolling: touch !important;'), `${fileName} missing momentum scrolling on mobile badges`);
  assert(content.includes('scrollbar-width: none !important;'), `${fileName} missing hidden scrollbar on mobile badges`);
  console.log(`  ✓ Horizontal touch-scrolling feature chips verified in ${fileName}`);

  // 4. Verify Dual Scrollbar Elimination & Layout Lock
  assert(content.includes('html, body {') && content.includes('overflow: hidden !important;'), `${fileName} missing body overflow lock`);
  assert(content.includes('100dvh'), `${fileName} missing dynamic viewport height (100dvh)`);
  assert(!content.includes('<div id="chatViewWrapper" style="display:flex; flex-direction:column; flex:1; min-height:0; height:calc(100vh - 52px);">'), `${fileName} has legacy hardcoded inline height on chatViewWrapper`);
  assert(content.includes('#chatViewWrapper {'), `${fileName} missing #chatViewWrapper CSS declaration`);
  console.log(`  ✓ Dual scrollbar elimination & layout lock verified in ${fileName}`);

  // 5. Verify Floating Scroll-to-Bottom Bug Fix
  assert(content.includes('hasHero = !!scrollEl.querySelector(\'.hero-container\')'), `${fileName} missing hasHero check in scroll listener`);
  assert(content.includes('scrollBtn.classList.remove(\'visible\')'), `${fileName} missing scrollBtn hide logic`);
  assert(content.includes('hero-container ~ * .scroll-bottom-btn') || content.includes('#chatContainer:has(.hero-container)'), `${fileName} missing CSS hero protection for scroll button`);
  console.log(`  ✓ Scroll-to-bottom button hero suppression verified in ${fileName}`);

  // 6. Verify Mobile Hero Screen & 2x2 Suggestion Grid
  assert(content.includes('grid-template-columns: repeat(2, 1fr) !important;'), `${fileName} missing 2-column mobile suggestion grid`);
  assert(content.includes('-webkit-line-clamp: 2;'), `${fileName} missing prompt text clamping for compact cards`);
  console.log(`  ✓ Compact 2x2 suggestion cards & mobile hero sizing verified in ${fileName}`);

  // 7. Verify Mobile Composer Optimization
  assert(content.includes('env(safe-area-inset-bottom'), `${fileName} missing safe-area inset on mobile composer`);
  assert(content.includes('font-size: 15px !important;'), `${fileName} missing 15px mobile textarea font size to prevent iOS auto-zoom`);
  console.log(`  ✓ Mobile composer safe-area & typography verified in ${fileName}\n`);
});

console.log('====================================================');
console.log('🎉 ALL MOBILE CHAT UI CHECKS PASSED WITH 100% PARITY!');
console.log('====================================================');
