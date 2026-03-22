const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const desktopConsoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') desktopConsoleErrors.push(msg.text());
  });

  const response = await page.goto('http://127.0.0.1:3000/bracket', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1800);

  const hasEmptyMessage = (await page.locator('text=la fase eliminatoria comienza cuando terminen los partidos de grupos').count()) > 0;
  const desktopColumns = await page.locator('span:has-text("Octavos"), span:has-text("Cuartos"), span:has-text("Semis"), span:has-text("Final")').count();
  const hasBracketCards = await page.locator('a[href^="/matches/"]').count();

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobile.goto('http://127.0.0.1:3000/bracket', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await mobile.waitForTimeout(1500);

  const scrollInfo = await mobile.locator('div.overflow-x-auto').first().evaluate((el) => ({
    clientWidth: el.clientWidth,
    scrollWidth: el.scrollWidth,
    hasHorizontalScroll: el.scrollWidth > el.clientWidth,
  }));

  console.log(JSON.stringify({
    status: response ? response.status() : null,
    hasEmptyMessage,
    desktopColumns,
    hasBracketCards,
    desktopConsoleHasTypeError: desktopConsoleErrors.some((e) => e.toLowerCase().includes('typeerror')),
    desktopConsoleErrors,
    mobileScroll: scrollInfo,
  }, null, 2));

  await browser.close();
})();
