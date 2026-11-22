import { getTranslations } from "next-intl/server";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { routing } from "@/i18n/routing";

export const alt = "Timevo — translation pipelines for market research teams";
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
  const t = await getTranslations({ locale, namespace: "research" });
  return ogImage({ eyebrow: t("og_eyebrow"), title: t("og_title") });
}
