const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const base = 'http://127.0.0.1:3011';
  const routes = [
    '/',
    '/matches',
    '/matches/537327',
    '/groups',
    '/bracket',
    '/compare',
    '/compare?a=759&b=773',
    '/teams',
    '/predictions',
    '/stats'
  ];

  const outDir = path.join(process.cwd(), 'tmp-audit-375');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });

  const results = [];

  for (const route of routes) {
    const page = await context.newPage();
    const url = `${base}${route}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1200);

    const safe = route
      .replace(/^\//, '')
      .replace(/[?&=]/g, '_')
      .replace(/\//g, '__') || 'home';

    const screenshotPath = path.join(outDir, `${safe}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const horizontal = Math.max(doc.scrollWidth, body ? body.scrollWidth : 0) > doc.clientWidth + 1;

      const nav = document.querySelector('nav');
      const logo = nav ? nav.querySelector('a[href="/"]') : null;
      const burger = nav ? nav.querySelector('button') : null;

      function fits(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return r.left >= -0.5 && r.right <= window.innerWidth + 0.5;
      }

      return {
        windowWidth: window.innerWidth,
        docClientWidth: doc.clientWidth,
        docScrollWidth: doc.scrollWidth,
        bodyScrollWidth: body ? body.scrollWidth : null,
        horizontal,
        navExists: !!nav,
        logoFits: fits(logo),
        burgerFits: fits(burger),
        textSample: (body?.innerText || '').slice(0, 500)
      };
    });

    results.push({ route, screenshotPath, metrics });
    await page.close();
  }

  fs.writeFileSync(path.join(outDir, 'metrics.json'), JSON.stringify(results, null, 2));
  console.log(`Saved ${results.length} screenshots to ${outDir}`);
})();
