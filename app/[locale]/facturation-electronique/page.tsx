import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import Breadcrumb from "@/components/Breadcrumb";
import FacturationPage from "@/components/FacturationPage";
import RelatedLinks from "@/components/RelatedLinks";
import StickyMobileCta from "@/components/StickyMobileCta";
import { LINK_LABELS, serviceLinks, sectorLinks } from "@/lib/links";
import type { Locale } from "@/lib/pageLabels";

const SLUG = "facturation-electronique";
const BASE = "https://www.timevo.io";

function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: "facturation" });
  const pageUrl = `${BASE}/${locale}/${SLUG}`;
  const title = t("meta_title");
  const description = t("meta_description");

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        fr: `${BASE}/fr/${SLUG}`,
        en: `${BASE}/en/${SLUG}`,
        "x-default": `${BASE}/fr/${SLUG}`,
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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

  const t = await getTranslations({ locale, namespace: "facturation" });
  const L = LINK_LABELS[locale];
  const pageUrl = `${BASE}/${locale}/${SLUG}`;
  const faqItems = t.raw("faq.items") as [string, string][];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("meta_title"),
    description: t("meta_description"),
    url: pageUrl,
    serviceType: t("breadcrumb"),
    provider: {
      "@type": "ProfessionalService",
      name: "Timevo",
      url: BASE,
    },
    areaServed: "FR",
    offers: {
      "@type": "Offer",
      name: t("offre.name"),
      price: "890",
      priceCurrency: "EUR",
      // Le prix affiché est HT : on le déclare explicitement pour éviter
      // que Google le présente comme un TTC.
      valueAddedTaxIncluded: false,
      url: pageUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: L.home,
        item: `${BASE}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb"),
        item: pageUrl,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <NavDkdp />
      <main>
        <Breadcrumb
          label={locale === "fr" ? "Fil d'Ariane" : "Breadcrumb"}
          items={[
            { href: `/${locale}`, label: L.home },
            { label: t("breadcrumb") },
          ]}
        />
        <FacturationPage />
        <RelatedLinks
          eyebrow={t("related_eyebrow")}
          h2={t("related_h2")}
          groups={[
            { title: L.services, items: serviceLinks(locale) },
            { title: L.sectors, items: sectorLinks(locale) },
          ]}
        />
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
