"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { configAvis, type ConfigAvis } from "@/lib/avis/config";
import { autoriser, rendre, LIMITES, JOUR_S } from "@/lib/avis/limites";
import { AVIS_MAX, avisSansReponse, choisirConcurrents, construireRapport, ficheValide } from "@/lib/avis/calculs";
import type { Fiche, Rapport } from "@/lib/avis/types";
import { creerCode, jetonCode, verifierCode, jetonAcces, verifierAcces } from "@/lib/livret/jeton";
import { EMAIL_RE, clean } from "@/lib/mail";
import { AVIS_PATH } from "@/lib/ressources";

/**
 * Analyse d'avis Google : recherche et aperçu gratuits (limités par IP), puis email vérifié
 * par code, puis analyse complète en deux temps (lancerAudit, suivreAudit).
 * Clés Redis : avis:ip:*, avis:email:*, avis:jour, avis:audit:*, avis:resultat:*,
 * avis:rapport:<placeId>:<email> (cache 24 h, par adresse vérifiée), avis:code:ip:*, avis:code:email:*, avis:verrou:*, avis:rendu:*, avis:contact:*,
 * avis:recherches:jour (plafond global des recherches Maps), avis:essais:<sha256 du jeton> (essais de code), avis:pdf:<auditId> (un seul PDF par analyse).
 */

const TACHE_MAX_MS = 3 * 60 * 1000;
const PDF_MAX = 4 * 1024 * 1024;
const OUTIL_URL = `https://www.timevo.io${AVIS_PATH}`;

type Indispo = { etat: "indisponible" };
export type ResultatRecherche = { etat: "ok"; fiches: Fiche[] } | { etat: "limite" } | Indispo | { etat: "erreur" };
export type ResultatComparaison = { etat: "ok"; concurrents: Fiche[] } | { etat: "limite" } | Indispo | { etat: "erreur" };
export type ResultatCode = { etat: "code"; email: string; jeton: string } | { etat: "erreur"; champ: "email" | "consent" | "envoi" | "limite" } | Indispo;
export type ResultatValidation = { etat: "ouvert"; email: string; acces: string } | { etat: "erreur"; message: string } | Indispo;
export type ResultatLancement = { etat: "lance"; auditId: string } | { etat: "acces" } | { etat: "limite" } | { etat: "erreur" } | Indispo;
export type ResultatSuivi = { etat: "encours" } | { etat: "pret"; rapport: Rapport } | { etat: "erreur"; message: string } | Indispo;

type Audit = { email: string; fiche: Fiche; concurrents: Fiche[]; tacheId: string | null; debut: number; deCache: boolean };

async function ipVisiteur(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "inconnue";
}

const ligne = (s: unknown, max: number) => clean(typeof s === "string" ? s : "", max);
const journal = (quoi: string, err: unknown) => console.error(`[avis] ${quoi} :`, err instanceof Error ? err.message : err);

/** Une recherche Maps : comptée par IP, puis dans le plafond global du site (l'IP est rendue si le plafond refuse). */
async function autoriserRecherche(c: ConfigAvis): Promise<boolean> {
  const cleIp = `avis:ip:${await ipVisiteur()}`;
  if (!(await autoriser(c.magasin, cleIp, LIMITES.recherchesParIp))) return false;
  if (!(await autoriser(c.magasin, "avis:recherches:jour", LIMITES.recherchesParJour))) {
    await rendre(c.magasin, cleIp);
    return false;
  }
  return true;
}

export async function rechercherFiches(nom: string, ville: string): Promise<ResultatRecherche> {
  const c = configAvis();
  if (!c) return { etat: "indisponible" };
  const n = ligne(nom, 120), v = ligne(ville, 80);
  if (n.length < 2 || v.length < 2) return { etat: "erreur" };
  if (!(await autoriserRecherche(c))) return { etat: "limite" };
  try {
    return { etat: "ok", fiches: (await c.donnees.rechercher(`${n} ${v}`)).slice(0, 5) };
  } catch (err) {
    journal("recherche", err);
    return { etat: "erreur" };
  }
}

export async function comparerFiche(fiche: Fiche, ville: string): Promise<ResultatComparaison> {
  const c = configAvis();
  if (!c) return { etat: "indisponible" };
  const f = ficheValide(fiche);
  const v = ligne(ville, 80);
  if (!f || v.length < 2) return { etat: "erreur" };
  if (!f.categorie) return { etat: "ok", concurrents: [] };
  if (!(await autoriserRecherche(c))) return { etat: "limite" };
  try {
    return { etat: "ok", concurrents: choisirConcurrents(await c.donnees.rechercher(`${f.categorie} ${v}`), f) };
  } catch (err) {
    journal("comparaison", err);
    return { etat: "erreur" };
  }
}

export async function demanderCodeAvis(email: string, consent: boolean, entreprise: string): Promise<ResultatCode> {
  const c = configAvis();
  if (!c) return { etat: "indisponible" };
  const e = ligne(email, 200).toLowerCase();
  if (!EMAIL_RE.test(e)) return { etat: "erreur", champ: "email" };
  if (consent !== true) return { etat: "erreur", champ: "consent" };
  const cleIp = `avis:code:ip:${await ipVisiteur()}`;
  if (!(await autoriser(c.magasin, cleIp, LIMITES.codesParIp))) return { etat: "erreur", champ: "limite" };
  if (!(await autoriser(c.magasin, `avis:code:email:${e}`, LIMITES.codesParEmail))) {
    await rendre(c.magasin, cleIp);
    return { etat: "erreur", champ: "limite" };
  }
  const code = creerCode();
  try {
    await c.boite.transport.sendMail({
      from: `"Timevo" <${c.boite.user}>`,
      to: e,
      subject: `Votre code : ${code}`,
      text: [
        `Votre code pour lancer l'analyse de vos avis Google sur timevo.io : ${code}`,
        "",
        "Il est valable 15 minutes. Le rapport vous sera aussi envoyé en PDF à cette adresse.",
        "",
        "Si vous n'avez rien demandé, ignorez ce message.",
        "",
        "L'équipe Timevo",
      ].join("\n"),
    });
  } catch (err) {
    journal("envoi du code", err);
    return { etat: "erreur", champ: "envoi" };
  }
  return { etat: "code", email: e, jeton: jetonCode({ email: e, entreprise: ligne(entreprise, 200), outil: "avis" }, code, c.secret) };
}

export async function validerCodeAvis(jeton: string, code: string): Promise<ResultatValidation> {
  const c = configAvis();
  if (!c) return { etat: "indisponible" };
  const j = ligne(jeton, 3000);
  // 5 essais par jeton de code : le million de codes possibles ne se parcourt pas.
  if (!(await autoriser(c.magasin, `avis:essais:${createHash("sha256").update(j).digest("hex")}`, LIMITES.essaisParCode))) {
    return { etat: "erreur", message: "Trop d'essais. Demandez un nouveau code." };
  }
  const infos = verifierCode(j, ligne(code, 12).replace(/\s/g, ""), c.secret);
  // Un jeton de code d'un autre outil (livret) n'ouvre pas l'analyse.
  if (!infos || infos.outil !== "avis") return { etat: "erreur", message: "Ce code ne correspond pas, ou il a expiré. Vérifiez-le ou demandez-en un nouveau." };
  return { etat: "ouvert", email: infos.email, acces: jetonAcces(infos.email, c.secret) };
}

export async function lancerAudit(acces: string, fiche: Fiche, concurrents: Fiche[]): Promise<ResultatLancement> {
  const c = configAvis();
  if (!c) return { etat: "indisponible" };
  const email = verifierAcces(ligne(acces, 3000), c.secret);
  if (!email) return { etat: "acces" };
  const f = ficheValide(fiche);
  if (!f) return { etat: "erreur" };
  const autres = (Array.isArray(concurrents) ? concurrents : []).map(ficheValide).filter((x): x is Fiche => x !== null).slice(0, 3);
  const auditId = crypto.randomUUID();

  // Rapport de moins de 24 h pour cette fiche : servi sans rien recompter ni repayer.
  const enCache = await c.magasin.lire<Rapport>(`avis:rapport:${f.placeId}:${email}`);
  if (enCache) {
    await c.magasin.ecrire(`avis:audit:${auditId}`, { email, fiche: f, concurrents: autres, tacheId: null, debut: Date.now(), deCache: true } satisfies Audit, JOUR_S);
    await c.magasin.ecrire(`avis:resultat:${auditId}`, enCache, JOUR_S);
    return { etat: "lance", auditId };
  }

  const cleEmail = `avis:email:${email}`;
  if (!(await autoriser(c.magasin, cleEmail, LIMITES.auditsParEmail))) return { etat: "limite" };
  if (!(await autoriser(c.magasin, "avis:jour", LIMITES.auditsParJour))) {
    await rendre(c.magasin, cleEmail);
    return { etat: "limite" };
  }
  try {
    const tacheId = await c.donnees.lancer(f.placeId);
    await c.magasin.ecrire(`avis:audit:${auditId}`, { email, fiche: f, concurrents: autres, tacheId, debut: Date.now(), deCache: false } satisfies Audit, JOUR_S);
    return { etat: "lance", auditId };
  } catch (err) {
    journal("lancement", err);
    await rendre(c.magasin, cleEmail);
    await rendre(c.magasin, "avis:jour");
    return { etat: "erreur" };
  }
}

/** Rend les compteurs d'une analyse qui n'a pas abouti, une seule fois. */
async function rembourser(c: ConfigAvis, auditId: string, email: string) {
  if (!(await c.magasin.prendre(`avis:rendu:${auditId}`, JOUR_S))) return;
  await rendre(c.magasin, `avis:email:${email}`);
  await rendre(c.magasin, "avis:jour");
}

async function prevenirTimevo(c: ConfigAvis, auditId: string, email: string, r: Rapport) {
  if (!(await c.magasin.prendre(`avis:contact:${auditId}`, JOUR_S))) return;
  const when = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  try {
    await c.boite.transport.sendMail({
      from: `"Site Timevo" <${c.boite.user}>`,
      to: c.boite.leadTo,
      replyTo: email,
      subject: `Analyse d'avis Google : ${r.fiche.nom}`,
      text: [
        "Nouvelle analyse d'avis Google (adresse vérifiée par code).",
        "",
        `Email : ${email}`,
        `Entreprise : ${r.fiche.nom}`,
        `Adresse : ${r.fiche.adresse || "(inconnue)"}`,
        `Catégorie : ${r.fiche.categorie || "(inconnue)"}`,
        `Note : ${r.fiche.note ?? "?"} / 5, ${r.fiche.nbAvis} avis`,
        `Taux de réponse : ${r.tauxReponse === null ? "sans objet" : `${r.tauxReponse} %`}`,
        `Avis sans réponse (récents) : ${r.sansReponse.length}`,
        `Date : ${when}`,
        "Consentement au recontact : oui",
        "",
        "Répondre à ce mail écrit directement au prospect.",
      ].join("\n"),
    });
  } catch (err) {
    journal("contact non transmis", err);
  }
}

export async function suivreAudit(acces: string, auditId: string): Promise<ResultatSuivi> {
  const c = configAvis();
  if (!c) return { etat: "indisponible" };
  const email = verifierAcces(ligne(acces, 3000), c.secret);
  const id = ligne(auditId, 80);
  const a = id ? await c.magasin.lire<Audit>(`avis:audit:${id}`) : null;
  if (!email || !a || a.email !== email) return { etat: "erreur", message: "Cette analyse est introuvable. Relancez-la." };

  const fait = await c.magasin.lire<Rapport>(`avis:resultat:${id}`);
  if (fait) {
    if (!a.deCache) await prevenirTimevo(c, id, email, fait);
    return { etat: "pret", rapport: fait };
  }
  if (!a.tacheId) return { etat: "erreur", message: "Cette analyse est introuvable. Relancez-la." };

  if (Date.now() - a.debut > TACHE_MAX_MS) {
    await rembourser(c, id, email);
    return { etat: "erreur", message: "La récupération de vos avis prend trop de temps. Réessayez dans quelques minutes : cette tentative n'est pas décomptée." };
  }

  let tache;
  try {
    tache = await c.donnees.lire(a.tacheId);
  } catch (err) {
    journal("lecture des avis", err);
    return { etat: "encours" };
  }
  if (tache.etat === "encours") return { etat: "encours" };
  if (tache.etat === "erreur") {
    await rembourser(c, id, email);
    return { etat: "erreur", message: "Vos avis n'ont pas pu être récupérés. Réessayez dans quelques minutes : cette tentative n'est pas décomptée." };
  }

  // Un seul appel à l'IA par analyse, même si la page interroge deux fois en même temps.
  if (!(await c.magasin.prendre(`avis:verrou:${id}`, 300))) return { etat: "encours" };
  try {
    const avis = tache.avis.slice(0, AVIS_MAX);
    const analyse = avis.length
      ? await c.ia.analyser({ entreprise: a.fiche.nom, categorie: a.fiche.categorie, avis, sansReponse: avisSansReponse(avis) })
      : null;
    const rapport = construireRapport({ fiche: a.fiche, concurrents: a.concurrents, avis, total: tache.total, analyse });
    await c.magasin.ecrire(`avis:resultat:${id}`, rapport, JOUR_S);
    if (avis.length > 0 && analyse === null) {
      // Analyse IA ratée : rapport chiffré servi, mais ni mis en cache ni décompté.
      await rembourser(c, id, email);
    } else {
      await c.magasin.ecrire(`avis:rapport:${a.fiche.placeId}:${email}`, rapport, JOUR_S);
    }
    await prevenirTimevo(c, id, email, rapport);
    return { etat: "pret", rapport };
  } catch (err) {
    journal("finalisation", err);
    await rembourser(c, id, email);
    return { etat: "erreur", message: "L'analyse n'a pas pu être terminée. Réessayez dans quelques minutes : cette tentative n'est pas décomptée." };
  }
}

/**
 * Envoie le PDF du rapport à l'adresse vérifiée du jeton d'accès, et à elle seule,
 * une seule fois par analyse terminée de cette adresse.
 */
export async function envoyerRapportPdf(formData: FormData): Promise<{ ok: boolean }> {
  const c = configAvis();
  if (!c) return { ok: false };
  const email = verifierAcces(clean(formData.get("acces"), 3000), c.secret);
  const fichier = formData.get("pdf");
  if (!email || !(fichier instanceof File) || fichier.size === 0 || fichier.size > PDF_MAX) return { ok: false };
  const contenu = Buffer.from(await fichier.arrayBuffer());
  if (contenu.subarray(0, 5).toString("latin1") !== "%PDF-") return { ok: false };
  const auditId = clean(formData.get("auditId"), 80);
  const a = auditId ? await c.magasin.lire<Audit>(`avis:audit:${auditId}`) : null;
  if (!a || a.email !== email || !(await c.magasin.lire<Rapport>(`avis:resultat:${auditId}`))) return { ok: false };
  if (!(await c.magasin.prendre(`avis:pdf:${auditId}`, JOUR_S))) return { ok: false };
  const nom = /^[a-z0-9-]{1,80}\.pdf$/.test(fichier.name) ? fichier.name : "analyse-avis-google.pdf";
  try {
    await c.boite.transport.sendMail({
      from: `"Timevo" <${c.boite.user}>`,
      to: email,
      subject: "L'analyse de vos avis Google",
      text: [
        "Bonjour,",
        "",
        "Voici l'analyse de vos avis Google, en pièce jointe, avec les réponses déjà rédigées pour vos avis restés sans réponse.",
        "",
        `Vous pouvez relancer une analyse sur ${OUTIL_URL}.`,
        "",
        "L'équipe Timevo",
      ].join("\n"),
      attachments: [{ filename: nom, content: contenu, contentType: "application/pdf" }],
    });
    return { ok: true };
  } catch (err) {
    journal("envoi du PDF", err);
    return { ok: false };
  }
}
