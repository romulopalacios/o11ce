const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

  await page.goto('http://127.0.0.1:3020/matches/537327', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.waitForTimeout(1500);

  const checks = await page.evaluate(() => {
    const text = (document.body.innerText || '').toLowerCase();
    const hasVisibleContent = text.trim().length > 120 && (text.includes('información general') || text.includes('goles') || text.includes('marcador') || text.includes('vs'));

    const hasScoreBoardSignals = ['vs', "'", 'en juego', 'finalizado', 'programado'].some((token) => text.includes(token));

    const infoLabel = Array.from(document.querySelectorAll('span,p,div')).find((el) =>
      (el.textContent || '').trim().toLowerCase() === 'información general'
    );

    let infoHasGridCols2 = false;
    if (infoLabel) {
      const container = infoLabel.closest('div');
      if (container) {
        const grid = container.querySelector('.grid.grid-cols-2');
        infoHasGridCols2 = Boolean(grid);
      }
    }

    const golesLabel = Array.from(document.querySelectorAll('span,p,div')).find((el) =>
      (el.textContent || '').trim().toLowerCase() === 'goles'
    );
    let golesLooksSystem = false;
    if (golesLabel) {
      const container = golesLabel.closest('div');
      if (container) {
        const cls = container.getAttribute('class') || '';
        golesLooksSystem = cls.includes('bg-surface') && cls.includes('border-border');
      }
    }

    const hasSlateClassInDom = Array.from(document.querySelectorAll('[class]')).some((el) =>
      (el.getAttribute('class') || '').includes('slate-')
    );

    const noHorizontal = document.documentElement.scrollWidth <= document.documentElement.clientWidth;

    return {
      hasVisibleContent,
      hasScoreBoardSignals,
      golesLooksSystem,
      infoHasGridCols2,
      hasSlateClassInDom,
      noHorizontal,
      width: {
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      },
    };
  });

  await page.screenshot({ path: 'tmp-audit-375/match-detail-after-fix.png', fullPage: true });

  console.log(JSON.stringify(checks, null, 2));
  await browser.close();
})();
