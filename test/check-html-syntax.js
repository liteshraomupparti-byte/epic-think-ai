import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/<script type="module">([\s\S]*?)<\/script>/i);

if (!match) {
  console.error('ERROR: No <script type="module"> found!');
  process.exit(1);
}

const scriptCode = match[1];
const tempFile = path.join(__dirname, '..', 'temp_module_check.mjs');
fs.writeFileSync(tempFile, scriptCode);

const res = spawnSync('node', ['--check', tempFile], { encoding: 'utf8' });
if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

if (res.status === 0) {
  console.log('✓ index.html module script syntax is 100% valid!');
} else {
  console.error('✗ Syntax error in index.html:');
  console.error(res.stderr || res.stdout);
  process.exit(1);
}
