/**
 * Formes de données d'un dashboard de démo.
 *
 * Un dashboard se lit sur deux niveaux, et la frontière compte :
 * - ce qui est DANS le cadre n'affiche que du langage d'application
 *   (compteurs, libellés opérationnels, lignes de contexte) ;
 * - `readings` vit SOUS le cadre. C'est le seul endroit où Timevo parle.
 *
 * Cf. docs/superpowers/specs/2026-07-23-dashboards-demo-design.md.
 */

export type Kpi = {
  value: string;
  label: string;
  detail: string;
};

export type QuoteStep = {
  label: string;
  /** done = étape passée, active = étape en cours, pending = à venir */
  state: "done" | "active" | "pending";
};

export type Quote = {
  client: string;
  project: string;
  amount: string;
  steps: QuoteStep[];
  outcome: { label: string; tone: "win" | "loss" | "pending" };
};

export type Call = {
  from: string;
  at: string;
  summary: string;
  urgent?: boolean;
  transcript: { who: "ia" | "client"; text: string }[];
  action: string;
};

export type Lead = {
  name: string;
  request: string;
  score: number;
  verdict: string;
  email?: { subject: string; body: string };
  rejected?: string;
};

export type Invoice = {
  ref: string;
  client: string;
  amount: string;
  status: string;
  tone: "ok" | "wait";
};

export type DemoDashboard = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  subtitle: string;

  demoBadge: string;
  demoNote: string;

  tabs: string[];

  kpis: Kpi[];

  quotesH2: string;
  quotesMeta: string;
  quotesCols: { client: string; amount: string; follow: string; outcome: string };
  quotes: Quote[];

  callsH2: string;
  callsMeta: string;
  urgentLabel: string;
  transcriptLabel: string;
  calls: Call[];

  leadsH2: string;
  leadsMeta: string;
  scoreLabel: string;
  emailReadyLabel: string;
  sendLabel: string;
  editLabel: string;
  leads: Lead[];

  billingH2: string;
  billingMeta: string;
  billingStats: { label: string; value: string }[];
  splitLabel: string;
  split: { label: string; value: number; color: string }[];
  invoicesCols: { ref: string; client: string; amount: string; status: string };
  invoices: Invoice[];

  /** Lecture commentée, SOUS le cadre : c'est là que Timevo parle. */
  readingH2: string;
  readingSubtitle: string;
  readings: { tab: string; text: string }[];

  ctaH2: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaReassurance: string;
};
