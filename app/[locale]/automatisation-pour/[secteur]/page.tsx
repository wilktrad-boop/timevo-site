import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import SectorPage from "@/components/SectorPage";
import StickyMobileCta from "@/components/StickyMobileCta";
import { SECTORS, SECTOR_SLUGS } from "@/lib/sectors";
import type { Locale } from "@/lib/pageLabels";

const BASE = "https://www.timevo.io";

function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    SECTOR_SLUGS.map(secteur => ({ locale, secteur }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; secteur: string }>;
}): Promise<Metadata> {
  const { locale, secteur } = await params;
  if (!isValidLocale(locale) || !SECTORS[secteur]) return {};
  const s = SECTORS[secteur][locale];

  const pageUrlFr = `${BASE}/fr/automatisation-pour/${secteur}`;
  const pageUrlEn = `${BASE}/en/automatisation-pour/${secteur}`;
  const url = locale === "fr" ? pageUrlFr : pageUrlEn;

  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        fr: pageUrlFr,
        en: pageUrlEn,
        "x-default": pageUrlFr,
      },
    },
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      url,
      siteName: "Timevo",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? "en_GB" : "fr_FR",
      type: "website",
      images: [
        {
          url: `${BASE}/og-image.png`,
          width: 1200,
          height: 630,
          alt: s.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: s.metaTitle,
      description: s.metaDescription,
      images: [`${BASE}/og-image.png`],
    },
  };
}

export default async function SectorPageRoute({
  params,
}: {
  params: Promise<{ locale: string; secteur: string }>;
}) {
  const { locale, secteur } = await params;
  if (!isValidLocale(locale) || !SECTORS[secteur]) notFound();
  const s = SECTORS[secteur][locale];

  setRequestLocale(locale);

  const url = `${BASE}/${locale}/automatisation-pour/${secteur}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.metaTitle,
    description: s.metaDescription,
    url,
    serviceType: locale === "fr" ? "Automatisation de processus" : "Process automation",
    provider: {
      "@type": "ProfessionalService",
      name: "Timevo",
      url: BASE,
    },
    areaServed: ["FR", "BE", "CH"],
    audience: {
      "@type": "BusinessAudience",
      audienceType: s.h1,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "fr" ? "Accueil" : "Home", item: `${BASE}/${locale}` },
      { "@type": "ListItem", position: 2, name: s.h1, item: url },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <NavDkdp />
      <main>
        <SectorPage s={s} locale={locale} />
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
