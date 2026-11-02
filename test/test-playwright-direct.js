import { chromium } from 'playwright';

async function test() {
  console.log('Launching browser via Playwright...');
  // Try launching msedge or default chromium
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (err) {
    console.log('Falling back to default chromium:', err.message);
    browser = await chromium.launch({ headless: true });
  }

  const page = await browser.newPage();
  await page.setContent('<!DOCTYPE html><html><head><title>Test Title</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><h1>Hello Playwright</h1></body></html>');
  const title = await page.title();
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log('✅ Playwright verified successfully:', { title, width });
  await browser.close();
}

test().catch(err => {
  console.error('Playwright error:', err);
  process.exit(1);
});
