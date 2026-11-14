// Shared headless-browser helpers for the screenshot and audit scripts.
// No external dependencies: Chrome/Chromium is driven over the DevTools protocol.
//
// Set CHROME_PATH to use a specific browser binary. Otherwise common Chrome,
// Chromium, Edge, and Brave locations are checked, followed by PATH lookups.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const platformCandidates = {
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  ],
  linux: [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
    "/usr/bin/microsoft-edge-stable",
  ],
  win32: [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ],
};

const pathNames = [
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
  "microsoft-edge",
  "microsoft-edge-stable",
  "msedge",
  "brave-browser",
];

function executableOnPath() {
  for (const name of pathNames) {
    const result =
      process.platform === "win32"
        ? spawnSync("where", [name], { encoding: "utf8" })
        : spawnSync("which", [name], { encoding: "utf8" });
    if (result.status === 0 && result.stdout.trim()) {
      return result.stdout.trim().split(/\r?\n/)[0];
    }
  }
  return null;
}

export function findChrome() {
  const configured = process.env.CHROME_PATH;
  if (configured) {
    const resolved = resolve(configured);
    if (!existsSync(resolved)) {
      throw new Error(`CHROME_PATH does not exist: ${resolved}`);
    }
    return resolved;
  }

  for (const candidate of platformCandidates[process.platform] ?? []) {
    if (existsSync(candidate)) return candidate;
  }

  const onPath = executableOnPath();
  if (onPath) return onPath;

  throw new Error(
    "No Chrome/Chromium binary found. Set CHROME_PATH to a Chrome or Chromium executable.",
  );
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

export async function openBrowser({
  width = 1440,
  height = 900,
  deviceScaleFactor = 1,
  mobile = false,
  reducedMotion = true,
} = {}) {
  const chromePath = findChrome();
  const port = 9300 + Math.floor(Math.random() * 500);
  const userDataDir = mkdtempSync(join(tmpdir(), "landlord-cdp-"));

  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--no-sandbox",
      "--disable-extensions",
      "--force-color-profile=srgb",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let ws;
  let nextId = 0;
  const pending = new Map();
  const waiters = new Map();
  const listeners = new Map();

  const cleanup = () => {
    try {
      ws?.close();
    } catch {}
    chrome.kill("SIGKILL");
    try {
      rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  };

  try {
    const target = await (async () => {
      const startedAt = Date.now();
      while (Date.now() - startedAt < 20000) {
        try {
          const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
            method: "PUT",
          });
          if (response.ok) return await response.json();
        } catch {}
        await sleep(100);
      }
      throw new Error("Chrome did not start listening on its DevTools port.");
    })();

    ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolveOpen, rejectOpen) => {
      ws.onopen = resolveOpen;
      ws.onerror = () => rejectOpen(new Error("Could not connect to Chrome DevTools."));
    });

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.id && pending.has(data.id)) {
        const { resolve: resolveCall, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(new Error(data.error.message));
        else resolveCall(data.result);
        return;
      }
      for (const handler of listeners.get(data.method) ?? []) handler(data.params);
      const waiter = waiters.get(data.method);
      if (waiter) {
        waiters.delete(data.method);
        waiter(data.params);
      }
    };

    const send = (method, params = {}) => {
      const id = ++nextId;
      ws.send(JSON.stringify({ id, method, params }));
      return new Promise((resolveCall, reject) => pending.set(id, { resolve: resolveCall, reject }));
    };

    const waitEvent = (name, timeout = 30000) =>
      new Promise((resolveEvent, reject) => {
        const timer = setTimeout(() => {
          waiters.delete(name);
          reject(new Error(`Timed out waiting for ${name}`));
        }, timeout);
        waiters.set(name, (params) => {
          clearTimeout(timer);
          resolveEvent(params);
        });
      });

    const on = (name, handler) => {
      const list = listeners.get(name) ?? [];
      list.push(handler);
      listeners.set(name, list);
      return () => listeners.set(name, (listeners.get(name) ?? []).filter((fn) => fn !== handler));
    };

    const evaluate = async (expression) => {
      const result = await send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (result.exceptionDetails) {
        const detail =
          result.exceptionDetails.exception?.description ?? result.exceptionDetails.text;
        throw new Error(detail ?? "Evaluation failed.");
      }
      return result.result.value;
    };

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor,
      mobile,
    });
    if (reducedMotion) {
      await send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value: "reduce" }],
      });
    }

    const navigate = async (url, { settle = 350, timeout = 45000 } = {}) => {
      const loaded = waitEvent("Page.loadEventFired", timeout);
      await send("Page.navigate", { url });
      try {
        await loaded;
      } catch {
        // Live third-party pages can keep loading; continue once the DOM is usable.
        await sleep(1200);
      }
      await evaluate(
        `document.fonts.ready.then(() => new Promise((done) => setTimeout(done, ${settle})))`,
      );
    };

    const screenshot = async ({ path, clip, fullPage = false }) => {
      let capture = clip;
      if (fullPage) {
        const metrics = await send("Page.getLayoutMetrics");
        const size = metrics.cssContentSize ?? metrics.contentSize;
        capture = { x: 0, y: 0, width: size.width, height: size.height, scale: 1 };
      }
      const result = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        fromSurface: true,
        ...(capture ? { clip: { scale: 1, ...capture } } : {}),
      });
      mkdirSync(dirname(resolve(path)), { recursive: true });
      writeFileSync(resolve(path), Buffer.from(result.data, "base64"));
      return {
        path,
        width: Math.round(capture?.width ?? width),
        height: Math.round(capture?.height ?? height),
      };
    };

    const close = async () => cleanup();

    return { send, on, waitEvent, navigate, evaluate, screenshot, close, width, height };
  } catch (error) {
    cleanup();
    throw error;
  }
}
