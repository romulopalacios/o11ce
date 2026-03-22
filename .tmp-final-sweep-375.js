const { chromium } = require('playwright');

(async () => {
  const base = 'http://127.0.0.1:3020';
  const browser = await chromium.launch({ headless: true });

  const routes = [
    { name: 'matches', path: '/matches' },
    { name: 'matchDetail', path: '/matches/537327' },
    { name: 'predictions', path: '/predictions' },
  ];

  const out = {};

  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto(`${base}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1500);

    out[route.name] = await page.evaluate(() => {
      const text = (document.body.innerText || '').toLowerCase();
      const links = Array.from(document.querySelectorAll('a'));
      const noHorizontal = document.documentElement.scrollWidth <= document.documentElement.clientWidth;

      const filters = ['todos', 'programados', 'en vivo', 'finalizados'].map((label) => {
        const link = links.find((a) => (a.textContent || '').trim().toLowerCase() === label);
        return {
          label,
          exists: Boolean(link),
          className: link?.getAttribute('class') || '',
        };
      });

      const activeFilterHasAccent = filters.some((f) => f.className.includes('border-accent') && f.className.includes('text-accent'));

      const hasPrediccionesTitle = text.includes('predicciones');
      const hasVerTodos = links.some((a) => (a.textContent || '').toLowerCase().includes('ver todos'));
      const hasFallbackAccuracy = text.includes('sin partidos evaluados') || text.includes('sin partidos evaluados aún');

      const hasInfoGeneral = text.includes('información general') || text.includes('informacion general');
      const hasGoles = text.includes('goles');
      const hasScoreSignals = text.includes('mexico') || text.includes('south africa') || text.includes('ht') || text.includes('jornada');
      const hasGridCols2 = Boolean(document.querySelector('.grid.grid-cols-2'));
      const hasSlateClassInDom = Array.from(document.querySelectorAll('[class]')).some((el) =>
        (el.getAttribute('class') || '').includes('slate-')
      );

      const hasPredictionCards = Boolean(document.querySelector('[class*="stagger"]')) || text.includes('predicción') || text.includes('probabilidad');

      return {
        noHorizontal,
        filters,
        activeFilterHasAccent,
        hasPrediccionesTitle,
        hasVerTodos,
        hasFallbackAccuracy,
        hasInfoGeneral,
        hasGoles,
        hasScoreSignals,
        hasGridCols2,
        hasSlateClassInDom,
        hasPredictionCards,
        bodyTextSample: (document.body.innerText || '').slice(0, 300),
      };
    });

    await page.screenshot({ path: `tmp-audit-375/final-${route.name}.png`, fullPage: true });
    await page.close();
  }

  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
