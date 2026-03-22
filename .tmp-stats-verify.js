const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });

  let skeletonSeen = false;
  const markSkeleton = async () => {
    const seen = await page.locator('[data-slot="skeleton"], .animate-pulse, [class*="skeleton"]').first().isVisible().catch(() => false);
    if (seen) skeletonSeen = true;
  };

  const start = Date.now();
  const nav = page.goto('http://127.0.0.1:3020/stats', { waitUntil: 'domcontentloaded', timeout: 120000 });

  await page.locator('h1:has-text("STATS")').first().waitFor({ state: 'visible', timeout: 120000 });
  const headerMs = Date.now() - start;

  // Sample quickly for skeleton during the loading window.
  for (let i = 0; i < 10; i += 1) {
    await markSkeleton();
    await page.waitForTimeout(40);
  }

  await page.locator('text=más goleadores').first().waitFor({ state: 'visible', timeout: 120000 });
  const contentMs = Date.now() - start;

  await nav;

  console.log(JSON.stringify({ headerMs, contentMs, skeletonSeen, headerBeforeData: headerMs < contentMs }, null, 2));
  await browser.close();
})();
