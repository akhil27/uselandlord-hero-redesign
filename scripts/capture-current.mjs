// Capture the current (live) Landlord homepage hero for the before/after
// comparison.
//
// Usage:
//   node scripts/capture-current.mjs [--out path] [--width 1440] [--height 851]
//                                    [--from page|hero] [--url https://uselandlord.com]
//
// --from page  (default) starts at the top of the page, so the announcement
//              bar, header, hero, and customer logo strip are all included.
// --from hero  starts at the hero section itself, for a hero-only crop.
//
// Both crops use the same width and height as the proposed hero preview, so the
// two screenshots can be compared at an identical viewport size. Consent and
// chat overlays are dismissed first; they are not part of the hero composition.
import { openBrowser } from "./cdp.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const source = option("url", "https://uselandlord.com");
const out = option("out", "public/screens/current-hero-desktop.png");
const width = Number(option("width", "1440"));
const height = Number(option("height", "851"));
const from = option("from", "page");

if (!Number.isFinite(width) || !Number.isFinite(height)) {
  console.error("Width and height must be numbers.");
  process.exit(1);
}

const browser = await openBrowser({ width, height: Math.max(height, 1000) });

try {
  await browser.navigate(source, { settle: 900 });

  // Decline analytics cookies so no consent dialog covers the hero.
  await browser.evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find((element) =>
      /reject all/i.test(element.textContent ?? ""),
    );
    button?.click();
    return Boolean(button);
  })()`);

  // Remove floating third-party widgets (chat launchers, consent remnants).
  await browser.evaluate(`(() => {
    for (const element of document.querySelectorAll(
      ".lcc-banner, .lwc-btn, [class*='cookie-'], [id*='chat-widget']",
    )) {
      const style = getComputedStyle(element);
      if (style.position === "fixed" || style.position === "sticky") {
        element.style.display = "none";
      }
    }
    window.scrollTo(0, 0);
    return true;
  })()`);

  const hero = await browser.evaluate(`(() => {
    const element = document.querySelector(".hero-section");
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  })()`);

  if (!hero) throw new Error("Could not find the live .hero-section element.");

  const origin = from === "hero" ? { x: hero.x, y: hero.y } : { x: 0, y: 0 };

  const saved = await browser.screenshot({
    path: out,
    clip: {
      x: origin.x,
      y: origin.y,
      width: Math.min(hero.width, width),
      height,
    },
  });

  console.log(`saved ${saved.path} (${saved.width}x${saved.height}) from ${source}`);
  console.log(`crop: --from ${from}`);
  console.log(
    `hero section: ${Math.round(hero.width)}x${Math.round(hero.height)} at y=${Math.round(hero.y)}`,
  );
} finally {
  await browser.close();
}
