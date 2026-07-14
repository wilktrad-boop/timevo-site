/**
 * Regénère les captures d'écran de la page Réalisations.
 *
 * Playwright n'est pas une dépendance du projet (les captures sont commitées
 * dans public/realisations/). Pour rejouer le script :
 *   npm i -D playwright && npx playwright install chromium
 *   node scripts/capture-realisations.mjs
 *
 * Les URLs doivent rester alignées sur lib/realisations.ts.
 */
import { chromium } from "playwright";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "realisations");

const SITES = [
  ["mon-espace-piscine", "https://www.monespacepiscine.fr/"],
  ["agence-laverne", "https://www.agencelavernepaysagistes.fr/"],
  ["agence-traduction-juridique", "https://www.agence-traduction-juridique.fr/"],
];

const COOKIE_BUTTONS = [
  "#tarteaucitronPersonalize2",
  "#didomi-notice-agree-button",
  "button:has-text('Tout accepter')",
  "button:has-text('Accepter')",
];

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 0.62, // → 794 × 496, la taille d'affichage des cartes
});

for (const [slug, url] of SITES) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  }
  await page.waitForTimeout(2500);

  for (const selector of COOKIE_BUTTONS) {
    try {
      await page.locator(selector).first().click({ timeout: 1200 });
      await page.waitForTimeout(600);
    } catch {
      // bannière absente : on continue
    }
  }

  const file = path.join(OUT_DIR, `${slug}.jpg`);
  await page.screenshot({ path: file, type: "jpeg", quality: 74 });
  const { size } = await stat(file);
  console.log(`${slug}  ${(size / 1024).toFixed(0)} Ko`);
  await page.close();
}

await browser.close();
