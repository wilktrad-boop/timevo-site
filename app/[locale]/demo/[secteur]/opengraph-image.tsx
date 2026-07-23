import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { routing } from "@/i18n/routing";
import { DEMO_DASHBOARDS, DEMO_SLUGS } from "@/lib/demoDashboards";
import type { Locale } from "@/lib/pageLabels";

/**
 * Image de partage des démos.
 *
 * C'est la plus utile du lot : ce sont les URLs que Max envoie en cold, donc
 * l'aperçu est souvent la première chose que le prospect voit de Timevo.
 * Le titre reprend le h1 de la page, et le pied rappelle que c'est une démo.
 */

export const alt = "Timevo — démonstration de tableau de bord";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    DEMO_SLUGS.map(secteur => ({ locale, secteur }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; secteur: string }>;
}) {
  const { locale, secteur } = await params;
  const loc: Locale = locale === "en" ? "en" : "fr";
  const d = DEMO_DASHBOARDS[secteur]?.[loc] ?? DEMO_DASHBOARDS.pisciniste[loc];

  return ogImage({
    eyebrow: d.eyebrow,
    // Le h1 se termine par un point : superflu sur une carte de partage.
    title: d.h1.replace(/\.$/, ""),
    footnote: loc === "fr" ? "Données fictives" : "Fictional data",
  });
}
