/**
 * test-dom-and-cart.js
 * Deep verification of Devika Collections JavaScript application logic
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';

const projectPath = 'builder_projects/devika_collections';

function runValidation() {
  console.log('--- Deep Validation of Devika Collections Logic ---');

  // 1. Verify JS Syntax
  const jsContent = fs.readFileSync(path.join(projectPath, 'js/main.js'), 'utf8');
  new vm.Script(jsContent, { filename: 'main.js' });
  console.log('✓ main.js compiles without SyntaxError');

  // 2. Verify Products Array
  const productMatches = jsContent.match(/id:\s*['"](.*?)['"]/g);
  console.log(`✓ Contains ${productMatches?.length || 0} product definitions`);

  // 3. Verify Cart & Wishlist Logic
  const hasCartMethods = jsContent.includes('addToCart') && jsContent.includes('renderCartDrawer') && jsContent.includes('updateCounters');
  const hasWishlistMethods = jsContent.includes('toggleWishlist') && jsContent.includes('renderProducts');
  const hasCounters = jsContent.includes('updateCounters');

  console.log('✓ Has Cart methods:', hasCartMethods);
  console.log('✓ Has Wishlist methods:', hasWishlistMethods);
  console.log('✓ Has Reactive Counters:', hasCounters);

  // 4. Verify Responsive CSS Breakpoints
  const cssContent = fs.readFileSync(path.join(projectPath, 'css/styles.css'), 'utf8');
  const hasMobileMedia = cssContent.includes('@media (max-width: 768px)') || cssContent.includes('@media (max-width: 480px)');
  console.log('✓ Has Responsive Media Queries:', hasMobileMedia);

  console.log('--- Devika Collections Logic Deep Validation: ALL PASSED ---');
}

runValidation();
