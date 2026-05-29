import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { geoMetadata, GeoPageContent } from "@/lib/geoPageHelpers";

const CITY_SLUG = "montpellier";

type Locale = (typeof routing.locales)[number];
function isValidLocale(v: string): v is Locale {
  return (routing.locales as readonly string[]).includes(v);
}

export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "fr") return {};
  return geoMetadata(CITY_SLUG, locale);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale) || locale !== "fr") notFound();
  setRequestLocale(locale);
  return <GeoPageContent citySlug={CITY_SLUG} locale={locale} />;
}
