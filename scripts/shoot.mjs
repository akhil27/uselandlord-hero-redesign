// Headless Chrome screenshot helper (no external dependencies).
// Usage:
//   node scripts/shoot.mjs <url> <out.png> [width] [height] [clipSelector|full|viewport]
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const [, , url, out, widthArg = "1440", heightArg = "1000", mode = "viewport"] = process.argv;
if (!url || !out) {
  console.error("Usage: node scripts/shoot.mjs <url> <out.png> [width] [height] [selector|full|viewport]");
  process.exit(1);
}

const width = Number(widthArg);
const height = Number(heightArg);
const port = 9300 + Math.floor(Math.random() * 500);
const userDataDir = `/tmp/landlord-cdp-${process.pid}`;
mkdirSync(userDataDir, { recursive: true });

const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--force-color-profile=srgb",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);

let ws;
let nextId = 0;
const pending = new Map();
const waiters = new Map();

function send(method, params = {}) {
  const id = ++nextId;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function waitEvent(name, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      waiters.delete(name);
      reject(new Error(`timeout waiting ${name}`));
    }, timeout);
    waiters.set(name, (params) => {
      clearTimeout(timer);
      waiters.delete(name);
      resolve(params);
    });
  });
}

async function getWsUrl() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Chrome did not start");
}

try {
  const wsUrl = await getWsUrl();
  ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
    } else if (data.method && waiters.has(data.method)) {
      waiters.get(data.method)(data.params);
    }
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: width < 700,
  });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  const loaded = waitEvent("Page.loadEventFired");
  await send("Page.navigate", { url });
  await loaded;
  await send("Runtime.evaluate", {
    expression: `document.fonts.ready.then(() => new Promise(r => setTimeout(r, 500)))`,
    awaitPromise: true,
  });
  await send("Runtime.evaluate", {
    expression: `(async () => {
      const frames = Array.from(document.querySelectorAll('iframe'));
      await Promise.all(frames.map(f => new Promise(resolve => {
        try { if (f.contentDocument && f.contentDocument.readyState === 'complete') return resolve(); } catch {}
        f.addEventListener('load', resolve, { once: true });
        setTimeout(resolve, 10000);
      })));
      await Promise.all(frames.map(f => {
        try { return f.contentDocument.fonts.ready; } catch { return Promise.resolve(); }
      }));
      await new Promise(r => setTimeout(r, 900));
      return frames.length;
    })()`,
    awaitPromise: true,
  });
  await send("Runtime.evaluate", {
    expression: `(() => {
      document.querySelectorAll('[data-cookie-banner]').forEach(el => el.remove());
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      return { h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth };
    })()`,
    returnByValue: true,
  });
  // Force offscreen iframes to render before a beyond-viewport capture.
  await send("Runtime.evaluate", {
    expression: `(async () => {
      const frames = Array.from(document.querySelectorAll('iframe'));
      for (const frame of frames) {
        frame.scrollIntoView({ block: 'center' });
        await new Promise(r => setTimeout(r, 450));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 350));
      return frames.length;
    })()`,
    awaitPromise: true,
  });

  let clip;
  if (mode === "full") {
    const metrics = await send("Page.getLayoutMetrics");
    clip = { x: 0, y: 0, width: metrics.cssContentSize.width, height: metrics.cssContentSize.height, scale: 1 };
  } else if (mode !== "viewport") {
    const { result } = await send("Runtime.evaluate", {
      expression: `(() => { const el = document.querySelector(${JSON.stringify(mode)}); if (!el) return null; const r = el.getBoundingClientRect(); return { x: 0, y: r.top + window.scrollY, width: ${width}, height: Math.ceil(r.height) }; })()`,
      returnByValue: true,
    });
    if (!result.value) throw new Error(`Selector not found: ${mode}`);
    clip = { ...result.value, scale: 1 };
  } else {
    clip = { x: 0, y: 0, width, height, scale: 1 };
  }
  if (clip.width > 2200) clip.width = 2200;
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true,
    clip,
  });
  writeFileSync(resolve(out), Buffer.from(shot.data, "base64"));
  console.log(`saved ${out} (${clip.width}x${clip.height})`);
} finally {
  try { ws && ws.close(); } catch {}
  chrome.kill("SIGKILL");
  try { rmSync(userDataDir, { recursive: true, force: true }); } catch {}
}
