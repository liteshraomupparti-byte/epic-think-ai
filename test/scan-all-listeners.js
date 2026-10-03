import fs from 'fs';

function scanAllListeners(filename) {
  console.log(`\n=== Scanning all addEventListener in ${filename} ===`);
  const html = fs.readFileSync(filename, 'utf-8');

  // Match anything before .addEventListener
  const regex = /([$\w.()'"#_-]+)\.addEventListener/g;
  let match;
  const missing = [];

  while ((match = regex.exec(html)) !== null) {
    const expr = match[1];
    // If it's $('#something') or document.getElementById('something') or document.querySelector('#something')
    const idMatch = expr.match(/(?:\$|document\.getElementById|document\.querySelector)\(\s*['"]#?([a-zA-Z0-9_-]+)['"]\s*\)/);
    if (idMatch) {
      const id = idMatch[1];
      const hasId = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
      const hasOptional = expr.includes('?.');
      if (!hasId) {
        missing.push({ expr, id, hasOptional });
      }
    }
  }

  console.log(`Found ${missing.length} missing element listener targets:`);
  for (const m of missing) {
    console.log(`  Target: id="${m.id}" | expr: ${m.expr} | hasOptional: ${m.hasOptional}`);
  }
}

scanAllListeners('index.html');
scanAllListeners('Epic Think AI.html');
