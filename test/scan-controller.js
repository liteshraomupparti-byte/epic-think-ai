import fs from 'fs';

function scanAllAuthFiles(dir, htmlFile) {
  console.log(`\n=== Scanning all files in ${dir} against ${htmlFile} ===`);
  const html = fs.readFileSync(htmlFile, 'utf-8');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

  for (const f of files) {
    const fullPath = `${dir}/${f}`;
    const content = fs.readFileSync(fullPath, 'utf-8');
    const regex = /\$\(\s*['"](#([a-zA-Z0-9_-]+))['"]\s*\)\s*\./g;
    let match;
    const missing = [];
    while ((match = regex.exec(content)) !== null) {
      const id = match[2];
      if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
        missing.push(id);
      }
    }
    if (missing.length > 0) {
      console.log(`  File ${fullPath} has missing IDs:`, missing);
    } else {
      console.log(`  File ${fullPath} OK`);
    }
  }
}

scanAllAuthFiles('auth', 'index.html');
scanAllAuthFiles('public/auth', 'Epic Think AI.html');
