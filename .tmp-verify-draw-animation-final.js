const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:3020/predictions', { waitUntil: 'domcontentloaded', timeout: 120000 });

  const initial = await page.evaluate(() => {
    const article = document.querySelector('article');
    if (!article) return { drawZero: false, drawStyle: '' };

    const zeroCandidates = Array.from(article.querySelectorAll('div[style*="width:0%"], div[style*="width: 0%"]'));
    const drawNode = zeroCandidates.find((el) => {
      const style = (el.getAttribute('style') || '').replace(/\s+/g, '').toLowerCase();
      return style.includes('transition:width0.6s') && style.includes('0%');
    });

    return {
      drawZero: !!drawNode,
      drawStyle: drawNode ? (drawNode.getAttribute('style') || '') : '',
      zeroCandidates: zeroCandidates.length,
    };
  });

  await page.waitForTimeout(1300);

  const after = await page.evaluate(() => {
    const article = document.querySelector('article');
    if (!article) return { drawAnimatedToFull: false, drawStyle: '', noHorizontal: false };

    const fullCandidates = Array.from(article.querySelectorAll('div[style*="width: 100%"], div[style*="width:100%"]'));
    const drawNode = fullCandidates.find((el) => {
      const style = (el.getAttribute('style') || '').replace(/\s+/g, '').toLowerCase();
      return style.includes('transition:width0.6s');
    });

    const noHorizontal = document.documentElement.scrollWidth <= window.innerWidth + 1;

    return {
      drawAnimatedToFull: !!drawNode,
      drawStyle: drawNode ? (drawNode.getAttribute('style') || '') : '',
      noHorizontal,
      fullCandidates: fullCandidates.length,
    };
  });

  await page.screenshot({ path: 'tmp-audit-375/predictions-draw-after-fix.png', fullPage: false });
  console.log(JSON.stringify({ initial, after }, null, 2));
  await browser.close();
})();
