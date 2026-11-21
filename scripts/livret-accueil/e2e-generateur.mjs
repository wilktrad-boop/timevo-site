/**
 * Vérification de bout en bout du générateur de livret.
 *   node scripts/livret-accueil/e2e-generateur.mjs http://localhost:3456 <dossier de sortie>
 * L'outil s'ouvre après l'écran d'email. Si le serveur envoie un code (LIVRET_SECRET et
 * SMTP configurés), E2E_BOITE doit désigner le dossier où un faux SMTP écrit les messages
 * (.eml) : le code y est lu. Sans configuration, l'outil s'ouvre sans code.
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

/** Passe l'écran d'entrée : email, puis code si le serveur en envoie un. */
async function ouvrirOutil(page, email = "test@livret.invalid") {
  await page.waitForSelector("[data-acces]");
  await page.fill('[name="email"]', email);
  await page.selectOption('[name="logements"]', "6 à 15");
  await page.check('[name="consent"]');
  await page.click('[data-acces] button[type="submit"]');
  const etape = await Promise.race([
    page.waitForSelector('[name="code"]').then(() => "code"),
    page.waitForSelector(".livret-gen").then(() => "ouvert"),
  ]);
  if (etape === "code") {
    const boite = process.env.E2E_BOITE;
    assert.ok(boite, "le serveur envoie un code : définir E2E_BOITE");
    const dernier = fs.readdirSync(boite).filter(f => f.endsWith(".eml")).map(f => path.join(boite, f))
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
    const code = fs.readFileSync(dernier, "latin1").match(/Subject: Votre code : (\d{6})/)[1];
    await page.fill('[name="code"]', "000000");
    await page.click('[data-acces] button[type="submit"]');
    await page.waitForSelector('#livret-code-error');
    await page.fill('[name="code"]', code);
    await page.click('[data-acces] button[type="submit"]');
    await page.waitForSelector(".livret-gen");
  }
  return etape;
}

const browser = await chromium.launch();
try {
  // 1. Desktop : parcours complet jusqu'au PDF
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: "networkidle" });
  const mode = await ouvrirOutil(p);
  console.log(`ok   outil ouvert (${mode === "code" ? "code vérifié, mauvais code refusé" : "sans code : serveur non configuré"})`);
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForSelector(".livret-gen");
  console.log("ok   accès gardé au rechargement");
  await p.fill('[name="nomConciergerie"]', "Conciergerie Test");
  await p.fill('[name="nomLogement"]', "Chalet des Pins");
  await p.fill('[name="contactPrenom"]', "Alex");
  await p.fill('[name="contactTelephone"]', "01 99 00 55 66");
  await p.fill('[name="contactDispo"]', "tous les jours 📞 8 h → 21 h");
  const logo = path.join(OUT, "logo-test.png");
  fs.writeFileSync(logo, LOGO_PNG);
  await p.setInputFiles('input[name="logo"]', logo);
  await p.waitForSelector('[data-apercu] img');
  assert.equal(await p.locator('.livret-gen [role="alert"]').count(), 0, "logo valide refusé");
  console.log("ok   logo PNG accepté");

  // Photo du logement : une grande photo (4000 × 3000) est réduite à 1600 px et réencodée en JPEG
  const grande = path.join(OUT, "photo-grande.png");
  const b64 = await p.evaluate(() => {
    const c = document.createElement("canvas"); c.width = 4000; c.height = 3000;
    const x = c.getContext("2d"); const g = x.createLinearGradient(0, 0, 4000, 3000);
    g.addColorStop(0, "#3a6ea5"); g.addColorStop(1, "#e3b04b"); x.fillStyle = g; x.fillRect(0, 0, 4000, 3000);
    return c.toDataURL("image/png").split(",")[1];
  });
  fs.writeFileSync(grande, Buffer.from(b64, "base64"));
  await p.setInputFiles('input[name="photo"]', grande);
  const photo = p.locator("[data-photo-couverture]");
  await photo.waitFor({ state: "visible" });
  const [pw, ph, src] = await photo.evaluate(img => [img.naturalWidth, img.naturalHeight, img.src.slice(0, 23)]);
  assert.deepEqual([pw, ph, src], [1600, 1200, "data:image/jpeg;base64,"], "photo non réduite");
  console.log("ok   photo réduite à 1600 px, en JPEG");

  // Un fichier qui n'est pas une image est refusé, la photo en place reste
  const pasPhoto = path.join(OUT, "pas-une-photo.txt");
  fs.writeFileSync(pasPhoto, "texte");
  await p.setInputFiles('input[name="photo"]', pasPhoto);
  await p.waitForSelector('[role="alert"]:has-text("Choisissez une photo")');
  assert.equal(await photo.isVisible(), true, "photo perdue après un refus");
  console.log("ok   fichier non image refusé");

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
  if (mode === "code") {
    await p.waitForSelector('[data-envoi="ok"]', { timeout: 30_000 });
    const boite = process.env.E2E_BOITE;
    const pj = fs.readdirSync(boite).filter(f => f.endsWith(".eml")).map(f => fs.readFileSync(path.join(boite, f), "latin1"))
      .find(m => /Subject: Votre livret d'accueil/.test(m) && /filename="?livret-accueil-chalet-des-pins\.pdf/.test(m));
    assert.ok(pj && /^To: test@livret.invalid/m.test(pj), "PDF non reçu à l'adresse vérifiée");
    console.log("ok   PDF envoyé en pièce jointe à l'adresse vérifiée");
  }
  const encart = p.locator('.livret-gen [data-apres-telechargement]');
  await encart.waitFor({ state: "visible" });
  assert.equal(await encart.locator('a[href="/fr/automatisation-pour/conciergerie"]').count(), 1, "lien conciergerie absent");
  assert.equal(await encart.locator('a[target="_blank"]').count(), 1, "lien diagnostic absent");
  assert.ok(await p.locator('.livret-gen.rr-block').count() === 1, "rr-block absent");
  await encart.screenshot({ path: path.join(OUT, "encart-apres-telechargement.png") });
  console.log("ok   encart après téléchargement");
  console.log("ok   PDF téléchargé", pdfPath);

  // 2. Brouillon retrouvé après rechargement, puis effacé
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForFunction(() => document.querySelector('[name="nomLogement"]')?.value === "Chalet des Pins");
  await p.locator("[data-photo-couverture]").waitFor({ state: "visible" });
  console.log("ok   brouillon restauré (photo comprise)");
  await p.click('[data-action="effacer"]');
  await p.click('[data-action="effacer"]');
  await p.waitForFunction(() => document.querySelector('[name="nomLogement"]')?.value === "");
  assert.equal(await p.locator("[data-photo-couverture]").count(), 0, "photo restée après effacement");
  console.log("ok   brouillon effacé");

  // 3. Logo refusé (format)
  const txt = path.join(OUT, "pas-un-logo.txt");
  fs.writeFileSync(txt, "texte");
  await p.setInputFiles('input[name="logo"]', txt);
  await p.waitForSelector('[role="alert"]');
  console.log("ok   logo invalide refusé");

  // 3a. Faux PNG : un WebP renommé .png est refusé (signature vérifiée)
  const faux = path.join(OUT, "faux.png");
  fs.writeFileSync(faux, Buffer.from("UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAUAmJaQAA3AA/vuUAAA=", "base64"));
  await p.setInputFiles('input[name="logo"]', faux);
  await p.waitForSelector('[role="alert"]:has-text("PNG ou JPG")');
  console.log("ok   WebP renommé .png refusé");

  // 3b. Logo corrompu (type PNG, données illisibles) refusé avec un message
  const bad = path.join(OUT, "bad.png");
  fs.writeFileSync(bad, Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47]), Buffer.from("not a png")]));
  await p.setInputFiles('input[name="logo"]', bad);
  await p.waitForSelector('[role="alert"]:has-text("pas pu être lu")');
  console.log("ok   logo corrompu refusé");
  await p.screenshot({ path: path.join(OUT, "generateur-desktop.jpg"), quality: 70, type: "jpeg" });
  await ctx.close();

  // 4. Mobile 375 px : onglets, pas de défilement horizontal
  const m = await (await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, reducedMotion: "reduce" })).newPage();
  await m.goto(URL, { waitUntil: "networkidle" });
  const [gw, giw] = await m.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  assert.equal(gw, giw, `écran d'entrée : défilement horizontal à 375 px (${gw} > ${giw})`);
  await m.screenshot({ path: path.join(OUT, "acces-375.jpg"), quality: 70, type: "jpeg" });
  await ouvrirOutil(m, "mobile@livret.invalid");
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
