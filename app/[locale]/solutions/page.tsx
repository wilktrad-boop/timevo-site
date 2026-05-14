import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import Pillars from "@/components/Pillars";
import ContactCard from "@/components/ContactCard";
import ScrollFadeIn from "@/components/ScrollFadeIn";

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

  const t = await getTranslations({ locale, namespace: "solutions_index" });
  const pageUrl = `https://www.timevo.io/${locale}/solutions`;
  const title = t("meta_title");
  const description = t("meta_description");

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        fr: "https://www.timevo.io/fr/solutions",
        en: "https://www.timevo.io/en/solutions",
        "x-default": "https://www.timevo.io/fr/solutions",
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

export default async function SolutionsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "solutions_index" });

  return (
    <>
      <NavDkdp />
      <main>
        <section style={{ padding: "72px 28px 32px", position: "relative" }}>
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
              {t("h1")}
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

        <ScrollFadeIn><Pillars /></ScrollFadeIn>
        <ScrollFadeIn><ContactCard /></ScrollFadeIn>
      </main>
      <FooterDkdp />
    </>
  );
}
