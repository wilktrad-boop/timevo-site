/**
 * Vérification de bout en bout du générateur de livret.
 *   node scripts/livret-accueil/e2e-generateur.mjs http://localhost:3456 <dossier de sortie>
 * Écrit le PDF téléchargé et des captures dans le dossier de sortie.
 * Sort avec le code 1 au premier échec.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const [BASE = "http://localhost:3456", OUT = "."] = process.argv.slice(2);
const URL = `${BASE}/fr/ressources/livret-accueil-airbnb/creer`;
fs.mkdirSync(OUT, { recursive: true });

const LOGO_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAKAAAAA8CAIAAABuCSZCAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA4UlEQVR4nO3OAQkAMQDEsCqZsKl7qa+iHIxCBIRzvzyM+SAq5oOomA+iYj6IivkgKuaDqJgPomI+iIr5ICrmg6iYD6JiPoiK+SAq5oOomA+iYj6IivkgKuaDqJgPomI+iIr5ICrmg6iYD6JiPoiK+SAq5oOomA+iYj6IivkgKuaDqJgPomI+iIr5ICrmg6iYD6JiPoiK+SAq5oOomA+iYj6IivkgKuaDqJgPomI+iIr5ICrmg6iYD6JiPoiK+SAq5oOomA+iYj6IivkgKuaDqJgPomI+iIr5ICrmg6iYD6L6AVuYBmjQGcK6AAAAAElFTkSuQmCC",
  "base64",
);

const browser = await chromium.launch();
try {
  // 1. Desktop : parcours complet jusqu'au PDF
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.fill('[name="nomConciergerie"]', "Conciergerie Test");
  await p.fill('[name="nomLogement"]', "Chalet des Pins");
  await p.fill('[name="contactPrenom"]', "Alex");
  await p.fill('[name="contactTelephone"]', "01 99 00 55 66");
  const logo = path.join(OUT, "logo-test.png");
  fs.writeFileSync(logo, LOGO_PNG);
  await p.setInputFiles('input[name="logo"]', logo);
  await p.fill('input[name="couleur"]', "#aa3355");
  assert.match(await p.locator("[data-apercu]").innerText(), /Chalet des Pins/);
  await p.click('[data-action="suivant"]');
  await p.waitForSelector('[data-etape="arrivee"]');
  await p.fill('[name="codeImmeuble"]', "1234A");
  await p.fill('[name="etagePorte"]', "3e étage, porte d’entrée");
  for (let i = 0; i < 2; i++) await p.click('[data-action="suivant"]');
  await p.waitForSelector('[data-etape="regles"]');
  await p.click('[data-action="suivant"]');
  await p.waitForSelector('[data-etape="quartier"]');
  await p.fill('[name="manger"]', "Le Café\nLe Café");
  await p.click('[data-action="suivant"]');
  await p.waitForSelector('[data-etape="depart"]');
  await p.fill('[name="heureDepart"]', "10 h");
  await p.fill('[name="medecin"]', "");
  const [dl] = await Promise.all([p.waitForEvent("download"), p.click('[data-action="telecharger"]')]);
  assert.equal(dl.suggestedFilename(), "livret-accueil-chalet-des-pins.pdf");
  const pdfPath = path.join(OUT, dl.suggestedFilename());
  await dl.saveAs(pdfPath);
  assert.ok(fs.statSync(pdfPath).size > 3000, "PDF trop petit");
  await p.waitForSelector('[role="status"]');
  console.log("ok   PDF téléchargé", pdfPath);

  // 2. Brouillon retrouvé après rechargement, puis effacé
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForFunction(() => document.querySelector('[name="nomLogement"]')?.value === "Chalet des Pins");
  console.log("ok   brouillon restauré");
  await p.click('[data-action="effacer"]');
  await p.click('[data-action="effacer"]');
  await p.waitForFunction(() => document.querySelector('[name="nomLogement"]')?.value === "");
  console.log("ok   brouillon effacé");

  // 3. Logo refusé (format)
  const txt = path.join(OUT, "pas-un-logo.txt");
  fs.writeFileSync(txt, "texte");
  await p.setInputFiles('input[name="logo"]', txt);
  await p.waitForSelector('[role="alert"]');
  console.log("ok   logo invalide refusé");
  await p.screenshot({ path: path.join(OUT, "generateur-desktop.jpg"), quality: 70, type: "jpeg" });
  await ctx.close();

  // 4. Mobile 375 px : onglets, pas de défilement horizontal
  const m = await (await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, reducedMotion: "reduce" })).newPage();
  await m.goto(URL, { waitUntil: "networkidle" });
  const [sw, iw] = await m.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  assert.equal(sw, iw, `défilement horizontal à 375 px (${sw} > ${iw})`);
  assert.equal(await m.locator("[data-apercu]").isVisible(), false);
  await m.click('[role="tab"]:has-text("Aperçu")');
  assert.equal(await m.locator("[data-apercu]").isVisible(), true);
  await m.screenshot({ path: path.join(OUT, "generateur-375-apercu.jpg"), quality: 70, type: "jpeg" });
  await m.click('[role="tab"]:has-text("Remplir")');
  await m.screenshot({ path: path.join(OUT, "generateur-375-saisie.jpg"), quality: 70, type: "jpeg" });
  console.log("ok   375 px");
} catch (err) {
  console.error("ÉCHEC", err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
