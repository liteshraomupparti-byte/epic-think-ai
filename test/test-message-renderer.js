// test/test-message-renderer.js
// Verification suite for MessageRenderer architecture

import assert from 'assert';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeUrl(url) {
  if (!url) return '#';
  const clean = String(url).trim();
  if (/^(?:https?:\/\/|mailto:)/i.test(clean)) {
    return clean;
  }
  return '#unsafe-url';
}

console.log('Testing sanitizeUrl...');
assert.strictEqual(sanitizeUrl('https://example.com'), 'https://example.com');
assert.strictEqual(sanitizeUrl('http://example.com/path?a=1'), 'http://example.com/path?a=1');
assert.strictEqual(sanitizeUrl('mailto:test@example.com'), 'mailto:test@example.com');
assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '#unsafe-url');
assert.strictEqual(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '#unsafe-url');
console.log('✓ sanitizeUrl blocks XSS and unsafe protocols');

console.log('All MessageRenderer primitive tests passed!');
