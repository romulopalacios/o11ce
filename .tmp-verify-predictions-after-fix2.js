const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

  await page.goto('http://localhost:3020/predictions', { waitUntil: 'domcontentloaded', timeout: 120000 });

  const early = await page.evaluate(() => {
    const firstArticle = document.querySelector('article');
    if (!firstArticle) return { animatedWidths: [] };

    const animated = Array.from(firstArticle.querySelectorAll('div[style*="transition: width 0.6s"]'));
    return {
      animatedWidths: animated.slice(0, 2).map((el) => el.getBoundingClientRect().width),
      animatedStyles: animated.slice(0, 2).map((el) => el.getAttribute('style') || ''),
    };
  });

  await page.waitForTimeout(1800);

  const late = await page.evaluate(() => {
    const noHorizontal = document.documentElement.scrollWidth <= window.innerWidth + 1;
    const firstArticle = document.querySelector('article');
    if (!firstArticle) {
      return {
        noHorizontal,
        localFillVisible: false,
        awayFillVisible: false,
        drawFillVisible: false,
        localFillAccent: false,
        animatedWidths: [],
      };
    }

    const animated = Array.from(firstArticle.querySelectorAll('div[style*="transition: width 0.6s"]'));
    const local = animated[0] instanceof HTMLElement ? animated[0] : null;
    const away = animated[1] instanceof HTMLElement ? animated[1] : null;

    const localRect = local?.getBoundingClientRect();
    const awayRect = away?.getBoundingClientRect();

    const localStyle = local ? window.getComputedStyle(local) : null;

    const drawCandidate = Array.from(firstArticle.querySelectorAll('div')).find((el) => {
      const node = el;
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      return rect.height >= 2 && rect.height <= 4 && rect.width >= 35 && rect.width <= 45 && style.borderRadius !== '0px';
    });

    const drawRect = drawCandidate ? drawCandidate.getBoundingClientRect() : null;

    return {
      noHorizontal,
      localFillVisible: !!localRect && localRect.width > 0,
      awayFillVisible: !!awayRect && awayRect.width > 0,
      drawFillVisible: !!drawRect && drawRect.width > 0,
      localFillAccent: !!localStyle && localStyle.backgroundColor !== 'rgba(0, 0, 0, 0)',
      animatedWidths: [localRect?.width || 0, awayRect?.width || 0],
      animatedStyles: animated.slice(0, 2).map((el) => el.getAttribute('style') || ''),
      drawWidth: drawRect?.width || 0,
    };
  });

  await page.screenshot({ path: 'tmp-audit-375/predictions-after-fix.png', fullPage: false });
  console.log(JSON.stringify({ early, late }, null, 2));

  await browser.close();
})();
