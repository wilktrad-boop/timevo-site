/**
 * Formes de données d'un dashboard de démo.
 *
 * Deux principes, et la frontière compte :
 *
 * 1. **Ce qui est DANS le cadre n'affiche que du langage d'application** —
 *    compteurs, libellés opérationnels, lignes de contexte. `readings` vit SOUS
 *    le cadre : c'est le seul endroit où Timevo parle.
 *    Cf. docs/superpowers/specs/2026-07-23-dashboards-demo-design.md.
 *
 * 2. **Les chiffres sont écrits une fois, les textes deux.** Un enregistrement
 *    porte son noyau numérique (date, montant, statut, score) puis ses textes
 *    `fr` et `en` côte à côte. La première version dupliquait tout par locale,
 *    montants compris sous forme de chaînes formatées (« 32 400 € ») : on ne
 *    pouvait en tirer ni filtre, ni tri, ni graphique, et un montant pouvait
 *    diverger entre les deux langues sans que rien ne le signale.
 */

export type Locale = "fr" | "en";

/**
 * Ancienneté en jours. 0 = aujourd'hui, 45 = il y a 45 jours.
 *
 * Base des filtres de période : « 30 derniers jours » garde les enregistrements
 * dont `day <= 30`. Aucune date absolue n'est stockée, sinon la démo
 * vieillirait toute seule.
 */
export type DayAgo = number;

// ── Devis ─────────────────────────────────────────────────────────

export type QuoteOutcome = "win" | "loss" | "pending";

export type QuoteText = { client: string; project: string };

export type Quote = {
  id: string;
  day: DayAgo;
  /** Montant HT, en euros. */
  amount: number;
  /** Relances effectivement parties, 0 à 3. */
  reminders: number;
  outcome: QuoteOutcome;
  /** Clé de prestation — libellé dans `SectorData.categories`. */
  category: string;
  fr: QuoteText;
  en: QuoteText;
};

// ── Appels ────────────────────────────────────────────────────────

export type CallText = {
  from: string;
  summary: string;
  transcript: { who: "ia" | "client"; text: string }[];
  action: string;
};

export type Call = {
  id: string;
  day: DayAgo;
  /** Heure d'arrivée en minutes depuis minuit — formatée selon la locale. */
  minute: number;
  durationSec: number;
  urgent: boolean;
  /** `escalated` = passé à un humain. */
  outcome: "handled" | "escalated";
  fr: CallText;
  en: CallText;
};

// ── Demandes ──────────────────────────────────────────────────────

export type LeadText = {
  name: string;
  request: string;
  verdict: string;
  email?: { subject: string; body: string };
  rejected?: string;
};

export type Lead = {
  id: string;
  day: DayAgo;
  /** 0 à 100. */
  score: number;
  accepted: boolean;
  /** Clé de canal — libellé dans `SectorData.sources`. */
  source: string;
  fr: LeadText;
  en: LeadText;
};

// ── Factures ──────────────────────────────────────────────────────

export type InvoiceText = { ref: string; client: string };

export type Invoice = {
  id: string;
  /** Ancienneté de l'émission. */
  day: DayAgo;
  /** Jours restants avant échéance. Négatif = en retard. */
  dueIn: number;
  /** Montant HT, en euros. */
  amount: number;
  /** 0.2, 0.1 ou 0.055. */
  vatRate: number;
  paid: boolean;
  category: string;
  fr: InvoiceText;
  en: InvoiceText;
};

// ── Secteur ───────────────────────────────────────────────────────

/** Libellé bilingue d'une clé (prestation, canal d'acquisition). */
export type KeyLabel = { key: string; fr: string; en: string };

/** Les enregistrements d'un secteur. Écrits une fois, lus dans les deux langues. */
export type SectorData = {
  /** Entreprise fictive affichée dans la barre latérale de l'application. */
  company: string;
  quotes: Quote[];
  calls: Call[];
  leads: Lead[];
  invoices: Invoice[];
  categories: KeyLabel[];
  sources: KeyLabel[];
};

// ── Copy ──────────────────────────────────────────────────────────

/**
 * Tout ce qui est rédigé, par langue. Contrairement aux enregistrements, il n'y
 * a rien à dériver ici : c'est de la prose, elle diffère réellement d'une langue
 * à l'autre.
 */
export type DemoCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  subtitle: string;

  demoBadge: string;
  demoNote: string;

  /** Libellés de la barre latérale, dans l'ordre des sections. */
  sections: {
    overview: string;
    quotes: string;
    calls: string;
    leads: string;
    billing: string;
  };

  /** Libellés des quatre compteurs. Les valeurs sont calculées. */
  kpis: {
    openQuotes: string;
    signed: string;
    calls: string;
    leads: string;
  };

  charts: {
    signedOverTime: string;
    quotesSentVsSigned: string;
    revenueMix: string;
    scoreSpread: string;
    sent: string;
    signed: string;
    other: string;
  };

  /** Contrôles communs à toutes les sections. */
  ui: {
    rangeLabel: string;
    range7: string;
    range30: string;
    range90: string;
    all: string;
    empty: string;
    close: string;
    detail: string;
    fictionalReminder: string;
    rowHint: string;
  };

  quotesH2: string;
  quotesCols: { client: string; amount: string; follow: string; outcome: string; age: string };
  outcomes: { win: string; loss: string; pending: string };
  quoteActions: { remind: string; markWon: string };
  quoteToasts: { remind: string; markWon: string };

  callsH2: string;
  urgentLabel: string;
  transcriptLabel: string;
  callOutcomes: { handled: string; escalated: string };
  callActions: { callBack: string };
  callToasts: { callBack: string };

  leadsH2: string;
  scoreLabel: string;
  emailReadyLabel: string;
  /** Filtres propres aux demandes — ne pas réutiliser ceux des appels. */
  leadFilters: { accepted: string; rejected: string };
  leadActions: { send: string; edit: string };
  leadToasts: { send: string };

  billingH2: string;
  billingStats: { collected: string; vat: string; outstanding: string; overdue: string };
  invoicesCols: { ref: string; client: string; amount: string; status: string; due: string };
  invoiceStatus: { paid: string; waiting: string; late: string };
  invoiceActions: { remind: string };
  invoiceToasts: { remind: string };

  /** Lecture commentée, SOUS le cadre : c'est là que Timevo parle. */
  readingH2: string;
  readingSubtitle: string;
  readings: { tab: string; text: string }[];

  ctaH2: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaReassurance: string;
};

export type DemoSector = {
  data: SectorData;
  fr: DemoCopy;
  en: DemoCopy;
};
