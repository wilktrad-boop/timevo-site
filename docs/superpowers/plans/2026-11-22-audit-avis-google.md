# Analyse d'avis Google — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the free Google reviews analysis tool on `/fr/ressources/repondre-avis-google`: business search, free comparison teaser, email verified by code, full analysis (computed figures + Claude), report on screen and PDF by email.

**Architecture:** Pure modules in `lib/avis/` (types, calculations, DataForSEO client, usage limits, Claude analysis, simulation, config), tested with `node --test`. Server Actions in the page folder orchestrate them; the analysis runs in two steps (`lancerAudit` creates the DataForSEO reviews task, `suivreAudit` is polled every 5 s and finishes the report). Client components in `components/avis/`. Email code, access token and mail box are reused from the welcome-book tool.

**Tech Stack:** Next.js 16.2.6 App Router (read `node_modules/next/dist/docs/` before writing Next code), React 19, TypeScript strict, `@react-pdf/renderer` 4.9.0 (already installed), `@anthropic-ai/sdk` 1.6.0, `zod` 4.6.7, `@upstash/redis` 1.41.0, Node 24 native TS for tests, Playwright for the end-to-end script.

Spec: `docs/superpowers/specs/2026-11-22-audit-avis-google-design.md`.

## Global Constraints

- Branch `feat/audit-avis`. Commit after each task. Never `git add assets/logo/impression/`. Never push: pushing to master deploys to production and needs Willy's explicit approval.
- Visitor-facing wording: the tool is **« Analyse de vos avis Google »** / « analyse ». Never write « audit » in visitor-facing copy (on timevo.io « audit » is the paid step 02; the free entry is the « diagnostic »). Code identifiers may say `audit`.
- Copy: French, sober, no emoji, no unsourced performance figures, no prices. Free meeting = « diagnostic gratuit », link `CONTACT_HREF` from `lib/contact.ts`.
- Page is French only: `/en/...` returns 404 (same pattern as `app/[locale]/ressources/livret-accueil-airbnb/creer/page.tsx`).
- Model: `claude-sonnet-5-5`, via `client.messages.parse()` + `output_config.format` (`zodOutputFormat`). No forced `tool_choice` (400 on this model). No `temperature`. Accept the result only if `stop_reason === "end_turn"` and `parsed_output !== null`.
- Exact dependency versions: `@anthropic-ai/sdk@1.6.0`, `zod@4.6.7`, `@upstash/redis@1.41.0`, installed with `npm i -E`.
- Env vars (Vercel, never in the repo): `ANTHROPIC_API_KEY` (dedicated key `timevo-site-avis`), `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`, Upstash (`UPSTASH_REDIS_REST_URL`/`_TOKEN` or `KV_REST_API_URL`/`_TOKEN`), plus existing `LIVRET_SECRET`, `SMTP_USER`, `SMTP_PASSWORD`.
- Missing config ⇒ the tool shows « momentanément indisponible » (never opens without limits). Simulation mode only when `AVIS_SIMULATION=1` **and** `NODE_ENV !== "production"`.
- Limits: 20 Maps searches per IP per day, 3 full analyses per verified email per day, 50 full analyses per day site-wide; finished report cached 24 h per Google place.
- Reviews analysed: at most 200, newest first. Drafted replies: at most 20, for reviews without an owner reply, in the review's language.
- Files under `lib/avis/` import each other with relative `.ts` paths (tests run with Node type stripping; `@/` does not resolve there). App and component files use `@/`.
- Every task: `npm test` and `npx tsc --noEmit` pass before commit.

---

## File map

| File | Responsibility |
|---|---|
| `lib/livret/jeton.ts` (modify) | Code tokens carry any string fields, not only the welcome-book ones. |
| `lib/avis/types.ts` | Shared types: `Fiche`, `Avis`, `Analyse`, `Rapport`, `Donnees`, `Ia`. |
| `lib/avis/calculs.ts` | Pure figures: reply rate, delay, quarterly rating, unanswered reviews, competitors, quote check, report assembly. |
| `lib/avis/dataforseo.ts` | DataForSEO client (Maps search, reviews task post/get). |
| `lib/avis/limites.ts` | `Magasin` storage interface (memory + Upstash), counters. |
| `lib/avis/analyse.ts` | Claude call with structured output, result cleanup. |
| `lib/avis/simulation.ts` | Fake data and fake AI for local end-to-end runs. |
| `lib/avis/config.ts` | Picks real or simulated providers from env; `null` when not configured. |
| `app/[locale]/ressources/repondre-avis-google/actions.ts` | Server Actions. |
| `app/[locale]/ressources/repondre-avis-google/page.tsx` | Editorial page + tool, metadata, JSON-LD. |
| `components/avis/AuditAvis.tsx` | Client flow: search, choice, teaser, email, code, progress, report. |
| `components/avis/Rapport.tsx` | Report on screen. |
| `components/avis/RapportPdf.tsx` | Report as PDF (`genererPdfRapport`). |
| `lib/ressources.ts`, `app/sitemap.ts`, `app/[locale]/politique-de-confidentialite/page.tsx` (modify) | Copy, sitemap, privacy. |
| `scripts/avis/e2e-audit.mjs` | Playwright end-to-end run in simulation mode. |

---

### Task 1: Generic code tokens and dependencies

**Files:**
- Modify: `lib/livret/jeton.ts`
- Modify: `tests/livret/jeton.test.ts`
- Modify: `package.json`, `package-lock.json` (via npm)

**Interfaces:**
- Produces: `export type InfosCode = { email: string; [cle: string]: string }`; `jetonCode(infos: InfosCode, code: string, secret: string, maintenant?: number): string`; `verifierCode(jeton: string, code: string, secret: string, maintenant?: number): InfosCode | null`. `jetonAcces` / `verifierAcces` unchanged.

- [ ] **Step 1: Install dependencies**

Run: `npm i -E @anthropic-ai/sdk@1.6.0 zod@4.6.7 @upstash/redis@1.41.0`
Expected: `package.json` dependencies gain exactly these three pinned versions.

- [ ] **Step 2: Add a failing test for any-field tokens**

Append to `tests/livret/jeton.test.ts`:

```ts
test("un jeton de code transporte n'importe quels champs texte", () => {
  const infos = { email: "a@b.fr", entreprise: "Atelier Cuisines", source: "avis" };
  const j = jetonCode(infos, "654321", SECRET, T0);
  assert.deepEqual(verifierCode(j, "654321", SECRET, T0), infos);
});
```

- [ ] **Step 3: Run it**

Run: `npm test`
Expected: the new test fails to type-check or returns extra/missing fields (current `verifierCode` returns only `email`, `conciergerie`, `logements`).

- [ ] **Step 4: Generalize `lib/livret/jeton.ts`**

Replace the `Charge` type, `jetonCode` and `verifierCode` with:

```ts
/** Champs portés par un jeton de code : l'email, plus ce que le formulaire veut retrouver après le code. */
export type InfosCode = { email: string; [cle: string]: string };

type Charge =
  | { t: "code"; exp: number; c: string; infos: InfosCode }
  | { t: "acces"; email: string; exp: number };
```

```ts
export function jetonCode(infos: InfosCode, code: string, secret: string, maintenant = Date.now()): string {
  return signer({ t: "code", infos, exp: maintenant + CODE_DUREE_MS, c: hmac(secret, `code:${infos.email}:${code}`) }, secret);
}

/** Les infos du formulaire si le code est le bon et n'a pas expiré, sinon null. */
export function verifierCode(jeton: string, code: string, secret: string, maintenant = Date.now()): InfosCode | null {
  const charge = lire(jeton, secret, maintenant);
  if (!charge || charge.t !== "code") return null;
  if (!egal(charge.c, hmac(secret, `code:${charge.infos.email}:${String(code).trim()}`))) return null;
  return charge.infos;
}
```

Keep the file's header comment, `signer`, `lire`, `egal`, `hmac`, `creerCode`, `jetonAcces`, `verifierAcces` as they are.

- [ ] **Step 5: Run tests and types**

Run: `npm test` then `npx tsc --noEmit`
Expected: all tests pass (the welcome-book tests still pass: `verifierCode` returns the same object that was passed in), no type errors. `app/[locale]/ressources/livret-accueil-airbnb/creer/actions.ts` still compiles (`infos.conciergerie` and `infos.logements` are `string`).

- [ ] **Step 6: Commit**

```bash
git add lib/livret/jeton.ts tests/livret/jeton.test.ts package.json package-lock.json
git commit -m "feat(avis): jetons de code génériques, dépendances de l'analyse d'avis"
```

---

### Task 2: Types and pure calculations

**Files:**
- Create: `lib/avis/types.ts`
- Create: `lib/avis/calculs.ts`
- Test: `tests/avis/calculs.test.ts`

**Interfaces:**
- Produces (types.ts): `Fiche`, `Avis`, `Theme`, `ReponseRedigee`, `Analyse`, `Trimestre`, `Rapport`, `EtatTache`, `Donnees`, `EntreeAnalyse`, `Ia` (exact definitions below).
- Produces (calculs.ts): `AVIS_MAX = 200`, `REPONSES_MAX = 20`, `dateDfs(s): string | null`, `tauxReponse(avis): number | null`, `delaiMoyenJours(avis): number | null`, `noteParTrimestre(avis, maintenant?): Trimestre[]`, `avisSansReponse(avis, max?): Avis[]`, `choisirConcurrents(fiches, choisie, n?): Fiche[]`, `verifierCitations(themes, avis): Theme[]`, `construireRapport(p): Rapport`, `ficheValide(x: unknown): Fiche | null`.

- [ ] **Step 1: Create `lib/avis/types.ts`**

```ts
/** Types partagés de l'analyse d'avis Google. Aucune dépendance. */

/** Une fiche Google Maps (entreprise). */
export type Fiche = {
  placeId: string;
  nom: string;
  adresse: string;
  categorie: string;
  note: number | null;
  nbAvis: number;
};

/** Un avis Google. Dates en ISO 8601, null si inconnues. */
export type Avis = {
  id: string;
  note: number;
  texte: string | null;
  date: string | null;
  reponse: string | null;
  dateReponse: string | null;
};

export type Theme = { titre: string; citations: string[] };
export type ReponseRedigee = { avisId: string; texte: string };

/** Ce que produit l'IA. */
export type Analyse = {
  pointsForts: Theme[];
  reproches: Theme[];
  reponses: ReponseRedigee[];
  recommandations: string[];
};

export type Trimestre = { libelle: string; note: number | null; nb: number };

/** Le rapport complet, tel qu'affiché et mis en PDF. */
export type Rapport = {
  fiche: Fiche;
  concurrents: Fiche[];
  genereLe: string;
  nbAvisAnalyses: number;
  tronque: boolean;
  tauxReponse: number | null;
  delaiMoyenJours: number | null;
  trimestres: Trimestre[];
  sansReponse: Avis[];
  analyse: Analyse | null;
};

/** État d'une tâche de récupération d'avis. */
export type EtatTache =
  | { etat: "encours" }
  | { etat: "pret"; avis: Avis[]; total: number }
  | { etat: "erreur" };

/** Source des données (DataForSEO ou simulation). */
export interface Donnees {
  rechercher(motCle: string): Promise<Fiche[]>;
  lancer(placeId: string): Promise<string>;
  lire(tacheId: string): Promise<EtatTache>;
}

export type EntreeAnalyse = { entreprise: string; categorie: string; avis: Avis[]; sansReponse: Avis[] };

/** Analyse par l'IA (Claude ou simulation). null si l'analyse a échoué. */
export interface Ia {
  analyser(e: EntreeAnalyse): Promise<Analyse | null>;
}
```

- [ ] **Step 2: Write the failing tests `tests/avis/calculs.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  dateDfs, tauxReponse, delaiMoyenJours, noteParTrimestre, avisSansReponse,
  choisirConcurrents, verifierCitations, construireRapport, ficheValide, AVIS_MAX,
} from "../../lib/avis/calculs.ts";
import type { Avis, Fiche } from "../../lib/avis/types.ts";

const avis = (p: Partial<Avis> & { id: string }): Avis => ({
  note: 5, texte: null, date: null, reponse: null, dateReponse: null, ...p,
});
const fiche = (p: Partial<Fiche> & { placeId: string }): Fiche => ({
  nom: p.placeId, adresse: "", categorie: "Cuisiniste", note: 4.5, nbAvis: 10, ...p,
});

test("dateDfs lit le format DataForSEO et refuse le reste", () => {
  assert.equal(dateDfs("2026-05-15 14:09:32 +00:00"), "2026-05-15T14:09:32.000Z");
  assert.equal(dateDfs("2026-05-15 16:09:32 +02:00"), "2026-05-15T14:09:32.000Z");
  assert.equal(dateDfs("hier"), null);
  assert.equal(dateDfs(null), null);
});

test("tauxReponse arrondit au pourcent et vaut null sans avis", () => {
  assert.equal(tauxReponse([]), null);
  assert.equal(tauxReponse([avis({ id: "a", reponse: "Merci" }), avis({ id: "b" }), avis({ id: "c" })]), 33);
});

test("delaiMoyenJours ne compte que les avis datés avec réponse datée", () => {
  const a = [
    avis({ id: "a", date: "2026-01-01T00:00:00.000Z", reponse: "ok", dateReponse: "2026-01-03T00:00:00.000Z" }),
    avis({ id: "b", date: "2026-01-01T00:00:00.000Z", reponse: "ok", dateReponse: "2026-01-02T00:00:00.000Z" }),
    avis({ id: "c", date: "2026-01-01T00:00:00.000Z", reponse: "ok" }),
  ];
  assert.equal(delaiMoyenJours(a), 1.5);
  assert.equal(delaiMoyenJours([avis({ id: "d" })]), null);
});

test("noteParTrimestre donne les 4 derniers trimestres, du plus ancien au plus récent", () => {
  const t = noteParTrimestre([
    avis({ id: "a", note: 4, date: "2026-11-02T10:00:00.000Z" }),
    avis({ id: "b", note: 5, date: "2026-10-20T10:00:00.000Z" }),
    avis({ id: "c", note: 2, date: "2026-02-10T10:00:00.000Z" }),
  ], new Date("2026-11-22T12:00:00.000Z"));
  assert.deepEqual(t.map(x => x.libelle), ["T1 2026", "T2 2026", "T3 2026", "T4 2026"]);
  assert.deepEqual(t[3], { libelle: "T4 2026", note: 4.5, nb: 2 });
  assert.deepEqual(t[1], { libelle: "T2 2026", note: null, nb: 0 });
  assert.equal(t[0].note, 2);
});

test("avisSansReponse garde les plus récents, au maximum demandé", () => {
  const a = [
    avis({ id: "vieux", date: "2025-01-01T00:00:00.000Z" }),
    avis({ id: "recent", date: "2026-06-01T00:00:00.000Z" }),
    avis({ id: "repondu", date: "2026-07-01T00:00:00.000Z", reponse: "Merci" }),
    avis({ id: "sansdate" }),
  ];
  assert.deepEqual(avisSansReponse(a).map(x => x.id), ["recent", "vieux", "sansdate"]);
  assert.deepEqual(avisSansReponse(a, 1).map(x => x.id), ["recent"]);
});

test("choisirConcurrents : même catégorie, sans la fiche choisie, les plus suivis d'abord", () => {
  const choisie = fiche({ placeId: "moi" });
  const liste = [
    choisie,
    fiche({ placeId: "petit", nbAvis: 5 }),
    fiche({ placeId: "gros", nbAvis: 200 }),
    fiche({ placeId: "autre-metier", categorie: "Plombier", nbAvis: 999 }),
    fiche({ placeId: "sans-avis", nbAvis: 0 }),
    fiche({ placeId: "moyen", nbAvis: 40, categorie: " cuisiniste " }),
    fiche({ placeId: "dernier", nbAvis: 3 }),
  ];
  assert.deepEqual(choisirConcurrents(liste, choisie).map(f => f.placeId), ["gros", "moyen", "petit"]);
});

test("verifierCitations retire ce qui n'est pas dans un avis, mot pour mot", () => {
  const a = [avis({ id: "a", texte: "Pose  impeccable, l’équipe était à l'heure." })];
  const themes = verifierCitations([{ titre: "Ponctualité", citations: ["« L'équipe était à l'heure »", "toujours en avance"] }], a);
  assert.deepEqual(themes, [{ titre: "Ponctualité", citations: ["« L'équipe était à l'heure »"] }]);
});

test("construireRapport assemble les chiffres et signale la troncature", () => {
  const a = [avis({ id: "a", note: 4, date: "2026-11-01T00:00:00.000Z" })];
  const r = construireRapport({
    fiche: fiche({ placeId: "moi" }), concurrents: [], avis: a, total: 350, analyse: null,
    maintenant: new Date("2026-11-22T00:00:00.000Z"),
  });
  assert.equal(r.nbAvisAnalyses, 1);
  assert.equal(r.tronque, true);
  assert.equal(r.tauxReponse, 0);
  assert.equal(r.sansReponse.length, 1);
  assert.equal(r.analyse, null);
  assert.equal(r.genereLe, "2026-11-22T00:00:00.000Z");
  assert.equal(AVIS_MAX, 200);
});

test("ficheValide accepte une fiche bien formée et refuse le reste", () => {
  assert.deepEqual(ficheValide({ placeId: "p1", nom: "A", adresse: "B", categorie: "C", note: 4.2, nbAvis: 3 }),
    { placeId: "p1", nom: "A", adresse: "B", categorie: "C", note: 4.2, nbAvis: 3 });
  assert.equal(ficheValide({ placeId: "", nom: "A" }), null);
  assert.equal(ficheValide("x"), null);
  assert.equal(ficheValide({ placeId: "p", nom: "A", adresse: "", categorie: "", note: "4", nbAvis: 1 })?.note, null);
});
```

- [ ] **Step 3: Run them**

Run: `npm test`
Expected: FAIL, `lib/avis/calculs.ts` not found.

- [ ] **Step 4: Create `lib/avis/calculs.ts`**

```ts
/**
 * Chiffres de l'analyse d'avis, calculés sans IA : l'IA ne fournit jamais un nombre.
 * Fonctions pures, testées dans tests/avis/calculs.test.ts.
 */
import type { Analyse, Avis, Fiche, Rapport, Theme, Trimestre } from "./types.ts";

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
```

- [ ] **Step 5: Run tests and types**

Run: `npm test` then `npx tsc --noEmit`
Expected: PASS, no type errors.

- [ ] **Step 6: Commit**

```bash
git add lib/avis/types.ts lib/avis/calculs.ts tests/avis/calculs.test.ts
git commit -m "feat(avis): types et calculs de l'analyse d'avis (taux, délai, trimestres, citations)"
```

---

### Task 3: DataForSEO client

**Files:**
- Create: `lib/avis/dataforseo.ts`
- Test: `tests/avis/dataforseo.test.ts`

**Interfaces:**
- Consumes: `Donnees`, `Fiche`, `Avis`, `EtatTache` from `./types.ts`; `dateDfs`, `AVIS_MAX` from `./calculs.ts`.
- Produces: `donneesDataForSEO(login: string, motDePasse: string, f?: typeof fetch): Donnees`.

API facts (verified 2026-11-22): base `https://api.dataforseo.com/v3`, HTTP Basic auth, bodies are JSON arrays. Maps: `POST /serp/google/maps/live/advanced`, items in `tasks[0].result[0].items[]`, keep `type === "maps_search"`; fields `title`, `address`, `category`, `rating.value`, `rating.votes_count`, `place_id`. Reviews: `POST /business_data/google/reviews/task_post` (`place_id`, `location_name`, `language_code`, `depth`, `sort_by: "newest"`, `priority: 2`) → `tasks[0].id`, `tasks[0].status_code` 20100; `GET /business_data/google/reviews/task_get/{id}` → `tasks[0].status_code` 40601/40602 = not ready, 20000 = done with `result[0].items[]` and `result[0].reviews_count`; review fields `review_id`, `review_text`, `rating.value`, `timestamp`, `owner_answer`, `owner_timestamp`.

- [ ] **Step 1: Write the failing tests `tests/avis/dataforseo.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { donneesDataForSEO } from "../../lib/avis/dataforseo.ts";

type Appel = { url: string; init?: RequestInit };
function faux(reponses: unknown[]) {
  const appels: Appel[] = [];
  const f = (async (url: string, init?: RequestInit) => {
    appels.push({ url, init });
    return new Response(JSON.stringify(reponses.shift()), { status: 200 });
  }) as unknown as typeof fetch;
  return { f, appels };
}

test("rechercher : envoie la recherche Maps et garde les fiches", async () => {
  const { f, appels } = faux([{ tasks: [{ status_code: 20000, result: [{ items: [
    { type: "maps_search", title: "Atelier Cuisines", address: "1 rue A, Annecy", category: "Cuisiniste", rating: { value: 4.3, votes_count: 48 }, place_id: "P1" },
    { type: "maps_paid_item", title: "Pub", place_id: "PUB" },
    { type: "maps_search", title: "Sans place id" },
  ] }] }] }]);
  const d = donneesDataForSEO("log", "mdp", f);
  const fiches = await d.rechercher("Atelier Cuisines Annecy");
  assert.deepEqual(fiches, [{ placeId: "P1", nom: "Atelier Cuisines", adresse: "1 rue A, Annecy", categorie: "Cuisiniste", note: 4.3, nbAvis: 48 }]);
  assert.equal(appels[0].url, "https://api.dataforseo.com/v3/serp/google/maps/live/advanced");
  assert.equal((appels[0].init?.headers as Record<string, string>).Authorization, "Basic " + Buffer.from("log:mdp").toString("base64"));
  const corps = JSON.parse(String(appels[0].init?.body));
  assert.deepEqual(corps, [{ keyword: "Atelier Cuisines Annecy", location_name: "France", language_code: "fr", depth: 20 }]);
});

test("lancer : crée la tâche d'avis en file prioritaire et rend son id", async () => {
  const { f, appels } = faux([{ tasks: [{ id: "T-1", status_code: 20100 }] }]);
  const id = await donneesDataForSEO("l", "m", f).lancer("P1");
  assert.equal(id, "T-1");
  assert.deepEqual(JSON.parse(String(appels[0].init?.body)), [{ place_id: "P1", location_name: "France", language_code: "fr", depth: 200, sort_by: "newest", priority: 2 }]);
});

test("lancer : lève une erreur si la tâche n'est pas créée", async () => {
  const { f } = faux([{ tasks: [{ status_code: 40501 }] }]);
  await assert.rejects(() => donneesDataForSEO("l", "m", f).lancer("P1"));
});

test("lire : en cours, prêt, erreur", async () => {
  const { f, appels } = faux([
    { tasks: [{ status_code: 40602, result: null }] },
    { tasks: [{ status_code: 20000, result: [{ reviews_count: 350, items: [
      { review_id: "R1", review_text: "Très bien", rating: { value: 5 }, timestamp: "2026-05-15 14:09:32 +00:00", owner_answer: "Merci", owner_timestamp: "2026-05-16 14:09:32 +00:00" },
      { review_id: "R2", review_text: null, rating: { value: 2 }, timestamp: "2026-05-10 10:00:00 +00:00", owner_answer: null, owner_timestamp: null },
    ] }] }] },
    { tasks: [{ status_code: 50000 }] },
  ]);
  const d = donneesDataForSEO("l", "m", f);
  assert.deepEqual(await d.lire("T-1"), { etat: "encours" });
  assert.equal(appels[0].url, "https://api.dataforseo.com/v3/business_data/google/reviews/task_get/T-1");
  assert.deepEqual(await d.lire("T-1"), { etat: "pret", total: 350, avis: [
    { id: "R1", note: 5, texte: "Très bien", date: "2026-05-15T14:09:32.000Z", reponse: "Merci", dateReponse: "2026-05-16T14:09:32.000Z" },
    { id: "R2", note: 2, texte: null, date: "2026-05-10T10:00:00.000Z", reponse: null, dateReponse: null },
  ] });
  assert.deepEqual(await d.lire("T-1"), { etat: "erreur" });
});
```

- [ ] **Step 2: Run them**

Run: `npm test`
Expected: FAIL, module not found.

- [ ] **Step 3: Create `lib/avis/dataforseo.ts`**

```ts
/**
 * Client DataForSEO (v3) pour l'analyse d'avis : recherche Google Maps et avis Google.
 * Identifiants : DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD (Vercel). Compte partagé avec
 * les outils SEO de Willy (choix assumé, cf. spec) : les limites de lib/avis/limites.ts
 * protègent son solde.
 */
import type { Avis, Donnees, EtatTache, Fiche } from "./types.ts";
import { AVIS_MAX, dateDfs } from "./calculs.ts";

const BASE = "https://api.dataforseo.com/v3";
const PAS_PRET = new Set([40601, 40602]);

type Brut = Record<string, unknown>;
type Tache = { id?: unknown; status_code?: unknown; result?: unknown };

const obj = (x: unknown): Brut => (x && typeof x === "object" ? (x as Brut) : {});
const str = (x: unknown): string | null => (typeof x === "string" && x.trim() ? x : null);
const num = (x: unknown): number | null => (typeof x === "number" && Number.isFinite(x) ? x : null);

export function donneesDataForSEO(login: string, motDePasse: string, f: typeof fetch = fetch): Donnees {
  const auth = "Basic " + Buffer.from(`${login}:${motDePasse}`).toString("base64");

  async function tache(chemin: string, corps?: unknown): Promise<Tache> {
    const r = await f(`${BASE}${chemin}`, {
      method: corps === undefined ? "GET" : "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: corps === undefined ? undefined : JSON.stringify(corps),
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`DataForSEO HTTP ${r.status}`);
    const json = obj(await r.json());
    const taches = Array.isArray(json.tasks) ? json.tasks : [];
    return obj(taches[0]) as Tache;
  }

  const premierResultat = (t: Tache): Brut | null =>
    Array.isArray(t.result) && t.result.length ? obj(t.result[0]) : null;

  return {
    async rechercher(motCle) {
      const t = await tache("/serp/google/maps/live/advanced", [
        { keyword: motCle, location_name: "France", language_code: "fr", depth: 20 },
      ]);
      const items = Array.isArray(premierResultat(t)?.items) ? (premierResultat(t)!.items as unknown[]) : [];
      return items.map(obj).flatMap((i): Fiche[] => {
        const placeId = str(i.place_id);
        const nom = str(i.title);
        if (i.type !== "maps_search" || !placeId || !nom) return [];
        const rating = obj(i.rating);
        return [{ placeId, nom, adresse: str(i.address) ?? "", categorie: str(i.category) ?? "", note: num(rating.value), nbAvis: num(rating.votes_count) ?? 0 }];
      });
    },

    async lancer(placeId) {
      const t = await tache("/business_data/google/reviews/task_post", [
        { place_id: placeId, location_name: "France", language_code: "fr", depth: AVIS_MAX, sort_by: "newest", priority: 2 },
      ]);
      const id = str(t.id);
      if (t.status_code !== 20100 || !id) throw new Error(`DataForSEO tâche non créée (${String(t.status_code)})`);
      return id;
    },

    async lire(tacheId): Promise<EtatTache> {
      const t = await tache(`/business_data/google/reviews/task_get/${encodeURIComponent(tacheId)}`);
      const code = num(t.status_code);
      if (code !== null && PAS_PRET.has(code)) return { etat: "encours" };
      const res = premierResultat(t);
      if (code !== 20000) return { etat: "erreur" };
      if (!res) return { etat: "encours" };
      const items = Array.isArray(res.items) ? (res.items as unknown[]) : [];
      const avis = items.map(obj).map((i, n): Avis => ({
        id: str(i.review_id) ?? `avis-${n}`,
        note: num(obj(i.rating).value) ?? 0,
        texte: str(i.review_text),
        date: dateDfs(str(i.timestamp)),
        reponse: str(i.owner_answer),
        dateReponse: dateDfs(str(i.owner_timestamp)),
      }));
      return { etat: "pret", avis, total: num(res.reviews_count) ?? avis.length };
    },
  };
}
```

- [ ] **Step 4: Run tests and types**

Run: `npm test` then `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/avis/dataforseo.ts tests/avis/dataforseo.test.ts
git commit -m "feat(avis): client DataForSEO (recherche Maps, tâche d'avis)"
```

---

### Task 4: Storage and usage limits

**Files:**
- Create: `lib/avis/limites.ts`
- Test: `tests/avis/limites.test.ts`

**Interfaces:**
- Produces: `interface Magasin { incr(cle: string, ttlSec: number): Promise<number>; decr(cle: string): Promise<void>; lire<T>(cle: string): Promise<T | null>; ecrire(cle: string, valeur: unknown, ttlSec: number): Promise<void>; prendre(cle: string, ttlSec: number): Promise<boolean> }`; `magasinMemoire(maintenant?: () => number): Magasin`; `magasinRedis(): Magasin`; `redisConfigure(): boolean`; `LIMITES = { recherchesParIp: 20, auditsParEmail: 3, auditsParJour: 50 }`; `JOUR_S = 86400`; `autoriser(m: Magasin, cle: string, max: number): Promise<boolean>`; `rendre(m: Magasin, cle: string): Promise<void>`.

- [ ] **Step 1: Write the failing tests `tests/avis/limites.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { magasinMemoire, autoriser, rendre, LIMITES } from "../../lib/avis/limites.ts";

test("autoriser compte jusqu'au maximum puis refuse sans dépasser", async () => {
  const m = magasinMemoire();
  for (let i = 0; i < 3; i++) assert.equal(await autoriser(m, "email:a", 3), true);
  assert.equal(await autoriser(m, "email:a", 3), false);
  assert.equal(await autoriser(m, "email:b", 3), true);
  await rendre(m, "email:a");
  assert.equal(await autoriser(m, "email:a", 3), true);
  assert.deepEqual(LIMITES, { recherchesParIp: 20, auditsParEmail: 3, auditsParJour: 50 });
});

test("les compteurs et les valeurs expirent", async () => {
  let t = 0;
  const m = magasinMemoire(() => t);
  await m.incr("k", 10);
  await m.ecrire("v", { a: 1 }, 10);
  assert.deepEqual(await m.lire("v"), { a: 1 });
  t = 11_000;
  assert.equal(await m.lire("v"), null);
  assert.equal(await m.incr("k", 10), 1);
});

test("prendre ne réussit qu'une fois tant que la clé vit", async () => {
  const m = magasinMemoire();
  assert.equal(await m.prendre("verrou", 60), true);
  assert.equal(await m.prendre("verrou", 60), false);
});
```

- [ ] **Step 2: Run them**

Run: `npm test`
Expected: FAIL, module not found.

- [ ] **Step 3: Create `lib/avis/limites.ts`**

```ts
/**
 * Compteurs et cache de l'analyse d'avis. Chaque analyse coûte (données + IA) :
 * on compte par IP, par email vérifié et pour tout le site.
 * En production : Upstash Redis (Marketplace Vercel). En simulation et en test : mémoire.
 */
import { Redis } from "@upstash/redis";

export const JOUR_S = 86_400;
export const LIMITES = { recherchesParIp: 20, auditsParEmail: 3, auditsParJour: 50 };

export interface Magasin {
  /** Incrémente et pose l'expiration au premier incrément. Rend la nouvelle valeur. */
  incr(cle: string, ttlSec: number): Promise<number>;
  decr(cle: string): Promise<void>;
  lire<T>(cle: string): Promise<T | null>;
  ecrire(cle: string, valeur: unknown, ttlSec: number): Promise<void>;
  /** Pose la clé si elle n'existe pas (verrou). true si on l'a prise. */
  prendre(cle: string, ttlSec: number): Promise<boolean>;
}

export function magasinMemoire(maintenant: () => number = Date.now): Magasin {
  const valeurs = new Map<string, { v: unknown; fin: number }>();
  const vivant = (cle: string) => {
    const e = valeurs.get(cle);
    if (e && e.fin <= maintenant()) { valeurs.delete(cle); return undefined; }
    return e;
  };
  return {
    async incr(cle, ttlSec) {
      const e = vivant(cle);
      const n = (typeof e?.v === "number" ? e.v : 0) + 1;
      valeurs.set(cle, { v: n, fin: e?.fin ?? maintenant() + ttlSec * 1000 });
      return n;
    },
    async decr(cle) {
      const e = vivant(cle);
      if (e && typeof e.v === "number") e.v = Math.max(0, e.v - 1);
    },
    async lire<T>(cle: string) {
      const e = vivant(cle);
      return e ? (structuredClone(e.v) as T) : null;
    },
    async ecrire(cle, valeur, ttlSec) {
      valeurs.set(cle, { v: structuredClone(valeur), fin: maintenant() + ttlSec * 1000 });
    },
    async prendre(cle, ttlSec) {
      if (vivant(cle)) return false;
      valeurs.set(cle, { v: 1, fin: maintenant() + ttlSec * 1000 });
      return true;
    },
  };
}

/** Variables posées par l'intégration Upstash de Vercel (l'un ou l'autre jeu de noms). */
export function redisConfigure(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const jeton = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return Boolean(url && jeton);
}

export function magasinRedis(): Magasin {
  const r = Redis.fromEnv();
  return {
    async incr(cle, ttlSec) {
      const n = await r.incr(cle);
      if (n === 1) await r.expire(cle, ttlSec);
      return n;
    },
    async decr(cle) {
      const n = await r.decr(cle);
      if (n < 0) await r.set(cle, 0, { keepTtl: true });
    },
    async lire<T>(cle: string) {
      return (await r.get<T>(cle)) ?? null;
    },
    async ecrire(cle, valeur, ttlSec) {
      await r.set(cle, valeur, { ex: ttlSec });
    },
    async prendre(cle, ttlSec) {
      return (await r.set(cle, 1, { nx: true, ex: ttlSec })) === "OK";
    },
  };
}

/** Compte un usage ; refuse (sans le compter) au-delà du maximum sur 24 h. */
export async function autoriser(m: Magasin, cle: string, max: number): Promise<boolean> {
  const n = await m.incr(cle, JOUR_S);
  if (n <= max) return true;
  await m.decr(cle);
  return false;
}

/** Rend un usage compté (analyse qui n'a pas abouti). */
export async function rendre(m: Magasin, cle: string): Promise<void> {
  await m.decr(cle);
}
```

If `npx tsc` rejects `{ keepTtl: true }` for `@upstash/redis@1.41.0`, read `node_modules/@upstash/redis` type definitions for `SetCommandOptions` and use the documented keep-TTL option name; do not drop the negative-value guard.

- [ ] **Step 4: Run tests and types**

Run: `npm test` then `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/avis/limites.ts tests/avis/limites.test.ts
git commit -m "feat(avis): compteurs d'usage et cache (mémoire, Upstash Redis)"
```

---

### Task 5: Claude analysis

**Files:**
- Create: `lib/avis/analyse.ts`
- Test: `tests/avis/analyse.test.ts`

**Interfaces:**
- Consumes: `Ia`, `EntreeAnalyse`, `Analyse` from `./types.ts`; `REPONSES_MAX` from `./calculs.ts`.
- Produces: `MODELE = "claude-sonnet-5-5"`; `iaClaude(client: Pick<Anthropic, "messages">): Ia`; `nettoyerAnalyse(a: Analyse, e: EntreeAnalyse): Analyse` (exported for tests).

Before coding, read `C:\Users\wilk7\AppData\Local\Temp\claude\bundled-skills\2.1.328\337ac7d2cfd80b0d83582a660b4c30a3\claude-api\typescript\claude-api\tool-use.md` (section Structured Outputs) and `README.md` (Stop Reasons, Error Handling) if the SDK call below does not type-check.

- [ ] **Step 1: Write the failing tests `tests/avis/analyse.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { iaClaude, nettoyerAnalyse, MODELE } from "../../lib/avis/analyse.ts";
import type { Avis, EntreeAnalyse } from "../../lib/avis/types.ts";

const a = (id: string, texte: string): Avis => ({ id, note: 2, texte, date: null, reponse: null, dateReponse: null });
const entree: EntreeAnalyse = {
  entreprise: "Atelier Cuisines", categorie: "Cuisiniste",
  avis: [a("R1", "Trois semaines de retard."), a("R2", "Belle cuisine.")],
  sansReponse: [a("R1", "Trois semaines de retard.")],
};
const analyse = {
  pointsForts: [{ titre: "Qualité", citations: ["Belle cuisine"] }],
  reproches: [{ titre: "Délais", citations: ["Trois semaines de retard"] }],
  reponses: [{ avisId: "R1", texte: "Bonjour, merci..." }, { avisId: "INCONNU", texte: "x" }, { avisId: "R1", texte: "doublon" }],
  recommandations: ["Un", "Deux", "Trois", "Quatre"],
};

function client(reponse: unknown, capture: unknown[] = []) {
  return { messages: { parse: async (p: unknown) => { capture.push(p); return reponse; } } } as never;
}

test("iaClaude envoie Sonnet en sortie structurée et nettoie le résultat", async () => {
  const capture: unknown[] = [];
  const res = await iaClaude(client({ stop_reason: "end_turn", parsed_output: analyse }, capture)).analyser(entree);
  const p = capture[0] as { model: string; output_config: { format: unknown }; messages: { content: string }[] };
  assert.equal(p.model, MODELE);
  assert.ok(p.output_config.format);
  assert.match(p.messages[0].content, /R1/);
  assert.deepEqual(res?.reponses, [{ avisId: "R1", texte: "Bonjour, merci..." }]);
  assert.equal(res?.recommandations.length, 3);
});

test("iaClaude rend null si la réponse est tronquée, refusée ou en erreur", async () => {
  assert.equal(await iaClaude(client({ stop_reason: "max_tokens", parsed_output: analyse })).analyser(entree), null);
  assert.equal(await iaClaude(client({ stop_reason: "refusal", parsed_output: null })).analyser(entree), null);
  const enErreur = { messages: { parse: async () => { throw new Error("boom"); } } } as never;
  assert.equal(await iaClaude(enErreur).analyser(entree), null);
});

test("nettoyerAnalyse borne les listes", () => {
  const beaucoup = Array.from({ length: 8 }, (_, i) => ({ titre: `T${i}`, citations: ["a", "b", "c"] }));
  const n = nettoyerAnalyse({ ...analyse, pointsForts: beaucoup, reproches: beaucoup }, entree);
  assert.equal(n.pointsForts.length, 5);
  assert.equal(n.pointsForts[0].citations.length, 2);
});
```

- [ ] **Step 2: Run them**

Run: `npm test`
Expected: FAIL, module not found.

- [ ] **Step 3: Create `lib/avis/analyse.ts`**

```ts
/**
 * Analyse des avis par Claude (clé dédiée timevo-site-avis, plafond de dépense).
 * Sortie structurée (output_config.format + zod) : Sonnet 5.5 refuse le tool_choice forcé.
 * Les chiffres ne viennent jamais d'ici (cf. calculs.ts) ; les citations sont revérifiées
 * dans construireRapport.
 */
import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { Analyse, EntreeAnalyse, Ia } from "./types.ts";
import { REPONSES_MAX } from "./calculs.ts";

export const MODELE = "claude-sonnet-5-5";
const TEXTE_MAX = 1500;

const Theme = z.object({ titre: z.string(), citations: z.array(z.string()) });
const SchemaAnalyse = z.object({
  pointsForts: z.array(Theme),
  reproches: z.array(Theme),
  reponses: z.array(z.object({ avisId: z.string(), texte: z.string() })),
  recommandations: z.array(z.string()),
});

const SYSTEME = [
  "Tu analyses les avis Google d'une petite entreprise française pour son dirigeant.",
  "Réponds en français, sans emoji, sur un ton sobre et concret.",
  "pointsForts et reproches : 3 à 5 thèmes chacun (moins s'il n'y a pas matière), titre court, et 1 ou 2 citations recopiées mot pour mot depuis le texte des avis, sans guillemets.",
  "Ne donne aucun chiffre, aucune note, aucun pourcentage : ils sont calculés ailleurs.",
  "reponses : une réponse par avis de la liste « à répondre », avec son avisId exact. Rédige-la dans la langue de l'avis, au nom de l'entreprise, en 2 à 4 phrases : remercier, reprendre le point précis soulevé, et pour un avis négatif reconnaître le problème et proposer d'en parler directement, sans promettre de remise ni de geste commercial.",
  "recommandations : exactement 3 actions concrètes, adaptées au métier, d'une ou deux phrases chacune.",
].join("\n");

const borne = (s: string | null) => (s ?? "").slice(0, TEXTE_MAX);

function message(e: EntreeAnalyse): string {
  const tous = e.avis.map(a => ({ avisId: a.id, note: a.note, date: a.date, texte: borne(a.texte), reponseDuProprietaire: a.reponse ? borne(a.reponse) : null }));
  const aRepondre = e.sansReponse.map(a => ({ avisId: a.id, note: a.note, texte: borne(a.texte) }));
  return [
    `Entreprise : ${e.entreprise}`,
    `Métier : ${e.categorie || "non précisé"}`,
    "",
    `Tous les avis (${tous.length}) :`,
    JSON.stringify(tous),
    "",
    `Avis à répondre (${aRepondre.length}) :`,
    JSON.stringify(aRepondre),
  ].join("\n");
}

/** Bornes et cohérence : réponses aux seuls avis demandés, une par avis, listes limitées. */
export function nettoyerAnalyse(a: Analyse, e: EntreeAnalyse): Analyse {
  const demandes = new Set(e.sansReponse.map(x => x.id));
  const vus = new Set<string>();
  const themes = (t: Analyse["pointsForts"]) =>
    t.slice(0, 5).map(x => ({ titre: x.titre.trim(), citations: x.citations.slice(0, 2) })).filter(x => x.titre);
  return {
    pointsForts: themes(a.pointsForts),
    reproches: themes(a.reproches),
    reponses: a.reponses
      .filter(r => demandes.has(r.avisId) && !vus.has(r.avisId) && r.texte.trim() && vus.add(r.avisId))
      .slice(0, REPONSES_MAX),
    recommandations: a.recommandations.map(r => r.trim()).filter(Boolean).slice(0, 3),
  };
}

export function iaClaude(client: Pick<Anthropic, "messages">): Ia {
  return {
    async analyser(e) {
      try {
        const reponse = await client.messages.parse({
          model: MODELE,
          max_tokens: 16000,
          system: SYSTEME,
          messages: [{ role: "user", content: message(e) }],
          output_config: { effort: "medium", format: zodOutputFormat(SchemaAnalyse) },
        });
        if (reponse.stop_reason !== "end_turn" || !reponse.parsed_output) {
          console.error("[avis] analyse non exploitable :", reponse.stop_reason);
          return null;
        }
        return nettoyerAnalyse(reponse.parsed_output, e);
      } catch (err) {
        console.error("[avis] analyse en échec :", err instanceof Error ? err.message : err);
        return null;
      }
    },
  };
}
```

If `npx tsc` rejects `output_config: { effort, format }` together, check `node_modules/@anthropic-ai/sdk` types for `output_config`; keep `format` and drop `effort` only if the type has no such field.

- [ ] **Step 4: Run tests and types**

Run: `npm test` then `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/avis/analyse.ts tests/avis/analyse.test.ts
git commit -m "feat(avis): analyse des avis par Claude en sortie structurée"
```

---

### Task 6: Simulation and configuration

**Files:**
- Create: `lib/avis/simulation.ts`
- Create: `lib/avis/config.ts`
- Test: `tests/avis/simulation.test.ts`

**Interfaces:**
- Consumes: `Donnees`, `Ia`, `Fiche`, `Avis`, `Analyse` (types.ts); `donneesDataForSEO` (dataforseo.ts); `iaClaude` (analyse.ts); `Magasin`, `magasinMemoire`, `magasinRedis`, `redisConfigure` (limites.ts); `boiteEnvoi` (`../mail.ts`).
- Produces: `donneesSimulation(maintenant?: () => number): Donnees`; `iaSimulation(): Ia`; `type ConfigAvis = { donnees: Donnees; ia: Ia; magasin: Magasin; secret: string; boite: NonNullable<ReturnType<typeof boiteEnvoi>> }`; `configAvis(): ConfigAvis | null`.

- [ ] **Step 1: Write the failing tests `tests/avis/simulation.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { donneesSimulation, iaSimulation } from "../../lib/avis/simulation.ts";
import { avisSansReponse, choisirConcurrents } from "../../lib/avis/calculs.ts";

test("la simulation donne des fiches, 3 concurrents, puis des avis après quelques secondes", async () => {
  let t = 1_000_000;
  const d = donneesSimulation(() => t);
  const fiches = await d.rechercher("Atelier Cuisines Annecy");
  assert.ok(fiches.length >= 2);
  const concurrents = choisirConcurrents(await d.rechercher(`${fiches[0].categorie} Annecy`), fiches[0]);
  assert.equal(concurrents.length, 3);
  const id = await d.lancer(fiches[0].placeId);
  assert.deepEqual(await d.lire(id), { etat: "encours" });
  t += 5_000;
  const pret = await d.lire(id);
  assert.equal(pret.etat, "pret");
  assert.ok(pret.etat === "pret" && pret.avis.length >= 20 && pret.avis.some(a => !a.reponse));
});

test("l'IA simulée cite de vrais avis et répond aux avis demandés", async () => {
  const d = donneesSimulation(() => 0);
  const id = await d.lancer("P1");
  const pret = await donneesSimulation(() => 10_000).lire(id);
  assert.equal(pret.etat, "pret");
  if (pret.etat !== "pret") return;
  const sansReponse = avisSansReponse(pret.avis);
  const r = await iaSimulation().analyser({ entreprise: "X", categorie: "Cuisiniste", avis: pret.avis, sansReponse });
  assert.ok(r);
  assert.equal(r!.reponses.length, sansReponse.length);
  assert.ok(pret.avis.some(a => a.texte?.includes(r!.pointsForts[0].citations[0])));
});
```

- [ ] **Step 2: Run them**

Run: `npm test`
Expected: FAIL, module not found.

- [ ] **Step 3: Create `lib/avis/simulation.ts`**

```ts
/**
 * Données et IA simulées pour les essais en local (AVIS_SIMULATION=1, jamais en production).
 * Déterministe : mêmes fiches et mêmes avis à chaque appel.
 */
import type { Analyse, Avis, Donnees, Fiche, Ia } from "./types.ts";

const CATEGORIE = "Cuisiniste";
const FICHES: Fiche[] = [
  { placeId: "SIM-1", nom: "Atelier Cuisines", adresse: "12 avenue de Genève, 74000 Annecy", categorie: CATEGORIE, note: 4.3, nbAvis: 48 },
  { placeId: "SIM-2", nom: "Cuisines du Lac", adresse: "3 rue Royale, 74000 Annecy", categorie: CATEGORIE, note: 4.8, nbAvis: 212 },
  { placeId: "SIM-3", nom: "L'Établi Cuisines", adresse: "8 rue Carnot, 74000 Annecy", categorie: CATEGORIE, note: 4.6, nbAvis: 95 },
  { placeId: "SIM-4", nom: "Cuisines Savoie Design", adresse: "21 route d'Albertville, 74320 Sevrier", categorie: CATEGORIE, note: 4.1, nbAvis: 31 },
  { placeId: "SIM-5", nom: "Menuiserie Duval", adresse: "5 impasse des Pins, 74960 Cran-Gevrier", categorie: "Menuisier", note: 4.9, nbAvis: 12 },
];

const TEXTES: [number, string][] = [
  [5, "Cuisine magnifique, la pose a été faite avec beaucoup de soin."],
  [2, "Trois semaines de retard sur la pose et personne ne nous prévenait."],
  [5, "Très bon conseil au showroom, le plan 3D nous a beaucoup aidés."],
  [4, "Beau résultat, mais il a fallu relancer pour la finition du plan de travail."],
  [1, "Devis jamais reçu malgré deux relances."],
  [5, "Équipe ponctuelle et chantier laissé propre."],
];

function avisSimules(): Avis[] {
  const base = Date.UTC(2026, 10, 15);
  return Array.from({ length: 30 }, (_, i) => {
    const [note, texte] = TEXTES[i % TEXTES.length];
    const date = new Date(base - i * 9 * 86_400_000);
    const repondu = i % 3 === 0;
    return {
      id: `SIM-AVIS-${i + 1}`, note, texte, date: date.toISOString(),
      reponse: repondu ? "Merci pour votre retour." : null,
      dateReponse: repondu ? new Date(date.getTime() + 2 * 86_400_000).toISOString() : null,
    };
  });
}

export function donneesSimulation(maintenant: () => number = Date.now): Donnees {
  return {
    async rechercher(motCle) {
      return motCle.toLowerCase().includes(CATEGORIE.toLowerCase()) ? FICHES : FICHES.slice(0, 2);
    },
    async lancer(placeId) {
      return `SIM-${maintenant()}-${placeId}`;
    },
    async lire(tacheId) {
      const debut = Number(tacheId.split("-")[1]);
      if (!Number.isFinite(debut) || maintenant() - debut < 4_000) return { etat: "encours" };
      const avis = avisSimules();
      return { etat: "pret", avis, total: avis.length };
    },
  };
}

export function iaSimulation(): Ia {
  return {
    async analyser(e): Promise<Analyse> {
      return {
        pointsForts: [{ titre: "Qualité de la pose", citations: ["la pose a été faite avec beaucoup de soin"] }, { titre: "Conseil", citations: ["le plan 3D nous a beaucoup aidés"] }],
        reproches: [{ titre: "Délais et suivi", citations: ["personne ne nous prévenait"] }, { titre: "Devis", citations: ["Devis jamais reçu malgré deux relances"] }],
        reponses: e.sansReponse.map(a => ({ avisId: a.id, texte: `Bonjour, merci pour votre avis. (réponse simulée à « ${(a.texte ?? "").slice(0, 40)} »)` })),
        recommandations: ["Prévenir chaque client dès qu'un délai glisse.", "Répondre à chaque avis sous 48 heures.", "Demander un avis à la fin de chaque pose."],
      };
    },
  };
}
```

- [ ] **Step 4: Create `lib/avis/config.ts`**

```ts
/**
 * Choisit les fournisseurs de l'analyse d'avis selon l'environnement.
 * null = non configuré : l'outil s'affiche « momentanément indisponible »
 * (jamais ouvert sans limites, chaque appel coûtant de l'argent).
 */
import Anthropic from "@anthropic-ai/sdk";
import { boiteEnvoi } from "../mail.ts";
import type { Donnees, Ia } from "./types.ts";
import { donneesDataForSEO } from "./dataforseo.ts";
import { iaClaude } from "./analyse.ts";
import { donneesSimulation, iaSimulation } from "./simulation.ts";
import { magasinMemoire, magasinRedis, redisConfigure, type Magasin } from "./limites.ts";

export type ConfigAvis = {
  donnees: Donnees;
  ia: Ia;
  magasin: Magasin;
  secret: string;
  boite: NonNullable<ReturnType<typeof boiteEnvoi>>;
};

// Un seul magasin mémoire par processus en simulation : les compteurs survivent entre deux actions.
const memoire = magasinMemoire();

export function configAvis(): ConfigAvis | null {
  const secret = process.env.LIVRET_SECRET;
  const boite = boiteEnvoi();
  if (!secret || secret.length < 32 || !boite) return null;

  if (process.env.AVIS_SIMULATION === "1" && process.env.NODE_ENV !== "production") {
    return { donnees: donneesSimulation(), ia: iaSimulation(), magasin: memoire, secret, boite };
  }

  const login = process.env.DATAFORSEO_LOGIN;
  const motDePasse = process.env.DATAFORSEO_PASSWORD;
  const cle = process.env.ANTHROPIC_API_KEY;
  if (!login || !motDePasse || !cle || !redisConfigure()) return null;
  return {
    donnees: donneesDataForSEO(login, motDePasse),
    ia: iaClaude(new Anthropic({ apiKey: cle })),
    magasin: magasinRedis(),
    secret,
    boite,
  };
}
```

If `lib/mail.ts` cannot be imported with a `.ts` extension by Next (it is imported as `@/lib/mail` elsewhere), keep `../mail.ts`: the welcome-book `lib/livret/livret.ts` already imports `./contenu.ts` the same way and `tsconfig.json` has `allowImportingTsExtensions`.

- [ ] **Step 5: Run tests and types**

Run: `npm test` then `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/avis/simulation.ts lib/avis/config.ts tests/avis/simulation.test.ts
git commit -m "feat(avis): simulation locale et choix des fournisseurs selon l'environnement"
```

---

### Task 7: Server Actions

**Files:**
- Create: `app/[locale]/ressources/repondre-avis-google/actions.ts`
- Modify: `lib/ressources.ts` (add `AVIS_PATH`)

**Interfaces:**
- Consumes: `configAvis` (`@/lib/avis/config`), `autoriser`, `rendre`, `LIMITES`, `JOUR_S` (`@/lib/avis/limites`), `choisirConcurrents`, `construireRapport`, `avisSansReponse`, `ficheValide`, `AVIS_MAX` (`@/lib/avis/calculs`), `Fiche`, `Rapport` (`@/lib/avis/types`), `creerCode`, `jetonCode`, `verifierCode`, `jetonAcces`, `verifierAcces` (`@/lib/livret/jeton`), `EMAIL_RE`, `clean` (`@/lib/mail`).
- Produces (all async, called directly from the client component with plain arguments):
  - `rechercherFiches(nom: string, ville: string): Promise<ResultatRecherche>` with `ResultatRecherche = { etat: "ok"; fiches: Fiche[] } | { etat: "limite" } | { etat: "indisponible" } | { etat: "erreur" }`
  - `comparerFiche(fiche: Fiche, ville: string): Promise<ResultatComparaison>` with `{ etat: "ok"; concurrents: Fiche[] } | { etat: "limite" } | { etat: "indisponible" } | { etat: "erreur" }`
  - `demanderCodeAvis(email: string, consent: boolean, entreprise: string): Promise<ResultatCode>` with `{ etat: "code"; email: string; jeton: string } | { etat: "erreur"; champ: "email" | "consent" | "envoi" } | { etat: "indisponible" }`
  - `validerCodeAvis(jeton: string, code: string): Promise<ResultatValidation>` with `{ etat: "ouvert"; email: string; acces: string } | { etat: "erreur"; message: string } | { etat: "indisponible" }`
  - `lancerAudit(acces: string, fiche: Fiche, concurrents: Fiche[]): Promise<ResultatLancement>` with `{ etat: "lance"; auditId: string } | { etat: "acces" } | { etat: "limite" } | { etat: "erreur" } | { etat: "indisponible" }`
  - `suivreAudit(acces: string, auditId: string): Promise<ResultatSuivi>` with `{ etat: "encours" } | { etat: "pret"; rapport: Rapport } | { etat: "erreur"; message: string } | { etat: "indisponible" }`
  - `envoyerRapportPdf(formData: FormData): Promise<{ ok: boolean }>` (fields `acces`, `pdf`)

- [ ] **Step 1: Add the path constant to `lib/ressources.ts`**

After `export const LIVRET_PATH = ...;` add:

```ts
/** Ressource « Répondre à un avis Google » et son outil d'analyse (français uniquement). */
export const AVIS_PATH = "/fr/ressources/repondre-avis-google";
```

- [ ] **Step 2: Read the Next docs on Server Actions and `headers()`**

Read `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/headers.md` (it is async: `await headers()`) and the Server Actions guide under `node_modules/next/dist/docs/01-app/` (search for `use server`). Server Actions may take plain serializable arguments.

- [ ] **Step 3: Create `app/[locale]/ressources/repondre-avis-google/actions.ts`**

```ts
"use server";

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
 * avis:rapport:<placeId> (cache 24 h), avis:verrou:*, avis:rendu:*, avis:contact:*.
 */

const TACHE_MAX_MS = 3 * 60 * 1000;
const PDF_MAX = 4 * 1024 * 1024;
const OUTIL_URL = `https://www.timevo.io${AVIS_PATH}`;

type Indispo = { etat: "indisponible" };
export type ResultatRecherche = { etat: "ok"; fiches: Fiche[] } | { etat: "limite" } | Indispo | { etat: "erreur" };
export type ResultatComparaison = { etat: "ok"; concurrents: Fiche[] } | { etat: "limite" } | Indispo | { etat: "erreur" };
export type ResultatCode = { etat: "code"; email: string; jeton: string } | { etat: "erreur"; champ: "email" | "consent" | "envoi" } | Indispo;
export type ResultatValidation = { etat: "ouvert"; email: string; acces: string } | { etat: "erreur"; message: string } | Indispo;
export type ResultatLancement = { etat: "lance"; auditId: string } | { etat: "acces" } | { etat: "limite" } | { etat: "erreur" } | Indispo;
export type ResultatSuivi = { etat: "encours" } | { etat: "pret"; rapport: Rapport } | { etat: "erreur"; message: string } | Indispo;

type Audit = { email: string; fiche: Fiche; concurrents: Fiche[]; tacheId: string | null; debut: number };

async function ipVisiteur(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "inconnue";
}

const ligne = (s: unknown, max: number) => clean(typeof s === "string" ? s : "", max);
const journal = (quoi: string, err: unknown) => console.error(`[avis] ${quoi} :`, err instanceof Error ? err.message : err);

export async function rechercherFiches(nom: string, ville: string): Promise<ResultatRecherche> {
  const c = configAvis();
  if (!c) return { etat: "indisponible" };
  const n = ligne(nom, 120), v = ligne(ville, 80);
  if (n.length < 2 || v.length < 2) return { etat: "erreur" };
  if (!(await autoriser(c.magasin, `avis:ip:${await ipVisiteur()}`, LIMITES.recherchesParIp))) return { etat: "limite" };
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
  if (!f || !v) return { etat: "erreur" };
  if (!f.categorie) return { etat: "ok", concurrents: [] };
  if (!(await autoriser(c.magasin, `avis:ip:${await ipVisiteur()}`, LIMITES.recherchesParIp))) return { etat: "limite" };
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
  return { etat: "code", email: e, jeton: jetonCode({ email: e, entreprise: ligne(entreprise, 200) }, code, c.secret) };
}

export async function validerCodeAvis(jeton: string, code: string): Promise<ResultatValidation> {
  const c = configAvis();
  if (!c) return { etat: "indisponible" };
  const infos = verifierCode(ligne(jeton, 3000), ligne(code, 12).replace(/\s/g, ""), c.secret);
  if (!infos) return { etat: "erreur", message: "Ce code ne correspond pas, ou il a expiré. Vérifiez-le ou demandez-en un nouveau." };
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
  const enCache = await c.magasin.lire<Rapport>(`avis:rapport:${f.placeId}`);
  if (enCache) {
    await c.magasin.ecrire(`avis:audit:${auditId}`, { email, fiche: f, concurrents: autres, tacheId: null, debut: Date.now() } satisfies Audit, JOUR_S);
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
    await c.magasin.ecrire(`avis:audit:${auditId}`, { email, fiche: f, concurrents: autres, tacheId, debut: Date.now() } satisfies Audit, JOUR_S);
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
    await prevenirTimevo(c, id, email, fait);
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
  const avis = tache.avis.slice(0, AVIS_MAX);
  const analyse = avis.length
    ? await c.ia.analyser({ entreprise: a.fiche.nom, categorie: a.fiche.categorie, avis, sansReponse: avisSansReponse(avis) })
    : null;
  const rapport = construireRapport({ fiche: a.fiche, concurrents: a.concurrents, avis, total: tache.total, analyse });
  await c.magasin.ecrire(`avis:resultat:${id}`, rapport, JOUR_S);
  await c.magasin.ecrire(`avis:rapport:${a.fiche.placeId}`, rapport, JOUR_S);
  await prevenirTimevo(c, id, email, rapport);
  return { etat: "pret", rapport };
}

/** Envoie le PDF du rapport à l'adresse vérifiée du jeton d'accès, et à elle seule. */
export async function envoyerRapportPdf(formData: FormData): Promise<{ ok: boolean }> {
  const c = configAvis();
  if (!c) return { ok: false };
  const email = verifierAcces(clean(formData.get("acces"), 3000), c.secret);
  const fichier = formData.get("pdf");
  if (!email || !(fichier instanceof File) || fichier.size === 0 || fichier.size > PDF_MAX) return { ok: false };
  const contenu = Buffer.from(await fichier.arrayBuffer());
  if (contenu.subarray(0, 5).toString("latin1") !== "%PDF-") return { ok: false };
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
```

- [ ] **Step 4: Types and existing tests**

Run: `npx tsc --noEmit` then `npm test`
Expected: no type errors, all tests pass. (The actions are exercised end to end in Task 10.)

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/ressources/repondre-avis-google/actions.ts" lib/ressources.ts
git commit -m "feat(avis): actions serveur (recherche, aperçu, code, analyse en deux temps, PDF)"
```

---

### Task 8: Report on screen and as PDF

**Files:**
- Create: `components/avis/Rapport.tsx`
- Create: `components/avis/RapportPdf.tsx`

**Interfaces:**
- Consumes: `Rapport`, `Fiche` (`@/lib/avis/types`); `CONTACT_HREF` (`@/lib/contact`); `pourPdf` (`@/lib/livret/livret`).
- Produces: `default function Rapport({ rapport }: { rapport: Rapport })`; `export function Comparaison({ fiche, concurrents }: { fiche: Fiche; concurrents: Fiche[] })` (also used by the teaser in Task 9); `genererPdfRapport(r: Rapport): Promise<Blob>`; `nomFichierRapport(r: Rapport): string`.

- [ ] **Step 1: Create `components/avis/Rapport.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Fiche, Rapport as RapportType } from "@/lib/avis/types";
import { CONTACT_HREF } from "@/lib/contact";

const carte = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 24 } as const;
const h3 = { fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 14px", color: "var(--text)" } as const;
const petit = { fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)" } as const;
const virgule = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

/** Note sur 5 et nombre d'avis, en barres à l'échelle de la note. */
export function Comparaison({ fiche, concurrents }: { fiche: Fiche; concurrents: Fiche[] }) {
  const lignes = [{ f: fiche, moi: true }, ...concurrents.map(f => ({ f, moi: false }))];
  return (
    <div role="img" aria-label={`Note Google de ${fiche.nom} comparée à ${concurrents.length} concurrents`} style={{ display: "grid", gap: 12 }}>
      {lignes.map(({ f, moi }) => (
        <div key={f.placeId} data-comparaison-ligne style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr) auto", gap: 12, alignItems: "center", fontFamily: "var(--font-sans)", fontSize: 14 }}>
          <span style={{ color: moi ? "var(--text)" : "var(--dim)", fontWeight: moi ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{moi ? `${f.nom} (vous)` : f.nom}</span>
          <span style={{ height: 10, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
            <span style={{ display: "block", height: "100%", width: `${((f.note ?? 0) / 5) * 100}%`, borderRadius: 999, background: moi ? "var(--accent)" : "var(--dim)" }} />
          </span>
          <span style={{ color: moi ? "var(--text)" : "var(--dim)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {f.note === null ? "sans note" : `${virgule(f.note)} / 5`} · {f.nbAvis} avis
          </span>
        </div>
      ))}
    </div>
  );
}

function Copier({ texte }: { texte: string }) {
  const [fait, setFait] = useState(false);
  return (
    <button type="button" onClick={() => navigator.clipboard.writeText(texte).then(() => setFait(true), () => setFait(false))}
      style={{ background: "none", border: "1px solid var(--border-strong)", borderRadius: 999, padding: "5px 12px", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: 13, cursor: "pointer" }}>
      {fait ? "Copié" : "Copier"}
    </button>
  );
}

export default function Rapport({ rapport: r }: { rapport: RapportType }) {
  const a = r.analyse;
  const reponses = new Map(a?.reponses.map(x => [x.avisId, x.texte]) ?? []);
  const chiffres = [
    { l: "Note Google", v: r.fiche.note === null ? "sans note" : `${virgule(r.fiche.note)} / 5` },
    { l: "Avis analysés", v: `${r.nbAvisAnalyses}${r.tronque ? " (les plus récents)" : ""}` },
    { l: "Taux de réponse", v: r.tauxReponse === null ? "sans objet" : `${r.tauxReponse} %` },
    { l: "Délai moyen de réponse", v: r.delaiMoyenJours === null ? "sans objet" : `${virgule(r.delaiMoyenJours)} j` },
  ];
  return (
    <div data-rapport style={{ display: "grid", gap: 16 }}>
      <div style={carte}>
        <div style={{ ...petit, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Analyse de vos avis Google</div>
        <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(26px, 3.4vw, 36px)", fontWeight: 500, letterSpacing: "-0.03em", margin: "0 0 6px", color: "var(--text)" }}>{r.fiche.nom}</h2>
        <p style={{ ...petit, margin: "0 0 20px" }}>{r.fiche.adresse}</p>
        <div className="avis-chiffres" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
          {chiffres.map(c => (
            <div key={c.l} style={{ background: "var(--card-soft)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={petit}>{c.l}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500, color: "var(--text)", marginTop: 4 }}>{c.v}</div>
            </div>
          ))}
        </div>
      </div>

      {r.concurrents.length > 0 && (
        <div style={carte}><h3 style={h3}>Face à vos concurrents</h3><Comparaison fiche={r.fiche} concurrents={r.concurrents} /></div>
      )}

      {r.nbAvisAnalyses === 0 ? (
        <div style={carte}>
          <h3 style={h3}>Pas encore d&apos;avis à analyser</h3>
          <p style={{ ...petit, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Votre fiche n&apos;a pas encore d&apos;avis. Demandez-en un à chaque client satisfait, au moment où il vous remercie : un lien direct vers votre fiche, envoyé par SMS ou par email, suffit. Répondez ensuite à chacun, même brièvement.
          </p>
        </div>
      ) : (
        <>
          <div style={carte}>
            <h3 style={h3}>Votre note sur les quatre derniers trimestres</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
              {r.trimestres.map(t => (
                <div key={t.libelle} style={{ textAlign: "center", background: "var(--card-soft)", borderRadius: 12, padding: "10px 4px" }}>
                  <div style={petit}>{t.libelle}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, color: "var(--text)" }}>{t.note === null ? "–" : virgule(t.note)}</div>
                  <div style={{ ...petit, fontSize: 12 }}>{t.nb} avis</div>
                </div>
              ))}
            </div>
          </div>

          {a ? (
            <div className="avis-themes" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
              {[{ titre: "Ce que vos clients apprécient", themes: a.pointsForts }, { titre: "Ce qu'ils vous reprochent", themes: a.reproches }].map(bloc => (
                <div key={bloc.titre} style={carte}>
                  <h3 style={h3}>{bloc.titre}</h3>
                  {bloc.themes.length === 0 ? <p style={petit}>Rien de récurrent.</p> : bloc.themes.map(t => (
                    <div key={t.titre} style={{ marginBottom: 14 }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{t.titre}</div>
                      {t.citations.map(c => <p key={c} style={{ ...petit, fontStyle: "italic", margin: "4px 0 0" }}>« {c} »</p>)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div style={carte}><p style={{ ...petit, margin: 0 }}>L&apos;analyse détaillée n&apos;a pas pu être produite cette fois. Les chiffres ci-dessus restent exacts.</p></div>
          )}

          {r.sansReponse.length > 0 && (
            <div style={carte}>
              <h3 style={h3}>Vos avis sans réponse, avec une réponse prête</h3>
              <div style={{ display: "grid", gap: 14 }}>
                {r.sansReponse.map(av => (
                  <div key={av.id} data-avis-sans-reponse style={{ background: "var(--card-soft)", borderRadius: 14, padding: 16 }}>
                    <div style={{ ...petit, marginBottom: 6 }}>{av.note} / 5{av.date ? ` · ${new Date(av.date).toLocaleDateString("fr-FR")}` : ""}</div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--dim)", fontStyle: "italic", margin: "0 0 10px" }}>{av.texte ? `« ${av.texte} »` : "(note sans commentaire)"}</p>
                    {reponses.get(av.id) && (
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--text)", margin: 0, flex: "1 1 260px" }}>{reponses.get(av.id)}</p>
                        <Copier texte={reponses.get(av.id)!} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {a && a.recommandations.length > 0 && (
            <div style={carte}>
              <h3 style={h3}>Trois choses à faire</h3>
              <ol style={{ margin: 0, paddingLeft: 20, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--text)" }}>
                {a.recommandations.map(x => <li key={x} style={{ marginBottom: 8 }}>{x}</li>)}
              </ol>
            </div>
          )}
        </>
      )}

      <div data-rapport-offre style={{ ...carte, background: "var(--card-soft)" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.55, color: "var(--text)", margin: "0 0 14px" }}>
          Chez nos clients, un agent IA rédige chaque jour la réponse à chaque nouvel avis ; vous la validez en un clic. On en parle en 30 minutes ?
        </p>
        <a href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--accent-soft)" }}>Réserver un diagnostic gratuit</a>
      </div>
    </div>
  );
}
```

Add to `app/globals.css`, inside the existing `@media (max-width: 900px)` block (next to `.livret-gen`):

```css
  .avis-themes {
    grid-template-columns: minmax(0, 1fr) !important;
  }
```

and inside the existing `@media (max-width: 600px)` block:

```css
  .avis-chiffres {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
```

- [ ] **Step 2: Create `components/avis/RapportPdf.tsx`**

```tsx
/**
 * Rapport d'analyse d'avis en PDF, généré dans le navigateur (import dynamique).
 * Même habillage que le livret : titres Fraunces, texte Helvetica, textes passés par pourPdf.
 */
import { Document, Page, View, Text, Font, StyleSheet, pdf } from "@react-pdf/renderer";
import { pourPdf } from "@/lib/livret/livret";
import type { Rapport } from "@/lib/avis/types";

Font.register({ family: "Fraunces", src: "/fonts/fraunces/fraunces-latin-600-normal.woff", fontWeight: 600 });
Font.registerHyphenationCallback(mot => [mot]);

const INK = "#1F2A2E", DIM = "#66707A", LINE = "#E3E7E5", ACCENT = "#1f5bc7", TEINTE = "#eef3fc";
const s = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 70, paddingHorizontal: 52, fontFamily: "Helvetica", fontSize: 10.5, color: INK, lineHeight: 1.5 },
  sur: { fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.4, textTransform: "uppercase", color: ACCENT, marginBottom: 6 },
  titre: { fontFamily: "Fraunces", fontWeight: 600, fontSize: 30, lineHeight: 1.1, marginBottom: 4 },
  dim: { color: DIM, fontSize: 10 },
  h2: { fontFamily: "Fraunces", fontWeight: 600, fontSize: 17, marginTop: 22, marginBottom: 10, paddingBottom: 6, borderBottomWidth: 0.6, borderBottomColor: LINE },
  chiffres: { flexDirection: "row", marginTop: 18 },
  chiffre: { flex: 1, backgroundColor: TEINTE, borderRadius: 6, padding: 10, marginRight: 8 },
  chiffreL: { fontSize: 8, color: DIM, textTransform: "uppercase", letterSpacing: 0.8 },
  chiffreV: { fontSize: 14, fontFamily: "Helvetica-Bold", marginTop: 3 },
  ligne: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  barre: { height: 7, backgroundColor: LINE, borderRadius: 4, flex: 1, marginHorizontal: 10 },
  theme: { marginBottom: 8 },
  themeT: { fontFamily: "Helvetica-Bold", fontSize: 10.5 },
  citation: { fontFamily: "Helvetica-Oblique", color: DIM, fontSize: 9.5 },
  avis: { backgroundColor: TEINTE, borderRadius: 6, padding: 10, marginBottom: 8 },
  pied: { position: "absolute", bottom: 30, left: 52, right: 52, paddingTop: 8, borderTopWidth: 0.6, borderTopColor: LINE, fontSize: 8, color: DIM },
});

const v = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
const t = (x: string) => pourPdf(x);

function Document_({ r }: { r: Rapport }) {
  const rep = new Map(r.analyse?.reponses.map(x => [x.avisId, x.texte]) ?? []);
  const lignes = [{ f: r.fiche, moi: true }, ...r.concurrents.map(f => ({ f, moi: false }))];
  return (
    <Document creator="Timevo" producer="Timevo" title={t(`Analyse des avis Google · ${r.fiche.nom}`)}>
      <Page size="A4" style={s.page}>
        <Text style={s.sur}>Analyse de vos avis Google</Text>
        <Text style={s.titre}>{t(r.fiche.nom)}</Text>
        <Text style={s.dim}>{t(r.fiche.adresse)} · {new Date(r.genereLe).toLocaleDateString("fr-FR")}</Text>
        <View style={s.chiffres}>
          {[
            ["Note", r.fiche.note === null ? "-" : `${v(r.fiche.note)} / 5`],
            ["Avis analysés", String(r.nbAvisAnalyses)],
            ["Taux de réponse", r.tauxReponse === null ? "-" : `${r.tauxReponse} %`],
            ["Délai de réponse", r.delaiMoyenJours === null ? "-" : `${v(r.delaiMoyenJours)} j`],
          ].map(([l, x]) => (
            <View key={l} style={s.chiffre}><Text style={s.chiffreL}>{t(l)}</Text><Text style={s.chiffreV}>{t(x)}</Text></View>
          ))}
        </View>
        {r.tronque ? <Text style={[s.dim, { marginTop: 6 }]}>Analyse des {r.nbAvisAnalyses} avis les plus récents.</Text> : null}

        {r.concurrents.length > 0 && (
          <View wrap={false}>
            <Text style={s.h2}>Face à vos concurrents</Text>
            {lignes.map(({ f, moi }) => (
              <View key={f.placeId} style={s.ligne}>
                <Text style={{ width: 150, fontFamily: moi ? "Helvetica-Bold" : "Helvetica", fontSize: 9.5 }}>{t(moi ? `${f.nom} (vous)` : f.nom)}</Text>
                <View style={s.barre}><View style={{ width: `${((f.note ?? 0) / 5) * 100}%`, height: 7, borderRadius: 4, backgroundColor: moi ? ACCENT : DIM }} /></View>
                <Text style={{ width: 90, fontSize: 9.5, textAlign: "right" }}>{f.note === null ? "-" : `${v(f.note)} / 5`} · {f.nbAvis}</Text>
              </View>
            ))}
          </View>
        )}

        {r.analyse && (
          <View>
            <Text style={s.h2} minPresenceAhead={60}>Ce que vos clients apprécient</Text>
            {r.analyse.pointsForts.map(th => (
              <View key={th.titre} style={s.theme} wrap={false}>
                <Text style={s.themeT}>{t(th.titre)}</Text>
                {th.citations.map(c => <Text key={c} style={s.citation}>« {t(c)} »</Text>)}
              </View>
            ))}
            <Text style={s.h2} minPresenceAhead={60}>Ce qu&apos;ils vous reprochent</Text>
            {r.analyse.reproches.map(th => (
              <View key={th.titre} style={s.theme} wrap={false}>
                <Text style={s.themeT}>{t(th.titre)}</Text>
                {th.citations.map(c => <Text key={c} style={s.citation}>« {t(c)} »</Text>)}
              </View>
            ))}
          </View>
        )}

        {r.sansReponse.length > 0 && (
          <View>
            <Text style={s.h2} minPresenceAhead={80}>Vos avis sans réponse, avec une réponse prête</Text>
            {r.sansReponse.map(a => (
              <View key={a.id} style={s.avis} wrap={false}>
                <Text style={s.dim}>{a.note} / 5{a.date ? ` · ${new Date(a.date).toLocaleDateString("fr-FR")}` : ""}</Text>
                <Text style={s.citation}>{a.texte ? `« ${t(a.texte)} »` : "(note sans commentaire)"}</Text>
                {rep.get(a.id) ? <Text style={{ marginTop: 4 }}>{t(rep.get(a.id)!)}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {r.analyse && r.analyse.recommandations.length > 0 && (
          <View wrap={false}>
            <Text style={s.h2}>Trois choses à faire</Text>
            {r.analyse.recommandations.map((x, i) => <Text key={x} style={{ marginBottom: 5 }}>{i + 1}. {t(x)}</Text>)}
          </View>
        )}

        <View wrap={false} style={{ marginTop: 18, padding: 12, backgroundColor: TEINTE, borderRadius: 6 }}>
          <Text>Chez nos clients, un agent IA rédige chaque jour la réponse à chaque nouvel avis ; vous la validez en un clic.</Text>
          <Text style={{ marginTop: 4, fontFamily: "Helvetica-Bold" }}>Diagnostic gratuit de 30 minutes : timevo.io</Text>
        </View>
        <Text style={s.pied} fixed>Analyse réalisée par Timevo · timevo.io</Text>
      </Page>
    </Document>
  );
}

export function nomFichierRapport(r: Rapport): string {
  const base = r.fiche.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  return `analyse-avis-google${base ? `-${base}` : ""}.pdf`;
}

export async function genererPdfRapport(r: Rapport): Promise<Blob> {
  return pdf(<Document_ r={r} />).toBlob();
}
```

- [ ] **Step 3: Types and lint**

Run: `npx tsc --noEmit` and `npx eslint components/avis`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/avis/Rapport.tsx components/avis/RapportPdf.tsx app/globals.css
git commit -m "feat(avis): rapport d'analyse à l'écran et en PDF"
```

---

### Task 9: Client flow component

**Files:**
- Create: `components/avis/AuditAvis.tsx`

**Interfaces:**
- Consumes: all actions from Task 7 (`@/app/[locale]/ressources/repondre-avis-google/actions`); `Rapport` default export and `Comparaison` from `./Rapport`; `genererPdfRapport`, `nomFichierRapport` from `./RapportPdf` (dynamic import); `Fiche`, `Rapport` types.
- Produces: `default function AuditAvis()`. DOM hooks used by the end-to-end script: `[data-avis-recherche]` form with inputs `name="nom"`, `name="ville"`; buttons `[data-fiche]` (one per result); `[data-apercu-avis]` teaser with `[data-comparaison-ligne]` rows and button `[data-action="analyser"]`; `[data-avis-acces]` with inputs `name="email"`, `name="consent"`, and after sending, `name="code"`; `[data-avis-progression]`; `[data-rapport]`; `[data-avis-envoi]` with attribute `data-etat` = `encours` | `ok` | `echec`.

- [ ] **Step 1: Create `components/avis/AuditAvis.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  rechercherFiches, comparerFiche, demanderCodeAvis, validerCodeAvis, lancerAudit, suivreAudit, envoyerRapportPdf,
} from "@/app/[locale]/ressources/repondre-avis-google/actions";
import type { Fiche, Rapport as RapportType } from "@/lib/avis/types";
import RapportVue, { Comparaison } from "./Rapport";
import { Arrow } from "../primitives";

const CLE_ACCES = "timevo-avis-acces-v1";
type Acces = { email: string; acces: string };
type Etape = "recherche" | "choix" | "apercu" | "email" | "code" | "analyse" | "rapport";

const label = { display: "block", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8 } as const;
const input = {
  width: "100%", boxSizing: "border-box", padding: "12px 14px", background: "var(--bg)", color: "var(--text)",
  border: "1px solid var(--border-strong)", borderRadius: 12, fontFamily: "var(--font-sans)", fontSize: 15,
} as const;
const bouton = {
  alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 24px", borderRadius: 999,
  border: "none", cursor: "pointer", background: "var(--accent-gradient)", color: "#fff",
  fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600,
} as const;
const lien = { background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--accent-soft)" } as const;
const erreurStyle = { fontFamily: "var(--font-sans)", fontSize: 14, color: "#ff8a8a", margin: 0 } as const;
const cadre = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: 28 } as const;

const MESSAGES = {
  indisponible: "L'analyse est momentanément indisponible. Réessayez plus tard.",
  limite: "Vous avez atteint la limite d'analyses pour aujourd'hui. Réessayez demain, ou parlons-en lors d'un diagnostic gratuit.",
  erreur: "Une erreur est survenue. Réessayez dans un instant.",
};

function lireAcces(): Acces | null {
  try {
    const a = JSON.parse(window.localStorage.getItem(CLE_ACCES) ?? "null");
    return a && typeof a.email === "string" && typeof a.acces === "string" ? a : null;
  } catch { return null; }
}
function ecrireAcces(a: Acces | null) {
  try { if (a) window.localStorage.setItem(CLE_ACCES, JSON.stringify(a)); else window.localStorage.removeItem(CLE_ACCES); } catch { /* accès redemandé */ }
}

export default function AuditAvis() {
  const [etape, setEtape] = useState<Etape>("recherche");
  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("");
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [concurrents, setConcurrents] = useState<Fiche[]>([]);
  const [acces, setAcces] = useState<Acces | null>(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [jeton, setJeton] = useState("");
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [debut, setDebut] = useState(0);
  const [secondes, setSecondes] = useState(0);
  const [rapport, setRapport] = useState<RapportType | null>(null);
  const [envoi, setEnvoi] = useState<"aucun" | "encours" | "ok" | "echec">("aucun");
  const pdf = useRef<Blob | null>(null);
  const haut = useRef<HTMLDivElement>(null);

  useEffect(() => { setAcces(lireAcces()); }, []);

  async function rechercher(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    if (nom.trim().length < 2 || ville.trim().length < 2) { setErreur("Indiquez le nom de votre entreprise et sa ville."); return; }
    setOccupe(true);
    const r = await rechercherFiches(nom, ville).catch(() => ({ etat: "erreur" as const }));
    setOccupe(false);
    if (r.etat !== "ok") { setErreur(MESSAGES[r.etat]); return; }
    if (!r.fiches.length) { setErreur("Aucune fiche trouvée. Vérifiez le nom exact de votre entreprise sur Google et la ville."); return; }
    setFiches(r.fiches);
    setEtape("choix");
  }

  async function choisir(f: Fiche) {
    setErreur("");
    setOccupe(true);
    const r = await comparerFiche(f, ville).catch(() => ({ etat: "erreur" as const }));
    setOccupe(false);
    if (r.etat !== "ok") { setErreur(MESSAGES[r.etat]); return; }
    setFiche(f);
    setConcurrents(r.concurrents);
    setEtape("apercu");
  }

  async function lancer(a: Acces) {
    if (!fiche) return;
    setErreur("");
    setOccupe(true);
    const r = await lancerAudit(a.acces, fiche, concurrents).catch(() => ({ etat: "erreur" as const }));
    setOccupe(false);
    if (r.etat === "acces") { ecrireAcces(null); setAcces(null); setEtape("email"); return; }
    if (r.etat !== "lance") { setErreur(MESSAGES[r.etat]); return; }
    setDebut(Date.now());
    setEtape("analyse");
    haut.current?.scrollIntoView({ block: "start" });
    suivre(a, r.auditId);
  }

  function suivre(a: Acces, auditId: string) {
    const tour = async () => {
      const r = await suivreAudit(a.acces, auditId).catch(() => ({ etat: "encours" as const }));
      if (r.etat === "encours") { setTimeout(tour, 5000); return; }
      if (r.etat === "pret") { setRapport(r.rapport); setEtape("rapport"); envoyer(a, r.rapport); return; }
      setErreur(r.etat === "indisponible" ? MESSAGES.indisponible : r.message);
      setEtape("apercu");
    };
    setTimeout(tour, 3000);
  }

  async function envoyer(a: Acces, r: RapportType) {
    setEnvoi("encours");
    try {
      const { genererPdfRapport, nomFichierRapport } = await import("./RapportPdf");
      const blob = await genererPdfRapport(r);
      pdf.current = blob;
      const fd = new FormData();
      fd.append("acces", a.acces);
      fd.append("pdf", new File([blob], nomFichierRapport(r), { type: "application/pdf" }));
      const res = await envoyerRapportPdf(fd);
      setEnvoi(res.ok ? "ok" : "echec");
    } catch (err) {
      console.error("[avis] PDF :", err);
      setEnvoi("echec");
    }
  }

  async function telecharger() {
    if (!rapport) return;
    const { genererPdfRapport, nomFichierRapport } = await import("./RapportPdf");
    const blob = pdf.current ?? (await genererPdfRapport(rapport));
    const url = URL.createObjectURL(blob);
    const lienDl = document.createElement("a");
    lienDl.href = url; lienDl.download = nomFichierRapport(rapport);
    document.body.appendChild(lienDl); lienDl.click(); lienDl.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  async function demanderCode(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setOccupe(true);
    const r = await demanderCodeAvis(email, consent, fiche?.nom ?? "").catch(() => ({ etat: "erreur" as const, champ: "envoi" as const }));
    setOccupe(false);
    if (r.etat === "indisponible") { setErreur(MESSAGES.indisponible); return; }
    if (r.etat === "erreur") {
      setErreur(r.champ === "email" ? "Indiquez une adresse email valide." : r.champ === "consent" ? "Cochez la case pour recevoir votre analyse." : "Le code n'a pas pu être envoyé. Vérifiez votre adresse, ou réessayez dans un instant.");
      return;
    }
    setJeton(r.jeton);
    setCode("");
    setEtape("code");
  }

  async function validerCode(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setOccupe(true);
    const r = await validerCodeAvis(jeton, code).catch(() => ({ etat: "erreur" as const, message: MESSAGES.erreur }));
    setOccupe(false);
    if (r.etat === "indisponible") { setErreur(MESSAGES.indisponible); return; }
    if (r.etat === "erreur") { setErreur(r.message); return; }
    const a = { email: r.email, acces: r.acces };
    ecrireAcces(a);
    setAcces(a);
    await lancer(a);
  }

  useEffect(() => {
    if (etape !== "analyse") return;
    const t = setInterval(() => setSecondes(Math.round((Date.now() - debut) / 1000)), 1000);
    return () => clearInterval(t);
  }, [etape, debut]);

  const recommencer = () => { setEtape("recherche"); setFiche(null); setFiches([]); setRapport(null); setErreur(""); setEnvoi("aucun"); pdf.current = null; };
  const erreurBloc = erreur ? <p role="alert" style={erreurStyle}>{erreur}</p> : null;

  return (
    <div ref={haut} className="rr-block" style={{ display: "grid", gap: 16 }}>
      {etape === "recherche" && (
        <form data-avis-recherche onSubmit={rechercher} noValidate style={{ ...cadre, display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="livret-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16 }}>
            <div>
              <label htmlFor="avis-nom" style={label}>Nom de votre entreprise</label>
              <input id="avis-nom" name="nom" value={nom} onChange={e => setNom(e.target.value)} placeholder="Atelier Cuisines" maxLength={120} autoComplete="organization" style={input} />
            </div>
            <div>
              <label htmlFor="avis-ville" style={label}>Ville</label>
              <input id="avis-ville" name="ville" value={ville} onChange={e => setVille(e.target.value)} placeholder="Annecy" maxLength={80} autoComplete="address-level2" style={input} />
            </div>
          </div>
          {erreurBloc}
          <button type="submit" disabled={occupe} style={{ ...bouton, opacity: occupe ? 0.7 : 1 }}>
            {occupe ? "Recherche…" : "Trouver ma fiche Google"} {!occupe && <Arrow color="#fff" size={14} />}
          </button>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)", margin: 0 }}>Gratuit. L&apos;aperçu s&apos;affiche sans inscription.</p>
        </form>
      )}

      {etape === "choix" && (
        <div style={{ ...cadre, display: "grid", gap: 12 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, margin: 0, color: "var(--text)" }}>Quelle est votre fiche ?</h2>
          {fiches.map(f => (
            <button key={f.placeId} type="button" data-fiche onClick={() => choisir(f)} disabled={occupe} className="hover-card" style={{
              textAlign: "left", padding: "14px 18px", borderRadius: 14, border: "1px solid var(--border-strong)", background: "var(--card-soft)", color: "var(--text)", cursor: "pointer", fontFamily: "var(--font-sans)",
            }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 600 }}>{f.nom}</span>
              <span style={{ display: "block", fontSize: 13, color: "var(--dim)" }}>{f.adresse}{f.categorie ? ` · ${f.categorie}` : ""}</span>
            </button>
          ))}
          {erreurBloc}
          <button type="button" onClick={recommencer} style={lien}>Ce n&apos;est aucune de celles-ci</button>
        </div>
      )}

      {etape === "apercu" && fiche && (
        <div data-apercu-avis style={{ ...cadre, display: "grid", gap: 18 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, margin: 0, color: "var(--text)" }}>
            {concurrents.length ? "Votre note face à vos concurrents" : "Votre note Google"}
          </h2>
          <Comparaison fiche={fiche} concurrents={concurrents} />
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>
            L&apos;analyse complète lit tous vos avis : ce que vos clients apprécient et vous reprochent, votre taux de réponse, et une réponse prête pour chaque avis resté sans réponse. Vous la recevez aussi en PDF.
          </p>
          {erreurBloc}
          <button type="button" data-action="analyser" disabled={occupe} onClick={() => (acces ? lancer(acces) : setEtape("email"))} style={{ ...bouton, opacity: occupe ? 0.7 : 1 }}>
            {occupe ? "Lancement…" : "Obtenir l'analyse complète"} {!occupe && <Arrow color="#fff" size={14} />}
          </button>
          <button type="button" onClick={recommencer} style={lien}>Chercher une autre entreprise</button>
        </div>
      )}

      {(etape === "email" || etape === "code") && (
        <div data-avis-acces style={{ ...cadre, display: "grid", gap: 18, maxWidth: 640 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, margin: 0, color: "var(--text)" }}>
            {etape === "email" ? "Où envoyer votre analyse ?" : "Votre code."}
          </h2>
          {etape === "email" ? (
            <form onSubmit={demanderCode} noValidate style={{ display: "grid", gap: 18 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>Vous y recevrez un code pour lancer l&apos;analyse, puis le rapport en PDF.</p>
              <div>
                <label htmlFor="avis-email" style={label}>Email professionnel</label>
                <input id="avis-email" name="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={input} />
              </div>
              <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                <input name="consent" type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5, color: "var(--dim)" }}>
                  J&apos;accepte que Timevo utilise ces informations pour m&apos;envoyer mon analyse et me recontacter au sujet de mon entreprise. Je peux m&apos;y opposer à tout moment.{" "}
                  <a href="/fr/politique-de-confidentialite" style={{ color: "var(--accent-soft)" }}>Politique de confidentialité</a>.
                </span>
              </label>
              {erreurBloc}
              <button type="submit" disabled={occupe} style={{ ...bouton, opacity: occupe ? 0.7 : 1 }}>{occupe ? "Envoi…" : "Recevoir mon code"} {!occupe && <Arrow color="#fff" size={14} />}</button>
            </form>
          ) : (
            <form onSubmit={validerCode} noValidate style={{ display: "grid", gap: 18 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>
                Nous venons d&apos;envoyer un code à 6 chiffres à <strong style={{ color: "var(--text)" }}>{email}</strong>. Pensez à regarder dans les indésirables.
              </p>
              <div>
                <label htmlFor="avis-code" style={label}>Code reçu par email</label>
                <input id="avis-code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value)} autoFocus style={{ ...input, maxWidth: 220, fontSize: 22, letterSpacing: "0.3em" }} />
              </div>
              {erreurBloc}
              <button type="submit" disabled={occupe} style={{ ...bouton, opacity: occupe ? 0.7 : 1 }}>{occupe ? "Vérification…" : "Lancer l'analyse"} {!occupe && <Arrow color="#fff" size={14} />}</button>
              <button type="button" onClick={() => setEtape("email")} style={lien}>Changer d&apos;adresse ou recevoir un nouveau code</button>
            </form>
          )}
        </div>
      )}

      {etape === "analyse" && (
        <div data-avis-progression role="status" style={{ ...cadre, display: "grid", gap: 12 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, margin: 0, color: "var(--text)" }}>Analyse en cours</h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--dim)", margin: 0 }}>
            {secondes < 20 ? "Récupération de vos avis Google…" : secondes < 60 ? "Lecture de vos avis…" : "Rédaction des réponses et des recommandations…"} Cela prend environ une minute.
          </p>
          <div style={{ height: 6, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(95, (secondes / 90) * 100)}%`, background: "var(--accent-gradient)", transition: "width 1s linear" }} />
          </div>
        </div>
      )}

      {etape === "rapport" && rapport && (
        <>
          <div data-avis-envoi data-etat={envoi} role="status" style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--dim)" }}>
            <span>
              {envoi === "encours" && "Préparation du PDF et envoi par email…"}
              {envoi === "ok" && <>Le rapport vous a été envoyé en PDF à <strong style={{ color: "var(--text)" }}>{acces?.email}</strong>.</>}
              {envoi === "echec" && "L'envoi par email n'a pas abouti : téléchargez le PDF ci-contre."}
            </span>
            <span style={{ display: "flex", gap: 16 }}>
              <button type="button" onClick={telecharger} style={lien}>Télécharger le PDF</button>
              <button type="button" onClick={recommencer} style={lien}>Analyser une autre entreprise</button>
            </span>
          </div>
          <RapportVue rapport={rapport} />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Types and lint**

Run: `npx tsc --noEmit` and `npx eslint components/avis`
Expected: no errors. If React 19 types reject `React.FormEvent` without import, add `import type { FormEvent } from "react";` and use `FormEvent`.

- [ ] **Step 3: Commit**

```bash
git add components/avis/AuditAvis.tsx
git commit -m "feat(avis): parcours visiteur (recherche, aperçu, code, progression, rapport)"
```

---

### Task 10: Page, copy, sitemap, privacy

**Files:**
- Create: `app/[locale]/ressources/repondre-avis-google/page.tsx`
- Modify: `lib/ressources.ts` (add `AVIS`)
- Modify: `app/sitemap.ts`
- Modify: `app/[locale]/politique-de-confidentialite/page.tsx`

**Interfaces:**
- Consumes: `AuditAvis` (Task 9), `AVIS_PATH` (Task 7), `NavDkdp`, `FooterDkdp`, `Breadcrumb`, `StickyMobileCta`, `PillGhost`, `Arrow`, `MonoLabel` (existing).
- Produces: `AVIS` copy object in `lib/ressources.ts`.

- [ ] **Step 1: Add the copy to `lib/ressources.ts`**

```ts
export const AVIS = {
  // Titre ≤ 51 caractères (+ « | Timevo »), description ≤ 155.
  metaTitle: "Répondre à un avis Google : guide et analyse",
  metaDescription:
    "Comment répondre à un avis Google, positif ou négatif, avec exemples. Et une analyse gratuite de vos avis face à vos concurrents, réponses prêtes à copier.",
  eyebrow: "RESSOURCE GRATUITE · AVIS GOOGLE",
  h1: "Répondre à un avis Google.",
  subtitle:
    "Trouvez votre fiche : voyez votre note face à vos concurrents, puis recevez l'analyse complète de vos avis, avec une réponse prête pour chacun de ceux restés sans réponse.",
  guideH2: "Comment répondre à un avis Google.",
  guide: [
    { titre: "Répondre à tous les avis", texte: "Les clients qui hésitent lisent vos réponses autant que les avis. Une fiche où chaque avis a sa réponse montre une entreprise présente. Répondez aussi aux avis positifs, en deux phrases." },
    { titre: "Un avis positif", texte: "Remerciez par le prénom si l'avis le donne, reprenez un détail précis de ce que le client a apprécié, et signez. Exemple : « Merci Sophie pour votre retour. Ravis que le plan de travail en chêne vous plaise autant qu'à nous. Julien, Atelier Cuisines »." },
    { titre: "Un avis négatif", texte: "Répondez vite et à froid. Remerciez, reconnaissez le point précis sans vous justifier longuement, dites ce qui change, et proposez d'en parler directement. Exemple : « Bonjour, merci pour ce retour. Trois semaines de retard sans nouvelles, ce n'est pas le suivi que nous voulons offrir. Nous prévenons désormais chaque client dès qu'un délai glisse. Appelez-moi si un point reste à reprendre. Julien »." },
    { titre: "Ce qu'il faut éviter", texte: "Une réponse copiée-collée identique partout, un ton défensif, des détails sur le client, ou une promesse de geste commercial écrite publiquement. Et laisser un avis négatif sans réponse : c'est la réponse que lisent les prochains clients." },
  ],
  bridgeH2: "Et quand les avis s'accumulent.",
  bridgeText:
    "Chez nos clients, un agent IA lit chaque nouvel avis, rédige la réponse dans le ton de l'entreprise, et la soumet pour validation. Vous gardez la main, sans y passer vos soirées.",
  bridgeCta: "Voir nos agents IA",
};
```

Lengths checked when writing the plan: title 44 characters (+ « | Timevo » = 53), description 155.

- [ ] **Step 2: Create `app/[locale]/ressources/repondre-avis-google/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import Breadcrumb from "@/components/Breadcrumb";
import StickyMobileCta from "@/components/StickyMobileCta";
import AuditAvis from "@/components/avis/AuditAvis";
import { Arrow, MonoLabel, PillGhost } from "@/components/primitives";
import { AVIS, AVIS_PATH } from "@/lib/ressources";

const BASE = "https://www.timevo.io";
const PAGE_URL = `${BASE}${AVIS_PATH}`;
const AGENTS = "/fr/solutions/agents-ia";

// Page française uniquement : /en/... renvoie 404.
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "fr") return {};
  return {
    title: AVIS.metaTitle,
    description: AVIS.metaDescription,
    alternates: { canonical: PAGE_URL },
    openGraph: { title: AVIS.metaTitle, description: AVIS.metaDescription, url: PAGE_URL, siteName: "Timevo", locale: "fr_FR", type: "website" },
    twitter: { card: "summary", title: AVIS.metaTitle, description: AVIS.metaDescription },
  };
}

const h2Style = {
  fontFamily: "var(--font-sans)", fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 500,
  letterSpacing: "-0.04em", lineHeight: 1.0, margin: 0, color: "var(--text)",
} as const;

export default async function RepondreAvisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "fr") notFound();
  setRequestLocale(locale);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${BASE}/fr` },
      { "@type": "ListItem", position: 2, name: "Répondre à un avis Google", item: PAGE_URL },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <NavDkdp />
      <main>
        <Breadcrumb label="Fil d'Ariane" items={[{ href: "/fr", label: "Accueil" }, { label: "Répondre à un avis Google" }]} />
        <section style={{ padding: "48px 28px 80px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-soft)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>{AVIS.eyebrow}</div>
            <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1.0, margin: "0 0 16px", color: "var(--text)" }}>{AVIS.h1}</h1>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.5, color: "var(--dim)", margin: "0 0 36px", maxWidth: 680 }}>{AVIS.subtitle}</p>
            <AuditAvis />
          </div>
        </section>

        <section style={{ padding: "88px 28px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <MonoLabel>Le guide</MonoLabel>
            <h2 style={{ ...h2Style, marginBottom: 40 }}>{AVIS.guideH2}</h2>
            <div style={{ display: "grid", gap: 28 }}>
              {AVIS.guide.map(g => (
                <div key={g.titre} style={{ maxWidth: 720 }}>
                  <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 8px", color: "var(--text)" }}>{g.titre}</h3>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.65, color: "var(--dim)", margin: 0 }}>{g.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "88px 28px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gap: 24 }}>
            <h2 style={h2Style}>{AVIS.bridgeH2}</h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.55, color: "var(--dim)", margin: 0, maxWidth: 640 }}>{AVIS.bridgeText}</p>
            <PillGhost href={AGENTS} large>{AVIS.bridgeCta} <Arrow size={14} /></PillGhost>
          </div>
        </section>
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
```

Check `components/primitives` exports `MonoLabel`, `PillGhost`, `Arrow` (they are used by `app/[locale]/ressources/livret-accueil-airbnb/page.tsx`). Check that `/fr/solutions/agents-ia` exists (`SERVICE_SLUGS` in `app/sitemap.ts` includes `agents-ia`).

- [ ] **Step 3: Sitemap**

In `app/sitemap.ts`, import `AVIS_PATH` next to `LIVRET_PATH` and add after the `/creer` entry:

```ts
    {
      url: `${BASE}${AVIS_PATH}`,
      lastModified: UPDATED.ressources,
      changeFrequency: "monthly",
      priority: 0.7,
    },
```

Set `ressources: "<today's date>"` with comment `// analyse d'avis Google ajoutée`.

- [ ] **Step 4: Privacy policy**

In `app/[locale]/politique-de-confidentialite/page.tsx`, after the « Générateur de livret d'accueil » `<li>`, add:

```tsx
          <li>
            <Strong>Analyse d&apos;avis Google.</Strong> Pour lancer l&apos;analyse, vous choisissez la fiche Google de votre
            entreprise (données publiques) et indiquez votre adresse e-mail, vérifiée par un code. Les avis publics de la fiche
            sont transmis à notre prestataire d&apos;intelligence artificielle (Anthropic) pour l&apos;analyse. Le rapport est
            conservé 24 heures pour éviter de refaire l&apos;analyse, puis supprimé ; le PDF vous est envoyé par e-mail et
            n&apos;est pas conservé.
          </li>
```

and in the « Base légale » list change `Téléchargement d&apos;une ressource et générateur de livret` to `Téléchargement d&apos;une ressource, générateur de livret et analyse d&apos;avis`. Update `LAST_UPDATE` to today's date in French (e.g. `"22 novembre 2026"`).

- [ ] **Step 5: Build checks**

Run: `npx tsc --noEmit`, `npm test`, then `npx next build`
Expected: build succeeds and lists `/[locale]/ressources/repondre-avis-google`.

- [ ] **Step 6: Commit**

```bash
git add "app/[locale]/ressources/repondre-avis-google/page.tsx" lib/ressources.ts app/sitemap.ts "app/[locale]/politique-de-confidentialite/page.tsx"
git commit -m "feat(avis): page « Répondre à un avis Google », sitemap, confidentialité"
```

---

### Task 11: End-to-end run in simulation

**Files:**
- Create: `scripts/avis/e2e-audit.mjs`

**Interfaces:**
- Consumes: DOM hooks listed in Task 9; the fake SMTP from the welcome-book work (`C:\Users\wilk7\AppData\Local\Temp\claude\...\scratchpad\smtp\faux-smtp.mjs` — copy it to `scripts/avis/faux-smtp.mjs` if that path no longer exists; its full code is in Step 1).

- [ ] **Step 1: Create the fake SMTP `scripts/avis/faux-smtp.mjs`**

```js
// Faux serveur SMTP local pour les essais : accepte tout, écrit chaque message dans OUT/n.eml.
//   node scripts/avis/faux-smtp.mjs 2525 <dossier>
import net from "node:net";
import fs from "node:fs";
const [PORT = "2525", OUT = "."] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
let n = 0;
net.createServer(sock => {
  let data = false, buf = "", corps = "";
  const dire = l => sock.write(l + "\r\n");
  dire("220 faux-smtp");
  sock.on("data", chunk => {
    buf += chunk.toString("latin1");
    let i;
    while ((i = buf.indexOf("\r\n")) >= 0) {
      const ligne = buf.slice(0, i); buf = buf.slice(i + 2);
      if (data) {
        if (ligne === ".") { data = false; fs.writeFileSync(`${OUT}/${++n}.eml`, corps, "latin1"); corps = ""; dire("250 OK"); }
        else corps += ligne + "\r\n";
        continue;
      }
      const cmd = ligne.slice(0, 4).toUpperCase();
      if (cmd === "EHLO") sock.write("250-faux-smtp\r\n250-AUTH PLAIN LOGIN\r\n250 OK\r\n");
      else if (cmd === "AUTH") dire("235 OK");
      else if (cmd === "DATA") { data = true; dire("354 go"); }
      else if (cmd === "QUIT") { dire("221 bye"); sock.end(); }
      else dire("250 OK");
    }
  });
}).listen(Number(PORT), "127.0.0.1", () => console.log("faux SMTP sur", PORT));
```

- [ ] **Step 2: Create `scripts/avis/e2e-audit.mjs`**

```js
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
```

- [ ] **Step 3: Run it**

1. Start the fake SMTP in the background: `node scripts/avis/faux-smtp.mjs 2525 <scratch>/boite`.
2. Restart the dev server on port 3456 with: `AVIS_SIMULATION=1`, a throwaway `LIVRET_SECRET` of 48 random letters, `SMTP_HOST=127.0.0.1`, `SMTP_PORT=2525`, `SMTP_USER=site@test.local`, `SMTP_PASSWORD=test`, `LEAD_TO=lead@test.local` (delete `.next/dev` first: Turbopack can serve stale CSS).
3. Run: `E2E_BOITE=<scratch>/boite node scripts/avis/e2e-audit.mjs http://localhost:3456 <scratch>/e2e`

Expected: every line `ok`, exit code 0. Look at `rapport.png` and `page-375.png`.

- [ ] **Step 4: Check "indisponible" without config**

Restart the dev server without `AVIS_SIMULATION` and without DataForSEO/Anthropic/Upstash variables. Search for a business on the page. Expected: the alert « L'analyse est momentanément indisponible. Réessayez plus tard. »

- [ ] **Step 5: Final checks and commit**

Run: `npm test`, `npx tsc --noEmit`, `npx eslint components/avis lib/avis "app/[locale]/ressources/repondre-avis-google"`, `npx next build`.
Expected: all pass.

```bash
git add scripts/avis/e2e-audit.mjs scripts/avis/faux-smtp.mjs
git commit -m "test(avis): parcours de bout en bout en simulation"
```

Then stop: report to Willy with screenshots. Do not push. Production needs Willy to create the Anthropic key `timevo-site-avis` (with spend cap), the Upstash Redis database (Vercel Marketplace), and `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD` in Vercel, then a redeploy.
