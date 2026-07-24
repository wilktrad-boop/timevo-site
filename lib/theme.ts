/**
 * Valeurs brutes du thème, en miroir des variables CSS de `app/globals.css`.
 *
 * Deux contextes ne savent pas résoudre `var(--…)` et ont besoin de hex :
 *   - les attributs de présentation SVG (`fill="…"`, `stroke="…"`), qui sont
 *     parsés selon la grammaire SVG et pas comme des déclarations CSS ;
 *   - Satori, qui génère les images Open Graph hors du DOM.
 *
 * Toute modification ici doit être répercutée dans `app/globals.css`, et
 * inversement.
 */
export const theme = {
  bg: "#ffffff",
  card: "#f7f8fa",
  cardSoft: "#f0f2f5",
  border: "#e4e7ec",
  borderStrong: "#d0d5dd",
  text: "#101014",
  dim: "#5a5f6b",
  dim2: "#71757f",

  accent: "#4338ca",
  accentStrong: "#3730a3",
  accentSoft: "#6d28d9",
  accentGlow: "rgba(67,56,202,0.10)",
  accentTint: "rgba(67,56,202,0.06)",
  gradientFrom: "#2563eb",
  gradientTo: "#6d28d9",
} as const;

/**
 * Couleurs de statut des tableaux de bord de démo.
 *
 * Les valeurs Tailwind 400 (`#4ade80`, `#fbbf24`, `#f87171`) sont calibrées pour
 * du fond sombre et tombent sous 3:1 sur blanc. On descend d'un cran (600/700).
 */
export const status = {
  ok: "#15803d",
  warn: "#b45309",
  danger: "#b91c1c",
  dangerTint: "#b91c1c22",
} as const;
