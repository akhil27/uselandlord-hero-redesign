// Inspect layout metrics and computed styles in headless Chrome.
//
// Usage:
//   node scripts/inspect.mjs <url> [width] [height] [expression]
//
// The optional expression runs in the page and its return value is printed as
// JSON. Without one, a layout summary is printed.
import { openBrowser } from "./cdp.mjs";

const [, , url, widthArg = "1440", heightArg = "900", expression] = process.argv;

if (!url) {
  console.error("Usage: node scripts/inspect.mjs <url> [width] [height] [expression]");
  process.exit(1);
}

const width = Number(widthArg);
const height = Number(heightArg);
const browser = await openBrowser({ width, height });

try {
  await browser.navigate(url);

  const defaultExpression = `(() => {
    const root = document.documentElement;
    return {
      url: location.href,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      document: { width: root.scrollWidth, height: root.scrollHeight },
      horizontalOverflow: root.scrollWidth > window.innerWidth,
      headings: [...document.querySelectorAll("h1,h2,h3")].slice(0, 12).map((el) => ({
        tag: el.tagName,
        text: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 80),
      })),
    };
  })()`;

  const result = await browser.evaluate(expression || defaultExpression);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
