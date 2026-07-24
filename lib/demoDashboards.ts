import type { DemoSector } from "./demo/types";
import { PISCINISTE_DATA } from "./demo/pisciniste";
import { PISCINISTE_FR, PISCINISTE_EN } from "./demo/pisciniste.copy";
import { CUISINISTE_DATA } from "./demo/cuisiniste";
import { CUISINISTE_FR, CUISINISTE_EN } from "./demo/cuisiniste.copy";
import { SOLAIRE_DATA } from "./demo/panneaux-solaires";
import { SOLAIRE_FR, SOLAIRE_EN } from "./demo/panneaux-solaires.copy";
import { DEMO_SECTORS } from "./links";

/**
 * Index des dashboards de démo.
 *
 * TOUTES LES DONNÉES SONT FICTIVES. Aucun client réel, aucun chiffre réel.
 * Chaque page le signale par la barre de titre du cadre (`demoBadge`), qui
 * reste visible pendant la lecture, et par la mention complète sous le
 * dashboard (`demoNote`).
 *
 * Un secteur = deux fichiers dans lib/demo/ : `X.ts` porte les enregistrements
 * (chiffres écrits une fois, textes fr/en côte à côte), `X.copy.ts` porte la
 * prose par langue. Les clés doivent correspondre aux slugs de SECTORS
 * (lib/sectors.ts) : c'est ce qui relie une démo à sa page secteur, et ce que
 * `demoLink` (lib/links.ts) attend.
 *
 * Cf. docs/superpowers/specs/2026-07-23-dashboards-demo-design.md
 * et docs/superpowers/specs/2026-07-24-demos-pleine-page-design.md.
 */

export type * from "./demo/types";
export * from "./demo/compute";

export const DEMO_DASHBOARDS: Record<string, DemoSector> = {
  pisciniste: { data: PISCINISTE_DATA, fr: PISCINISTE_FR, en: PISCINISTE_EN },
  cuisiniste: { data: CUISINISTE_DATA, fr: CUISINISTE_FR, en: CUISINISTE_EN },
  "panneaux-solaires": { data: SOLAIRE_DATA, fr: SOLAIRE_FR, en: SOLAIRE_EN },
};

export const DEMO_SLUGS = Object.keys(DEMO_DASHBOARDS);

// Une démo qui existe mais n'est listée nulle part serait une page sans aucun
// lien entrant — exactement le problème qu'on avait corrigé sur les pages
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
