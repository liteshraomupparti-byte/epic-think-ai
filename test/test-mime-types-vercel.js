/**
 * Verification test for static file serving, MIME types, and Vercel routing
 */

import assert from 'assert';
import http from 'http';
import app from '../server.js';

console.log('====================================================');
console.log('VERIFYING MODULE SCRIPT MIME TYPES & STATIC SERVING');
console.log('====================================================\n');

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  let passed = 0;
  let failed = 0;

  function check(cond, msg) {
    if (cond) {
      passed++;
      console.log(`  ✓ ${msg}`);
    } else {
      failed++;
      console.error(`  ✗ FAIL: ${msg}`);
    }
  }

  const endpoints = [
    { path: '/auth/authService.js', expectedType: 'application/javascript' },
    { path: '/auth/userService.js', expectedType: 'application/javascript' },
    { path: '/auth/profileUiController.js', expectedType: 'application/javascript' },
    { path: '/auth/memoryService.js', expectedType: 'application/javascript' },
    { path: '/auth/aiService.js', expectedType: 'application/javascript' },
    { path: '/auth/pluginService.js', expectedType: 'application/javascript' },
    { path: '/auth/mongoChatService.js', expectedType: 'application/javascript' },
    { path: '/auth/firebase.js', expectedType: 'application/javascript' },
    { path: '/intro/introController.js', expectedType: 'application/javascript' },
    { path: '/intro/epic-think-intro.bundle.js', expectedType: 'application/javascript' },
    { path: '/intro/epic-think-intro.bundle.css', expectedType: 'text/css' },
    { path: '/api/auth/authService.js', expectedType: 'application/javascript' },
    { path: '/api/intro/introController.js', expectedType: 'application/javascript' },
    { path: '/', expectedType: 'text/html' }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${baseUrl}${ep.path}`);
      const cType = res.headers.get('content-type') || '';
      const isStatusOk = res.status === 200;
      const isMimeOk = cType.includes(ep.expectedType);
      
      check(isStatusOk && isMimeOk, `${ep.path} -> HTTP ${res.status}, Content-Type: ${cType}`);
    } catch (err) {
      check(false, `${ep.path} error: ${err.message}`);
    }
  }

  server.close(() => {
    console.log('\n====================================================');
    console.log(`MIME TYPE & STATIC TEST: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  });
});
