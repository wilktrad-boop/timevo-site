import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { routing } from "@/i18n/routing";
import { CITIES } from "@/lib/cities";
import type { Locale } from "@/lib/pageLabels";

const CITY_SLUG = "thonon-les-bains";

export const alt = "Timevo — agence d'automatisation";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = locale === "en" ? "en" : "fr";
  const c = CITIES[CITY_SLUG].content[loc];

  return ogImage({ eyebrow: c.eyebrow, title: c.h1.replace(/\.$/, "") });
}
