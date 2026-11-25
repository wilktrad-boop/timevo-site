/**
 * Chiffres de l'analyse d'avis, calculés sans IA : l'IA ne fournit jamais un nombre.
 * Fonctions pures, testées dans tests/avis/calculs.test.ts.
 */
import type { Analyse, Avis, Fiche, Indicateurs, Rapport, Theme, Trimestre } from "./types.ts";

export const AVIS_MAX = 200;
export const REPONSES_MAX = 20;
const JOUR_MS = 86_400_000;

const arrondi1 = (x: number) => Math.round(x * 10) / 10;
const temps = (iso: string | null) => (iso ? Date.parse(iso) : 0);

/** « 2026-05-15 14:09:32 +00:00 » (format DataForSEO) vers ISO 8601. */
export function dateDfs(s: string | null | undefined): string | null {
  if (!s) return null;
  const m = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([+-]\d{2}:\d{2})$/.exec(s.trim());
  if (!m) return null;
  const d = new Date(`${m[1]}T${m[2]}${m[3]}`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Part des avis ayant une réponse du propriétaire, en pourcent entier. */
export function tauxReponse(avis: Avis[]): number | null {
  if (!avis.length) return null;
  return Math.round((100 * avis.filter(a => a.reponse).length) / avis.length);
}

/** Délai moyen entre l'avis et la réponse, en jours (une décimale). */
export function delaiMoyenJours(avis: Avis[]): number | null {
  const delais = avis
    .filter(a => a.reponse && a.date && a.dateReponse)
    .map(a => (temps(a.dateReponse) - temps(a.date)) / JOUR_MS)
    .filter(j => j >= 0);
  if (!delais.length) return null;
  return arrondi1(delais.reduce((s, j) => s + j, 0) / delais.length);
}

/** Note moyenne des 4 derniers trimestres civils (UTC), du plus ancien au plus récent. */
export function noteParTrimestre(avis: Avis[], maintenant = new Date()): Trimestre[] {
  const res: Trimestre[] = [];
  let annee = maintenant.getUTCFullYear();
  let t = Math.floor(maintenant.getUTCMonth() / 3);
  for (let i = 0; i < 4; i++) {
    const debut = Date.UTC(annee, t * 3, 1);
    const fin = Date.UTC(annee, t * 3 + 3, 1);
    const notes = avis.filter(a => a.date && temps(a.date) >= debut && temps(a.date) < fin).map(a => a.note);
    res.unshift({
      libelle: `T${t + 1} ${annee}`,
      nb: notes.length,
      note: notes.length ? arrondi1(notes.reduce((s, n) => s + n, 0) / notes.length) : null,
    });
    t -= 1;
    if (t < 0) { t = 3; annee -= 1; }
  }
  return res;
}

/** Avis sans réponse, les plus récents d'abord (les avis sans date en dernier). */
export function avisSansReponse(avis: Avis[], max = REPONSES_MAX): Avis[] {
  return avis.filter(a => !a.reponse).sort((x, y) => temps(y.date) - temps(x.date)).slice(0, max);
}

/** Jusqu'à n concurrents : même catégorie, au moins un avis, les plus suivis d'abord. */
export function choisirConcurrents(fiches: Fiche[], choisie: Fiche, n = 3): Fiche[] {
  const cat = choisie.categorie.trim().toLowerCase();
  return fiches
    .filter(f => f.placeId !== choisie.placeId && f.nbAvis > 0 && f.categorie.trim().toLowerCase() === cat)
    .sort((a, b) => b.nbAvis - a.nbAvis)
    .slice(0, n);
}

/**
 * Avis 5 étoiles nécessaires pour que la note affichée (arrondie au dixième) atteigne la cible.
 * Cible : la note du concurrent le mieux noté s'il fait mieux (jusqu'à 4,9), sinon le dixième suivant.
 * Calcul sur la note affichée par Google, faute de moyenne exacte.
 */
export function objectifNote(fiche: Fiche, concurrents: Fiche[]): Indicateurs["objectif"] {
  const note = fiche.note;
  const n = fiche.nbAvis;
  if (note === null || n <= 0 || note >= 4.95) return null;
  const leader = concurrents
    .filter(c => c.note !== null && c.note > note && c.note <= 4.9)
    .sort((a, b) => (b.note ?? 0) - (a.note ?? 0))[0];
  const cible = leader ? leader.note! : arrondi1(note + 0.1);
  if (cible > 5) return null;
  const seuil = cible - 0.05;
  const avisNecessaires = Math.max(1, Math.ceil((n * (seuil - note)) / (5 - seuil)));
  return { cible, avisNecessaires, concurrent: leader ? leader.nom : null };
}

/** Rythme, répartition, avis négatifs et objectif de note : tout ce qui se compte sans IA. */
export function indicateurs(avis: Avis[], fiche: Fiche, concurrents: Fiche[], maintenant = new Date()): Indicateurs {
  const depuis = maintenant.getTime() - 365 * JOUR_MS;
  const recents = avis.filter(a => a.date && temps(a.date) >= depuis);
  const repartition: Indicateurs["repartition"] = [0, 0, 0, 0, 0];
  for (const a of avis) {
    const etoiles = Math.min(5, Math.max(1, Math.round(a.note)));
    repartition[5 - etoiles] += 1;
  }
  const negatifs = recents.filter(a => a.note <= 3);
  const negSansReponse = negatifs.filter(a => !a.reponse);
  const plusAncien = negSansReponse.reduce((m, a) => Math.min(m, temps(a.date)), Infinity);
  return {
    douzeMois: recents.length,
    parMois: arrondi1(recents.length / 12),
    repartition,
    partSansTexte: avis.length ? Math.round((100 * avis.filter(a => !a.texte).length) / avis.length) : null,
    sansReponseTotal: avis.filter(a => !a.reponse).length,
    negatifs: {
      douzeMois: negatifs.length,
      sansReponse: negSansReponse.length,
      plusAncienJours: Number.isFinite(plusAncien) ? Math.floor((maintenant.getTime() - plusAncien) / JOUR_MS) : null,
    },
    objectif: objectifNote(fiche, concurrents),
  };
}

const normaliser = (s: string) =>
  s.toLowerCase().replace(/[’`]/g, "'").replace(/^[\s"«»“”]+|[\s"«»“”]+$/g, "").replace(/\s+/g, " ").trim();

/** Ne garde que les citations présentes mot pour mot dans au moins un avis. */
export function verifierCitations(themes: Theme[], avis: Avis[]): Theme[] {
  const textes = avis.map(a => normaliser(a.texte ?? ""));
  return themes.map(t => ({
    titre: t.titre,
    citations: t.citations.filter(c => {
      const n = normaliser(c);
      return n.length >= 3 && textes.some(x => x.includes(n));
    }),
  }));
}

export function construireRapport(p: {
  fiche: Fiche; concurrents: Fiche[]; avis: Avis[]; total: number; analyse: Analyse | null; maintenant?: Date;
}): Rapport {
  const maintenant = p.maintenant ?? new Date();
  return {
    fiche: p.fiche,
    concurrents: p.concurrents,
    genereLe: maintenant.toISOString(),
    nbAvisAnalyses: p.avis.length,
    tronque: p.total > p.avis.length,
    tauxReponse: tauxReponse(p.avis),
    delaiMoyenJours: delaiMoyenJours(p.avis),
    trimestres: noteParTrimestre(p.avis, maintenant),
    sansReponse: avisSansReponse(p.avis),
    indicateurs: indicateurs(p.avis, p.fiche, p.concurrents, maintenant),
    analyse: p.analyse
      ? { ...p.analyse, pointsForts: verifierCitations(p.analyse.pointsForts, p.avis), reproches: verifierCitations(p.analyse.reproches, p.avis) }
      : null,
  };
}

const texte = (x: unknown, max: number) => (typeof x === "string" ? x.slice(0, max) : "");

/** Fiche reçue du navigateur (non fiable) : forme vérifiée, textes bornés. */
export function ficheValide(x: unknown): Fiche | null {
  if (!x || typeof x !== "object") return null;
  const f = x as Record<string, unknown>;
  const placeId = texte(f.placeId, 200);
  const nom = texte(f.nom, 200);
  if (!placeId || !nom) return null;
  return {
    placeId, nom,
    adresse: texte(f.adresse, 300),
    categorie: texte(f.categorie, 120),
    note: typeof f.note === "number" && Number.isFinite(f.note) ? f.note : null,
    nbAvis: typeof f.nbAvis === "number" && Number.isFinite(f.nbAvis) ? Math.max(0, Math.round(f.nbAvis)) : 0,
  };
}
