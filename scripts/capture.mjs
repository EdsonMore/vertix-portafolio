// Capturas desktop + móvil de cada proyecto con URL. Uso: npm run capture [slug ...]
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { projects } from "./projects.mjs";

const OUT = resolve("assets/img/projects");
const only = process.argv.slice(2);
const sizes = { desktop: { width: 1280, height: 800 }, mobile: { width: 390, height: 844 } };

const browser = await chromium.launch();
for (const p of projects.filter(p => p.url && (!only.length || only.includes(p.slug)))) {
  // Las demos locales se capturan desde disco; el resto, desde su URL pública.
  const url = p.url.startsWith("/") ? pathToFileURL(resolve("." + p.url, "index.html")).href : p.url;
  for (const [kind, viewport] of Object.entries(sizes)) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: kind === "mobile" ? 2 : 1, colorScheme: "dark" });
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(2500); // animaciones de entrada
      await page.screenshot({ path: `${OUT}/${p.slug}-${kind}.jpg`, type: "jpeg", quality: 70 });
      console.log("ok", p.slug, kind);
    } catch (e) {
      console.error("FALLÓ", p.slug, kind, e.message);
    }
    await page.close();
  }
}
await browser.close();
