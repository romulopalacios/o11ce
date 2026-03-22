const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const response = await page.goto('http://127.0.0.1:3011/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    const hasTournamentBannerSignal = bodyText.includes('goles') && bodyText.includes('partidos');

    console.log(JSON.stringify({
      status: response ? response.status() : null,
      hasTournamentBannerSignal,
      hasTypeErrorInConsole: consoleErrors.some((e) => e.toLowerCase().includes('typeerror')),
      consoleErrors,
      url: page.url()
    }, null, 2));

    await browser.close();
  } catch (error) {
    console.error('CHECK_FAILED', error);
    process.exit(1);
  }
})();
