import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/pageLabels";

/**
 * Image de partage par défaut.
 *
 * Elle couvre la home et, par héritage, toute page qui n'a pas la sienne
 * (index Solutions, Réalisations, pages légales).
 */

export const alt = "Timevo — On construit votre IA. On la fait vivre avec vous.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

// Même texte que le H1 de la home (clé `hero` de messages/*.json).
const COPY: Record<Locale, { eyebrow: string; title: string; suite: string; accent: string }> = {
  fr: {
    eyebrow: "Agence IA · Thonon-les-Bains",
    title: "On construit votre IA.",
    suite: "On la fait vivre",
    accent: "avec vous.",
  },
  en: {
    eyebrow: "AI agency · Thonon-les-Bains, France",
    title: "We build your AI.",
    suite: "We keep it running",
    accent: "with you.",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = COPY[(locale as Locale) in COPY ? (locale as Locale) : "fr"];
  return ogImage(c);
}
