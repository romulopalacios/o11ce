const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  const pageMatches = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await pageMatches.goto('http://127.0.0.1:3020/matches', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageMatches.waitForTimeout(1200);

  const filterData = await pageMatches.evaluate(() => {
    const labels = ['todos', 'programados', 'en vivo', 'finalizados'];
    const links = labels.map((label) => {
      const el = Array.from(document.querySelectorAll('a')).find((a) => (a.textContent || '').trim().toLowerCase() === label);
      return {
        label,
        exists: Boolean(el),
        className: el ? (el.getAttribute('class') || '') : ''
      };
    });

    const activeTodos = links.find((l) => l.label === 'todos');

    return {
      links,
      activeTodosHasAccent: Boolean(activeTodos && activeTodos.className.includes('border-accent') && activeTodos.className.includes('text-accent')),
    };
  });

  await pageMatches.screenshot({ path: 'tmp-audit-375/matches-after-fix.png', fullPage: true });

  const pagePred = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await pagePred.goto('http://127.0.0.1:3020/predictions', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pagePred.waitForTimeout(1200);

  const predData = await pagePred.evaluate(() => {
    const hasVerTodos = Array.from(document.querySelectorAll('a')).some((a) => (a.textContent || '').toLowerCase().includes('ver todos'));
    const hasPrediccionesHeading = Array.from(document.querySelectorAll('*')).some((n) => (n.textContent || '').trim().toLowerCase() === 'predicciones');
    return { hasVerTodos, hasPrediccionesHeading };
  });

  await pagePred.screenshot({ path: 'tmp-audit-375/predictions-after-fix.png', fullPage: true });

  console.log(JSON.stringify({ matches: filterData, predictions: predData }, null, 2));
  await browser.close();
})();
