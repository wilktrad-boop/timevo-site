/**
 * Valeurs brutes du thème, en miroir des variables CSS de `app/globals.css`.
 *
 * Deux contextes ne savent pas résoudre `var(--…)` et ont besoin de hex :
 *   - les attributs de présentation SVG (`fill="…"`, `stroke="…"`), qui sont
 *     parsés selon la grammaire SVG et pas comme des déclarations CSS ;
 *   - Satori, qui génère les images Open Graph hors du DOM.
 *
 * Toute modification ici doit être répercutée dans `app/globals.css`, et
 * inversement. Les filets sont des aplats équivalents aux alphas du CSS.
 */
export const theme = {
  bg: "#0c0e14",
  card: "#12151d",
  cardSoft: "#1a1e28",
  border: "#1e212a",
  borderStrong: "#2b2f3a",
  text: "#eef0f5",
  dim: "#a3a9b8",
  dim2: "#7a8296",

  accent: "#5fa8ff",
  accentStrong: "#8ec4ff",
  accentInk: "#0c0e14",
  accentSoft: "#5fa8ff",
  accentGlow: "rgba(0,0,0,0)",
  accentTint: "rgba(95,168,255,0.10)",
  gradientFrom: "#5fa8ff",
  gradientTo: "#5fa8ff",
} as const;

/**
 * Couleurs de statut des tableaux de bord de démo.
 *
 * Calibrées pour du fond sombre : les tons Tailwind 400 tiennent au-dessus de
 * 4,5:1 sur `--bg`, là où les 600/700 du thème clair y tombaient sous 3:1.
 */
export const status = {
  ok: "#4ade80",
  warn: "#fbbf24",
  danger: "#f87171",
  dangerTint: "#f8717122",
} as const;
