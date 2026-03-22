const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:3020/predictions', { waitUntil: 'domcontentloaded', timeout: 120000 });

  const initial = await page.evaluate(() => {
    const article = document.querySelector('article');
    if (!article) return { drawZero: false, drawStyle: '' };

    const animated = Array.from(article.querySelectorAll('div[style*="transition: width 0.6s"], div[style*="transition:width 0.6s"]'));
    const drawNode = animated.find((el) => {
      const style = (el.getAttribute('style') || '').replace(/\s+/g, '');
      return style.includes('width:0%');
    });

    return {
      drawZero: !!drawNode,
      drawStyle: drawNode ? (drawNode.getAttribute('style') || '') : '',
      animatedCount: animated.length,
    };
  });

  await page.waitForTimeout(1300);

  const after = await page.evaluate(() => {
    const article = document.querySelector('article');
    if (!article) return { drawAnimatedToFull: false, drawStyle: '', noHorizontal: false };

    const nodes = Array.from(article.querySelectorAll('div[style*="transition"]'));
    const drawNode = nodes.find((el) => {
      const style = (el.getAttribute('style') || '').replace(/\s+/g, '');
      return style.includes('width:100%');
    });

    const noHorizontal = document.documentElement.scrollWidth <= window.innerWidth + 1;

    return {
      drawAnimatedToFull: !!drawNode,
      drawStyle: drawNode ? (drawNode.getAttribute('style') || '') : '',
      noHorizontal,
    };
  });

  console.log(JSON.stringify({ initial, after }, null, 2));
  await browser.close();
})();
