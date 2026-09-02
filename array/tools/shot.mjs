/**
 * A picture of the bench, on the real GPU.
 *
 *     npm run shot                  every frame on index.html
 *     npm run shot -- out/here      into somewhere else
 *
 * Headless but not software-rendered: `--use-gl=angle` puts Chrome on Metal,
 * which matters because everything being looked at here is a shader.
 */
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const out = process.argv[2] || path.join(root, "shots");

function findChrome() {
  if (process.env.RAYL_CHROME) return process.env.RAYL_CHROME;
  const cache = path.join(os.homedir(), ".cache/puppeteer/chrome");
  if (fs.existsSync(cache)) {
    for (const build of fs.readdirSync(cache).sort().reverse()) {
      const found = path.join(
        cache,
        build,
        "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
      );
      if (fs.existsSync(found)) return found;
    }
  }
  for (const known of [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ]) {
    if (fs.existsSync(known)) return known;
  }
  throw new Error("no Chrome — set RAYL_CHROME to one");
}

const port = await new Promise((resolve) => {
  const probe = net.createServer();
  probe.listen(0, () => {
    const { port } = probe.address();
    probe.close(() => resolve(port));
  });
});
const server = spawn(
  "npx",
  ["vite", "--port", String(port), "--strictPort", "--clearScreen", "false"],
  { cwd: root, stdio: "ignore" },
);
process.on("exit", () => server.kill());
for (let tries = 0; tries < 60; tries++) {
  try {
    await new Promise((resolve, reject) => {
      const probe = net.connect(port, "127.0.0.1", () => {
        probe.end();
        resolve();
      });
      probe.on("error", reject);
    });
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
  }
}

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: "new",
  args: ["--use-gl=angle"],
  defaultViewport: { width: 1100, height: 900, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
const trouble = [];
page.on("pageerror", (e) => trouble.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    trouble.push(m.text().slice(0, 300));
});
await page.goto(`http://localhost:${port}/${process.env.RAYL_PAGE || ""}`, {
  waitUntil: "networkidle0",
});
/* Long enough for the basket to arrive and for a wave to be somewhere worth
   photographing. Every array is held at the same point in its loop, so two runs
   are comparable. */
await page.evaluate(async () => {
  const frames = [...document.querySelectorAll("[data-rayl-array]")];
  await Promise.all(frames.map((el) => el.raylArray?.set({ motion: "still" })));
});
await new Promise((r) => setTimeout(r, 3500));

fs.mkdirSync(out, { recursive: true });
const frames = await page.$$("[data-rayl-array]");
for (let i = 0; i < frames.length; i++) {
  const name = await frames[i].evaluate((el) => el.dataset.raylArray);
  await frames[i].screenshot({ path: path.join(out, `${i}-${name}.png`) });
  console.log("wrote", `${i}-${name}.png`);
}
if (trouble.length)
  console.log("\ntrouble:\n " + trouble.slice(0, 8).join("\n "));

await browser.close();
server.kill();
