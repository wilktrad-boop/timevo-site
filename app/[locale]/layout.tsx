import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Inter : la police de la plaquette commerciale, pour une identité typographique unique.
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
// Geist Mono reste : Inter n'a pas de compagne monospace, et le mono ne sert
// que pour les eyebrows et les libellés techniques.
const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
    },

    twitter: {
      card: "summary_large_image",
      title: t("og_title"),
      description: t("og_description"),
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

/**
 * Le site n'a qu'un thème, clair. On le déclare pour que les contrôles natifs
 * (champs de formulaire, scrollbars) et la barre du navigateur mobile suivent,
 * au lieu de partir sur le réglage système de l'utilisateur.
 */
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

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
      className={`${sans.variable} ${mono.variable} h-full`}
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
