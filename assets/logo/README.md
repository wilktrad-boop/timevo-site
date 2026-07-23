# Logo Timevo — exports

Wordmark « Timevo. » vectorisé depuis les specs du header (`components/NavDkdp.tsx`).

## Fabrication

- Police : **Inter SemiBold (600)**, version 4.001 — `assets/inter-600.ttf`
- Interlettrage : `-0.04em`, crénage GPOS appliqué (`ev` et `vo` : −38 unités)
- Texte **converti en courbes** : aucun besoin d'installer Inter pour ouvrir les fichiers
- Cadrage serré sur l'encre. Ratio **4.5634:1** (3529,5 × 773,4 unités)

Conforme au rendu du navigateur : la bbox d'encre mesurée sur la page à 1000 px
(40 / 3570 / largeur 3530) correspond au vectoriel (40,53 / 3570,06 / 3529,53).

## Couleurs

| Élément | Valeur |
|---|---|
| Mot, version claire | `#ededed` |
| Mot, version sombre | `#0a0a0a` |
| Fond sombre | `#0a0a0a` |
| Point, dégradé | `#4ec3ff → #7c4dff`, 135° |
| Point, aplat | `#6c76ff` |

## Les deux traitements du point

Sur le site, le dégradé est appliqué en `background-clip: text` sur la boîte du
`<span>`, haute d'une ligne (24 px pour un texte de 20 px). Le point, lui, ne
mesure que ~3 px et se situe près du bas : il ne couvre que la tranche **55–76 %**
du dégradé, soit `#6782ff → #7169ff`. À l'œil, le site affiche donc un **aplat**
bleu-violet, pas un dégradé.

- **Fichiers sans suffixe** — dégradé complet sur le point. Plus expressif, c'est
  l'intention de la DA. À privilégier pour un usage logo.
- **Fichiers `-point-uni`** — aplat `#6c76ff`, reproduction exacte de ce que le
  site affiche aujourd'hui. À utiliser s'il faut une correspondance stricte, ou
  pour tout support où un dégradé pose problème (impression, monochrome, broderie).

## Fichiers

| Fichier | Usage |
|---|---|
| `timevo-logo-clair.svg` | Fonds sombres. Le fichier de référence à transmettre. |
| `timevo-logo-sombre.svg` | Fonds clairs, documents, papeterie. |
| `timevo-logo-fond-noir.svg` | Logo clair sur pavé `#0a0a0a`, zone de protection incluse. |
| `timevo-logo-*-point-uni.svg` | Idem, point en aplat. |
| `timevo-logo-*-{512,1024,2048}.png` | PNG, fond transparent (sauf `fond-noir`). |

## Zone de protection

Au minimum **la moitié de la hauteur du logo** sur les quatre côtés — c'est la
marge appliquée dans les fichiers `fond-noir`.

## Régénérer

Les fichiers sont produits par script à partir de `assets/inter-600.ttf`
(fontTools pour la vectorisation, sharp pour la rasterisation). Toute
modification des specs du header doit être répercutée ici.
