import type { Locale } from "./pageLabels";
import type { DemoDashboard } from "./demo/types";
import { PISCINISTE_FR, PISCINISTE_EN } from "./demo/pisciniste";
import { CUISINISTE_FR, CUISINISTE_EN } from "./demo/cuisiniste";
import { SOLAIRE_FR, SOLAIRE_EN } from "./demo/panneaux-solaires";
import { DEMO_SECTORS } from "./links";

/**
 * Index des dashboards de démo.
 *
 * TOUTES LES DONNÉES SONT FICTIVES. Aucun client réel, aucun chiffre réel.
 * Chaque page le signale par la barre de titre du cadre (`demoBadge`) et par
 * la mention complète sous le dashboard (`demoNote`).
 *
 * Un secteur = un fichier dans lib/demo/. Les clés doivent correspondre aux
 * slugs de SECTORS (lib/sectors.ts) : c'est ce qui relie une démo à sa page
 * secteur, et ce que `demoLink` (lib/links.ts) attend.
 *
 * Cf. docs/superpowers/specs/2026-07-23-dashboards-demo-design.md.
 */

export type * from "./demo/types";

export const DEMO_DASHBOARDS: Record<string, Record<Locale, DemoDashboard>> = {
  pisciniste: { fr: PISCINISTE_FR, en: PISCINISTE_EN },
  cuisiniste: { fr: CUISINISTE_FR, en: CUISINISTE_EN },
  "panneaux-solaires": { fr: SOLAIRE_FR, en: SOLAIRE_EN },
};

export const DEMO_SLUGS = Object.keys(DEMO_DASHBOARDS);

// Une démo qui existe mais n'est listée nulle part serait une page sans aucun
// lien entrant — exactement le problème qu'on vient de corriger sur les pages
// secteur et ville. On préfère casser le build.
const missing = DEMO_SLUGS.filter(s => !DEMO_SECTORS.includes(s));
const extra = DEMO_SECTORS.filter(s => !DEMO_SLUGS.includes(s));
if (missing.length || extra.length) {
  throw new Error(
    "DEMO_SECTORS (lib/links.ts) et DEMO_DASHBOARDS divergent." +
      (missing.length ? ` Démos non listées : ${missing.join(", ")}.` : "") +
      (extra.length ? ` Listées sans démo : ${extra.join(", ")}.` : "")
  );
}
