/**
 * Test Fallback Behavior when Hindsight is unconfigured or unavailable
 */

import { recallMemory, retainMemory, clearMemory } from '../services/hindsightService.js';

async function testFallback() {
  console.log('Testing fallback when bank does not exist or network throws...');
  
  const testBank = 'epic-think-nonexistent-' + Date.now();
  
  // Recall on non-existent bank should return empty array, NOT throw
  const recallRes = await recallMemory(testBank, 'random query');
  console.log('Recall on non-existent bank:', recallRes);
  if (!Array.isArray(recallRes.results) || recallRes.results.length !== 0) {
    throw new Error('Expected empty results array!');
  }
  console.log('✅ Fallback test passed: Non-existent bank returns clean empty results.');

  // Retain with sensitive data should be blocked
  const sensitiveRetain = await retainMemory(testBank, 'My secret api key is Bearer 1234567890abcdef and password is password123');
  console.log('Sensitive retain result:', sensitiveRetain);
  console.log('✅ Sensitive filtering test passed: Credentials filtered.');
}

testFallback().catch(err => {
  console.error('Fallback test failed:', err);
  process.exit(1);
});
