export type Locale = "fr" | "en";

export const SECTOR_LABELS: Record<Locale, {
  problem: string;
  workflows: string;
  case: string;
  before: string;
  after: string;
  faq: string;
  cta_primary: string;
  cta_secondary: string;
  cta_final: string;
  reassurance: string;
}> = {
  fr: {
    problem: "Le problème",
    workflows: "Ce qu'on automatise",
    case: "Scénario type",
    before: "Avant",
    after: "Après",
    faq: "Questions fréquentes",
    cta_primary: "Réserver un audit gratuit",
    cta_secondary: "↓ Voir les workflows",
    cta_final: "Réserver l'audit gratuit",
    reassurance: "30 minutes · Gratuit · Sans engagement · Diagnostic écrit",
  },
  en: {
    problem: "The problem",
    workflows: "What we automate",
    case: "Typical scenario",
    before: "Before",
    after: "After",
    faq: "FAQ",
    cta_primary: "Book a free audit",
    cta_secondary: "↓ See the workflows",
    cta_final: "Book the free audit",
    reassurance: "30 minutes · Free · No commitment · Written diagnostic",
  },
};

export const GEO_LABELS: Record<Locale, {
  why: string;
  expertises: string;
  case: string;
  before: string;
  after: string;
  faq: string;
  cta_primary: string;
  cta_secondary: string;
  see_page: string;
  cta_final: string;
  reassurance: string;
}> = {
  fr: {
    why: "Pourquoi local",
    expertises: "Nos expertises",
    case: "Scénario type",
    before: "Avant",
    after: "Après",
    faq: "Questions fréquentes",
    cta_primary: "Réserver un audit gratuit",
    cta_secondary: "↓ Nos expertises",
    see_page: "Voir la page",
    cta_final: "Réserver l'audit gratuit",
    reassurance: "30 minutes · Gratuit · Sans engagement · Diagnostic écrit",
  },
  en: {
    why: "Why local",
    expertises: "Our expertise",
    case: "Typical scenario",
    before: "Before",
    after: "After",
    faq: "FAQ",
    cta_primary: "Book a free audit",
    cta_secondary: "↓ Our expertise",
    see_page: "See page",
    cta_final: "Book the free audit",
    reassurance: "30 minutes · Free · No commitment · Written diagnostic",
  },
};
