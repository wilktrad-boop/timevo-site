import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import ServiceTemplate from "@/components/ServiceTemplate";

const SERVICE_SLUGS = ["automatisation", "agents-ia", "formation", "sites-web", "seo", "reseaux-sociaux"] as const;
type ServiceSlug = (typeof SERVICE_SLUGS)[number];
type Locale = (typeof routing.locales)[number];

function isValidSlug(value: string): value is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(value);
}

function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICE_SLUGS.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale) || !isValidSlug(slug)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: `services.${slug}` });
  const pageUrl = `https://www.timevo.io/${locale}/solutions/${slug}`;
  const title = t("meta_title");
  const description = t("meta_description");

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        fr: `https://www.timevo.io/fr/solutions/${slug}`,
        en: `https://www.timevo.io/en/solutions/${slug}`,
        "x-default": `https://www.timevo.io/fr/solutions/${slug}`,
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

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale) || !isValidSlug(slug)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <>
      <NavDkdp />
      <main>
        <ServiceTemplate slug={slug} />
      </main>
      <FooterDkdp />
    </>
  );
}
