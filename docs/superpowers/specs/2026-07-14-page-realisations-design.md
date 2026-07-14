# Page Réalisations — design

Date : 2026-07-14
Statut : validé par Willy, prêt pour le plan d'implémentation

## Objectif

Donner à Timevo une page qui montre les sites livrés. Elle sert la crédibilité, pas l'acquisition : Max l'envoie à un prospect en cold ou après un audit, le prospect vérifie que Timevo sait construire un site qui travaille.

Trois sites au lancement :

| Site | URL | Ce que c'est |
|---|---|---|
| Mon Espace Piscine | https://www.monespacepiscine.fr/ | Vitrine multi-pages d'un pisciniste à Publier (74) : magasin, prestations, réalisations, demande de devis |
| Agence Laverne | https://www.agencelavernepaysagistes.fr/ | Portail éditorial habitat & jardin : quiz de qualification, guides de prix, blog |
| Agence de Traduction Juridique | https://www.agence-traduction-juridique.fr/ | Vitrine + générateur de devis en ligne |

## Structure retenue

**Option 1 — page unique, trois cartes.** Une URL, `/[locale]/realisations`. Titre, sous-titre, grille de trois cartes (capture d'écran, activité, nom, une phrase sur ce qui a été construit, chips de prestations, lien vers le site en production), puis le bloc contact existant.

Écartées :
- *Index + page détail par projet* — meilleure pour le SEO, mais les cases « Résultat » resteraient vides tant que Mon Espace Piscine n'a pas fourni de chiffres. À reprendre quand ces chiffres existent : cette option devient alors un ajout, pas une refonte.
- *Un cas client en grand + galerie* — plus honnête sur l'asymétrie, mais Willy ne veut pas hiérarchiser les trois sites.

## Contrainte éditoriale (non négociable)

Les trois cartes sont traitées à l'identique : **aucun badge, aucune mention distinguant client et projet interne**. Le titre de section couvre les trois sans mentir (« Sites conçus et développés par Timevo »).

En revanche, la page **n'affirme pas** que les trois sites sont des commandes clients. Concrètement, elle ne contient :
- aucun nom de donneur d'ordre autre que celui de Mon Espace Piscine ;
- aucun témoignage ;
- aucun résultat chiffré non vérifiable.

Un chiffre n'apparaît sur une carte que s'il est réel et vérifiable. Le premier candidat est Mon Espace Piscine, si le client fournit une métrique (demandes de devis, délai de réponse). D'ici là, aucune carte n'affiche de chiffre.

## Architecture

La page suit exactement le pattern de `Pillars` + `app/[locale]/solutions/page.tsx`, déjà en place :

**`lib/realisations.ts`** — les données non traduisibles, dans l'ordre d'affichage :

```ts
export const REALISATIONS = [
  { slug: "mon-espace-piscine", url: "https://www.monespacepiscine.fr/", image: "/realisations/mon-espace-piscine.jpg" },
  { slug: "agence-laverne", url: "https://www.agencelavernepaysagistes.fr/", image: "/realisations/agence-laverne.jpg" },
  { slug: "agence-traduction-juridique", url: "https://www.agence-traduction-juridique.fr/", image: "/realisations/agence-traduction-juridique.jpg" },
] as const;
```

Ajouter un site = une entrée ici + une entrée dans `messages/fr.json` et `messages/en.json` + une capture. Rien d'autre.

**`messages/{fr,en}.json`** — namespace `realisations`, sur le modèle de `pillars` :

```json
"realisations": {
  "meta_title": "...",
  "meta_description": "...",
  "eyebrow": "RÉALISATIONS",
  "h1_line1": "Des sites qui travaillent.",
  "h1_line2": "Pas des vitrines.",
  "subtitle": "...",
  "cta_site": "Voir le site",
  "items": [
    { "meta": "Pisciniste — Publier (74)", "title": "Mon Espace Piscine", "description": "...", "chips": ["Site vitrine", "Devis en ligne", "SEO local"] }
  ]
}
```

L'index de `items` est aligné sur celui de `REALISATIONS` — même contrat implicite que `Pillars`/`SLUGS` aujourd'hui.

**`components/Realisations.tsx`** — server component. Grille `repeat(3, 1fr)`, gap 16. Carte : `background: var(--card)`, `border: 1px solid var(--border)`, `border-radius: 24`, capture en tête (bordure basse), puis meta mono, `h3`, description, chips, lien `Voir le site →` en `var(--accent-soft)` avec `<Arrow />`. Lien externe : `target="_blank" rel="noopener noreferrer"`, libellé accessible incluant le nom du site.

**`app/[locale]/realisations/page.tsx`** — copie de la structure de `solutions/page.tsx` :
- `generateStaticParams` sur les deux locales, `isValidLocale` + `notFound()`
- `generateMetadata` : title, description, `alternates.canonical` + hreflang fr/en/x-default, OpenGraph, Twitter card, `og-image.png`
- JSON-LD `BreadcrumbList` (Accueil → Réalisations) et `CollectionPage` dont `hasPart` liste les trois sites en `CreativeWork` avec leur URL
- Corps : `<NavDkdp />`, section hero (eyebrow, h1, subtitle), `<ScrollFadeIn><Realisations /></ScrollFadeIn>`, `<ScrollFadeIn><ContactCard /></ScrollFadeIn>`, `<FooterDkdp />`, `<StickyMobileCta />`

**Captures** — `scripts/capture-realisations.mjs`, Playwright (déjà dans les dépendances). Viewport 1280×800, `deviceScaleFactor` 0.62, JPEG qualité 74, sortie `public/realisations/<slug>.jpg` (~45 Ko pièce). Le script accepte les bannières cookies courantes avant de capturer. Rejouable quand un site change.

Affichage via `<img>` simple (`width={794} height={496}`, `loading="lazy"`, `decoding="async"`) et non `next/image` : le codebase n'utilise aucune image bitmap ni `next/image` aujourd'hui, et le gain d'optimisation sur trois JPEG de ~45 Ko ne justifie pas d'introduire le composant — d'autant que l'AGENTS.md prévient que les API de cette version de Next diffèrent.

**Navigation** — nouvelle entrée `realisations` dans le namespace `nav`, ajoutée à `otherLinks` de `NavDkdp` entre `methode` et `resultats`, href `/${locale}/realisations`. Elle apparaît automatiquement dans le menu mobile, qui itère sur la même liste.

**Sitemap** — deux entrées dans `app/sitemap.ts` (`/fr/realisations` priorité 0.8, `/en/realisations` priorité 0.7), avec le bloc `alternates.languages` habituel.

**Responsive** — `globals.css` : `.realisations-grid { grid-template-columns: repeat(3, 1fr) }`, passe à `repeat(2, 1fr)` ≤ 900 px et `1fr` ≤ 600 px, comme `.pillars-row1`.

## Ce qu'on ne fait pas

- Pas de page détail par projet (voir « Structure retenue »)
- Pas de filtre, pas de catégories, pas de pagination — trois entrées
- Pas de lightbox sur les captures : le lien mène au vrai site, c'est la preuve
- Pas de nouvelle dépendance

## Vérification

1. `npm run build` passe sans erreur ni warning nouveau
2. `/fr/realisations` et `/en/realisations` rendent les trois cartes, captures comprises
3. Les trois liens externes ouvrent le bon site dans un nouvel onglet
4. Rendu correct en 1440 px, 900 px et 390 px
5. Le lien Réalisations apparaît dans la nav desktop et dans le menu mobile, sur les deux locales
6. `/sitemap.xml` contient les deux nouvelles URL
7. Relecture de la copie : aucune carte n'affirme une relation client qui n'existe pas, aucun chiffre non vérifiable
