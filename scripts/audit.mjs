// Layout, console, and asset audit for the review site.
//
// Usage:
//   node scripts/audit.mjs [--base http://localhost:3000] [--json]
//
// Visits every route at every breakpoint, then reports:
//   - horizontal overflow and the elements responsible
//   - console errors, page exceptions, and failed requests
//   - images without alt text or that failed to load
//   - interactive controls smaller than 24 × 24 CSS px
//
// Exits with status 1 when any check fails. Set CHROME_PATH if Chrome is not in
// a standard location.
import { openBrowser } from "./cdp.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const base = option("base", process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const asJson = args.includes("--json");

const routes = option("routes", "/design-review,/hero-preview").split(",");
const widths = [1440, 1280, 1024, 768, 390, 375];

const results = [];

for (const width of widths) {
  const browser = await openBrowser({ width, height: 900 });

  for (const route of routes) {
    const url = `${base}${route}`;
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    const offConsole = browser.on("Runtime.consoleAPICalled", (params) => {
      if (params.type !== "error" && params.type !== "warning") return;
      const text = (params.args ?? [])
        .map((arg) => arg.value ?? arg.description ?? arg.type)
        .join(" ");
      consoleErrors.push(`${params.type}: ${text.slice(0, 300)}`);
    });

    const offException = browser.on("Runtime.exceptionThrown", (params) => {
      const detail = params.exceptionDetails;
      pageErrors.push(
        `${detail.exception?.description ?? detail.text ?? "Unknown error"}`.slice(0, 300),
      );
    });

    const offRequest = browser.on("Network.loadingFailed", (params) => {
      // Cancelled requests are routine for images that scroll out of view.
      if (params.canceled) return;
      failedRequests.push(`${params.type} ${params.errorText}`.trim());
    });

    await browser.send("Network.enable");
    await browser.navigate(url, { settle: 700 });

    const audit = await browser.evaluate(`(() => {
      const doc = document.documentElement;
      const viewportWidth = window.innerWidth;
      const describe = (element) => {
        const id = element.id ? "#" + element.id : "";
        const cls = (element.className || "").toString().trim().split(/\\s+/).filter(Boolean).slice(0, 2).join(".");
        const text = (element.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40);
        return element.tagName.toLowerCase() + id + (cls ? "." + cls : "") + (text ? ' "' + text + '"' : "");
      };

      const overflowing = [];
      for (const element of document.querySelectorAll("body *")) {
        const style = getComputedStyle(element);
        if (style.position === "fixed" || style.visibility === "hidden" || style.display === "none") continue;
        const rect = element.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) continue;
        const parentOverflow = element.parentElement ? getComputedStyle(element.parentElement).overflowX : "visible";
        if (parentOverflow !== "visible") continue;
        if (rect.right > viewportWidth + 1 || rect.left < -1) {
          overflowing.push({
            element: describe(element),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
          });
        }
      }

      const images = [...document.images].map((image) => ({
        src: image.currentSrc.replace(location.origin, ""),
        alt: image.getAttribute("alt"),
        loaded: image.complete && image.naturalWidth > 0,
        width: Math.round(image.getBoundingClientRect().width),
      }));

      const smallTargets = [];
      for (const element of document.querySelectorAll("a, button, input, [role=button]")) {
        const rect = element.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) continue;
        const label = (element.getAttribute("aria-label") || element.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 30);
        if (rect.width < 24 || rect.height < 24) {
          smallTargets.push({ element: describe(element), w: Math.round(rect.width), h: Math.round(rect.height), label });
        }
      }

      return {
        viewport: { width: viewportWidth, height: window.innerHeight },
        document: { width: doc.scrollWidth, height: doc.scrollHeight },
        horizontalOverflow: doc.scrollWidth > viewportWidth + 1,
        overflowing: overflowing.slice(0, 12),
        imagesMissingAlt: images.filter((image) => image.alt === null || image.alt.trim() === "").map((image) => image.src),
        imagesFailed: images.filter((image) => !image.loaded).map((image) => image.src),
        smallTargets: smallTargets.slice(0, 12),
        headings: [...document.querySelectorAll("h1")].map((element) => element.textContent.trim().replace(/\\s+/g, " ")),
        iframes: [...document.querySelectorAll("iframe")].length,
      };
    })()`);

    offConsole();
    offException();
    offRequest();

    results.push({
      url,
      width,
      ...audit,
      consoleErrors,
      pageErrors,
      failedRequests,
    });
  }

  await browser.close();
}

const problems = results.filter(
  (result) =>
    result.horizontalOverflow ||
    result.overflowing.length > 0 ||
    result.consoleErrors.length > 0 ||
    result.pageErrors.length > 0 ||
    result.failedRequests.length > 0 ||
    result.imagesMissingAlt.length > 0 ||
    result.imagesFailed.length > 0 ||
    result.smallTargets.length > 0,
);

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const result of results) {
    const flags = [];
    if (result.horizontalOverflow) flags.push(`overflow ${result.document.width}px > ${result.viewport.width}px`);
    if (result.overflowing.length) flags.push(`${result.overflowing.length} overflowing element(s)`);
    if (result.consoleErrors.length) flags.push(`${result.consoleErrors.length} console error(s)`);
    if (result.pageErrors.length) flags.push(`${result.pageErrors.length} exception(s)`);
    if (result.failedRequests.length) flags.push(`${result.failedRequests.length} failed request(s)`);
    if (result.imagesMissingAlt.length) flags.push(`${result.imagesMissingAlt.length} image(s) without alt`);
    if (result.imagesFailed.length) flags.push(`${result.imagesFailed.length} broken image(s)`);
    if (result.smallTargets.length) flags.push(`${result.smallTargets.length} small target(s)`);

    const status = flags.length ? "FAIL" : "ok";
    console.log(`${status}  ${result.width}px  ${result.url.replace(base, "") || "/"}  ${flags.join(", ")}`);

    for (const item of result.overflowing) {
      console.log(`      overflow: ${item.element} (${item.left}..${item.right})`);
    }
    for (const error of [...result.consoleErrors, ...result.pageErrors, ...result.failedRequests]) {
      console.log(`      ${error}`);
    }
    for (const src of [...result.imagesMissingAlt, ...result.imagesFailed]) {
      console.log(`      image: ${src}`);
    }
    for (const target of result.smallTargets) {
      console.log(`      target: ${target.w}×${target.h} ${target.element}`);
    }
  }

  console.log(
    problems.length ? `\n${problems.length} of ${results.length} checks failed.` : `\nAll ${results.length} checks passed.`,
  );
}

process.exit(problems.length ? 1 : 0);
