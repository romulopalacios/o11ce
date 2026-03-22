const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://127.0.0.1:3020/predictions', { waitUntil: 'networkidle' });

  const checks = await page.evaluate(() => {
    const noHorizontal = document.documentElement.scrollWidth <= window.innerWidth + 1;

    const bars = Array.from(document.querySelectorAll('div[style*="width"]')).filter((el) => {
      const w = el.getAttribute('style') || '';
      return /width:\s*\d+%/.test(w);
    });

    const renderedBars = bars.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width >= 6 && r.height >= 2 && r.right <= window.innerWidth + 1 && r.left >= -1;
    });

    const percentNodes = Array.from(document.querySelectorAll('p,span,div')).filter((n) => /\b\d{1,3}%\b/.test((n.textContent || '').trim()));

    return {
      noHorizontal,
      totalBars: bars.length,
      renderedBars: renderedBars.length,
      percentLabels: percentNodes.length,
    };
  });

  await page.screenshot({ path: 'tmp-audit-375/final-predictions-viewport.png', fullPage: false });
  console.log(JSON.stringify(checks, null, 2));
  await browser.close();
})();
