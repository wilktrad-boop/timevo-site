# Générateur de livret d'accueil — étape 1 (sans IA) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Une conciergerie remplit son livret d'accueil en six étapes sur `/fr/ressources/livret-accueil-airbnb/creer`, voit l'aperçu en direct et télécharge un PDF à sa marque, sans email et sans IA.

**Architecture:** Le contenu du livret (étapes, champs, textes par défaut, gabarits) vit dans un seul fichier de données sans import, `lib/livret/contenu.ts`. Une couche pure, `lib/livret/livret.ts`, transforme les valeurs saisies en un « livret rendu » (blocs déjà filtrés) consommé à la fois par l'aperçu HTML et par le PDF `@react-pdf/renderer`, généré dans le navigateur. Le script du modèle Word lit le même fichier.

**Tech Stack:** Next.js 16.2.6 (App Router, next-intl), React 19.2.4, TypeScript strict, `@react-pdf/renderer` 4.9.0, `docx` (global, scripts), tests `node --test` (Node 24, TypeScript natif), Playwright 1.58 pour la vérification de bout en bout.

Spec : `docs/superpowers/specs/2026-11-21-generateur-livret-accueil-design.md` (étape 1 de la section « Livraison en deux temps »).

## Global Constraints

- Lire `AGENTS.md` : cette version de Next.js a des changements ; documentation dans `node_modules/next/dist/docs/`.
- Page en **français uniquement** : `/en/ressources/livret-accueil-airbnb/creer` renvoie 404, aucune alternate hreflang.
- `lib/livret/contenu.ts` n'importe **rien**. `lib/livret/livret.ts` n'importe que `./contenu.ts` (avec l'extension).
- Aucun chiffre de performance, aucun prix, pas d'emoji, ton sobre (cf. `C:\Users\wilk7\Timevo\CLAUDE.md`).
- Aucune mention Timevo dans les pages du PDF ; seulement `creator: "Timevo"` dans ses métadonnées.
- Les codes, mots de passe, téléphones et le logo ne quittent jamais le navigateur (aucun appel serveur dans cette étape).
- `localStorage` : chaque lecture et écriture dans un `try/catch` ; le générateur fonctionne sans.
- Dépendance ajoutée : `@react-pdf/renderer@4.9.0` en version exacte (`--save-exact`).
- Vérification visuelle en desktop (1440 px) et à 375 px, sans défilement horizontal.
- Ne rien pousser sur `master` sans l'accord explicite de Willy (déploiement Vercel).
- Le serveur de dev peut servir un CSS périmé : en cas de doute, arrêter le serveur et supprimer `.next/dev`.

---

## File Structure

| Fichier | Action | Rôle |
|---|---|---|
| `tsconfig.json` | Modifier | `allowImportingTsExtensions` pour l'import `./contenu.ts` |
| `package.json` | Modifier | script `test`, dépendance `@react-pdf/renderer` |
| `lib/livret/contenu.ts` | Créer | Données du livret : types, étapes, champs, couverture, numéros |
| `lib/livret/livret.ts` | Créer | Logique pure : brouillon, gabarits, livret rendu, nom de fichier |
| `tests/livret/livret.test.ts` | Créer | Tests `node --test` de la logique pure |
| `scripts/livret-accueil/build-livret.mts` | Créer | Modèle Word et exemple, lus depuis `contenu.ts` |
| `scripts/livret-accueil/build-livret.cjs`, `contenu.cjs` | Supprimer | Remplacés par le `.mts` |
| `components/livret/LivretPdf.tsx` | Créer | Document PDF et `genererPdf()` |
| `components/livret/Apercu.tsx` | Créer | Aperçu HTML du livret rendu |
| `components/livret/Generateur.tsx` | Créer | Étapes, saisie, brouillon, logo, couleur, téléchargement |
| `app/[locale]/ressources/livret-accueil-airbnb/creer/page.tsx` | Créer | Page du générateur |
| `app/[locale]/ressources/livret-accueil-airbnb/page.tsx` | Modifier | Bouton « Créer mon livret en ligne » |
| `lib/ressources.ts` | Modifier | Textes de la vitrine et du générateur |
| `app/sitemap.ts` | Modifier | URL du générateur |
| `app/globals.css` | Modifier | Grille du générateur, onglets mobile |
| `scripts/livret-accueil/e2e-generateur.mjs` | Créer | Scénario Playwright de bout en bout |

---

### Task 1: Contenu et logique pure du livret

**Files:**
- Modify: `tsconfig.json`
- Modify: `package.json` (bloc `scripts`)
- Create: `lib/livret/contenu.ts`
- Create: `lib/livret/livret.ts`
- Test: `tests/livret/livret.test.ts`

**Interfaces:**
- Consumes: rien.
- Produces (utilisés par les tâches 2 à 5) :
  - `contenu.ts` : types `ChampType`, `Champ`, `LigneTableau`, `Bloc`, `Section`, `Etape` ; constantes `ETAPES: Etape[]`, `COUVERTURE`, `CHAMPS: Champ[]`, `COULEUR_DEFAUT: string`.
  - `livret.ts` : `type LivretData = { valeurs: Record<string, string>; marque: { couleur: string; logo: string | null } }`, `type BlocRendu`, `type SectionRendu`, `type LivretRendu`, `brouillonVide(): LivretData`, `remplir(gabarit: string, valeurs: Record<string, string>): string | null`, `lignes(texte: string): string[]`, `couleurValide(couleur: string): string`, `restaurerBrouillon(brut: unknown): LivretData`, `construireLivret(data: LivretData): LivretRendu`, `nomFichier(data: LivretData): string`, `CLE_BROUILLON = "timevo-livret-brouillon-v1"`.

- [ ] **Step 1: Autoriser les imports `.ts` et ajouter le script de test**

Dans `tsconfig.json`, ajouter dans `compilerOptions` (après `"noEmit": true,`) :

```json
    "allowImportingTsExtensions": true,
```

Dans `package.json`, dans `"scripts"`, ajouter :

```json
    "test": "node --test tests/"
```

- [ ] **Step 2: Écrire `lib/livret/contenu.ts`**

```ts
/**
 * Contenu du livret d'accueil, source unique du générateur en ligne
 * (/fr/ressources/livret-accueil-airbnb/creer) et du modèle Word
 * (scripts/livret-accueil/build-livret.mts).
 *
 * Ce fichier n'importe RIEN : le script Word le lit hors de Next.js.
 *
 * Gabarits : `{idDuChamp}` est remplacé par la valeur saisie. Une ligne de
 * tableau dont un champ référencé est vide disparaît du livret.
 * `exemple` sert de placeholder dans le générateur et de valeur dans
 * l'exemple PDF ; il n'est jamais imprimé dans le livret d'une conciergerie.
 * `sensible` : jamais envoyé à l'IA (étape 2 du chantier).
 */

export type ChampType = "court" | "long" | "liste";

export type Champ = {
  id: string;
  label: string;
  type: ChampType;
  exemple: string;
  defaut?: string;
  sensible?: boolean;
};

export type LigneTableau = { label: string; gabarit: string };

export type Bloc =
  | { type: "tableau"; titre?: string; lignes: LigneTableau[] }
  | { type: "texte"; titre?: string; champ: string }
  | { type: "liste"; titre?: string; champ: string; style: "puces" | "cases" };

export type Section = { titre: string; blocs: Bloc[]; sautAvant?: boolean };

export type Etape = { id: string; titre: string; intro: string; champs: Champ[]; sections: Section[] };

export const COULEUR_DEFAUT = "#2F5D50";

export const ETAPES: Etape[] = [
  {
    id: "conciergerie",
    titre: "Votre conciergerie",
    intro: "Ce qui apparaît en première page : qui vous êtes, le logement, et comment vous joindre.",
    champs: [
      { id: "nomConciergerie", label: "Nom de la conciergerie", type: "court", exemple: "Conciergerie Rive Gauche" },
      { id: "nomLogement", label: "Nom du logement", type: "court", exemple: "Le Loft du Marais" },
      { id: "adresse", label: "Adresse du logement", type: "court", exemple: "8 rue de l'Exemple, 75003 Paris", sensible: true },
      { id: "contactPrenom", label: "Prénom du contact", type: "court", exemple: "Camille" },
      { id: "contactTelephone", label: "Téléphone du contact", type: "court", exemple: "01 99 00 12 34", sensible: true },
      { id: "contactDispo", label: "Disponibilités", type: "court", exemple: "tous les jours de 8 h à 21 h" },
      {
        id: "intro", label: "Mot d'accueil", type: "long",
        exemple: "Merci d'avoir choisi notre logement…",
        defaut: "Merci d'avoir choisi notre logement. Ce livret rassemble tout ce qu'il faut savoir pendant votre séjour : l'arrivée, le logement, le quartier et le départ. Gardez-le à portée de main, et écrivez-nous au moindre doute : nous préférons une question de trop à un souci pendant votre séjour.",
      },
    ],
    sections: [],
  },
  {
    id: "arrivee",
    titre: "L'arrivée",
    intro: "Tout ce qu'il faut pour entrer dans le logement sans vous appeler.",
    champs: [
      { id: "heureArrivee", label: "Heure d'arrivée (à partir de)", type: "court", exemple: "16 h", sensible: true },
      { id: "codeImmeuble", label: "Code de l'immeuble", type: "court", exemple: "4815B", sensible: true },
      { id: "etagePorte", label: "Étage et porte", type: "court", exemple: "3e étage, porte de droite" },
      { id: "cles", label: "Remise des clés", type: "long", exemple: "Boîte à clés à gauche de la porte, code envoyé le jour de l'arrivée." },
      { id: "parking", label: "Stationnement", type: "long", exemple: "Pas de place privée. Parking public à 4 minutes à pied ; stationnement en rue payant de 9 h à 20 h." },
      {
        id: "arriveeTardive", label: "Arrivée tardive", type: "long", exemple: "",
        defaut: "Vous arrivez tard ? Prévenez-nous la veille : l'accès autonome fonctionne à toute heure, mais nous préférons savoir que vous êtes bien arrivés.",
      },
    ],
    sections: [{
      titre: "Votre arrivée",
      blocs: [
        { type: "tableau", titre: "Accès au logement", lignes: [
          { label: "Adresse", gabarit: "{adresse}" },
          { label: "Arrivée", gabarit: "À partir de {heureArrivee}" },
          { label: "Code de l'immeuble", gabarit: "{codeImmeuble}" },
          { label: "Étage, porte", gabarit: "{etagePorte}" },
          { label: "Clés", gabarit: "{cles}" },
        ] },
        { type: "texte", titre: "Stationnement", champ: "parking" },
        { type: "texte", titre: "Arrivée tardive", champ: "arriveeTardive" },
      ],
    }],
  },
  {
    id: "logement",
    titre: "Le logement",
    intro: "Le Wi-Fi, les équipements et quoi faire en cas de souci.",
    champs: [
      { id: "wifiReseau", label: "Nom du réseau Wi-Fi", type: "court", exemple: "LoftMarais", sensible: true },
      { id: "wifiMotDePasse", label: "Mot de passe Wi-Fi", type: "court", exemple: "bienvenue-2026", sensible: true },
      { id: "television", label: "Télévision", type: "long", exemple: "Télécommande dans le tiroir du meuble TV. Applications de streaming via le bouton Accueil." },
      { id: "equipements", label: "Équipements", type: "liste", exemple: "Chauffage : thermostat dans l'entrée, à baisser en partant\nCuisine : plaques induction, four, lave-vaisselle, cafetière\nLinge : draps et serviettes fournis, lave-linge dans la salle de bains" },
      {
        id: "souci", label: "En cas de souci", type: "long", exemple: "",
        defaut: "Une panne, un équipement qui ne fonctionne pas : écrivez-nous ou appelez-nous. Nous intervenons au plus vite, et en priorité en cas d'urgence (fuite, coupure, serrure).",
      },
      { id: "compteur", label: "Compteur électrique", type: "court", exemple: "placard de l'entrée, en haut à droite" },
      { id: "arriveeEau", label: "Arrivée d'eau", type: "court", exemple: "sous l'évier de la cuisine" },
      { id: "extincteur", label: "Extincteur", type: "court", exemple: "à côté de la porte d'entrée" },
    ],
    sections: [{
      titre: "Le logement",
      blocs: [
        { type: "tableau", titre: "Wi-Fi et télévision", lignes: [
          { label: "Réseau Wi-Fi", gabarit: "{wifiReseau}" },
          { label: "Mot de passe", gabarit: "{wifiMotDePasse}" },
          { label: "Télévision", gabarit: "{television}" },
        ] },
        { type: "liste", titre: "Équipements", champ: "equipements", style: "puces" },
        { type: "texte", titre: "En cas de souci", champ: "souci" },
        { type: "tableau", lignes: [
          { label: "Compteur électrique", gabarit: "{compteur}" },
          { label: "Arrivée d'eau", gabarit: "{arriveeEau}" },
          { label: "Extincteur", gabarit: "{extincteur}" },
        ] },
      ],
    }],
  },
  {
    id: "regles",
    titre: "Les règles de la maison",
    intro: "Quelques règles, formulées sans ton de règlement.",
    champs: [
      {
        id: "reglesIntro", label: "Introduction", type: "long", exemple: "",
        defaut: "Le logement est un lieu de vie dans un immeuble habité. Quelques règles pour que votre séjour se passe bien, pour vous comme pour les voisins :",
      },
      { id: "capacite", label: "Capacité maximale", type: "court", exemple: "4 personnes" },
      {
        id: "regles", label: "Règles", type: "liste", exemple: "",
        defaut: "Fêtes et événements : non autorisés\nCalme : à partir de 22 h, dans le logement comme dans les parties communes\nTabac : logement non-fumeur, y compris à la fenêtre\nAnimaux : non acceptés\nClés : à ne pas reproduire ni confier à des personnes extérieures à la réservation",
      },
      { id: "tri", label: "Tri et déchets", type: "long", exemple: "Poubelles dans la cour, à gauche en entrant. Bac jaune : emballages et papiers. Le verre se dépose dans la colonne au coin de la rue." },
    ],
    sections: [{
      titre: "Les règles de la maison",
      sautAvant: true,
      blocs: [
        { type: "texte", champ: "reglesIntro" },
        { type: "tableau", lignes: [{ label: "Capacité", gabarit: "{capacite} maximum" }] },
        { type: "liste", champ: "regles", style: "puces" },
        { type: "texte", titre: "Tri et déchets", champ: "tri" },
      ],
    }],
  },
  {
    id: "quartier",
    titre: "Le quartier",
    intro: "Vos bonnes adresses : la rubrique que les voyageurs lisent le plus.",
    champs: [
      { id: "quartierIntro", label: "Introduction", type: "long", exemple: "", defaut: "Nos adresses préférées, testées par l'équipe." },
      { id: "manger", label: "Pour manger", type: "liste", exemple: "Le Petit Comptoir, à 3 minutes : cuisine de saison, réservez le week-end\nLa Fournée, en bas de la rue : boulangerie ouverte dès 7 h" },
      { id: "quotidien", label: "Au quotidien", type: "liste", exemple: "Supérette : au coin de la rue, ouverte jusqu'à 22 h\nPharmacie : à 2 minutes, place du marché" },
      { id: "transports", label: "Se déplacer", type: "liste", exemple: "Métro : à 4 minutes, ligne 11\nGare : 15 minutes en métro" },
    ],
    sections: [{
      titre: "Le quartier",
      blocs: [
        { type: "texte", champ: "quartierIntro" },
        { type: "liste", titre: "Pour manger", champ: "manger", style: "puces" },
        { type: "liste", titre: "Au quotidien", champ: "quotidien", style: "puces" },
        { type: "liste", titre: "Se déplacer", champ: "transports", style: "puces" },
      ],
    }],
  },
  {
    id: "depart",
    titre: "Le départ",
    intro: "L'heure, la liste à cocher et les numéros utiles.",
    champs: [
      { id: "heureDepart", label: "Heure de départ (avant)", type: "court", exemple: "11 h", sensible: true },
      {
        id: "departInfo", label: "Informations de départ", type: "long", exemple: "",
        defaut: "Besoin de plus de temps ? Demandez-nous la veille : selon les réservations, nous pouvons parfois décaler l'heure.",
      },
      {
        id: "checklist", label: "Avant de partir", type: "liste", exemple: "",
        defaut: "Fermer les fenêtres et baisser le chauffage\nLancer le lave-vaisselle avec la vaisselle utilisée\nSortir les poubelles\nLaisser les serviettes utilisées dans la salle de bains\nÉteindre les lumières et les appareils\nRemettre les clés dans la boîte à clés",
      },
      {
        id: "motFin", label: "Un dernier mot", type: "long", exemple: "",
        defaut: "Merci de votre séjour. Si quelque chose vous a manqué, dites-le-nous directement : c'est comme ça que le logement s'améliore. Et si vous avez aimé votre séjour, un avis sur la plateforme de réservation nous aide énormément.",
      },
      { id: "medecin", label: "Médecin le plus proche", type: "court", exemple: "cabinet médical, 20 rue de l'Exemple" },
    ],
    sections: [
      {
        titre: "Votre départ",
        sautAvant: true,
        blocs: [
          { type: "tableau", lignes: [{ label: "Départ", gabarit: "Avant {heureDepart}" }] },
          { type: "texte", champ: "departInfo" },
          { type: "liste", titre: "Avant de partir", champ: "checklist", style: "cases" },
          { type: "texte", titre: "Un dernier mot", champ: "motFin" },
        ],
      },
      {
        titre: "Numéros utiles",
        blocs: [{ type: "tableau", lignes: [
          { label: "Votre conciergerie", gabarit: "{contactPrenom}, {contactTelephone}" },
          { label: "Urgences (Europe)", gabarit: "112" },
          { label: "SAMU", gabarit: "15" },
          { label: "Police", gabarit: "17" },
          { label: "Pompiers", gabarit: "18" },
          { label: "Pharmacie de garde", gabarit: "3237" },
          { label: "Médecin le plus proche", gabarit: "{medecin}" },
        ] }],
      },
    ],
  },
];

export const COUVERTURE = {
  surtitre: "{nomConciergerie}",
  titre: "Bienvenue chez vous.",
  sousTitre: "Livret d'accueil · {nomLogement}",
  sousTitreSansLogement: "Livret d'accueil",
  lignes: [
    { label: "Adresse", gabarit: "{adresse}" },
    { label: "Arrivée", gabarit: "À partir de {heureArrivee}" },
    { label: "Départ", gabarit: "Avant {heureDepart}" },
    { label: "Wi-Fi", gabarit: "Réseau {wifiReseau} · mot de passe {wifiMotDePasse}" },
    { label: "Votre contact", gabarit: "{contactPrenom}, {contactTelephone}" },
    { label: "Disponibilités", gabarit: "{contactDispo}" },
  ] as LigneTableau[],
  intro: "intro",
  pied: "{nomConciergerie} · {contactTelephone}",
};

export const CHAMPS: Champ[] = ETAPES.flatMap(e => e.champs);
```

- [ ] **Step 3: Écrire le test qui échoue, `tests/livret/livret.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  brouillonVide, remplir, lignes, couleurValide, restaurerBrouillon,
  construireLivret, nomFichier, type LivretData,
} from "../../lib/livret/livret.ts";
import { CHAMPS, COULEUR_DEFAUT } from "../../lib/livret/contenu.ts";

const avec = (valeurs: Record<string, string>): LivretData => {
  const d = brouillonVide();
  return { ...d, valeurs: { ...d.valeurs, ...valeurs } };
};

test("brouillonVide reprend les textes par défaut et laisse le reste vide", () => {
  const d = brouillonVide();
  assert.equal(Object.keys(d.valeurs).length, CHAMPS.length);
  assert.match(d.valeurs.intro, /^Merci d'avoir choisi/);
  assert.equal(d.valeurs.nomLogement, "");
  assert.deepEqual(d.marque, { couleur: COULEUR_DEFAUT, logo: null });
});

test("remplir remplace les champs et renvoie null si un champ manque", () => {
  assert.equal(remplir("Avant {heureDepart}", { heureDepart: "11 h" }), "Avant 11 h");
  assert.equal(remplir("Réseau {a} · mot de passe {b}", { a: "X", b: "" }), null);
  assert.equal(remplir("112", {}), "112");
  assert.equal(remplir("{a}", { a: "  " }), null);
});

test("lignes découpe une liste et ignore les lignes vides", () => {
  assert.deepEqual(lignes(" un \n\n deux\n  "), ["un", "deux"]);
});

test("couleurValide garde un hexa à six chiffres, sinon la couleur par défaut", () => {
  assert.equal(couleurValide("#1a2b3c"), "#1a2b3c");
  assert.equal(couleurValide("red"), COULEUR_DEFAUT);
});

test("restaurerBrouillon ignore les champs inconnus et les types invalides", () => {
  const d = restaurerBrouillon({ valeurs: { nomLogement: "Chalet", inconnu: "x", intro: 3 }, marque: { couleur: "#000000", logo: "data:image/png;base64,AA" } });
  assert.equal(d.valeurs.nomLogement, "Chalet");
  assert.equal("inconnu" in d.valeurs, false);
  assert.match(d.valeurs.intro, /^Merci/);
  assert.equal(d.marque.couleur, "#000000");
  assert.equal(d.marque.logo, "data:image/png;base64,AA");
  assert.deepEqual(restaurerBrouillon("n'importe quoi"), brouillonVide());
  assert.equal(restaurerBrouillon({ marque: { logo: "javascript:alert(1)" } }).marque.logo, null);
});

test("construireLivret retire les lignes, blocs et sections vides", () => {
  const vide = construireLivret(avec({ intro: "", arriveeTardive: "", souci: "", reglesIntro: "", regles: "", quartierIntro: "", departInfo: "", checklist: "", motFin: "" }));
  const titres = vide.sections.map(s => s.titre);
  assert.deepEqual(titres, ["Numéros utiles"]);
  assert.deepEqual(vide.sections[0].blocs[0], {
    type: "tableau", lignes: [
      { label: "Urgences (Europe)", valeur: "112" }, { label: "SAMU", valeur: "15" },
      { label: "Police", valeur: "17" }, { label: "Pompiers", valeur: "18" },
      { label: "Pharmacie de garde", valeur: "3237" },
    ],
  });
  assert.equal(vide.couverture.intro, null);
  assert.deepEqual(vide.couverture.tableau, []);
});

test("construireLivret remplit couverture, listes et pied de page", () => {
  const l = construireLivret(avec({
    nomConciergerie: "Rive Gauche", nomLogement: "Loft", heureDepart: "11 h",
    contactPrenom: "Camille", contactTelephone: "01 99 00 12 34",
  }));
  assert.equal(l.couverture.surtitre, "Rive Gauche");
  assert.equal(l.couverture.sousTitre, "Livret d'accueil · Loft");
  assert.deepEqual(l.couverture.tableau.map(r => r.label), ["Départ", "Votre contact"]);
  assert.equal(l.pied, "Rive Gauche · 01 99 00 12 34");
  const depart = l.sections.find(s => s.titre === "Votre départ")!;
  assert.equal(depart.sautAvant, true);
  const cases = depart.blocs.find(b => b.type === "liste")!;
  assert.equal(cases.type === "liste" && cases.style, "cases");
  assert.equal(cases.type === "liste" && cases.items.length, 6);
});

test("nomFichier produit un nom de fichier sans accents ni espaces", () => {
  assert.equal(nomFichier(avec({ nomLogement: "Le Loft du Marais — 3e" })), "livret-accueil-le-loft-du-marais-3e.pdf");
  assert.equal(nomFichier(avec({ nomLogement: "" })), "livret-accueil.pdf");
});
```

- [ ] **Step 4: Lancer le test et vérifier qu'il échoue**

Run: `npm test`
Expected: FAIL, `Cannot find module` sur `lib/livret/livret.ts`.

- [ ] **Step 5: Écrire `lib/livret/livret.ts`**

```ts
/**
 * Logique pure du livret : aucune dépendance au navigateur ni à React.
 * L'aperçu HTML et le PDF consomment tous deux `construireLivret()`,
 * ce qui garantit qu'ils affichent exactement la même chose.
 */
import { CHAMPS, COUVERTURE, COULEUR_DEFAUT, ETAPES, type LigneTableau } from "./contenu.ts";

export const CLE_BROUILLON = "timevo-livret-brouillon-v1";

export type LivretData = {
  valeurs: Record<string, string>;
  marque: { couleur: string; logo: string | null };
};

export type LigneRendue = { label: string; valeur: string };

export type BlocRendu =
  | { type: "tableau"; titre?: string; lignes: LigneRendue[] }
  | { type: "texte"; titre?: string; texte: string }
  | { type: "liste"; titre?: string; style: "puces" | "cases"; items: string[] };

export type SectionRendu = { titre: string; sautAvant: boolean; blocs: BlocRendu[] };

export type LivretRendu = {
  couverture: {
    surtitre: string | null;
    titre: string;
    sousTitre: string;
    tableau: LigneRendue[];
    intro: string | null;
  };
  sections: SectionRendu[];
  pied: string | null;
  couleur: string;
  logo: string | null;
};

export function brouillonVide(): LivretData {
  return {
    valeurs: Object.fromEntries(CHAMPS.map(c => [c.id, c.defaut ?? ""])),
    marque: { couleur: COULEUR_DEFAUT, logo: null },
  };
}

/** Remplace `{id}` par la valeur ; `null` si un champ référencé est vide. */
export function remplir(gabarit: string, valeurs: Record<string, string>): string | null {
  let manque = false;
  const texte = gabarit.replace(/\{(\w+)\}/g, (_, id: string) => {
    const v = (valeurs[id] ?? "").trim();
    if (!v) manque = true;
    return v;
  });
  return manque ? null : texte;
}

export function lignes(texte: string): string[] {
  return texte.split("\n").map(l => l.trim()).filter(Boolean);
}

export function couleurValide(couleur: string): string {
  return /^#[0-9a-f]{6}$/i.test(couleur) ? couleur : COULEUR_DEFAUT;
}

/** Relit un brouillon stocké (JSON non fiable) sans jamais lever d'erreur. */
export function restaurerBrouillon(brut: unknown): LivretData {
  const base = brouillonVide();
  if (!brut || typeof brut !== "object") return base;
  const b = brut as { valeurs?: unknown; marque?: unknown };
  if (b.valeurs && typeof b.valeurs === "object") {
    for (const c of CHAMPS) {
      const v = (b.valeurs as Record<string, unknown>)[c.id];
      if (typeof v === "string") base.valeurs[c.id] = v.slice(0, 4000);
    }
  }
  if (b.marque && typeof b.marque === "object") {
    const m = b.marque as { couleur?: unknown; logo?: unknown };
    if (typeof m.couleur === "string") base.marque.couleur = couleurValide(m.couleur);
    if (typeof m.logo === "string" && /^data:image\/(png|jpeg);base64,/.test(m.logo)) base.marque.logo = m.logo;
  }
  return base;
}

function tableau(lignesTableau: LigneTableau[], valeurs: Record<string, string>): LigneRendue[] {
  return lignesTableau.flatMap(l => {
    const valeur = remplir(l.gabarit, valeurs);
    return valeur ? [{ label: l.label, valeur }] : [];
  });
}

export function construireLivret(data: LivretData): LivretRendu {
  const v = data.valeurs;
  const sections: SectionRendu[] = [];
  for (const etape of ETAPES) {
    for (const s of etape.sections) {
      const blocs: BlocRendu[] = [];
      for (const b of s.blocs) {
        if (b.type === "tableau") {
          const l = tableau(b.lignes, v);
          if (l.length) blocs.push({ type: "tableau", titre: b.titre, lignes: l });
        } else if (b.type === "texte") {
          const t = (v[b.champ] ?? "").trim();
          if (t) blocs.push({ type: "texte", titre: b.titre, texte: t });
        } else {
          const items = lignes(v[b.champ] ?? "");
          if (items.length) blocs.push({ type: "liste", titre: b.titre, style: b.style, items });
        }
      }
      if (blocs.length) sections.push({ titre: s.titre, sautAvant: Boolean(s.sautAvant), blocs });
    }
  }
  return {
    couverture: {
      surtitre: remplir(COUVERTURE.surtitre, v),
      titre: COUVERTURE.titre,
      sousTitre: remplir(COUVERTURE.sousTitre, v) ?? COUVERTURE.sousTitreSansLogement,
      tableau: tableau(COUVERTURE.lignes, v),
      intro: (v[COUVERTURE.intro] ?? "").trim() || null,
    },
    sections,
    pied: remplir(COUVERTURE.pied, v),
    couleur: couleurValide(data.marque.couleur),
    logo: data.marque.logo,
  };
}

export function nomFichier(data: LivretData): string {
  const slug = (data.valeurs.nomLogement ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return slug ? `livret-accueil-${slug}.pdf` : "livret-accueil.pdf";
}
```

- [ ] **Step 6: Lancer les tests et vérifier qu'ils passent**

Run: `npm test`
Expected: `ℹ pass 8`, `ℹ fail 0`.

- [ ] **Step 7: Vérifier les types**

Run: `npx tsc --noEmit`
Expected: aucune sortie, code 0.

- [ ] **Step 8: Commit**

```bash
git add tsconfig.json package.json lib/livret tests/livret
git commit -m "feat(livret): contenu et logique pure du générateur de livret"
```

---

### Task 2: Le modèle Word lit le même contenu

**Files:**
- Create: `scripts/livret-accueil/build-livret.mts`
- Delete: `scripts/livret-accueil/build-livret.cjs`, `scripts/livret-accueil/contenu.cjs`
- Modify: `public/ressources/livret-accueil-modele.docx`, `public/ressources/livret-accueil-exemple.pdf`, `public/ressources/livret-apercu-{1,2,3}.webp` (régénérés)

**Interfaces:**
- Consumes: `ETAPES`, `COUVERTURE`, `CHAMPS`, `type Champ`, `type LigneTableau` de `lib/livret/contenu.ts` (tâche 1).
- Produces: deux fichiers `.docx` dans le dossier de sortie passé en argument.

Règles de rendu : **modèle** — un champ avec `defaut` est imprimé tel quel ; un champ sans `defaut` devient `[Libellé]` surligné jaune ; une ligne de tableau est toujours imprimée, ses `{id}` remplacés par `[Libellé]` surligné. **Exemple** — `{id}` et champs prennent `defaut` sinon `exemple`.

- [ ] **Step 1: Écrire `scripts/livret-accueil/build-livret.mts`**

```ts
/**
 * Génère le modèle Word et l'exemple du livret d'accueil, à partir de
 * lib/livret/contenu.ts (source partagée avec le générateur en ligne).
 *
 *   NODE_PATH="$(npm root -g)" node scripts/livret-accueil/build-livret.mts <dossier de sortie>
 *
 * Puis convertir l'exemple en PDF avec Word (cf. commentaire en fin de fichier).
 * `docx` n'est pas une dépendance du projet : installation globale.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { CHAMPS, COUVERTURE, ETAPES, type Champ, type LigneTableau } from "../../lib/livret/contenu.ts";

const require = createRequire(import.meta.url);
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, AlignmentType, LevelFormat, Footer, PageNumber,
  HeadingLevel, PageBreak, TableLayoutType,
} = require("docx");

const OUT = process.argv[2] || ".";
const FONT = "Arial", INK = "1F2A2E", DIM = "5B6670", ACCENT = "2F5D50", LINE = "D5DCD9", SOFT = "F1F4F3";
const PAGE_W = 11906, MARGIN = 1134, CONTENT_W = PAGE_W - 2 * MARGIN;
const PAR_ID = new Map<string, Champ>(CHAMPS.map(c => [c.id, c]));

type Mode = "modele" | "exemple";

function valeurChamp(c: Champ, mode: Mode): string | null {
  if (c.defaut) return c.defaut;
  return mode === "exemple" ? c.exemple : null;
}

/** Runs d'un gabarit `{id}` : surligné `[Libellé]` (modèle) ou valeur d'exemple. */
function runsGabarit(gabarit: string, mode: Mode, base: Record<string, unknown>) {
  const out: unknown[] = [];
  let last = 0;
  for (const m of gabarit.matchAll(/\{(\w+)\}/g)) {
    if (m.index! > last) out.push(new TextRun({ text: gabarit.slice(last, m.index), ...base }));
    const c = PAR_ID.get(m[1])!;
    const v = valeurChamp(c, mode);
    out.push(v ? new TextRun({ text: v, ...base }) : new TextRun({ text: `[${c.label}]`, highlight: "yellow", ...base }));
    last = m.index! + m[0].length;
  }
  if (last < gabarit.length) out.push(new TextRun({ text: gabarit.slice(last), ...base }));
  return out;
}

const corps = { font: FONT, size: 22, color: INK };

function para(runs: unknown[], spacing = { after: 120, line: 300 }) {
  return new Paragraph({ spacing, children: runs });
}

function h1(text: string, pageBreakBefore: boolean) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, pageBreakBefore,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
    children: [new TextRun({ text })],
  });
}

const h2 = (text: string) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text })] });

function tableau(lignesT: LigneTableau[], mode: Mode) {
  const LABEL_W = 3000, VALUE_W = CONTENT_W - LABEL_W;
  const b = { style: BorderStyle.SINGLE, size: 4, color: LINE };
  const borders = { top: b, bottom: b, left: b, right: b };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [LABEL_W, VALUE_W], layout: TableLayoutType.FIXED,
    rows: lignesT.map(l => new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: LABEL_W, type: WidthType.DXA }, borders, shading: { type: ShadingType.CLEAR, color: "auto", fill: SOFT },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [new Paragraph({ children: [new TextRun({ text: l.label, font: FONT, size: 20, bold: true, color: INK })] })] }),
      new TableCell({ width: { size: VALUE_W, type: WidthType.DXA }, borders, margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [new Paragraph({ children: runsGabarit(l.gabarit, mode, { font: FONT, size: 20, color: INK }) })] }),
    ] })),
  });
}

function blocChamp(champId: string, mode: Mode, style?: "puces" | "cases") {
  const c = PAR_ID.get(champId)!;
  const v = valeurChamp(c, mode);
  if (!v) {
    const run = new TextRun({ text: `[${c.label}]`, highlight: "yellow", ...corps });
    return [style ? new Paragraph({ numbering: { reference: style, level: 0 }, children: [run] }) : para([run])];
  }
  if (!style) return [para([new TextRun({ text: v, ...corps })])];
  return v.split("\n").filter(Boolean).map(item =>
    new Paragraph({ numbering: { reference: style, level: 0 }, spacing: { after: 80, line: 290 }, children: [new TextRun({ text: item, ...corps })] }));
}

function build(mode: Mode) {
  const children: unknown[] = [
    new Paragraph({ spacing: { before: 2400, after: 200 }, children: runsGabarit(COUVERTURE.surtitre, mode, { font: FONT, size: 20, color: ACCENT, bold: true, allCaps: true, characterSpacing: 40 }) }),
    new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: COUVERTURE.titre, font: FONT, size: 64, bold: true, color: INK })] }),
    new Paragraph({ spacing: { after: 600 }, children: runsGabarit(COUVERTURE.sousTitre, mode, { font: FONT, size: 28, color: DIM }) }),
    tableau(COUVERTURE.lignes, mode),
    new Paragraph({ spacing: { after: 120 }, children: [] }),
    ...blocChamp(COUVERTURE.intro, mode),
    para([new TextRun({ font: FONT, size: 18, color: DIM, italics: true, text: mode === "modele"
      ? "Modèle proposé par Timevo (timevo.io). Remplacez chaque champ surligné, supprimez les rubriques qui ne concernent pas votre logement et ajoutez votre logo en haut de cette page. Supprimez ensuite ce paragraphe. Version en ligne, avec export PDF : timevo.io/fr/ressources/livret-accueil-airbnb/creer"
      : "Exemple rempli pour une conciergerie fictive. Créez le vôtre en ligne sur timevo.io." })], { before: 600, after: 120, line: 300 }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
  for (const etape of ETAPES) for (const s of etape.sections) {
    children.push(h1(s.titre, Boolean(s.sautAvant)));
    for (const b of s.blocs) {
      if (b.titre) children.push(h2(b.titre));
      if (b.type === "tableau") children.push(tableau(b.lignes, mode), new Paragraph({ spacing: { after: 120 }, children: [] }));
      else children.push(...blocChamp(b.champ, mode, b.type === "liste" ? b.style : undefined));
    }
  }
  return new Document({
    creator: "Timevo", title: "Livret d'accueil — location courte durée",
    styles: {
      default: { document: { run: { font: FONT, size: 22, color: INK } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT, size: 34, bold: true, color: INK }, paragraph: { spacing: { before: 360, after: 200 }, keepNext: true, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT, size: 24, bold: true, color: ACCENT }, paragraph: { spacing: { before: 240, after: 100 }, keepNext: true, outlineLevel: 1 } },
      ],
    },
    numbering: { config: [
      { reference: "puces", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] },
      { reference: "cases", levels: [{ level: 0, format: LevelFormat.BULLET, text: "☐", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } }, run: { font: "Segoe UI Symbol" } } }] },
    ] },
    sections: [{
      properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        ...runsGabarit(COUVERTURE.pied, mode, { font: FONT, size: 16, color: DIM }),
        new TextRun({ text: "  ·  ", font: FONT, size: 16, color: DIM }),
        new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: DIM }),
      ] })] }) },
      children,
    }],
  });
}

fs.mkdirSync(OUT, { recursive: true });
for (const [name, mode] of [["livret-accueil-modele.docx", "modele"], ["livret-accueil-exemple.docx", "exemple"]] as const) {
  const buf: Buffer = await Packer.toBuffer(build(mode));
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log(name, Math.round(buf.length / 1024) + " Ko");
}

// Conversion de l'exemple en PDF (PowerShell, Word installé) :
// $w = New-Object -ComObject Word.Application; $d = $w.Documents.Open("<dossier>\livret-accueil-exemple.docx", $false, $true)
// $d.ExportAsFixedFormat("<dossier>\livret-accueil-exemple.pdf", 17); $d.Close($false); $w.Quit()
```

- [ ] **Step 2: Générer dans le scratchpad et vérifier**

Run: `NODE_PATH="$(npm root -g)" node scripts/livret-accueil/build-livret.mts "$SCRATCH/livret"` (où `$SCRATCH` est le dossier scratchpad de la session)
Expected: `livret-accueil-modele.docx` et `livret-accueil-exemple.docx`, environ 13 Ko chacun.

Puis convertir l'exemple en PDF avec la commande PowerShell en fin de script et compter les pages et mots avec pymupdf :

Run: `cd "$SCRATCH/livret" && python -c "import fitz; d=fitz.open('livret-accueil-exemple.pdf'); print(len(d), [len(p.get_text().split()) for p in d])"`
Expected: 4 ou 5 pages, **aucune page à moins de 40 mots** (pas de page blanche ni de page orpheline). Sinon, ajuster `sautAvant` dans `contenu.ts` et relancer `npm test`.

Lire le rendu (pages converties en PNG avec `fitz`, `get_pixmap(dpi=55)`) et vérifier : surlignage jaune dans le modèle, valeurs d'exemple dans l'exemple, cases à cocher dans « Avant de partir ».

- [ ] **Step 3: Remplacer les fichiers publiés**

Copier `livret-accueil-modele.docx` et `livret-accueil-exemple.pdf` dans `public/ressources/`. Régénérer les aperçus :

Run: `cd "$SCRATCH/livret" && python -c "import fitz; d=fitz.open('livret-accueil-exemple.pdf'); [d[i].get_pixmap(dpi=110).save(f'apercu-{i+1}.png') for i in range(3)]"` puis `node -e 'const sharp=require("sharp");(async()=>{for(const i of [1,2,3]){await sharp(process.argv[1]+"/apercu-"+i+".png").resize({width:620}).webp({quality:80}).toFile("public/ressources/livret-apercu-"+i+".webp")}})()' "$SCRATCH/livret"` (depuis la racine du dépôt)
Expected: trois `.webp` de 620 px de large.

Mettre à jour `LIVRET_FILES` dans `lib/ressources.ts` si le nombre de pages a changé (`meta: "DOCX · N pages"`).

- [ ] **Step 4: Supprimer l'ancien script**

```bash
git rm scripts/livret-accueil/build-livret.cjs scripts/livret-accueil/contenu.cjs
```

- [ ] **Step 5: Commit**

```bash
git add scripts/livret-accueil public/ressources lib/ressources.ts
git commit -m "refactor(livret): le modèle Word lit lib/livret/contenu.ts"
```

---

### Task 3: Le PDF généré dans le navigateur

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `components/livret/LivretPdf.tsx`

**Interfaces:**
- Consumes: `type LivretRendu`, `type BlocRendu` de `@/lib/livret/livret` (tâche 1).
- Produces: `export async function genererPdf(livret: LivretRendu): Promise<Blob>`. Module importé **uniquement** dynamiquement (`await import("@/components/livret/LivretPdf")`).

- [ ] **Step 1: Installer la dépendance**

Run: `npm install @react-pdf/renderer@4.9.0 --save-exact`
Puis: `npm audit --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const v=JSON.parse(s).vulnerabilities;console.log(v["@react-pdf/renderer"]?"FAILLE":"ok")})'`
Expected: `ok`. Si une faille est signalée sur `@react-pdf/renderer`, s'arrêter et en parler à Willy.

- [ ] **Step 2: Écrire `components/livret/LivretPdf.tsx`**

```tsx
/**
 * Document PDF du livret, généré dans le navigateur.
 * Importé dynamiquement au clic sur « Télécharger » : @react-pdf/renderer
 * n'alourdit pas le chargement de la page.
 *
 * Police Helvetica intégrée au moteur (accents français couverts). Les cases
 * à cocher sont dessinées (le caractère ☐ n'existe pas dans Helvetica).
 */
import { Document, Page, View, Text, Image, StyleSheet, pdf } from "@react-pdf/renderer";
import type { BlocRendu, LivretRendu } from "@/lib/livret/livret";

const INK = "#1F2A2E", DIM = "#5B6670", LINE = "#D5DCD9", SOFT = "#F1F4F3";

const s = StyleSheet.create({
  page: { paddingTop: 56, paddingBottom: 64, paddingHorizontal: 56, fontFamily: "Helvetica", fontSize: 10.5, color: INK, lineHeight: 1.45 },
  surtitre: { fontSize: 9.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 },
  titre: { fontSize: 32, fontFamily: "Helvetica-Bold", marginBottom: 10 },
  sousTitre: { fontSize: 14, color: DIM, marginBottom: 28 },
  logo: { maxWidth: 160, maxHeight: 64, objectFit: "contain", marginBottom: 36 },
  h1: { fontSize: 17, fontFamily: "Helvetica-Bold", paddingBottom: 5, borderBottomWidth: 1.2, marginTop: 18, marginBottom: 10 },
  h2: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 12, marginBottom: 5 },
  p: { marginBottom: 6 },
  table: { borderWidth: 0.6, borderColor: LINE, marginBottom: 8 },
  row: { flexDirection: "row", borderBottomWidth: 0.6, borderBottomColor: LINE },
  rowLast: { flexDirection: "row" },
  cellLabel: { width: 130, backgroundColor: SOFT, padding: 6, fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  cellValue: { flex: 1, padding: 6, fontSize: 9.5 },
  item: { flexDirection: "row", marginBottom: 3 },
  puce: { width: 14 },
  caseBox: { width: 8, height: 8, borderWidth: 0.8, borderColor: INK, marginTop: 2.5, marginRight: 6 },
  itemTexte: { flex: 1 },
  pied: { position: "absolute", bottom: 28, left: 56, right: 56, textAlign: "center", fontSize: 8, color: DIM },
});

function Bloc({ b, couleur }: { b: BlocRendu; couleur: string }) {
  return (
    <View>
      {b.titre ? <Text style={[s.h2, { color: couleur }]}>{b.titre}</Text> : null}
      {b.type === "tableau" && (
        <View style={s.table} wrap={false}>
          {b.lignes.map((l, i) => (
            <View key={l.label} style={i === b.lignes.length - 1 ? s.rowLast : s.row}>
              <Text style={s.cellLabel}>{l.label}</Text>
              <Text style={s.cellValue}>{l.valeur}</Text>
            </View>
          ))}
        </View>
      )}
      {b.type === "texte" && <Text style={s.p}>{b.texte}</Text>}
      {b.type === "liste" && b.items.map(item => (
        <View key={item} style={s.item} wrap={false}>
          {b.style === "cases" ? <View style={s.caseBox} /> : <Text style={s.puce}>•</Text>}
          <Text style={s.itemTexte}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function LivretDocument({ livret }: { livret: LivretRendu }) {
  const { couverture: c, couleur } = livret;
  const pied = livret.pied ? (
    <Text style={s.pied} fixed render={({ pageNumber }) => `${livret.pied}  ·  ${pageNumber}`} />
  ) : (
    <Text style={s.pied} fixed render={({ pageNumber }) => `${pageNumber}`} />
  );
  return (
    <Document creator="Timevo" producer="Timevo" title={c.sousTitre}>
      <Page size="A4" style={s.page}>
        <View style={{ marginTop: 90 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de @react-pdf/renderer, sans attribut alt */}
          {livret.logo ? <Image src={livret.logo} style={s.logo} /> : null}
          {c.surtitre ? <Text style={[s.surtitre, { color: couleur }]}>{c.surtitre}</Text> : null}
          <Text style={s.titre}>{c.titre}</Text>
          <Text style={s.sousTitre}>{c.sousTitre}</Text>
          {c.tableau.length > 0 && <Bloc b={{ type: "tableau", lignes: c.tableau }} couleur={couleur} />}
          {c.intro ? <Text style={[s.p, { marginTop: 18 }]}>{c.intro}</Text> : null}
        </View>
        {pied}
      </Page>
      <Page size="A4" style={s.page}>
        {livret.sections.map((sec, i) => (
          <View key={sec.titre} break={i > 0 && sec.sautAvant}>
            <Text style={[s.h1, { borderBottomColor: couleur }]} minPresenceAhead={60}>{sec.titre}</Text>
            {sec.blocs.map((b, j) => <Bloc key={j} b={b} couleur={couleur} />)}
          </View>
        ))}
        {pied}
      </Page>
    </Document>
  );
}

export async function genererPdf(livret: LivretRendu): Promise<Blob> {
  return pdf(<LivretDocument livret={livret} />).toBlob();
}
```

- [ ] **Step 3: Vérifier les types**

Run: `npx tsc --noEmit`
Expected: code 0. Si `minPresenceAhead`, `break`, `fixed` ou `render` sont refusés par les types installés, lire `node_modules/@react-pdf/renderer/index.d.ts` et ajuster le nom exact de la prop ; ne pas les retirer sans remplacement (ils évitent les titres orphelins en bas de page).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json components/livret/LivretPdf.tsx
git commit -m "feat(livret): document PDF généré dans le navigateur"
```

(Le rendu du PDF est vérifié de bout en bout dans la tâche 5.)

---

### Task 4: Le générateur et sa page

**Files:**
- Create: `components/livret/Apercu.tsx`
- Create: `components/livret/Generateur.tsx`
- Create: `app/[locale]/ressources/livret-accueil-airbnb/creer/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `ETAPES`, `type Champ` (`@/lib/livret/contenu`) ; `brouillonVide`, `restaurerBrouillon`, `construireLivret`, `nomFichier`, `couleurValide`, `CLE_BROUILLON`, `type LivretData`, `type LivretRendu` (`@/lib/livret/livret`) ; `genererPdf` (import dynamique, tâche 3) ; `NavDkdp`, `FooterDkdp`, `Breadcrumb`, `Arrow`, `PillGhost` (existants).
- Produces: `export default function Generateur()` (client), `export default function Apercu({ livret }: { livret: LivretRendu })`. Attributs stables pour le scénario de la tâche 5 : `data-etape="<id>"` sur le formulaire de chaque étape, `name="<idDuChamp>"` sur chaque champ, `data-action="suivant" | "precedent" | "telecharger" | "effacer"` sur les boutons, `input[name="logo"]`, `input[name="couleur"]`, `data-apercu` sur la racine de l'aperçu, `role="tab"` sur les onglets mobile.

- [ ] **Step 1: Écrire `components/livret/Apercu.tsx`**

```tsx
import type { BlocRendu, LivretRendu } from "@/lib/livret/livret";

/** Aperçu HTML du livret : mêmes blocs que le PDF (construireLivret). Papier blanc, quel que soit le thème du site. */
const papier = {
  background: "#ffffff", color: "#1F2A2E", borderRadius: 12, padding: "36px 32px",
  boxShadow: "0 1px 0 rgba(0,0,0,.04)", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13, lineHeight: 1.5,
} as const;

function Bloc({ b, couleur }: { b: BlocRendu; couleur: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {b.titre && <div style={{ fontWeight: 700, color: couleur, margin: "12px 0 6px" }}>{b.titre}</div>}
      {b.type === "tableau" && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <tbody>
            {b.lignes.map(l => (
              <tr key={l.label}>
                <th style={{ textAlign: "left", width: "34%", background: "#F1F4F3", border: "1px solid #D5DCD9", padding: "6px 8px", verticalAlign: "top" }}>{l.label}</th>
                <td style={{ border: "1px solid #D5DCD9", padding: "6px 8px" }}>{l.valeur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {b.type === "texte" && <p style={{ margin: "0 0 6px", whiteSpace: "pre-line" }}>{b.texte}</p>}
      {b.type === "liste" && (
        <ul style={{ margin: 0, paddingLeft: b.style === "cases" ? 0 : 18, listStyle: b.style === "cases" ? "none" : "disc" }}>
          {b.items.map(item => (
            <li key={item} style={{ marginBottom: 3 }}>
              {b.style === "cases" && <span aria-hidden="true" style={{ display: "inline-block", width: 10, height: 10, border: "1px solid #1F2A2E", marginRight: 8 }} />}
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Apercu({ livret }: { livret: LivretRendu }) {
  const { couverture: c, couleur } = livret;
  return (
    <div data-apercu style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={papier}>
        {/* eslint-disable-next-line @next/next/no-img-element -- logo local (data URL), jamais envoyé */}
        {livret.logo && <img src={livret.logo} alt="Logo de la conciergerie" style={{ maxWidth: 140, maxHeight: 56, objectFit: "contain", marginBottom: 24 }} />}
        {c.surtitre && <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: couleur, marginBottom: 8 }}>{c.surtitre}</div>}
        <div style={{ fontWeight: 700, fontSize: 28, lineHeight: 1.1, marginBottom: 8 }}>{c.titre}</div>
        <div style={{ color: "#5B6670", fontSize: 15, marginBottom: 20 }}>{c.sousTitre}</div>
        {c.tableau.length > 0 && <Bloc b={{ type: "tableau", lignes: c.tableau }} couleur={couleur} />}
        {c.intro && <p style={{ margin: "14px 0 0", whiteSpace: "pre-line" }}>{c.intro}</p>}
      </div>
      {livret.sections.length > 0 && (
        <div style={papier}>
          {livret.sections.map(sec => (
            <section key={sec.titre} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 18, borderBottom: `2px solid ${couleur}`, paddingBottom: 4, marginBottom: 8 }}>{sec.titre}</div>
              {sec.blocs.map((b, i) => <Bloc key={i} b={b} couleur={couleur} />)}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Écrire `components/livret/Generateur.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ETAPES, type Champ } from "@/lib/livret/contenu";
import {
  brouillonVide, restaurerBrouillon, construireLivret, nomFichier, couleurValide,
  CLE_BROUILLON, type LivretData,
} from "@/lib/livret/livret";
import Apercu from "./Apercu";
import { Arrow } from "../primitives";

const LOGO_MAX = 1024 * 1024;

const label = { display: "block", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 } as const;
const champStyle = {
  width: "100%", boxSizing: "border-box", padding: "11px 13px", background: "var(--bg)", color: "var(--text)",
  border: "1px solid var(--border-strong)", borderRadius: 12, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.5,
} as const;
const bouton = {
  display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 999, cursor: "pointer",
  fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600,
} as const;

function lire(): LivretData {
  try {
    const brut = window.localStorage.getItem(CLE_BROUILLON);
    return brut ? restaurerBrouillon(JSON.parse(brut)) : brouillonVide();
  } catch {
    return brouillonVide();
  }
}

function ecrire(data: LivretData) {
  try { window.localStorage.setItem(CLE_BROUILLON, JSON.stringify(data)); } catch { /* stockage indisponible : pas de brouillon */ }
}

function ChampSaisie({ c, valeur, onChange }: { c: Champ; valeur: string; onChange: (v: string) => void }) {
  const id = `livret-${c.id}`;
  const commun = { id, name: c.id, value: valeur, placeholder: c.exemple, onChange: (e: { target: { value: string } }) => onChange(e.target.value), style: champStyle };
  return (
    <div>
      <label htmlFor={id} style={label}>
        {c.label}
        {c.type === "liste" && <span style={{ fontWeight: 400, color: "var(--dim)" }}> · une ligne par élément</span>}
      </label>
      {c.type === "court" ? <input type="text" maxLength={300} {...commun} /> : <textarea rows={c.type === "liste" ? 5 : 3} maxLength={4000} {...commun} />}
    </div>
  );
}

export default function Generateur() {
  const [data, setData] = useState<LivretData>(brouillonVide);
  const [charge, setCharge] = useState(false);
  const [etape, setEtape] = useState(0);
  const [onglet, setOnglet] = useState<"saisie" | "apercu">("saisie");
  const [erreurLogo, setErreurLogo] = useState("");
  const [pdfEtat, setPdfEtat] = useState<"idle" | "encours" | "erreur" | "ok">("idle");
  const [confirmeEffacer, setConfirmeEffacer] = useState(false);
  const haut = useRef<HTMLDivElement>(null);

  // Le brouillon n'est lu qu'après le montage : le rendu serveur reste identique au premier rendu client.
  useEffect(() => { setData(lire()); setCharge(true); }, []);
  useEffect(() => { if (charge) ecrire(data); }, [data, charge]);

  const livret = useMemo(() => construireLivret(data), [data]);
  const e = ETAPES[etape];
  const derniere = etape === ETAPES.length - 1;

  const maj = (id: string, v: string) => setData(d => ({ ...d, valeurs: { ...d.valeurs, [id]: v } }));
  const aller = (i: number) => { setEtape(i); setPdfEtat("idle"); haut.current?.scrollIntoView({ block: "start" }); };

  function choisirLogo(fichier: File | undefined) {
    setErreurLogo("");
    if (!fichier) return;
    if (!["image/png", "image/jpeg"].includes(fichier.type)) { setErreurLogo("Format accepté : PNG ou JPG."); return; }
    if (fichier.size > LOGO_MAX) { setErreurLogo("Le logo doit faire moins de 1 Mo."); return; }
    const lecteur = new FileReader();
    lecteur.onload = () => setData(d => ({ ...d, marque: { ...d.marque, logo: String(lecteur.result) } }));
    lecteur.readAsDataURL(fichier);
  }

  async function telecharger() {
    setPdfEtat("encours");
    try {
      const { genererPdf } = await import("./LivretPdf");
      const blob = await genererPdf(livret);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = nomFichier(data);
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setPdfEtat("ok");
    } catch (err) {
      console.error("[livret] génération PDF :", err);
      setPdfEtat("erreur");
    }
  }

  function effacer() {
    if (!confirmeEffacer) { setConfirmeEffacer(true); return; }
    try { window.localStorage.removeItem(CLE_BROUILLON); } catch { /* rien à effacer */ }
    setData(brouillonVide()); setConfirmeEffacer(false); aller(0);
  }

  return (
    <div ref={haut} className="livret-gen" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 40, alignItems: "start" }}>
      <div className="livret-tabs" role="tablist" aria-label="Affichage" style={{ display: "none", gap: 8 }}>
        {(["saisie", "apercu"] as const).map(o => (
          <button key={o} type="button" role="tab" aria-selected={onglet === o} onClick={() => setOnglet(o)} style={{
            ...bouton, padding: "9px 16px", border: "1px solid var(--border-strong)",
            background: onglet === o ? "var(--card-soft)" : "transparent", color: "var(--text)",
          }}>{o === "saisie" ? "Remplir" : "Aperçu"}</button>
        ))}
      </div>

      <div className="livret-saisie" data-visible={onglet === "saisie"} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: 28 }}>
        <ol aria-label="Étapes" style={{ display: "flex", flexWrap: "wrap", gap: 6, listStyle: "none", padding: 0, margin: "0 0 24px" }}>
          {ETAPES.map((x, i) => (
            <li key={x.id}>
              <button type="button" onClick={() => aller(i)} aria-current={i === etape ? "step" : undefined} style={{
                ...bouton, padding: "6px 12px", fontSize: 12, fontWeight: 500,
                border: `1px solid ${i === etape ? "var(--accent)" : "var(--border-strong)"}`,
                background: i === etape ? "var(--accent-tint)" : "transparent", color: "var(--text)",
              }}>{i + 1}. {x.titre}</button>
            </li>
          ))}
        </ol>

        <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 26, fontWeight: 500, letterSpacing: "-0.03em", margin: "0 0 6px", color: "var(--text)" }}>{e.titre}</h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--dim)", margin: "0 0 24px" }}>{e.intro}</p>

        <form data-etape={e.id} onSubmit={ev => ev.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {etape === 0 && (
            <div className="livret-marque" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 140px", gap: 16 }}>
              <div>
                <label htmlFor="livret-logo" style={label}>Logo <span style={{ fontWeight: 400, color: "var(--dim)" }}>· PNG ou JPG, 1 Mo maximum</span></label>
                <input id="livret-logo" name="logo" type="file" accept="image/png,image/jpeg" onChange={ev => choisirLogo(ev.target.files?.[0])}
                  style={{ ...champStyle, padding: 9, fontSize: 13 }} />
                {erreurLogo && <p role="alert" style={{ color: "#ff8a8a", fontSize: 13, margin: "6px 0 0" }}>{erreurLogo}</p>}
                {data.marque.logo && (
                  <button type="button" onClick={() => setData(d => ({ ...d, marque: { ...d.marque, logo: null } }))}
                    style={{ ...bouton, padding: "6px 0", border: "none", background: "none", color: "var(--accent-soft)", fontSize: 13 }}>Retirer le logo</button>
                )}
              </div>
              <div>
                <label htmlFor="livret-couleur" style={label}>Couleur</label>
                <input id="livret-couleur" name="couleur" type="color" value={data.marque.couleur}
                  onChange={ev => setData(d => ({ ...d, marque: { ...d.marque, couleur: couleurValide(ev.target.value) } }))}
                  style={{ ...champStyle, padding: 4, height: 46 }} />
              </div>
            </div>
          )}
          {e.champs.map(c => <ChampSaisie key={c.id} c={c} valeur={data.valeurs[c.id] ?? ""} onChange={v => maj(c.id, v)} />)}
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28, alignItems: "center" }}>
          {etape > 0 && (
            <button type="button" data-action="precedent" onClick={() => aller(etape - 1)}
              style={{ ...bouton, border: "1px solid var(--border-strong)", background: "transparent", color: "var(--text)" }}>Précédent</button>
          )}
          {!derniere ? (
            <button type="button" data-action="suivant" onClick={() => aller(etape + 1)}
              style={{ ...bouton, border: "none", background: "var(--accent-gradient)", color: "#fff" }}>Suivant <Arrow color="#fff" size={13} /></button>
          ) : (
            <button type="button" data-action="telecharger" onClick={telecharger} disabled={pdfEtat === "encours"}
              style={{ ...bouton, border: "none", background: "var(--accent-gradient)", color: "#fff", opacity: pdfEtat === "encours" ? 0.7 : 1 }}>
              {pdfEtat === "encours" ? "Préparation du PDF…" : "Télécharger mon livret (PDF)"}
            </button>
          )}
        </div>
        {pdfEtat === "erreur" && (
          <p role="alert" style={{ color: "#ff8a8a", fontSize: 14, margin: "14px 0 0" }}>
            Le PDF n&apos;a pas pu être généré. <button type="button" onClick={telecharger} style={{ background: "none", border: "none", color: "var(--accent-soft)", cursor: "pointer", padding: 0, fontSize: 14 }}>Réessayer</button>
          </p>
        )}
        {pdfEtat === "ok" && (
          <p role="status" style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--dim)", margin: "14px 0 0" }}>
            Votre livret est téléchargé. Il reste enregistré dans ce navigateur : vous pouvez revenir le modifier.
          </p>
        )}
        <button type="button" data-action="effacer" onClick={effacer}
          style={{ ...bouton, marginTop: 20, padding: 0, border: "none", background: "none", color: "var(--dim)", fontSize: 13, fontWeight: 500 }}>
          {confirmeEffacer ? "Confirmer : tout effacer" : "Effacer mon brouillon"}
        </button>
      </div>

      <div className="livret-apercu" data-visible={onglet === "apercu"} style={{ position: "sticky", top: 96 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
          Aperçu
        </div>
        <Apercu livret={livret} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Écrire `app/[locale]/ressources/livret-accueil-airbnb/creer/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import Breadcrumb from "@/components/Breadcrumb";
import Generateur from "@/components/livret/Generateur";
import { Arrow, PillGhost } from "@/components/primitives";
import { GENERATEUR, LIVRET_PATH } from "@/lib/ressources";

const BASE = "https://www.timevo.io";
const URL = `${BASE}${LIVRET_PATH}/creer`;

// Page française uniquement (cf. lib/ressources.ts) : /en/... renvoie 404.
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "fr") return {};
  return {
    title: GENERATEUR.metaTitle,
    description: GENERATEUR.metaDescription,
    alternates: { canonical: URL },
    openGraph: { title: GENERATEUR.metaTitle, description: GENERATEUR.metaDescription, url: URL, siteName: "Timevo", locale: "fr_FR", type: "website" },
  };
}

export default async function CreerLivretPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "fr") notFound();
  setRequestLocale(locale);

  return (
    <>
      <NavDkdp />
      <main>
        <Breadcrumb label="Fil d'Ariane" items={[
          { href: "/fr", label: "Accueil" },
          { href: LIVRET_PATH, label: "Livret d'accueil" },
          { label: "Créer mon livret" },
        ]} />
        <section style={{ padding: "48px 28px 96px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h1 style={{
              fontFamily: "var(--font-sans)", fontSize: "clamp(34px, 4.6vw, 60px)", fontWeight: 500,
              letterSpacing: "-0.05em", lineHeight: 1.0, margin: "0 0 16px", color: "var(--text)",
            }}>{GENERATEUR.h1}</h1>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.5, color: "var(--dim)", margin: "0 0 40px", maxWidth: 640 }}>
              {GENERATEUR.subtitle}
            </p>
            <Generateur />
          </div>
        </section>
        <section style={{ padding: "72px 28px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.5, color: "var(--dim)", margin: 0, maxWidth: 640 }}>{GENERATEUR.bridge}</p>
            <PillGhost href="/fr/automatisation-pour/conciergerie" large>{GENERATEUR.bridgeCta} <Arrow size={14} /></PillGhost>
          </div>
        </section>
      </main>
      <FooterDkdp />
    </>
  );
}
```

- [ ] **Step 4: Ajouter les textes dans `lib/ressources.ts`**

À la fin du fichier :

```ts
export const GENERATEUR = {
  metaTitle: "Créer son livret d'accueil Airbnb en ligne",
  metaDescription:
    "Créez votre livret d'accueil Airbnb en ligne : arrivée, Wi-Fi, règles, bonnes adresses, départ. Votre logo, votre couleur, un PDF prêt à envoyer. Gratuit.",
  h1: "Créez votre livret d'accueil.",
  subtitle:
    "Six étapes, un aperçu en direct, et un PDF à votre marque prêt à envoyer à vos voyageurs. Vos informations restent dans votre navigateur : rien n'est envoyé.",
  bridge:
    "Chez les conciergeries qu'on accompagne, ce livret devient un guide voyageur digital, multilingue, avec un assistant qui répond aux voyageurs à toute heure.",
  bridgeCta: "Voir l'offre conciergerie",
};
```

- [ ] **Step 5: Ajouter le CSS dans `app/globals.css`**

Dans le bloc `@media (max-width: 900px)`, après la règle `.livret-digital figure` :

```css
  .livret-gen {
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 16px !important;
  }
  .livret-tabs {
    display: flex !important;
  }
  .livret-saisie[data-visible="false"],
  .livret-apercu[data-visible="false"] {
    display: none !important;
  }
  .livret-apercu {
    position: static !important;
  }
```

Dans le bloc `@media (max-width: 600px)`, après la règle `#telecharger` :

```css
  .livret-saisie {
    padding: 20px !important;
  }
  .livret-marque {
    grid-template-columns: minmax(0, 1fr) !important;
  }
```

- [ ] **Step 6: Vérifier les types et la page**

Run: `npx tsc --noEmit`
Expected: code 0.

Lancer le serveur de dev (`npx next dev -p 3456` en arrière-plan), puis :
Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3456/fr/ressources/livret-accueil-airbnb/creer` et la même chose avec `/en/`
Expected: `200` puis `404`.

- [ ] **Step 7: Commit**

```bash
git add components/livret app/[locale]/ressources/livret-accueil-airbnb/creer lib/ressources.ts app/globals.css
git commit -m "feat(livret): générateur en ligne avec aperçu et brouillon"
```

---

### Task 5: Vitrine, sitemap et vérification de bout en bout

**Files:**
- Modify: `app/[locale]/ressources/livret-accueil-airbnb/page.tsx`
- Modify: `lib/ressources.ts` (objet `LIVRET`)
- Modify: `app/sitemap.ts`
- Create: `scripts/livret-accueil/e2e-generateur.mjs`

**Interfaces:**
- Consumes: attributs stables de la tâche 4 (`data-etape`, `name`, `data-action`, `data-apercu`, `role="tab"`), `LIVRET_PATH`.
- Produces: scénario `node scripts/livret-accueil/e2e-generateur.mjs <baseUrl> <dossierSortie>`, code de sortie 0 si tout passe.

- [ ] **Step 1: Bouton « Créer mon livret en ligne » sur la vitrine**

Dans `lib/ressources.ts`, objet `LIVRET`, ajouter :

```ts
  creerCta: "Créer mon livret en ligne",
  creerNote: "Gratuit, sans inscription. Ou recevez le modèle Word ci-contre.",
```

et remplacer `formH2: "Recevez le modèle."` par `formH2: "Ou recevez le modèle Word."`.

Dans `app/[locale]/ressources/livret-accueil-airbnb/page.tsx`, importer `PillPrimary` depuis `@/components/primitives` (à côté de `Arrow, MonoLabel, PillGhost`) et insérer, juste après le paragraphe `{LIVRET.subtitle}` du hero :

```tsx
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", margin: "0 0 36px" }}>
                <PillPrimary href={`${LIVRET_PATH}/creer`} large>
                  {LIVRET.creerCta} <Arrow color="#fff" size={14} />
                </PillPrimary>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)" }}>{LIVRET.creerNote}</span>
              </div>
```

et ramener la marge basse du paragraphe `{LIVRET.subtitle}` de `"28px 0 40px"` à `"28px 0 28px"`.

- [ ] **Step 2: Ajouter le générateur au sitemap**

Dans `app/sitemap.ts`, juste après l'entrée `${BASE}${LIVRET_PATH}` :

```ts
    {
      url: `${BASE}${LIVRET_PATH}/creer`,
      lastModified: UPDATED.ressources,
      changeFrequency: "monthly",
      priority: 0.6,
    },
```

et mettre le commentaire de `ressources` à `// livret d'accueil : modèle Word et générateur en ligne`.

- [ ] **Step 3: Écrire le scénario `scripts/livret-accueil/e2e-generateur.mjs`**

```js
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
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGElEQVR42mNk+M9Qz0AEYBxVSF+FAAhKDveksOjmAAAAAElFTkSuQmCC",
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
  for (let i = 0; i < 4; i++) await p.click('[data-action="suivant"]');
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
```

- [ ] **Step 4: Lancer le scénario**

Le serveur de dev doit tourner (redémarré avec `.next/dev` supprimé si le CSS a changé).
Run: `node scripts/livret-accueil/e2e-generateur.mjs http://localhost:3456 "$SCRATCH/e2e"`
Expected: cinq lignes `ok`, code 0.

- [ ] **Step 5: Relire le contenu du PDF**

Run: `cd "$SCRATCH/e2e" && python -c "import fitz; d=fitz.open('livret-accueil-chalet-des-pins.pdf'); t=d[0].get_text()+d[1].get_text(); print(len(d)); print(t[:1500])"`
Expected, à vérifier dans la sortie :
- « CONCIERGERIE TEST », « Bienvenue chez vous. », « Livret d'accueil · Chalet des Pins » ;
- « Votre contact » avec « Alex, 01 99 00 55 66 » ; « Départ » avec « Avant 10 h » ;
- « 1234A » ; **pas** de ligne « Médecin le plus proche » (champ vidé) ; aucun texte d'exemple (« Conciergerie Rive Gauche », « Le Loft du Marais ») ;
- aucun « Timevo » dans le texte des pages.

Puis rendre les pages en PNG (`get_pixmap(dpi=60)`) et vérifier visuellement : logo en tête de couverture, titres et filets dans la couleur `#aa3355`, cases dessinées dans « Avant de partir », pas de titre orphelin en bas de page.

- [ ] **Step 6: Relire les captures**

Lire `generateur-desktop.jpg`, `generateur-375-saisie.jpg`, `generateur-375-apercu.jpg` : rien ne déborde, aperçu lisible, boutons visibles.

- [ ] **Step 7: Vérifier la vitrine et le sitemap**

Run: `curl -s http://localhost:3456/fr/ressources/livret-accueil-airbnb | grep -c "Créer mon livret en ligne"` puis `curl -s http://localhost:3456/sitemap.xml | grep -c "livret-accueil-airbnb/creer"`
Expected: `1` (ou plus) et `1`.

- [ ] **Step 8: Commit**

```bash
git add app/[locale]/ressources/livret-accueil-airbnb/page.tsx lib/ressources.ts app/sitemap.ts scripts/livret-accueil/e2e-generateur.mjs
git commit -m "feat(livret): bouton vers le générateur, sitemap, scénario de bout en bout"
```

- [ ] **Step 9: Demander à Willy l'accord pour pousser**

Montrer les captures et le PDF. Pousser sur `master` seulement après son accord explicite, puis vérifier sur https://www.timevo.io/fr/ressources/livret-accueil-airbnb/creer (200, génération d'un PDF en production avec le scénario pointé sur `https://www.timevo.io`).
