import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const ids = [
  'pluginStoreBtn',
  'sidebarPluginsBtn',
  'pluginStoreModal',
  'closePluginStoreBtn',
  'donePluginStoreBtn',
  'pluginsGrid',
  'pluginCategoryTabs',
  'activeToolsCount',
  'sidebarActiveToolsCount',
  'activeToolsCountModal',
  'botTokenModal',
  'closeBotTokenBtn',
  'cancelBotTokenBtn',
  'submitBotTokenBtn',
  'botTokenInput'
];

let allPassed = true;
ids.forEach(id => {
  const has = html.includes(`id="${id}"`);
  if (!has) {
    console.error(`✗ Missing ID: ${id}`);
    allPassed = false;
  } else {
    console.log(`✓ ID present: ${id}`);
  }
});

if (allPassed) {
  console.log('\nAll 15 Plugin UI Elements & Modals are present in the DOM!');
} else {
  process.exit(1);
}
