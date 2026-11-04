import { chromium } from 'playwright';

async function run() {
  console.log('Launching browser to test live plugins UI...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('https://epic-think-ai.vercel.app/app/chat', { waitUntil: 'networkidle' });

  // Simulate authenticated appView display
  await page.evaluate(() => {
    const intro = document.getElementById('epicIntroContainer');
    if (intro) intro.style.display = 'none';
    const app = document.getElementById('appView');
    if (app) app.style.display = 'flex';
  });

  await page.waitForSelector('#pluginStoreBtn', { state: 'visible', timeout: 5000 });
  console.log('✓ #pluginStoreBtn is visible in top navigation');

  // Verify modal is initially closed
  let isOpen = await page.$eval('#pluginStoreModal', el => el.classList.contains('open'));
  console.log('Plugin modal initially open:', isOpen);
  if (isOpen) throw new Error('Plugin modal should initially be closed');

  // Click top nav button
  console.log('Clicking #pluginStoreBtn...');
  await page.click('#pluginStoreBtn');
  await page.waitForTimeout(500);

  isOpen = await page.$eval('#pluginStoreModal', el => el.classList.contains('open'));
  console.log('Plugin modal open after top nav click:', isOpen);
  if (!isOpen) throw new Error('Plugin modal failed to open after #pluginStoreBtn click');

  // Check rendered cards count
  const cardCount = await page.$$eval('#pluginsGrid .plugin-card', cards => cards.length);
  console.log('Rendered plugin cards count:', cardCount);
  if (cardCount < 5) throw new Error('Expected at least 5 plugins to be rendered');

  // Check card titles
  const titles = await page.$$eval('#pluginsGrid .plugin-title', els => els.map(e => e.textContent.trim()));
  console.log('Plugin titles rendered:', titles);

  // Close modal via Close button
  console.log('Clicking #closePluginStoreBtn...');
  await page.click('#closePluginStoreBtn');
  await page.waitForTimeout(500);

  isOpen = await page.$eval('#pluginStoreModal', el => el.classList.contains('open'));
  console.log('Plugin modal open after close click:', isOpen);
  if (isOpen) throw new Error('Plugin modal should be closed');

  // Click sidebar button
  console.log('Clicking #sidebarPluginsBtn...');
  await page.click('#sidebarPluginsBtn');
  await page.waitForTimeout(500);

  isOpen = await page.$eval('#pluginStoreModal', el => el.classList.contains('open'));
  console.log('Plugin modal open after sidebar click:', isOpen);
  if (!isOpen) throw new Error('Plugin modal failed to open after #sidebarPluginsBtn click');

  // Close modal via Done button
  console.log('Clicking #donePluginStoreBtn...');
  await page.click('#donePluginStoreBtn');
  await page.waitForTimeout(500);

  isOpen = await page.$eval('#pluginStoreModal', el => el.classList.contains('open'));
  console.log('Plugin modal open after Done click:', isOpen);
  if (isOpen) throw new Error('Plugin modal should be closed after Done click');

  // Test hash navigation directly (#plugins)
  console.log('Testing deep-link navigation window.location.hash = "#plugins"...');
  await page.evaluate(() => { window.location.hash = 'plugins'; });
  await page.waitForTimeout(500);

  isOpen = await page.$eval('#pluginStoreModal', el => el.classList.contains('open'));
  console.log('Plugin modal open after setting hash to #plugins:', isOpen);
  if (!isOpen) throw new Error('Plugin modal failed to open via hash change');

  await browser.close();
  console.log('\n🎉 ALL TESTS PASSED: Plugins option is fully working in production!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
