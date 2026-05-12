import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const BASE_URL = "https://www.timevo.io";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(BASE_URL),

    title: {
      default: t("title"),
      template: `%s | Timevo`,
    },
    description: t("description"),
    keywords: t("keywords"),

    authors: [{ name: "Timevo", url: BASE_URL }],
    creator: "Timevo",

    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        "fr": `${BASE_URL}/fr`,
        "en": `${BASE_URL}/en`,
        "x-default": `${BASE_URL}/fr`,
      },
    },

    openGraph: {
      title: t("og_title"),
      description: t("og_description"),
      url: `${BASE_URL}/${locale}`,
      siteName: "Timevo",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? "en_GB" : "fr_FR",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("og_image_alt"),
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: t("og_title"),
      description: t("og_description"),
      images: [`${BASE_URL}/og-image.png`],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full`}
    >
      <body style={{ background: "var(--bg)", color: "var(--text)" }}>
        <script
          src="https://app.rybbit.io/api/script.js"
          data-site-id="3c0df62af0c0"
          defer
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
