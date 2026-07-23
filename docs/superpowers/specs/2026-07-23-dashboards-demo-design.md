# Dashboards de démo par secteur — design

Date : 2026-07-23
Statut : validé par Willy, implémentation démarrée sur pisciniste

Référence visuelle : `https://www.marineabord.fr/dashboard-artisan-demo.html`

## Objectif

Donner à chaque page secteur une preuve visuelle de ce que Timevo livre concrètement. Aujourd'hui les pages secteur décrivent des workflows en texte ; le prospect ne voit jamais à quoi ressemble le résultat. Le dashboard de démo comble ce trou.

Double usage :
- **Vente** — Max envoie l'URL en cold ou après l'audit, le prospect voit l'outil avant de payer.
- **SEO indirect** — la page est indexée et maillée depuis la page secteur, qu'elle renforce en profondeur et en temps passé.

## URLs

Route dynamique `app/[locale]/demo/[secteur]/page.tsx`, sur le modèle exact de `automatisation-pour/[secteur]`.

```
/fr/demo/pisciniste          /en/demo/pisciniste
/fr/demo/cuisiniste          /en/demo/cuisiniste
/fr/demo/panneaux-solaires   /en/demo/panneaux-solaires
```

Le slug reste court : le mot-clé sectoriel est déjà porté par `/automatisation-pour/{secteur}`, qui pointe vers la démo. Pas de `tableau-de-bord-demo-pisciniste`.

Chaque page émet : metadata + canonical + hreflang fr/en/x-default, JSON-LD `SoftwareApplication` et `BreadcrumbList` (Accueil → Solutions → Secteur → Démo), fil d'Ariane visible, bloc `RelatedLinks`. Les 6 URLs entrent dans `app/sitemap.ts` et dans le registre `lib/links.ts`.

## Contrainte éditoriale

Les données sont **entièrement fictives**. La page doit le dire sans ambiguïté, et le dire *pendant* la lecture, pas seulement à la fin.

Deux dispositifs cumulés :

1. **Filigrane « DÉMO »** répété en fond de chaque panneau de données. `var(--font-mono)`, opacité ~0.04, `aria-hidden`, non sélectionnable. Assez présent pour être vu, assez discret pour ne pas casser la DA minimaliste.
2. **Mention explicite en pied de page**, alignée sur la formule déjà utilisée par les pages secteur : « Scénario type, pas un client existant. Les chiffres réels sont validés lors de l'audit gratuit. »

Ce que la page ne fait jamais : présenter ces données comme des résultats clients Timevo, ni nommer un client réel, ni afficher un témoignage.

## Structure d'une page

Six sections, calquées sur la référence :

| Section | Contenu |
|---|---|
| Barre KPI | 4 métriques : devis en cours, CA récupéré, appels traités par l'IA, demandes reçues |
| Suivi des devis | Tableau, timeline de relances J+3 / J+7, statut Signé / Perdu / En cours |
| Agent IA vocal | Transcriptions d'appels dépliables, alertes horodatées, action associée |
| Demandes qualifiées | Score de sérieux 0–100, email prérédigé, motif de disqualification |
| Facturation & TVA | CA encaissé, TVA collectée, répartition B2C/B2B en donut, tableau de factures |
| CTA | Audit gratuit, vers le Calendly existant |

L'ossature est commune aux trois secteurs. Seules changent les données, le vocabulaire métier et la saisonnalité.

## Architecture

**Données** — `lib/demoDashboards.ts`, structure `Record<secteur, Record<Locale, DemoDashboard>>`, exactement le pattern de `SECTORS` (`lib/sectors.ts`) et `CITIES` (`lib/cities.ts`).

**Composants** — un fichier par panneau, dans `components/demo/` :

| Fichier | Type | Rôle |
|---|---|---|
| `DashboardShell.tsx` | server | Assemble les panneaux, porte le filigrane et la mention |
| `KpiRow.tsx` | server | Les 4 métriques |
| `QuotesTable.tsx` | server | Tableau des devis + timeline de relances |
| `CallsPanel.tsx` | server | Transcriptions, en `<details>/<summary>` natif |
| `LeadsPanel.tsx` | server | Demandes qualifiées + email prérédigé |
| `BillingPanel.tsx` | server | Facturation, TVA, donut |
| `DemoTabs.tsx` | **client** | Onglets entre panneaux |
| `Donut.tsx`, `Bars.tsx` | server | Graphiques SVG |

**Un seul composant client.** `DemoTabs` reçoit les panneaux déjà rendus côté serveur en `children` et bascule l'affichage. Les panneaux inactifs sont masqués en `display: none`, **pas démontés** : tout le contenu reste dans le HTML servi, donc lisible par Google.

Le dépliage des transcriptions utilise `<details>/<summary>` natif — zéro JavaScript, contenu dans le HTML, et c'est déjà l'idiome de la FAQ dans `ServiceTemplate`.

## Choix techniques

**Graphiques en SVG écrit à la main, pas de Chart.js.** La référence charge ~200 Ko de CDN pour un donut et des barres. En SVG c'est une quarantaine de lignes, rendu côté serveur, aucune dépendance, aucun CLS. Le projet n'a aujourd'hui aucune dépendance runtime hors `next`, `react` et `next-intl` : on ne l'ouvre pas pour deux graphiques.

**Styles inline + variables CSS**, comme tout le reste du site. Le hover passe par des classes dans `globals.css` — les Server Components ne peuvent pas porter de handlers React (c'est ce qui avait cassé `GeoPage`, cf. commit `8688f89`).

**Bilingue FR + EN.** Laisser `/en/demo/*` absent casserait le pattern hreflang appliqué partout ailleurs.

## Livraison

Par étapes, pour ne pas produire trois fois un contenu dense avant validation du format :

1. **Pisciniste**, complet, FR + EN — c'est le prospect chaud de Max.
2. Validation du rendu par Willy.
3. Déclinaison cuisiniste et panneaux solaires sur la même ossature.

## Dépendance

Cette branche part de `fix/pages-geo-500-et-maillage-interne`, non encore mergée : elle utilise `lib/links.ts` et `components/RelatedLinks.tsx` qui y sont introduits.
