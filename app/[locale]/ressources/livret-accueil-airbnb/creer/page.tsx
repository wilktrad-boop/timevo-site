import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import Breadcrumb from "@/components/Breadcrumb";
import Generateur from "@/components/livret/Generateur";
import { Arrow, PillGhost } from "@/components/primitives";
import { GENERATEUR, LIVRET_PATH } from "@/lib/ressources";

const BASE = "https://www.timevo.io";
const PAGE_URL = `${BASE}${LIVRET_PATH}/creer`;

// Page française uniquement (cf. lib/ressources.ts) : /en/... renvoie 404.
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "fr") return {};
  return {
    title: GENERATEUR.metaTitle,
    description: GENERATEUR.metaDescription,
    alternates: { canonical: PAGE_URL },
    openGraph: { title: GENERATEUR.metaTitle, description: GENERATEUR.metaDescription, url: PAGE_URL, siteName: "Timevo", locale: "fr_FR", type: "website", images: [{ url: `${BASE}/ressources/livret-apercu-1.webp`, width: 620, height: 877 }] },
    twitter: { card: "summary_large_image", title: GENERATEUR.metaTitle, description: GENERATEUR.metaDescription },
  };
}

export default async function CreerLivretPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "fr") notFound();
  setRequestLocale(locale);

  return (
    <>
      <NavDkdp />
      <main>
        <Breadcrumb label="Fil d'Ariane" items={[
          { href: "/fr", label: "Accueil" },
          { href: "/fr/automatisation-pour/conciergerie", label: "Conciergerie" },
          { href: LIVRET_PATH, label: "Livret d'accueil" },
          { label: "Créer mon livret" },
        ]} />
        <section style={{ padding: "48px 28px 96px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h1 style={{
              fontFamily: "var(--font-sans)", fontSize: "clamp(34px, 4.6vw, 60px)", fontWeight: 500,
              letterSpacing: "-0.05em", lineHeight: 1.0, margin: "0 0 16px", color: "var(--text)",
            }}>{GENERATEUR.h1}</h1>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.5, color: "var(--dim)", margin: "0 0 40px", maxWidth: 640 }}>
              {GENERATEUR.subtitle}
            </p>
            <Generateur />
          </div>
        </section>
        <section style={{ padding: "72px 28px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.5, color: "var(--dim)", margin: 0, maxWidth: 640 }}>{GENERATEUR.bridge}</p>
            <PillGhost href="/fr/automatisation-pour/conciergerie" large>{GENERATEUR.bridgeCta} <Arrow size={14} /></PillGhost>
          </div>
        </section>
      </main>
      <FooterDkdp />
    </>
  );
}
