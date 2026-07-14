/**
 * Sites livrés, dans l'ordre d'affichage.
 * L'index de chaque entrée correspond à celui de `realisations.items`
 * dans messages/fr.json et messages/en.json.
 *
 * Ajouter un site : une entrée ici, une entrée dans chaque fichier de messages,
 * puis `node scripts/capture-realisations.mjs` pour la capture.
 */
export const REALISATIONS = [
  {
    slug: "mon-espace-piscine",
    url: "https://www.monespacepiscine.fr/",
    image: "/realisations/mon-espace-piscine.jpg",
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
] as const;

/** Dimensions natives des captures (viewport 1280×800 × DPR 0.62). */
export const SHOT_WIDTH = 794;
export const SHOT_HEIGHT = 496;
