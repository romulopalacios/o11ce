const { chromium } = require('playwright');

(async () => {
  const base = 'http://localhost:3020';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

  const hasClassToken = (el, token) => (el?.className?.toString?.() || '').includes(token);
  const findByClassIncludes = (root, token) => Array.from(root.querySelectorAll('*')).find((el) => (el.className?.toString?.() || '').includes(token));

  const result = {};

  await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 120000 });
  result.home = await page.evaluate(() => {
    const header = document.querySelector('header');
    const logo = header?.querySelector('a[href="/"]');
    const navLink = header?.querySelector('nav a');
    const logoFamily = logo ? getComputedStyle(logo).fontFamily : '';
    const navFamily = navLink ? getComputedStyle(navLink).fontFamily : '';
    return {
      logoHasBebas: /bebas|__Bebas|font-display/i.test((logo?.className || '') + ' ' + logoFamily),
      navHasMono: /dm mono|__DM_Mono|font-mono|monospace/i.test((navLink?.className || '') + ' ' + navFamily),
    };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-home.png', fullPage: false });

  await page.goto(`${base}/matches`, { waitUntil: 'networkidle', timeout: 120000 });
  result.matches = await page.evaluate(() => {
    const scoreNode = Array.from(document.querySelectorAll('article span')).find((el) => {
      const c = el.className?.toString?.() || '';
      return c.includes('font-display');
    });
    return { hasDisplayScore: !!scoreNode };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-matches2.png', fullPage: false });

  await page.goto(`${base}/matches/537327`, { waitUntil: 'networkidle', timeout: 120000 });
  result.matchDetail = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const hasLargeScore = all.some((el) => {
      const c = el.className?.toString?.() || '';
      return c.includes('font-display') && (c.includes('text-[56px]') || c.includes('sm:text-[68px]'));
    });
    const slateCount = all.filter((el) => {
      const c = el.className?.toString?.() || '';
      return c.toLowerCase().includes('slate');
    }).length;
    return { hasLargeScore, noSlateClasses: slateCount === 0 };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-match-detail2.png', fullPage: false });

  await page.goto(`${base}/groups`, { waitUntil: 'networkidle', timeout: 120000 });
  result.groups = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('span'));
    const hasDisplayPositions = all.some((el) => (el.className?.toString?.() || '').includes('font-display'));
    const hasAccentPoints = all.some((el) => (el.className?.toString?.() || '').includes('text-accent'));
    return { hasDisplayPositions, hasAccentPoints };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-groups.png', fullPage: false });

  await page.goto(`${base}/bracket`, { waitUntil: 'networkidle', timeout: 120000 });
  result.bracket = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div')).filter((el) => (el.className?.toString?.() || '').includes('w-[180px]'));
    const firstCard = cards[0] || null;
    const width = firstCard ? Math.round(firstCard.getBoundingClientRect().width) : 0;
    const hasDisplayScore = !!(firstCard && Array.from(firstCard.querySelectorAll('span')).find((el) => (el.className?.toString?.() || '').includes('font-display')));
    return { has180Card: !!firstCard && width >= 176, hasDisplayScore, width };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-bracket.png', fullPage: false });

  await page.goto(`${base}/predictions`, { waitUntil: 'networkidle', timeout: 120000 });
  result.predictions = await page.evaluate(() => {
    const pct = Array.from(document.querySelectorAll('span')).find((el) => {
      const c = el.className?.toString?.() || '';
      return c.includes('font-display') && c.includes('text-[24px]');
    });
    return { hasDisplayPercentages: !!pct };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-predictions2.png', fullPage: false });

  await page.goto(`${base}/compare?a=759&b=773`, { waitUntil: 'networkidle', timeout: 120000 });
  result.compare = await page.evaluate(() => {
    const text = document.body.innerText.toLowerCase();
    const hasStatsTitle = text.includes('estadisticas en el torneo') || text.includes('estadísticas en el torneo');
    const hasStatBarsVisible = ['puntos', 'victorias', 'goles a favor'].every((k) => text.includes(k));
    return { hasStatsTitle, hasStatBarsVisible };
  });
  await page.screenshot({ path: 'tmp-audit-375/final-compare.png', fullPage: false });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
