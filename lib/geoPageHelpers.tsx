import type { Metadata } from "next";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import GeoPage from "@/components/GeoPage";
import StickyMobileCta from "@/components/StickyMobileCta";
import { CITIES } from "@/lib/cities";

const BASE = "https://www.timevo.io";

export function geoMetadata(citySlug: string, locale: string): Metadata {
  const c = CITIES[citySlug];
  if (!c) return {};
  const url = `${BASE}/${locale}/agence-automatisation-${citySlug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: url,
      languages: { fr: url, "x-default": url },
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      siteName: "Timevo",
      locale: "fr_FR",
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

export function GeoPageContent({ citySlug, locale }: { citySlug: string; locale: string }) {
  const c = CITIES[citySlug];
  if (!c) return null;

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
      postalCode: c.geo.postalCode,
      addressRegion: c.region,
      addressCountry: c.geo.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: c.geo.latitude,
      longitude: c.geo.longitude,
    },
    areaServed: c.geo.areaServed.map(a => ({ "@type": "City", name: a })),
    priceRange: "€€",
    serviceType: [
      "Automatisation de processus",
      "Agents IA",
      "Création de sites web",
      "SEO",
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${BASE}/${locale}` },
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
        <GeoPage c={c} />
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
