import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { routing } from "@/i18n/routing";
import { SECTORS, SECTOR_SLUGS } from "@/lib/sectors";
import type { Locale } from "@/lib/pageLabels";

export const alt = "Timevo — automatisation par secteur";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    SECTOR_SLUGS.map(secteur => ({ locale, secteur }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; secteur: string }>;
}) {
  const { locale, secteur } = await params;
  const loc: Locale = locale === "en" ? "en" : "fr";
  const s = SECTORS[secteur]?.[loc] ?? SECTORS.pisciniste[loc];

  return ogImage({ eyebrow: s.eyebrow, title: s.h1.replace(/\.$/, "") });
}
