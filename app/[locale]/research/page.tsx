import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ResearchPage from "@/components/ResearchPage";
import { RESEARCH_EMAIL } from "@/lib/contact";
import { LINK_LABELS, RESEARCH_PATH, type Locale } from "@/lib/links";

const BASE = "https://www.timevo.io";

function isValidLocale(v: string): v is Locale {
  return (routing.locales as readonly string[]).includes(v);
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: "research" });
  const pageUrl = `${BASE}/${locale}${RESEARCH_PATH}`;
  // Titres ≤ 51 caractères : le gabarit du layout ajoute « | Timevo ».
  const title = t("meta_title");
  const description = t("meta_description");

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        fr: `${BASE}/fr${RESEARCH_PATH}`,
        en: `${BASE}/en${RESEARCH_PATH}`,
        "x-default": `${BASE}/fr${RESEARCH_PATH}`,
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Timevo",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? "en_GB" : "fr_FR",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "research" });
  const pageUrl = `${BASE}/${locale}${RESEARCH_PATH}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("meta_title"),
    description: t("meta_description"),
    url: pageUrl,
    inLanguage: locale === "fr" ? "fr" : "en-GB",
    serviceType: locale === "fr" ? "Traduction pour les études de marché" : "Translation for market research",
    provider: { "@type": "ProfessionalService", name: "Timevo", url: BASE, email: RESEARCH_EMAIL },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: LINK_LABELS[locale].home, item: `${BASE}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("breadcrumb"), item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ResearchPage locale={locale} />
    </>
  );
}
