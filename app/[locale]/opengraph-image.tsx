import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/pageLabels";

/**
 * Image de partage par défaut.
 *
 * Elle couvre la home et, par héritage, toute page qui n'a pas la sienne
 * (index Solutions, Réalisations, pages légales).
 */

export const alt = "Timevo — automatisation pour PME";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

const COPY: Record<Locale, { eyebrow: string; title: string }> = {
  fr: {
    eyebrow: "Automatisation pour PME",
    title: "Le temps que les tâches répétitives vous volent. On vous le rend.",
  },
  en: {
    eyebrow: "Automation for SMBs",
    title: "The time repetitive tasks steal from you. We give it back.",
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
