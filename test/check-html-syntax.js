import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

for (const fileName of ['index.html', 'Epic Think AI.html']) {
  const html = fs.readFileSync(path.join(__dirname, '..', fileName), 'utf8');
  const match = html.match(/<script type="module">([\s\S]*?)<\/script>/i);

  if (!match) {
    console.error(`ERROR: No <script type="module"> found in ${fileName}!`);
    process.exit(1);
  }

  const scriptCode = match[1];
  const tempFile = path.join(__dirname, '..', `temp_module_check_${fileName.replace(/\s+/g, '_')}.mjs`);
  fs.writeFileSync(tempFile, scriptCode);

  const res = spawnSync('node', ['--check', tempFile], { encoding: 'utf8' });
  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

  if (res.status === 0) {
    console.log(`✓ ${fileName} module script syntax is 100% valid!`);
  } else {
    console.error(`✗ Syntax error in ${fileName}:`);
    console.error(res.stderr || res.stdout);
    process.exit(1);
  }
}
