import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import Breadcrumb from "@/components/Breadcrumb";
import StickyMobileCta from "@/components/StickyMobileCta";
import AuditAvis from "@/components/avis/AuditAvis";
import { Arrow, MonoLabel, PillGhost } from "@/components/primitives";
import { AVIS, AVIS_PATH } from "@/lib/ressources";

const BASE = "https://www.timevo.io";
const PAGE_URL = `${BASE}${AVIS_PATH}`;
const AGENTS = "/fr/solutions/agents-ia";

// Délai maximal des Server Actions de la page (récupération des avis et analyse IA).
export const maxDuration = 300;

// Page française uniquement : /en/... renvoie 404.
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "fr") return {};
  return {
    title: AVIS.metaTitle,
    description: AVIS.metaDescription,
    alternates: { canonical: PAGE_URL },
    openGraph: { title: AVIS.metaTitle, description: AVIS.metaDescription, url: PAGE_URL, siteName: "Timevo", locale: "fr_FR", type: "website" },
    twitter: { card: "summary", title: AVIS.metaTitle, description: AVIS.metaDescription },
  };
}

const h2Style = {
  fontFamily: "var(--font-sans)", fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 500,
  letterSpacing: "-0.04em", lineHeight: 1.0, margin: 0, color: "var(--text)",
} as const;

export default async function RepondreAvisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "fr") notFound();
  setRequestLocale(locale);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${BASE}/fr` },
      { "@type": "ListItem", position: 2, name: "Répondre à un avis Google", item: PAGE_URL },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <NavDkdp />
      <main>
        <Breadcrumb label="Fil d'Ariane" items={[{ href: "/fr", label: "Accueil" }, { label: "Répondre à un avis Google" }]} />
        <section style={{ padding: "48px 28px 80px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-soft)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>{AVIS.eyebrow}</div>
            <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1.0, margin: "0 0 16px", color: "var(--text)" }}>{AVIS.h1}</h1>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.5, color: "var(--dim)", margin: "0 0 36px", maxWidth: 680 }}>{AVIS.subtitle}</p>
            <AuditAvis />
          </div>
        </section>

        <section style={{ padding: "88px 28px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <MonoLabel>Le guide</MonoLabel>
            <h2 style={{ ...h2Style, marginBottom: 40 }}>{AVIS.guideH2}</h2>
            <div style={{ display: "grid", gap: 28 }}>
              {AVIS.guide.map(g => (
                <div key={g.titre} style={{ maxWidth: 720 }}>
                  <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 8px", color: "var(--text)" }}>{g.titre}</h3>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.65, color: "var(--dim)", margin: 0 }}>{g.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "88px 28px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gap: 24 }}>
            <h2 style={h2Style}>{AVIS.bridgeH2}</h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.55, color: "var(--dim)", margin: 0, maxWidth: 640 }}>{AVIS.bridgeText}</p>
            <PillGhost href={AGENTS} large>{AVIS.bridgeCta} <Arrow size={14} /></PillGhost>
          </div>
        </section>
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
