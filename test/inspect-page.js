import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('https://epic-think-ai.vercel.app/app/chat', { waitUntil: 'networkidle' });

  const bodyChildren = await page.$$eval('body > *', els => els.map(e => ({
    tag: e.tagName,
    id: e.id,
    class: e.className,
    display: window.getComputedStyle(e).display
  })));
  console.log('Body direct children:', JSON.stringify(bodyChildren, null, 2));

  await browser.close();
}

run().catch(console.error);
