import fs from 'fs';

function scanFile(htmlFile, jsFiles = []) {
  console.log(`\n=== Scanning ${htmlFile} ===`);
  const html = fs.readFileSync(htmlFile, 'utf-8');

  function checkContent(name, content) {
    const regex = /(?:\$|document\.querySelector)\(\s*['"](#([a-zA-Z0-9_-]+))['"]\s*\)\s*(?:\.([a-zA-Z0-9_$]+)|\?)/g;
    let match;
    const missing = [];
    while ((match = regex.exec(content)) !== null) {
      const fullMatch = match[0];
      const id = match[2];
      const member = match[3];
      const isOptional = fullMatch.endsWith('?');
      const existsInHtml = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
      if (!existsInHtml && !isOptional && member) {
        missing.push({ source: name, id, member });
      }
    }
    return missing;
  }

  const scriptMatches = html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
  let scriptIdx = 0;
  for (const sm of scriptMatches) {
    scriptIdx++;
    const res = checkContent(`${htmlFile} <script #${scriptIdx}>`, sm[1]);
    if (res.length > 0) {
      console.log(`  Unsafe direct access in script #${scriptIdx}:`, res);
    }
  }

  for (const jsFile of jsFiles) {
    if (fs.existsSync(jsFile)) {
      const content = fs.readFileSync(jsFile, 'utf-8');
      const res = checkContent(jsFile, content);
      if (res.length > 0) {
        console.log(`  Unsafe direct access in ${jsFile}:`, res);
      }
    }
  }
}

scanFile('index.html', [
  'auth/profileUiController.js',
  'auth/userService.js',
  'auth/authService.js',
  'auth/aiService.js'
]);

scanFile('Epic Think AI.html', [
  'public/auth/profileUiController.js',
  'public/auth/userService.js',
  'public/auth/authService.js',
  'public/auth/aiService.js'
]);
