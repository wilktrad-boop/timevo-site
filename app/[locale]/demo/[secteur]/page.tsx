import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import StickyMobileCta from "@/components/StickyMobileCta";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedLinks from "@/components/RelatedLinks";
import DashboardShell from "@/components/demo/DashboardShell";
import { DEMO_DASHBOARDS, DEMO_SLUGS } from "@/lib/demoDashboards";
import type { Locale } from "@/lib/pageLabels";
import { serviceLinks, sectorLinks, cityLinks, sectorLink, LINK_LABELS } from "@/lib/links";

const BASE = "https://www.timevo.io";

function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    DEMO_SLUGS.map(secteur => ({ locale, secteur }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; secteur: string }>;
}): Promise<Metadata> {
  const { locale, secteur } = await params;
  if (!isValidLocale(locale) || !DEMO_DASHBOARDS[secteur]) return {};
  const d = DEMO_DASHBOARDS[secteur][locale];

  const urlFr = `${BASE}/fr/demo/${secteur}`;
  const urlEn = `${BASE}/en/demo/${secteur}`;
  const url = locale === "fr" ? urlFr : urlEn;

  return {
    title: d.metaTitle,
    description: d.metaDescription,
    alternates: {
      canonical: url,
      languages: { fr: urlFr, en: urlEn, "x-default": urlFr },
    },
    openGraph: {
      title: d.metaTitle,
      description: d.metaDescription,
      url,
      siteName: "Timevo",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? "en_GB" : "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: d.metaTitle,
      description: d.metaDescription,
    },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string; secteur: string }>;
}) {
  const { locale, secteur } = await params;
  if (!isValidLocale(locale) || !DEMO_DASHBOARDS[secteur]) notFound();

  setRequestLocale(locale);

  const d = DEMO_DASHBOARDS[secteur][locale];
  const L = LINK_LABELS[locale];
  const url = `${BASE}/${locale}/demo/${secteur}`;
  const sector = sectorLink(secteur, locale);

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: d.metaTitle,
    description: d.metaDescription,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    provider: {
      "@type": "ProfessionalService",
      name: "Timevo",
      url: BASE,
    },
    // La page est une démonstration : on ne revendique ni prix ni avis.
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L.home, item: `${BASE}/${locale}` },
      { "@type": "ListItem", position: 2, name: L.solutions, item: `${BASE}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: sector.label, item: `${BASE}${sector.href}` },
      { "@type": "ListItem", position: 4, name: d.eyebrow, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <NavDkdp />
      <main>
        <Breadcrumb
          label={locale === "fr" ? "Fil d'Ariane" : "Breadcrumb"}
          items={[
            { href: `/${locale}`, label: L.home },
            { href: `/${locale}/solutions`, label: L.solutions },
            { href: sector.href, label: sector.label },
            { label: locale === "fr" ? "Démo" : "Demo" },
          ]}
        />
        <DashboardShell data={DEMO_DASHBOARDS[secteur].data} copy={d} locale={locale} />
        <RelatedLinks
          eyebrow={L.eyebrow}
          h2={L.h2}
          groups={[
            { title: L.services, items: serviceLinks(locale) },
            { title: L.sectors, items: sectorLinks(locale) },
            { title: L.cities, items: cityLinks(locale) },
          ]}
        />
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
