// Inspect layout metrics and computed styles in headless Chrome.
// Usage: node scripts/inspect.mjs <url> [width] [height] [expression]
import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

const [, , url, widthArg = "1440", heightArg = "900", expression] = process.argv;
const width = Number(widthArg);
const height = Number(heightArg);
const port = 9800 + Math.floor(Math.random() * 400);
const userDataDir = `/tmp/landlord-inspect-${process.pid}`;
mkdirSync(userDataDir, { recursive: true });

const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
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
    const timer = setTimeout(() => reject(new Error(`timeout waiting ${name}`)), timeout);
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
      if (res.ok) return (await res.json()).webSocketDebuggerUrl;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Chrome did not start");
}

try {
  ws = new WebSocket(await getWsUrl());
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
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: width < 700 });
  const loaded = waitEvent("Page.loadEventFired");
  await send("Page.navigate", { url });
  await loaded;
  await send("Runtime.evaluate", {
    expression: `document.fonts.ready.then(() => new Promise(r => setTimeout(r, 600)))`,
    awaitPromise: true,
  });
  const script =
    expression ||
    `(() => {
      const rect = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return { top: r.top + scrollY, left: r.left, width: r.width, height: r.height, bg: cs.backgroundColor, padding: cs.padding, font: cs.fontSize + "/" + cs.lineHeight + " " + cs.fontWeight };
      };
      return {
        viewport: { width: innerWidth, height: innerHeight },
        doc: { scrollHeight: document.documentElement.scrollHeight, bodyHeight: document.body.scrollHeight },
        hero: rect('section'),
        inner: rect('section > div:nth-child(3)'),
        h1: rect('h1'),
        visual: rect('[class*="visual"]'),
        app: rect('[class*="app"]'),
        main: rect('main'),
        body: { bg: getComputedStyle(document.body).backgroundColor },
      };
    })()`;
  const { result } = await send("Runtime.evaluate", { expression: script, returnByValue: true });
  console.log(JSON.stringify(result.value, null, 2));
} finally {
  try { ws && ws.close(); } catch {}
  chrome.kill("SIGKILL");
  try { rmSync(userDataDir, { recursive: true, force: true }); } catch {}
}
