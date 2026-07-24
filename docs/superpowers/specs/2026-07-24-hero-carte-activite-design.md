# Carte d'activité dans le hero — design

Date : 2026-07-24
Statut : implémenté

Référence visuelle : `https://www.marineabord.fr/index.html`

## Objectif

Le hero ne portait qu'une déclaration typographique. Il gagne une preuve visuelle :
une carte qui montre des automatisations en train de se déclencher.

## Emplacement

Hero en deux colonnes, la carte **au même niveau que le H1** — pas en dessous.

`minmax(0, 1.25fr) minmax(0, 1fr)`, gap 56, `align-items: start`. Sous 900 px, la
carte passe sous la copy (`.hero-grid` dans `globals.css`).

Conséquence assumée : le H1 n'occupe plus la pleine largeur. Son échelle descend de
`clamp(48px, 8vw, 116px)` à `clamp(38px, 5.2vw, 72px)` pour tenir dans une colonne
d'environ 640 px.

`.hero-subrow`, la grille que le hero utilisait avant, est partagée par `GeoPage`,
`SectorPage` et `ServiceTemplate`. Elle n'a pas été touchée ; le hero de la home a sa
propre classe.

## Contenu — ne pas doubler DemoTeaser

La home a déjà un extrait de dashboard : `DemoTeaser` rejoue la barre de KPI et le
tableau des devis du pisciniste, en statique. Deux extraits identiques se
cannibaliseraient.

Le partage est donc :

| | Montre | Forme |
|---|---|---|
| Carte de hero | que les workflows **tournent** | fil de 4 automatisations déclenchées |
| `DemoTeaser` | à quoi **ressemble** l'écran | KPI + tableau des devis |

## Écarts délibérés par rapport à la référence

Les règles éditoriales des dashboards de démo
(`2026-07-23-dashboards-demo-design.md`) s'appliquent, et Marine À Bord ne les suit pas :

1. **Pas de toast « 1 240 € viennent de rentrer ! »** — dans le cadre, uniquement du
   langage d'application. Une première version des dashboards mettait des libellés de
   vente dans les KPI ; ils ont été retirés après revue parce qu'ils cassaient l'illusion.
2. **Pas de badge « EN DIRECT »** — annoncer du direct sur des données fictives est un
   mensonge. On reprend « Extrait · pisciniste », déjà utilisé par `DemoTeaser`.
3. **Pas de compteur « heures rendues cette semaine »** — c'est une promesse Timevo, pas
   une métrique d'application. On anime les deux premiers KPI pisciniste déjà validés.
4. **Pas de boucle perpétuelle** — la DA demande une motion subtile, pas un gimmick.

## Motion

Au chargement, une fois, puis figé :

- compteurs de 0 à leur valeur en 1 000 ms, ease-out cubique ;
- lignes révélées une à une à partir de 400 ms, une toutes les 380 ms.

Les lignes masquées occupent leur place dès le départ (`opacity` seulement) : pas de
décalage de mise en page pendant la révélation.

`prefers-reduced-motion: reduce` affiche l'état final immédiatement, sans rAF ni timers.

## Sources de données

| Élément | Source | Pourquoi |
|---|---|---|
| Badge « données fictives » | `DEMO_DASHBOARDS.pisciniste[locale].demoBadge` | si la démo change, le hero suit |
| « Extrait · pisciniste » | `demo_teaser.sample` | déjà traduit, déjà employé |
| 2 compteurs | `…pisciniste[locale].kpis.slice(0, 2)` | copy déjà revue |
| Fil d'activité | `hero.card.rows` (fr + en) | n'existe nulle part ailleurs |

Le fil n'a **pas** été ajouté au type `DemoDashboard` : il faudrait le remplir pour
3 secteurs × 2 locales alors que seul le pisciniste est utilisé dans le hero.

## Animation des compteurs et locales

Les valeurs sont stockées formatées — `« 8 400 € »` en français, `« €8,400 »` en anglais.
Le compteur extrait le nombre, l'anime, puis le reformate avec le séparateur et
l'entourage d'origine.

Vérifié : à 100 %, la chaîne rendue est identique caractère pour caractère à la source,
espace insécable compris, dans les deux locales.

## Technique

`HeroActivityCard` est un Client Component isolé ; `HeroDkdp` reste un Server Component.
C'est le découpage qui avait causé le 500 sur `GeoPage` (commit 8688f89) quand un
handler s'était retrouvé côté serveur.

## Vérification effectuée

`npm run build` — compile sans erreur.

Rendu contrôlé sur `/fr` et `/en` : état initial, animation en cours (capture prise à
mi-parcours, compteurs à `7` / `€4,051`) et état final.

**Non vérifié en conditions réelles** : le rendu mobile et `prefers-reduced-motion`.
L'outil d'automatisation ne rend qu'un viewport fixe de 1568 px et ne permet pas de
forcer la préférence système. À confirmer sur un vrai téléphone.
