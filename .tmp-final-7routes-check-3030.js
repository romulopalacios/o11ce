const { chromium } = require('playwright');

(async () => {
  const base = 'http://localhost:3030';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

  const result = {};

  await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 120000 });
  result.home = await page.evaluate(() => {
    const header = document.querySelector('header');
    const logoParts = Array.from(header?.querySelectorAll('a[href="/"] span') || []);
    const navLink = header?.querySelector('nav a');
    const logoHasDisplayClass = logoParts.some((el) => (el.className?.toString?.() || '').includes('font-display'));
    const navHasMono = !!navLink && (navLink.className?.toString?.() || '').includes('font-mono');
    return { logoHasDisplayClass, navHasMono };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-home-3030.png', fullPage: false });

  await page.goto(`${base}/matches`, { waitUntil: 'networkidle', timeout: 120000 });
  result.matches = await page.evaluate(() => {
    const scoreNode = Array.from(document.querySelectorAll('article span')).find((el) => {
      const c = el.className?.toString?.() || '';
      return c.includes('font-display');
    });
    return { hasDisplayScore: !!scoreNode };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-matches-3030.png', fullPage: false });

  await page.goto(`${base}/matches/537327`, { waitUntil: 'networkidle', timeout: 120000 });
  result.matchDetail = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const hasLargeScore = all.some((el) => {
      const c = el.className?.toString?.() || '';
      return c.includes('font-display') && (c.includes('text-[56px]') || c.includes('sm:text-[68px]'));
    });
    const noSlateClasses = all.every((el) => !(el.className?.toString?.() || '').toLowerCase().includes('slate'));
    return { hasLargeScore, noSlateClasses };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-match-detail-3030.png', fullPage: false });

  await page.goto(`${base}/groups`, { waitUntil: 'networkidle', timeout: 120000 });
  result.groups = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('span'));
    const hasDisplayPositions = spans.some((el) => (el.className?.toString?.() || '').includes('font-display'));
    const hasAccentPoints = spans.some((el) => (el.className?.toString?.() || '').includes('text-accent'));
    return { hasDisplayPositions, hasAccentPoints };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-groups-3030.png', fullPage: false });

  await page.goto(`${base}/bracket`, { waitUntil: 'networkidle', timeout: 120000 });
  result.bracket = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div')).filter((el) => (el.className?.toString?.() || '').includes('w-[180px]'));
    const firstCard = cards[0] || null;
    const width = firstCard ? Math.round(firstCard.getBoundingClientRect().width) : 0;
    const hasDisplayScore = !!(firstCard && Array.from(firstCard.querySelectorAll('span')).find((el) => (el.className?.toString?.() || '').includes('font-display')));
    return { has180Card: !!firstCard && width >= 176, hasDisplayScore, width };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-bracket-3030.png', fullPage: false });

  await page.goto(`${base}/predictions`, { waitUntil: 'networkidle', timeout: 120000 });
  result.predictions = await page.evaluate(() => {
    const pct = Array.from(document.querySelectorAll('span')).find((el) => {
      const c = el.className?.toString?.() || '';
      return c.includes('font-display') && c.includes('text-[24px]');
    });
    return { hasDisplayPercentages: !!pct };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-predictions-3030.png', fullPage: false });

  await page.goto(`${base}/compare?a=759&b=773`, { waitUntil: 'networkidle', timeout: 120000 });
  result.compare = await page.evaluate(() => {
    const text = document.body.innerText.toLowerCase();
    const hasStatsTitle = text.includes('estadisticas en el torneo') || text.includes('estadísticas en el torneo');
    const hasStatBarsVisible = ['puntos', 'victorias', 'goles a favor'].every((k) => text.includes(k));
    return { hasStatsTitle, hasStatBarsVisible };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-compare-3030.png', fullPage: false });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
