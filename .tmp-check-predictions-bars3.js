const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://127.0.0.1:3020/predictions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const checks = await page.evaluate(() => {
    const noHorizontal = document.documentElement.scrollWidth <= window.innerWidth + 1;
    const bars = Array.from(document.querySelectorAll('div[style*="width"]')).filter((el) => /width:\s*\d+%/.test(el.getAttribute('style') || ''));
    const sample = bars.slice(0, 5).map((el) => ({
      style: el.getAttribute('style'),
      rect: el.getBoundingClientRect().toJSON()
    }));

    const renderedBars = bars.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width >= 2 && r.height >= 2;
    });

    return { noHorizontal, totalBars: bars.length, renderedBars: renderedBars.length, sample };
  });

  await page.screenshot({ path: 'tmp-audit-375/final-predictions-viewport.png', fullPage: false });
  console.log(JSON.stringify(checks, null, 2));
  await browser.close();
})();
