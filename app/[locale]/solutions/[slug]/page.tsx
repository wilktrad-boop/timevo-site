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

  const tService = await getTranslations({ locale, namespace: `services.${slug}` });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const pageUrl = `https://www.timevo.io/${locale}/solutions/${slug}`;
  const homeUrl = `https://www.timevo.io/${locale}`;
  const solutionsUrl = `https://www.timevo.io/${locale}/solutions`;
  const breadcrumbLabel = (tNav.raw("solutions_items") as string[])[SERVICE_SLUGS.indexOf(slug)];
  const faqItems = tService.raw("faq.items") as [string, string][];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: tService("meta_title"),
    description: tService("meta_description"),
    url: pageUrl,
    serviceType: breadcrumbLabel,
    provider: {
      "@type": "ProfessionalService",
      name: "Timevo",
      url: "https://www.timevo.io",
    },
    areaServed: ["FR", "BE", "CH"],
    audience: {
      "@type": "BusinessAudience",
      audienceType: locale === "fr" ? "PME haut ticket" : "Premium SMBs",
    },
  };

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
        name: "Solutions",
        item: solutionsUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: breadcrumbLabel,
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
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
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
        <ServiceTemplate slug={slug} />
      </main>
      <FooterDkdp />
    </>
  );
}
