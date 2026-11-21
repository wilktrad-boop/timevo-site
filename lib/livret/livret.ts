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
  /** Photo du logement, déjà réduite et réencodée en JPEG dans le navigateur (data URL). */
  photo: string | null;
};

/** Plafond de la photo stockée (data URL) : une photo réduite à 1600 px pèse bien moins. */
export const PHOTO_MAX_DATA_URL = 2_000_000;

export type LigneRendue = { label: string; valeur: string };

export type BlocRendu =
  | { type: "tableau"; titre?: string; lignes: LigneRendue[] }
  | { type: "texte"; titre?: string; texte: string }
  | { type: "liste"; titre?: string; style: "puces" | "cases"; items: string[] };

/** `etape` : index dans ETAPES de l'étape où l'on remplit cette section (l'aperçu y renvoie). */
export type SectionRendu = { titre: string; sautAvant: boolean; etape: number; blocs: BlocRendu[] };

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
  photo: string | null;
};

export function brouillonVide(): LivretData {
  return {
    valeurs: Object.fromEntries(CHAMPS.map(c => [c.id, c.defaut ?? ""])),
    marque: { couleur: COULEUR_DEFAUT, logo: null },
    photo: null,
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
  const b = brut as { valeurs?: unknown; marque?: unknown; photo?: unknown };
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
  if (typeof b.photo === "string" && b.photo.startsWith("data:image/jpeg;base64,") && b.photo.length <= PHOTO_MAX_DATA_URL) {
    base.photo = b.photo;
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
  for (const [indexEtape, etape] of ETAPES.entries()) {
    for (const s of etape.sections) {
      const blocs: BlocRendu[] = [];
      for (const b of s.blocs) {
        if (b.type === "tableau") {
          const l = tableau(b.lignes, v);
          if (l.length) blocs.push({ type: "tableau", ...(b.titre ? { titre: b.titre } : {}), lignes: l });
        } else if (b.type === "texte") {
          const t = (v[b.champ] ?? "").trim();
          if (t) blocs.push({ type: "texte", ...(b.titre ? { titre: b.titre } : {}), texte: t });
        } else {
          const items = lignes(v[b.champ] ?? "");
          if (items.length) blocs.push({ type: "liste", ...(b.titre ? { titre: b.titre } : {}), style: b.style, items });
        }
      }
      if (blocs.length) sections.push({ titre: s.titre, sautAvant: Boolean(s.sautAvant), etape: indexEtape, blocs });
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
    photo: data.photo,
  };
}

const AUTORISES_WIN1252 = new Set(Array.from("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ"));

/**
 * Texte compatible avec la police Helvetica du PDF (WinAnsi / Windows-1252).
 * Les espaces fines deviennent des insécables, les flèches des équivalents
 * ASCII, et tout caractère que la police ne sait pas dessiner est retiré
 * (sinon il s'affiche sous la forme d'un autre caractère).
 */
export function pourPdf(texte: string): string {
  const net = texte
    .normalize("NFC")
    .replace(/[\u202F\u2009\u2007]/g, "\u00A0")
    .replace(/→/g, "->")
    .replace(/←/g, "<-");
  let sortie = "";
  for (const car of net) {
    const n = car.codePointAt(0) ?? 0;
    if (car === "\n" || (n >= 0x20 && n <= 0x7e) || (n >= 0xa0 && n <= 0xff) || AUTORISES_WIN1252.has(car)) sortie += car;
  }
  // Un emoji retiré entre deux espaces ne doit pas laisser un double espace.
  return sortie.replace(/ {2,}/g, " ");
}

export function nomFichier(data: LivretData): string {
  const slug = (data.valeurs.nomLogement ?? "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return slug ? `livret-accueil-${slug}.pdf` : "livret-accueil.pdf";
}
