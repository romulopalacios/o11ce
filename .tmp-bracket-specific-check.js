const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:3030/bracket', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    const bracketCards = divs.filter((el) => {
      const c = el.className?.toString?.() || '';
      return c.includes('w-[180px]') && !c.includes('sm:w-[180px]');
    });
    const skeletonCards = divs.filter((el) => {
      const c = el.className?.toString?.() || '';
      return c.includes('w-[150px]') && c.includes('sm:w-[180px]');
    });
    const displayScores = Array.from(document.querySelectorAll('span')).filter((el) => {
      const c = el.className?.toString?.() || '';
      return c.includes('font-display') && c.includes('text-[17px]');
    });
    return {
      bracketCardCount: bracketCards.length,
      skeletonCount: skeletonCards.length,
      displayScoreCount: displayScores.length,
      bracketWidth: bracketCards[0] ? Math.round(bracketCards[0].getBoundingClientRect().width) : 0,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
