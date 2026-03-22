const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:3020/predictions', { waitUntil: 'domcontentloaded', timeout: 120000 });

  const initialZero = await page.evaluate(() => {
    const firstArticle = document.querySelector('article');
    if (!firstArticle) return { zeroCount: 0, styles: [] };
    const zeroNodes = Array.from(firstArticle.querySelectorAll('div[style*="width:0%"], div[style*="width: 0%"]'));
    return {
      zeroCount: zeroNodes.length,
      styles: zeroNodes.slice(0, 2).map((el) => el.getAttribute('style') || ''),
    };
  });

  await page.waitForTimeout(1200);

  const after = await page.evaluate(() => {
    const firstArticle = document.querySelector('article');
    if (!firstArticle) return { nonZeroCount: 0, styles: [] };
    const nonZero = Array.from(firstArticle.querySelectorAll('div[style*="transition"]')).filter((el) => {
      const style = (el.getAttribute('style') || '').replace(/\s+/g, '');
      return /width:(?!0%)[0-9]+%/.test(style);
    });
    return {
      nonZeroCount: nonZero.length,
      styles: nonZero.slice(0, 2).map((el) => el.getAttribute('style') || ''),
    };
  });

  console.log(JSON.stringify({ initialZero, after }, null, 2));
  await browser.close();
})();
