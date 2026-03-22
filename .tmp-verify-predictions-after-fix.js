const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

  await page.goto('http://localhost:3020/predictions', { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(1800);

  const checks = await page.evaluate(() => {
    const noHorizontal = document.documentElement.scrollWidth <= window.innerWidth + 1;

    const cards = Array.from(document.querySelectorAll('article'));
    const firstCard = cards[0] || null;

    const barTracks = firstCard
      ? Array.from(firstCard.querySelectorAll('div.h-\[3px\].bg-\[var\(--border2\)\]'))
      : [];

    const getFill = (track) => {
      const child = track.firstElementChild;
      if (!(child instanceof HTMLElement)) return null;
      const rect = child.getBoundingClientRect();
      const style = window.getComputedStyle(child);
      const inlineStyle = child.getAttribute('style') || '';
      return {
        width: rect.width,
        height: rect.height,
        background: style.backgroundColor,
        inlineStyle,
      };
    };

    const localFill = barTracks[0] ? getFill(barTracks[0]) : null;
    const drawFill = barTracks[1] ? getFill(barTracks[1]) : null;
    const awayFill = barTracks[2] ? getFill(barTracks[2]) : null;

    const localHasAccent = !!localFill && /var\(--accent\)|rgb\(/i.test(localFill.inlineStyle + localFill.background);
    const awayVisible = !!awayFill && awayFill.width > 0;
    const drawVisible = !!drawFill && drawFill.width > 0;

    const animatedFromZero = !!localFill && /width\s*0\.6s/.test(localFill.inlineStyle)
      && !!awayFill && /width\s*0\.6s/.test(awayFill.inlineStyle);

    return {
      noHorizontal,
      localHasAccent,
      awayVisible,
      drawVisible,
      animatedFromZero,
      localFill,
      drawFill,
      awayFill,
      barTrackCount: barTracks.length,
    };
  });

  await page.screenshot({ path: 'tmp-audit-375/predictions-after-fix.png', fullPage: false });
  console.log(JSON.stringify(checks, null, 2));
  await browser.close();
})();
