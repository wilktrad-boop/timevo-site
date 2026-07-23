import { getTranslations } from "next-intl/server";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { routing } from "@/i18n/routing";

export const alt = "Timevo — réalisations";
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
  const t = await getTranslations({ locale, namespace: "realisations" });
  return ogImage({
    eyebrow: t("eyebrow"),
    title: `${t("h1_line1")} ${t("h1_line2")}`,
  });
}
