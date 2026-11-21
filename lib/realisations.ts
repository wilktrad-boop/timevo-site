/**
 * Sites livrés, dans l'ordre d'affichage.
 * L'index de chaque entrée correspond à celui de `realisations.items`
 * dans messages/fr.json et messages/en.json.
 *
 * Ajouter un site : une entrée ici, une entrée dans chaque fichier de messages,
 * puis `node scripts/capture-realisations.mjs` pour la capture.
 */
type Realisation = {
  slug: string;
  url: string;
  image: string;
  /** Compte Instagram tenu par Timevo, affiché en second lien de la carte. */
  instagram?: string;
};

export const REALISATIONS: readonly Realisation[] = [
  {
    slug: "mon-espace-piscine",
    url: "https://www.monespacepiscine.fr/",
    image: "/realisations/mon-espace-piscine.jpg",
  },
  {
    slug: "yannick-hulin",
    url: "https://yannickhulin.fr/",
    image: "/realisations/yannick-hulin.jpg",
    instagram: "https://www.instagram.com/yannick.hulin/",
  },
  {
    slug: "agence-laverne",
    url: "https://www.agencelavernepaysagistes.fr/",
    image: "/realisations/agence-laverne.jpg",
  },
  {
    slug: "agence-traduction-juridique",
    url: "https://www.agence-traduction-juridique.fr/",
    image: "/realisations/agence-traduction-juridique.jpg",
  },
];

/** Dimensions natives des captures (viewport 1280×800 × DPR 0.62). */
export const SHOT_WIDTH = 794;
export const SHOT_HEIGHT = 496;
