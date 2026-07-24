# Démos en pleine page — design

Date : 2026-07-24
Statut : implémenté

Complète et amende `2026-07-23-dashboards-demo-design.md`, dont les contraintes
éditoriales restent en vigueur.

## Ce qui change

Les trois pages de démo passent d'une page marketing contenant un cadre étroit à
**une application qui occupe la page**, avec barre latérale, sélecteur de période,
tri, filtres, panneau de détail et actions simulées.

Ordre de la page : nav → fil d'Ariane → `<h1>` compact → **application** → mention
« données fictives » → contexte → lecture commentée → maillage → CTA → footer.

Le `<h1>` reste au-dessus du cadre, contrairement à la maquette validée : une page
qui s'ouvre sur une application sans titre perd son orientation pour quelqu'un qui
arrive d'une recherche, et c'est un signal que ces pages portent.

## Modèle de données

L'ancien modèle stockait les montants en chaînes formatées (`"32 400 €"`) et
dupliquait chaque secteur par locale. Impossible d'en tirer un filtre, un tri ou un
graphique, et un montant pouvait diverger entre le français et l'anglais.

Nouveau découpage, deux fichiers par secteur :

- `lib/demo/<secteur>.ts` — les enregistrements. **Chiffres écrits une fois**
  (`day` en ancienneté relative, `amount` numérique, `outcome`, `score`), textes
  `fr` et `en` colocalisés sur le même enregistrement.
- `lib/demo/<secteur>.copy.ts` — la prose, par langue.

`lib/demo/compute.ts` dérive tout le reste : compteurs, découpage temporel,
répartition, totaux de facturation, tri, formatage.

**Aucun appel à `Intl` ni à `Date` dans `compute.ts`.** Les filtres recalculent côté
client ce que le serveur a déjà rendu ; la moindre différence de formatage entre
Node et le navigateur produirait une erreur d'hydratation. Les séparateurs sont
écrits par locale, et les dates n'existent qu'en relatif pour que la démo ne
vieillisse pas toute seule.

Conséquence directe : **aucun total n'est saisi à la main**. Un KPI ne peut plus
contredire le tableau juste en dessous, ce qui arrivait dans la version précédente.
Les chiffres cités dans la lecture commentée ont été relevés sur la sortie réelle du
module, en période 30 jours.

## Volumes

| Secteur | Devis | Appels | Demandes | Factures |
|---|---|---|---|---|
| Pisciniste | 30 | 18 | 18 | 14 |
| Cuisiniste | 23 | 12 | 15 | 12 |
| Photovoltaïque | 22 | 12 | 15 | 13 |

Contre 5 / 3 / 3 / 4 auparavant, par secteur.

## Interactions

Barre latérale (5 sections), période 7/30/90 jours qui recalcule compteurs,
graphiques et tableaux, tri de colonnes, filtres par statut, clic sur une ligne vers
un panneau de détail latéral, actions simulées avec toast.

Les clés de section sont communes aux trois secteurs, les libellés non : `calls`
s'appelle « Appels », « Chantiers » ou « Qualification » selon le métier. Mêmes
formes de données, mots différents.

## Indexabilité

Les cinq sections **et tous les panneaux de détail** restent dans le DOM, masqués par
l'attribut `hidden` — la règle héritée de l'ancien système d'onglets. `hidden` sort
l'élément de l'arbre d'accessibilité sans le retirer du HTML : le contenu est
indexable et n'est pas dupliqué pour un lecteur d'écran.

Vérifié sur le HTML servi de `/fr/demo/pisciniste` : transcriptions, emails
prérédigés, motifs de rejet et enregistrements hors fenêtre 30 jours sont tous
présents. **Coût : 468 Ko de HTML** contre environ la moitié auparavant. C'est le
prix assumé de l'indexabilité complète.

## Graphiques

SVG inline, aucune dépendance ajoutée.

Palette catégorielle passée au validateur avant d'être retenue. Indigo `#4338ca`
(l'accent de la marque), orange `#eb6834` et vert d'eau `#1baf7a` passent tous les
seuils en paires adjacentes. **Une quatrième teinte échoue** : jaune contre orange
tombe à ΔE 13.7 en vision normale, sous le plancher de 15. D'où le plafond à trois
teintes nommées, tout le reste replié dans un « Autres » gris — jamais une quatrième
couleur.

Le vert d'eau passe sous 3:1 sur le fond clair : la règle de relief impose des
étiquettes visibles, donc le donut porte systématiquement sa légende chiffrée.

**Le chiffre signé par période est en barres, pas en aire.** Sur 30 jours la série
ne compte que 5 valeurs non nulles sur 15 : une courbe suggérerait une continuité
qui n'existe pas. Les tuiles de compteurs n'ont pas de sparkline — sur des données
aussi creuses, une tuile de chiffre nue est la forme honnête.

## Garde-fous « données fictives »

Les actions simulées étaient signalées comme le point qui brouille le plus la
frontière avec un vrai produit. En face :

- la barre « Démonstration — données fictives » est **collante** en haut du cadre,
  donc lisible pendant tout le scroll ;
- le panneau de détail reprend la mention dans son propre en-tête ;
- les toasts sont rédigés en langage d'application (« Relance programmée pour demain
  9h00 »), jamais en langage Timevo ;
- la note sous le cadre précise désormais que « les boutons réagissent mais
  n'envoient rien ».

## Défauts corrigés pendant la vérification

- **Toast hors champ** — ancré en bas du cadre, il s'affichait à 1918 px dans une
  fenêtre de 855 px. Passé en `position: fixed`, relatif à la fenêtre.
- **Panneau de détail hors champ** — ancré en haut du cadre, il passait au-dessus de
  l'écran sur un tableau long. Son contenu est désormais collant, plafonné à `100vh`.
- **Libellés de filtres empruntés** — la section Demandes réutilisait les libellés
  des appels (« Qualifié par l'agent / Abandonné »). Champ `leadFilters` dédié.
- **Barres d'histogramme trop épaisses** — largeur plafonnée à 54 unités.

## Vérification effectuée

`npx tsc --noEmit` et `npm run build` : sans erreur.

Rendu contrôlé sur `/fr/demo/pisciniste`, `/fr/demo/panneaux-solaires` et
`/en/demo/cuisiniste` : sections, tri, filtres, ouverture du panneau, action simulée
et toast mesurés dans le DOM.

**Non vérifié en conditions réelles** : le rendu mobile. L'outil d'automatisation ne
rend qu'un viewport fixe de 1568 px. Les règles responsive existent
(`.demo-app`, `.demo-side`, `.demo-charts-grid`, `.demo-drawer` sous 900 px) mais
restent à confirmer sur un vrai téléphone.

## Hors périmètre

- Recherche et pagination dans les tableaux — écartées lors du cadrage.
- Persistance de l'état dans l'URL.
