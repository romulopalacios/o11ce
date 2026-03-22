const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://127.0.0.1:3020/predictions', { waitUntil: 'networkidle' });

  const checks = await page.evaluate(() => {
    const main = document.querySelector('main');
    const noHorizontal = main ? main.scrollWidth <= main.clientWidth + 1 : false;

    const cards = Array.from(document.querySelectorAll('article, [class*="rounded"], [class*="border"]'));
    const overflowElements = cards.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.right > window.innerWidth + 1 || r.left < -1;
    }).length;

    const progressCandidates = Array.from(document.querySelectorAll('div')).filter((el) => {
      const cls = el.className?.toString?.() ?? '';
      return cls.includes('bg-accent') || cls.includes('bg-blue') || cls.includes('bg-emerald') || cls.includes('bg-amber');
    });

    const visibleBars = progressCandidates.filter((el) => {
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return r.width >= 20 && r.height >= 4 && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }).length;

    const hasPercentText = /\d{1,3}%/.test(document.body.innerText);

    return { noHorizontal, overflowElements, visibleBars, hasPercentText, viewportWidth: window.innerWidth };
  });

  await page.screenshot({ path: 'tmp-audit-375/final-predictions-viewport.png', fullPage: false });
  console.log(JSON.stringify(checks, null, 2));
  await browser.close();
})();
