import { getTranslations } from "next-intl/server";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { routing } from "@/i18n/routing";

export const alt = "Timevo — conformité facturation électronique";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "facturation" });

  return ogImage({
    eyebrow: t("hero.eyebrow"),
    title: `${t("hero.h1_line1")} ${t("hero.h1_accent")}`.replace(/\.$/, ""),
    footnote: locale === "fr" ? "Diagnostic gratuit" : "Free assessment",
  });
}
