import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { REALISATIONS } from "@/lib/realisations";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import Realisations from "@/components/Realisations";
import ContactCard from "@/components/ContactCard";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import StickyMobileCta from "@/components/StickyMobileCta";

type Locale = (typeof routing.locales)[number];

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

  const t = await getTranslations({ locale, namespace: "realisations" });
  const pageUrl = `https://www.timevo.io/${locale}/realisations`;
  const title = t("meta_title");
  const description = t("meta_description");

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        fr: "https://www.timevo.io/fr/realisations",
        en: "https://www.timevo.io/en/realisations",
        "x-default": "https://www.timevo.io/fr/realisations",
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
      images: [
        {
          url: "https://www.timevo.io/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.timevo.io/og-image.png"],
    },
  };
}

type Item = { meta: string; title: string; description: string; chips: string[] };

export default async function RealisationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "realisations" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const items = t.raw("items") as Item[];
  const homeUrl = `https://www.timevo.io/${locale}`;
  const pageUrl = `https://www.timevo.io/${locale}/realisations`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "fr" ? "Accueil" : "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("realisations"),
        item: pageUrl,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("meta_title"),
    description: t("meta_description"),
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Timevo",
      url: "https://www.timevo.io",
    },
    hasPart: REALISATIONS.map((site, i) => ({
      "@type": "WebSite",
      name: items[i].title,
      url: site.url,
      abstract: items[i].description,
      image: `https://www.timevo.io${site.image}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <NavDkdp />
      <main>
        <section style={{ padding: "72px 28px 32px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              fontFamily: "var(--font-geist-mono)", fontSize: 11,
              color: "var(--accent-soft)", letterSpacing: "0.12em", textTransform: "uppercase",
              marginBottom: 28,
              padding: "6px 12px",
              background: "var(--accent-tint)",
              border: "1px solid var(--accent-tint)",
              borderRadius: 999,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
              <span>{t("eyebrow")}</span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(40px, 6.5vw, 92px)",
              fontWeight: 500,
              letterSpacing: "-0.05em",
              lineHeight: 0.98,
              margin: 0,
              maxWidth: 1100,
              color: "var(--text)",
            }}>
              {t("h1_line1")}<br />
              <span style={{ color: "var(--dim)" }}>{t("h1_line2")}</span>
            </h1>

            <p style={{
              fontFamily: "var(--font-geist-sans)", fontSize: 18, lineHeight: 1.5,
              color: "var(--dim)", margin: 0, marginTop: 28,
              maxWidth: 720,
            }}>
              {t("subtitle")}
            </p>
          </div>
        </section>

        <ScrollFadeIn><Realisations /></ScrollFadeIn>
        <ScrollFadeIn><ContactCard /></ScrollFadeIn>
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
