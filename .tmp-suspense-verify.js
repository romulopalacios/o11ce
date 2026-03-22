const { chromium } = require('playwright');

(async () => {
  const base = 'http://127.0.0.1:3020';
  const routes = [
    { path: '/matches', headerText: 'PARTIDOS' },
    { path: '/groups', headerText: 'GRUPOS' },
    { path: '/bracket', headerText: 'BRACKET' },
    { path: '/compare', headerText: 'COMPARAR' },
    { path: '/stats', headerText: 'STATS' },
  ];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });

  const results = [];

  for (const route of routes) {
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 120000 });

    await page.addInitScript((targetHeader) => {
      window.__perfFlags = {
        headerSeenMs: null,
        skeletonSeen: false,
      };

      const markHeader = () => {
        if (window.__perfFlags.headerSeenMs !== null) return;
        const els = Array.from(document.querySelectorAll('h1, h2, [role="heading"]'));
        const found = els.some((el) => (el.textContent || '').toUpperCase().includes(targetHeader));
        if (found) {
          const nav = performance.getEntriesByType('navigation')[0];
          window.__perfFlags.headerSeenMs = nav ? Math.round(performance.now()) : Math.round(performance.now());
        }
      };

      const markSkeleton = () => {
        if (window.__perfFlags.skeletonSeen) return;
        const sk = document.querySelector('[data-slot="skeleton"], .animate-pulse, [class*="skeleton"]');
        if (sk) window.__perfFlags.skeletonSeen = true;
      };

      const observer = new MutationObserver(() => {
        markHeader();
        markSkeleton();
      });

      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-slot'] });
      markHeader();
      markSkeleton();
      document.addEventListener('DOMContentLoaded', () => { markHeader(); markSkeleton(); }, { once: true });
    }, route.headerText);

    const start = Date.now();
    await page.goto(`${base}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 120000 });

    await page.waitForFunction(() => {
      const root = document.querySelector('main') || document.body;
      const txt = (root?.innerText || '').replace(/\s+/g, ' ').trim();
      return txt.length >= 24;
    }, { timeout: 120000 });

    const visibleMs = Date.now() - start;
    const flags = await page.evaluate(() => window.__perfFlags || { headerSeenMs: null, skeletonSeen: false });

    results.push({
      route: route.path,
      headerSeenMs: flags.headerSeenMs,
      skeletonSeen: Boolean(flags.skeletonSeen),
      visibleMs,
    });
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
