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
  bg: "#100c18",
  card: "#191424",
  cardSoft: "#201a2e",
  border: "#2c2440",
  borderStrong: "#3c3355",
  text: "#efecf5",
  dim: "#9990ac",
  dim2: "#8c82a0",

  accent: "#5fa8ff",
  accentStrong: "#8ec4ff",
  accentSoft: "#a98aff",
  accentGlow: "rgba(124,77,255,0.22)",
  accentTint: "rgba(124,77,255,0.10)",
  gradientFrom: "#4ec3ff",
  gradientTo: "#7c4dff",
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
