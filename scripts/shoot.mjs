// Take a screenshot with headless Chrome.
//
// Usage:
//   node scripts/shoot.mjs <url> <out.png> [width] [height] [mode]
//
// mode: viewport (default) | full | <css selector>
//   full      capture the entire document
//   selector  capture the full box of the first element matching the selector
//
// Set CHROME_PATH if Chrome is not installed in a standard location.
import { openBrowser } from "./cdp.mjs";

const [, , url, out, widthArg = "1440", heightArg = "900", mode = "viewport"] = process.argv;

if (!url || !out) {
  console.error(
    "Usage: node scripts/shoot.mjs <url> <out.png> [width] [height] [viewport|full|selector]",
  );
  process.exit(1);
}

const width = Number(widthArg);
const height = Number(heightArg);

if (!Number.isFinite(width) || !Number.isFinite(height)) {
  console.error("Width and height must be numbers.");
  process.exit(1);
}

const browser = await openBrowser({ width, height });

try {
  await browser.navigate(url);
  await browser.evaluate("window.scrollTo(0, 0)");

  let clip;
  if (mode !== "viewport" && mode !== "full") {
    clip = await browser.evaluate(`(() => {
      const element = document.querySelector(${JSON.stringify(mode)});
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    })()`);
    if (!clip) {
      console.error(`No element matches selector: ${mode}`);
      process.exit(1);
    }
  }

  const saved = await browser.screenshot({
    path: out,
    ...(clip ? { clip } : {}),
    fullPage: mode === "full",
  });
  console.log(`saved ${saved.path} (${saved.width}x${saved.height})`);
} finally {
  await browser.close();
}
