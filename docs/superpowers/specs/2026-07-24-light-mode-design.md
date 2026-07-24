# Bascule du site en light mode

Date : 2026-07-24
Statut : implémenté

## Décision

Le site passe intégralement en thème clair. Le thème sombre disparaît — pas de toggle,
pas de `prefers-color-scheme`, un seul thème à maintenir.

Direction retenue : **blanc froid + accent indigo**. C'est l'inversion directe de la
structure sombre actuelle : mêmes rôles de tokens, mêmes contrastes relatifs, teinte
d'accent assombrie pour rester lisible sur blanc.

## Palette

| Token | Avant (dark) | Après (light) | Rôle |
|---|---|---|---|
| `--bg` | `#0a0a0a` | `#ffffff` | fond de page |
| `--card` | `#141414` | `#f7f8fa` | surface de carte |
| `--card-soft` | `#1a1a1a` | `#f0f2f5` | surface secondaire |
| `--border` | `#262626` | `#e4e7ec` | bordure standard |
| `--border-strong` | `#333333` | `#d0d5dd` | bordure appuyée |
| `--text` | `#ededed` | `#101014` | texte principal |
| `--dim` | `#8a8a8a` | `#5a5f6b` | texte secondaire |
| `--dim-2` | `#7a7a7a` | `#71757f` | texte tertiaire |
| `--accent` | `#5fa8ff` | `#4338ca` | accent principal |
| `--accent-soft` | `#a98aff` | `#6d28d9` | accent secondaire |
| `--accent-glow` | `rgba(124,77,255,.22)` | `rgba(67,56,202,.10)` | halo → teinte plate |
| `--accent-tint` | `rgba(124,77,255,.10)` | `rgba(67,56,202,.06)` | fond teinté |
| `--accent-gradient` | `#4ec3ff → #7c4dff` | `#2563eb → #6d28d9` | dégradé de CTA |

Trois tokens ajoutés, absents du thème sombre :

- `--shadow` / `--shadow-lg` — en dark on sépare les surfaces par des bordures, en light
  par des ombres douces. Sans eux, les cartes `#f7f8fa` sur fond `#ffffff` ne se détachent
  pas et les panneaux flottants (dropdown de nav) perdent leur élévation.
- `--accent-strong` (`#3730a3`) — état hover des éléments d'accent.

Contrastes vérifiés sur `--bg` : `--text` 17:1, `--dim` 6.4:1, `--dim-2` 4.8:1,
`--accent` 7.5:1. Tous ≥ AA, les trois premiers ≥ AAA pour du corps de texte.

## `lib/theme.ts`

Deux contextes ne savent pas résoudre `var(--…)` et exigent des valeurs brutes :

- les **attributs de présentation SVG** (`fill="…"`, `stroke="…"`), parsés selon la
  grammaire SVG et non comme des déclarations CSS ;
- **Satori**, qui génère les images Open Graph hors du DOM.

Plutôt que de laisser ces hex diverger de `globals.css`, ils sont centralisés dans
`lib/theme.ts`, en miroir explicite des variables CSS. Toute modification de l'un doit
être répercutée dans l'autre.

Le même fichier expose les **couleurs de statut** des dashboards de démo. Les valeurs
Tailwind 400 d'origine (`#4ade80`, `#fbbf24`, `#f87171`) sont calibrées pour du fond
sombre et tombent sous 3:1 sur blanc ; on descend d'un cran (600/700).

## Lots de travail

### 1. Socle

`app/globals.css` : redéfinition des variables, ajout de `--shadow`, `--shadow-lg`,
`--accent-strong`. `body` et `:focus-visible` héritent sans modification.

`app/[locale]/layout.tsx` : ajout d'un export `viewport` (`colorScheme: "light"`,
`themeColor: "#ffffff"`) pour que les contrôles natifs et la barre du navigateur mobile
suivent le thème au lieu du réglage système. API vérifiée contre les docs embarquées de
Next 16.2.6.

### 2. Neutres écrits en dur

| Fichier | Valeur | Traitement |
|---|---|---|
| `NavDkdp.tsx` | `rgba(10,10,10,0.92)` | fond de nav collante → `rgba(255,255,255,0.92)` |
| `NavDkdp.tsx` | `boxShadow rgba(0,0,0,0.4)` | ombre de dropdown → `var(--shadow-lg)` |
| `Pillars.tsx` | `rgba(0,0,0,0.4)` | scrim de la pastille → blanc 0.75 + bordure |
| `LogoWall.tsx` | `#000` dans `mask-image` | **aucun** — masque, couleur non rendue |
| partout | `#fff` sur CTA en dégradé | **aucun** — reste correct |

### 3. Accents écrits en dur

`PillarIllustrations.tsx` et `lib/og.tsx` passent par `lib/theme.ts`.

L'opacité globale des SVG d'illustration monte de `0.55` à `0.8` : la valeur d'origine
était calibrée pour de l'accent clair sur fond noir et rendait délavé en indigo sur fond
pâle.

### 4. Les tuiles sombres de `TeamGrid`

Les deux dernières vignettes représentent des interfaces et **restent sombres** — un écran
affiché en dark reste crédible et donne des ancrages visuels sur une page claire.

Correction par rapport au design initial : leur anneau d'avatar ne devient pas
`var(--card)`. Ces tuiles ne peuvent consommer **aucun** token global, puisque `--dim`,
`--border-strong` et `--card-soft` sont désormais clairs — du texte gris foncé sur fond
bleu-nuit serait illisible. Elles reçoivent une palette locale `darkTile` héritée de
l'ancien thème.

Leurs halos néon n'ont pas eu besoin d'être resserrés : les conteneurs sont en
`overflow: hidden`, rien ne bave sur le fond blanc.

À noter : `messages/fr.json` ne définit que deux membres d'équipe, donc ces deux branches
(`idx === 2` et `idx === 3`) ne sont pas rendues aujourd'hui. Le correctif est défensif.

### 5. Bug corrigé en passant

`components/demo/panels.tsx` — `StatusPill` construit sa bordure et son fond par
concaténation d'un suffixe alpha : `` `${color}33` ``. La tonalité `pending` valait
`var(--accent)`, produisant `var(--accent)33`, du CSS invalide silencieusement ignoré : la
pastille « en attente » n'avait ni bordure ni fond. Toutes les tonalités sont désormais en
hex, ce que la concaténation exige.

## Hors périmètre

- Toggle de thème et respect de `prefers-color-scheme`
- Refonte typographique ou de mise en page
- Éclaircissement des mockups d'écran de `TeamGrid`
- **Favicon et apple-icon** : `app/icon.svg` est une tuile sombre à coins arrondis portant
  un « T » clair. C'est une marque autonome, pas une surface thématisée — elle reste
  lisible sur un onglet clair comme sombre, alors qu'une version blanche disparaîtrait.
  Inchangée délibérément.

## Vérification effectuée

`npm run build` — compile sans erreur.

Passage visuel sur le serveur de production local : home (hero, encadré facturation,
douleurs, six cartes piliers, dashboard de démo, estimateur, méthode, équipe, FAQ),
`/facturation-electronique`, `/mentions-legales`, pied de page.

**Non vérifié en conditions réelles** : le rendu mobile. L'outil d'automatisation
redimensionne la fenêtre mais continue de rendre un viewport fixe de 1568 px. Les chemins
mobiles ont été contrôlés par lecture — menu déroulant (`var(--bg)` + `var(--text)`) et
CTA collant (dégradé + `#fff` + anneau d'accent) sont entièrement tokenisés, et aucune
règle de mise en page responsive n'a été modifiée. À confirmer sur un vrai téléphone.
