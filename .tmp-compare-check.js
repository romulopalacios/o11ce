const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  const p1 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p1.goto('http://127.0.0.1:3000/compare', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p1.waitForTimeout(1200);
  const compareGridCount = await p1.locator('a[href^="/compare?a="]').count();
  const compareHeading = (await p1.locator('text=comparar equipos').count()) > 0;

  const p2 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p2.goto('http://127.0.0.1:3000/compare?a=759', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p2.waitForTimeout(1200);
  const selectedAExists = await p2.locator('a').evaluateAll((links) => {
    return links.filter((link) => (link.getAttribute('class') || '').includes('border-[var(--accent)]')).length;
  });
  const waitingSecondTeam = (await p2.locator('text=Selecciona dos selecciones para comparar su rendimiento en este torneo.').count()) > 0;

  const p3 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p3.goto('http://127.0.0.1:3000/compare?a=759&b=773', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p3.waitForTimeout(1500);
  const hasVs = (await p3.locator('text=vs').count()) > 0;
  const statSection = (await p3.locator('text=estadísticas en el torneo').count()) > 0;
  const h2hSection = (await p3.locator('text=enfrentamientos directos').count()) > 0;

  const p4 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p4.goto('http://127.0.0.1:3000/teams/759', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p4.waitForTimeout(1200);
  const hasCompareLinkInTeam = (await p4.locator('a[href="/compare?a=759"]').count()) > 0;
  const hasCompareLinkText = (await p4.locator('text=comparar con otro equipo →').count()) > 0;

  const results = {
    compareRoot: {
      compareHeading,
      compareGridCount,
    },
    compareAOnly: {
      selectedAExists,
      waitingSecondTeam,
    },
    compareAB: {
      hasVs,
      statSection,
      h2hSection,
    },
    teamPage: {
      hasCompareLinkInTeam,
      hasCompareLinkText,
    },
  };

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
