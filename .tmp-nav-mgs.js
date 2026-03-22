const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const base = 'http://127.0.0.1:3011';

  for (const path of ['/matches', '/groups', '/stats']) {
    await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(250);
  }

  console.log('done');
  await browser.close();
})();
