const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const measure = async () => {
    const start = Date.now();
    await page.goto('http://127.0.0.1:3011/stats', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.locator('text=más goleadores').first().waitFor({ state: 'visible', timeout: 120000 });
    return Date.now() - start;
  };

  const firstMs = await measure();
  const secondMs = await measure();

  console.log(JSON.stringify({ firstMs, secondMs, fasterSecond: secondMs < firstMs }, null, 2));
  await browser.close();
})();
