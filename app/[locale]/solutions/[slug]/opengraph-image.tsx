import { getTranslations } from "next-intl/server";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { routing } from "@/i18n/routing";
import { SERVICE_SLUGS } from "@/lib/links";

export const alt = "Timevo — nos solutions";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    SERVICE_SLUGS.map(slug => ({ locale, slug }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: `services.${slug}` });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const label = (tNav.raw("solutions_items") as string[])[
    (SERVICE_SLUGS as readonly string[]).indexOf(slug)
  ];

  return ogImage({
    eyebrow: `${tNav("solutions")} · ${label}`,
    title: t("meta_title"),
  });
}
