import React from "react";

/**
 * Icônes des pastilles d'intitulé, une par bloc de la home.
 *
 * Tracés géométriques, jamais de pictogramme d'IA : ni cerveau, ni circuit,
 * ni robot. Chacune dit le sujet de son bloc par sa forme — un signal
 * d'alerte, un réseau de nœuds, une cible, une suite d'étapes, une courbe,
 * une grille, une étoile.
 *
 * Toutes sont dessinées dans une grille de 16, au même poids de trait, et
 * héritent de la couleur d'accent plutôt que de la couleur du texte : c'est
 * le seul point coloré de la pastille.
 */

const S = {
  width: 14, height: 14, viewBox: "0 0 16 16", fill: "none",
  stroke: "var(--accent)", strokeWidth: 1.5,
  strokeLinecap: "round", strokeLinejoin: "round",
  style: { flexShrink: 0 },
} as const;

export const IconAlert = () => (
  <svg {...S} aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" />
    <path d="M8 4.8v3.6" />
    <path d="M8 11.05v.05" />
  </svg>
);

export const IconNetwork = () => (
  <svg {...S} aria-hidden="true">
    <circle cx="3.4" cy="8" r="1.7" />
    <circle cx="12.6" cy="3.9" r="1.7" />
    <circle cx="12.6" cy="12.1" r="1.7" />
    <path d="M5 7.3 11 4.5" />
    <path d="M5 8.7 11 11.5" />
  </svg>
);

export const IconTarget = () => (
  <svg {...S} aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" />
    <circle cx="8" cy="8" r="2.6" />
  </svg>
);

export const IconSteps = () => (
  <svg {...S} aria-hidden="true">
    <path d="M2 8h12" />
    <circle cx="3.6" cy="8" r="1.4" />
    <circle cx="8" cy="8" r="1.4" />
    <circle cx="12.4" cy="8" r="1.4" />
  </svg>
);

export const IconTrend = () => (
  <svg {...S} aria-hidden="true">
    <path d="M2 11.4 6 7.4l2.6 2.6L14 4.6" />
    <path d="M10.4 4.6H14v3.6" />
  </svg>
);

export const IconGrid = () => (
  <svg {...S} aria-hidden="true">
    <rect x="2.2" y="2.2" width="5" height="5" rx="1.2" />
    <rect x="8.8" y="2.2" width="5" height="5" rx="1.2" />
    <rect x="2.2" y="8.8" width="5" height="5" rx="1.2" />
    <rect x="8.8" y="8.8" width="5" height="5" rx="1.2" />
  </svg>
);

export const IconSpark = () => (
  <svg {...S} aria-hidden="true">
    <path d="M8 1.8 9.6 6.4 14.2 8 9.6 9.6 8 14.2 6.4 9.6 1.8 8l4.6-1.6z" />
  </svg>
);

export const IconQuestion = () => (
  <svg {...S} aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" />
    <path d="M6.3 6.2a1.75 1.75 0 1 1 2.4 1.62c-.45.2-.7.6-.7 1.08v.3" />
    <path d="M8 11.6v.05" />
  </svg>
);

export const IconArrow = () => (
  <svg {...S} aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" />
    <path d="M5.6 8h4.8" />
    <path d="M8.6 6.2 10.4 8l-1.8 1.8" />
  </svg>
);
