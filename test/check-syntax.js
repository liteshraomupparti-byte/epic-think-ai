import fs from 'fs';

console.log('Testing JS syntax across all files with native ESM imports...');

// 1. check index.html script tag
const indexHtml = fs.readFileSync('./index.html', 'utf8');
const scriptMatch = indexHtml.match(/<script type="module">([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const cleanCode = scriptMatch[1]
    .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '// import')
    .replace(/export\s+(default\s+|class\s+|function\s+|const\s+|let\s+|var\s+)/g, '$1');
  new Function(cleanCode);
  console.log('✅ index.html: Syntax OK');
} else {
  throw new Error('No script tag found in index.html');
}

// 2. dynamically import server and services
await import('../services/hindsightService.js');
console.log('✅ services/hindsightService.js: Valid ESM');

await import('../services/firebaseAuthService.js');
console.log('✅ services/firebaseAuthService.js: Valid ESM');

console.log('\n🎉 ALL SYNTAX CHECKS PASSED PERFECTLY!');
