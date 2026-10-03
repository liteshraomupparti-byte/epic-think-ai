import fs from 'fs';
import vm from 'vm';

['index.html', 'Epic Think AI.html'].forEach(file => {
  console.log(`Checking ${file}...`);
  const html = fs.readFileSync(file, 'utf8');
  const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    const attrs = match[1];
    const code = match[2];
    if (!code || !code.trim()) continue;
    if (attrs.includes('module')) {
      console.log(`  Script #${count} is type="module"`);
      continue;
    }
    try {
      new vm.Script(code);
      console.log(`  Script #${count} passed syntax check.`);
    } catch (e) {
      console.error(`Syntax error in ${file} script #${count}:`, e.message);
      process.exit(1);
    }
  }
  console.log(`✓ All scripts in ${file} passed syntax validation!\n`);
});
