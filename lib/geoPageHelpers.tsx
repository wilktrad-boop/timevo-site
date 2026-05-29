import type { Metadata } from "next";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import GeoPage from "@/components/GeoPage";
import StickyMobileCta from "@/components/StickyMobileCta";
import { CITIES } from "@/lib/cities";
import type { Locale } from "@/lib/pageLabels";

const BASE = "https://www.timevo.io";

export function geoMetadata(citySlug: string, locale: Locale): Metadata {
  const city = CITIES[citySlug];
  if (!city) return {};
  const c = city.content[locale];
  const urlFr = `${BASE}/fr/agence-automatisation-${citySlug}`;
  const urlEn = `${BASE}/en/agence-automatisation-${citySlug}`;
  const url = locale === "fr" ? urlFr : urlEn;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: url,
      languages: { fr: urlFr, en: urlEn, "x-default": urlFr },
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      siteName: "Timevo",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? "en_GB" : "fr_FR",
      type: "website",
      images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: c.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.metaTitle,
      description: c.metaDescription,
      images: [`${BASE}/og-image.png`],
    },
  };
}

export function GeoPageContent({ citySlug, locale }: { citySlug: string; locale: Locale }) {
  const city = CITIES[citySlug];
  if (!city) return null;
  const c = city.content[locale];

  const url = `${BASE}/${locale}/agence-automatisation-${citySlug}`;

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `Timevo — ${c.city}`,
    url,
    image: `${BASE}/og-image.png`,
    description: c.metaDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: c.city,
      postalCode: city.geo.postalCode,
      addressRegion: c.region,
      addressCountry: city.geo.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.geo.latitude,
      longitude: city.geo.longitude,
    },
    areaServed: city.geo.areaServed.map(a => ({ "@type": "City", name: a })),
    priceRange: "€€",
    serviceType:
      locale === "fr"
        ? ["Automatisation de processus", "Agents IA", "Création de sites web", "SEO"]
        : ["Process automation", "AI agents", "Website creation", "SEO"],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "fr" ? "Accueil" : "Home", item: `${BASE}/${locale}` },
      { "@type": "ListItem", position: 2, name: c.h1, item: url },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <NavDkdp />
      <main>
        <GeoPage c={c} locale={locale} />
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
