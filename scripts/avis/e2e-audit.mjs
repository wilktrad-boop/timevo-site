/**
 * Parcours complet de l'analyse d'avis, en simulation.
 *   E2E_BOITE=<dossier du faux SMTP> node scripts/avis/e2e-audit.mjs http://localhost:3456 <dossier de sortie>
 * Le serveur de dev doit tourner avec AVIS_SIMULATION=1, LIVRET_SECRET (≥ 32 caractères)
 * et SMTP_HOST=127.0.0.1 SMTP_PORT=2525 SMTP_USER=site@test.local SMTP_PASSWORD=test LEAD_TO=lead@test.local.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const [BASE = "http://localhost:3456", OUT = "."] = process.argv.slice(2);
const URL = `${BASE}/fr/ressources/repondre-avis-google`;
const BOITE = process.env.E2E_BOITE;
assert.ok(BOITE, "définir E2E_BOITE");
fs.mkdirSync(OUT, { recursive: true });
const ok = m => console.log("ok  ", m);

const messages = () => fs.readdirSync(BOITE).filter(f => f.endsWith(".eml")).map(f => fs.readFileSync(path.join(BOITE, f), "latin1"));
async function attendreMessage(test, delai = 20_000) {
  const fin = Date.now() + delai;
  while (Date.now() < fin) {
    const m = messages().find(test);
    if (m) return m;
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error("message attendu non reçu");
}

const browser = await chromium.launch();
try {
  const p = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();
  await p.goto(URL, { waitUntil: "networkidle" });

  await p.fill('[data-avis-recherche] [name="nom"]', "Atelier Cuisines");
  await p.fill('[data-avis-recherche] [name="ville"]', "Annecy");
  await p.click('[data-avis-recherche] button[type="submit"]');
  await p.waitForSelector("[data-fiche]");
  ok("fiches trouvées");

  await p.click("[data-fiche] >> nth=0");
  await p.waitForSelector("[data-apercu-avis]");
  assert.equal(await p.locator("[data-comparaison-ligne]").count(), 4, "aperçu : la fiche et 3 concurrents");
  await p.screenshot({ path: path.join(OUT, "apercu.png") });
  ok("aperçu avec 3 concurrents");

  await p.click('[data-action="analyser"]');
  await p.waitForSelector('[data-avis-acces] [name="email"]');
  await p.fill('[name="email"]', "test@avis.invalid");
  await p.check('[name="consent"]');
  await p.click('[data-avis-acces] button[type="submit"]');
  await p.waitForSelector('[name="code"]');
  const mailCode = await attendreMessage(m => /^To: test@avis\.invalid/m.test(m) && /Subject: Votre code : \d{6}/.test(m));
  const code = mailCode.match(/Subject: Votre code : (\d{6})/)[1];
  await p.fill('[name="code"]', "000000");
  await p.click('[data-avis-acces] button[type="submit"]');
  await p.waitForSelector('[data-avis-acces] [role="alert"]');
  ok("mauvais code refusé");
  await p.fill('[name="code"]', code);
  await p.click('[data-avis-acces] button[type="submit"]');
  await p.waitForSelector("[data-avis-progression]");
  ok("analyse lancée");

  await p.waitForSelector("[data-rapport]", { timeout: 60_000 });
  assert.ok(await p.locator("[data-avis-sans-reponse]").count() > 0, "réponses prêtes affichées");
  assert.equal(await p.locator("[data-rapport-offre]").count(), 1);
  await p.screenshot({ path: path.join(OUT, "rapport.png"), fullPage: true });
  ok("rapport affiché");

  await p.waitForSelector('[data-avis-envoi][data-etat="ok"]', { timeout: 30_000 });
  await attendreMessage(m => /^To: test@avis\.invalid/m.test(m) && /analyse-avis-google-atelier-cuisines\.pdf/.test(m));
  ok("PDF reçu par email");
  await attendreMessage(m => /^To: lead@test\.local/m.test(m) && /Atelier Cuisines/.test(m));
  ok("contact transmis à Timevo");

  await p.reload({ waitUntil: "networkidle" });
  await p.fill('[data-avis-recherche] [name="nom"]', "Atelier Cuisines");
  await p.fill('[data-avis-recherche] [name="ville"]', "Annecy");
  await p.click('[data-avis-recherche] button[type="submit"]');
  await p.click("[data-fiche] >> nth=0");
  await p.click('[data-action="analyser"]');
  await p.waitForSelector("[data-rapport]", { timeout: 20_000 });
  ok("accès gardé et rapport servi depuis le cache");

  const m = await (await browser.newContext({ viewport: { width: 375, height: 812 } })).newPage();
  await m.goto(URL, { waitUntil: "networkidle" });
  const [sw, iw] = await m.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  assert.equal(sw, iw, `défilement horizontal à 375 px (${sw} > ${iw})`);
  await m.screenshot({ path: path.join(OUT, "page-375.png"), fullPage: true });
  ok("375 px");
} catch (err) {
  console.error("ÉCHEC", err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
