import type { Locale } from "./pageLabels";
import { SECTORS } from "./sectors";
import { CITIES } from "./cities";

export type { Locale };

/**
 * Registre central du maillage interne.
 *
 * Toutes les pages profondes (services, secteurs, villes) tirent leurs liens
 * d'ici : une seule source de vérité pour les URLs et les libellés courts.
 */

export type LinkItem = {
  href: string;
  label: string;
  desc: string;
};

export type LinkGroup = {
  title: string;
  items: LinkItem[];
};

// ── Services ─────────────────────────────────────────────────────────

export const SERVICE_SLUGS = [
  "automatisation",
  "agents-ia",
  "formation",
  "sites-web",
  "seo",
  "reseaux-sociaux",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

// Libellés courts. À garder alignés avec `nav.solutions_items` dans messages/*.json.
const SERVICE_LABELS: Record<Locale, Record<ServiceSlug, { label: string; desc: string }>> = {
  fr: {
    automatisation: { label: "Automatisation", desc: "Devis, relances, rapports, synchros CRM." },
    "agents-ia": { label: "Agents IA", desc: "SAV, qualification de leads, triage email." },
    formation: { label: "Formation", desc: "IA et automatisation pour vos équipes." },
    "sites-web": { label: "Création de sites", desc: "Vitrine, landing, e-commerce, refonte." },
    seo: { label: "SEO", desc: "Local, technique, contenu, international." },
    "reseaux-sociaux": { label: "Réseaux sociaux", desc: "LinkedIn, Instagram, YouTube." },
  },
  en: {
    automatisation: { label: "Automation", desc: "Quotes, follow-ups, reports, CRM syncs." },
    "agents-ia": { label: "AI Agents", desc: "Support, lead qualification, email triage." },
    formation: { label: "Training", desc: "AI and automation for your teams." },
    "sites-web": { label: "Website creation", desc: "Brochure, landing, e-commerce, redesign." },
    seo: { label: "SEO", desc: "Local, technical, content, international." },
    "reseaux-sociaux": { label: "Social media", desc: "LinkedIn, Instagram, YouTube." },
  },
};

export function serviceLink(slug: ServiceSlug, locale: Locale): LinkItem {
  return {
    href: `/${locale}/solutions/${slug}`,
    ...SERVICE_LABELS[locale][slug],
  };
}

export function serviceLinks(locale: Locale, exclude?: string): LinkItem[] {
  return SERVICE_SLUGS.filter(s => s !== exclude).map(s => serviceLink(s, locale));
}

// ── Secteurs ─────────────────────────────────────────────────────────

// Libellés courts : le h1 des pages secteur est trop long pour une liste de liens.
const SECTOR_LABELS: Record<Locale, Record<string, { label: string; desc: string }>> = {
  fr: {
    cuisiniste: { label: "Cuisiniste", desc: "Devis configurés, relances showroom, suivi chantier." },
    pisciniste: { label: "Pisciniste", desc: "Devis, relances saisonnières, contrats d'entretien." },
    "panneaux-solaires": { label: "Panneaux solaires", desc: "Qualification des leads, suivi de dossier." },
  },
  en: {
    cuisiniste: { label: "Kitchen installers", desc: "Configured quotes, showroom follow-up, project tracking." },
    pisciniste: { label: "Pool builders", desc: "Quotes, seasonal follow-up, maintenance contracts." },
    "panneaux-solaires": { label: "Solar installers", desc: "Lead qualification, application tracking." },
  },
};

export const SECTOR_SLUGS = Object.keys(SECTORS);

export function sectorLink(slug: string, locale: Locale): LinkItem {
  return {
    href: `/${locale}/automatisation-pour/${slug}`,
    ...SECTOR_LABELS[locale][slug],
  };
}

export function sectorLinks(locale: Locale, exclude?: string): LinkItem[] {
  return SECTOR_SLUGS.filter(s => s !== exclude).map(s => sectorLink(s, locale));
}

// ── Villes ───────────────────────────────────────────────────────────

export const CITY_SLUGS = Object.keys(CITIES);

export function cityLink(slug: string, locale: Locale): LinkItem {
  const c = CITIES[slug].content[locale];
  return {
    href: `/${locale}/agence-automatisation-${slug}`,
    label: c.city,
    desc: c.region,
  };
}

export function cityLinks(locale: Locale, exclude?: string): LinkItem[] {
  return CITY_SLUGS.filter(s => s !== exclude).map(s => cityLink(s, locale));
}

// ── Libellés des groupes ─────────────────────────────────────────────

export const LINK_LABELS: Record<Locale, {
  eyebrow: string;
  h2: string;
  services: string;
  otherServices: string;
  sectors: string;
  otherSectors: string;
  cities: string;
  demo: string;
  demoCta: string;
  realisations: string;
  realisationsLabel: string;
  realisationsDesc: string;
  home: string;
  solutions: string;
}> = {
  fr: {
    eyebrow: "Aller plus loin",
    h2: "Explorer le reste.",
    services: "Nos solutions",
    otherServices: "Autres solutions",
    sectors: "Par secteur",
    otherSectors: "Autres secteurs",
    cities: "Où on intervient",
    demo: "Voir en vrai",
    demoCta: "Voir le tableau de bord",
    realisations: "Voir aussi",
    realisationsLabel: "Réalisations",
    realisationsDesc: "Les projets qu'on a livrés.",
    home: "Accueil",
    solutions: "Solutions",
  },
  en: {
    eyebrow: "Go further",
    h2: "Explore the rest.",
    services: "Our solutions",
    otherServices: "Other solutions",
    sectors: "By industry",
    otherSectors: "Other industries",
    cities: "Where we work",
    demo: "See it live",
    demoCta: "View the dashboard",
    realisations: "See also",
    realisationsLabel: "Case studies",
    realisationsDesc: "The projects we delivered.",
    home: "Home",
    solutions: "Solutions",
  },
};

// ── Démos ────────────────────────────────────────────────────────────

// Les secteurs qui ont un dashboard de démo. Volontairement une liste en dur :
// importer DEMO_DASHBOARDS ici tirerait tout le contenu des démos dans le
// bundle de chaque page qui utilise le registre de liens.
const DEMO_SECTORS = ["pisciniste"];

const DEMO_LABELS: Record<Locale, { label: string; desc: string }> = {
  fr: { label: "Démo du tableau de bord", desc: "Ce que vous avez sous les yeux le lundi matin." },
  en: { label: "Dashboard demo", desc: "What you see on Monday morning." },
};

/** `null` si le secteur n'a pas encore de démo. */
export function demoLink(sectorSlug: string, locale: Locale): LinkItem | null {
  if (!DEMO_SECTORS.includes(sectorSlug)) return null;
  return {
    href: `/${locale}/demo/${sectorSlug}`,
    ...DEMO_LABELS[locale],
  };
}

export function demoLinks(locale: Locale): LinkItem[] {
  return DEMO_SECTORS.map(s => demoLink(s, locale)).filter((l): l is LinkItem => l !== null);
}

export function realisationsLink(locale: Locale): LinkItem {
  const L = LINK_LABELS[locale];
  return {
    href: `/${locale}/realisations`,
    label: L.realisationsLabel,
    desc: L.realisationsDesc,
  };
}
