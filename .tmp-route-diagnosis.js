const { chromium } = require('playwright');

(async () => {
  const base = 'http://127.0.0.1:3020';
  const transitions = [
    { from: '/', to: '/matches' },
    { from: '/matches', to: '/groups' },
    { from: '/groups', to: '/bracket' },
    { from: '/bracket', to: '/compare' },
    { from: '/compare', to: '/stats' },
  ];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });

  await page.addInitScript(() => {
    const state = { skeletonSeen: false };
    window.__diagState = state;

    const isSkeleton = (el) => {
      if (!el || !el.matches) return false;
      if (el.matches('[data-slot="skeleton"]')) return true;
      const cls = el.getAttribute('class') || '';
      return cls.includes('animate-pulse') || cls.includes('skeleton');
    };

    const scan = () => {
      const found = document.querySelector('[data-slot="skeleton"], .animate-pulse, [class*="skeleton"]');
      if (found) state.skeletonSeen = true;
    };

    new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && isSkeleton(m.target)) {
          state.skeletonSeen = true;
          return;
        }
        for (const n of m.addedNodes) {
          if (n.nodeType === Node.ELEMENT_NODE) {
            if (isSkeleton(n) || n.querySelector?.('[data-slot="skeleton"], .animate-pulse, [class*="skeleton"]')) {
              state.skeletonSeen = true;
              return;
            }
          }
        }
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-slot'],
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scan, { once: true });
    } else {
      scan();
    }
  });

  const results = [];

  for (const step of transitions) {
    await page.goto(`${base}${step.from}`, { waitUntil: 'domcontentloaded', timeout: 120000 });

    let externalSeen = false;

    const onRequest = (req) => {
      if (req.url().includes('api.football-data.org')) externalSeen = true;
    };
    const onResponse = (res) => {
      if (res.url().includes('api.football-data.org')) externalSeen = true;
    };

    page.on('request', onRequest);
    page.on('response', onResponse);

    const start = Date.now();
    const nav = page.goto(`${base}${step.to}`, { waitUntil: 'domcontentloaded', timeout: 120000 });

    await page.waitForFunction(() => {
      const root = document.querySelector('main') || document.body;
      if (!root) return false;
      const style = window.getComputedStyle(root);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      const rect = root.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return false;
      const txt = (root.innerText || '').replace(/\s+/g, ' ').trim();
      return txt.length >= 24;
    }, { timeout: 120000 });

    const visibleMs = Date.now() - start;
    await nav;

    const [skeletonSeen, docTTFB] = await page.evaluate(() => {
      const navEntry = performance.getEntriesByType('navigation')[0];
      const ttfb = navEntry && typeof navEntry.responseStart === 'number'
        ? Math.round(navEntry.responseStart)
        : null;
      return [Boolean(window.__diagState?.skeletonSeen), ttfb];
    });

    results.push({
      transition: `${step.from} -> ${step.to}`,
      visibleMs,
      skeletonSeen,
      docTTFB,
      docTTFBOver500: docTTFB !== null ? docTTFB > 500 : null,
      externalApiSeen: externalSeen,
    });

    page.off('request', onRequest);
    page.off('response', onResponse);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
