import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

console.log('Testing index.html for Plugins Modal...');
if (!html.includes('id="pluginStoreModal"')) throw new Error('pluginStoreModal missing');
if (!html.includes('id="pluginStoreBtn"')) throw new Error('pluginStoreBtn missing');
if (!html.includes('id="sidebarPluginsBtn"')) throw new Error('sidebarPluginsBtn missing');
if (!html.includes('window.openPluginStoreModal = openPluginStoreModal')) throw new Error('openPluginStoreModal export missing');
if (!html.includes("id: 'browser-use'")) throw new Error('browser-use missing');
if (!html.includes("id: 'firecrawl'")) throw new Error('firecrawl missing');
if (!html.includes('window.closePluginStore = closePluginStore')) throw new Error('closePluginStore export missing');
if (!html.includes("window.addEventListener('hashchange', handlePluginRoute)")) throw new Error('handlePluginRoute listener missing');

console.log('✓ All DOM IDs, click bindings, and exports verified successfully in index.html!');
