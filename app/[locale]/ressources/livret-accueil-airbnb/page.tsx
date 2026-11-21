import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import StickyMobileCta from "@/components/StickyMobileCta";
import Breadcrumb from "@/components/Breadcrumb";
import LivretForm from "@/components/LivretForm";
import { Arrow, MonoLabel, PillGhost } from "@/components/primitives";
import { LIVRET, LIVRET_PATH } from "@/lib/ressources";
import { SCREEN_SIZES } from "@/lib/sectors";

const BASE = "https://www.timevo.io";
const URL = `${BASE}${LIVRET_PATH}`;
const CONCIERGERIE = "/fr/automatisation-pour/conciergerie";

// Page française uniquement (cf. lib/ressources.ts) : /en/... renvoie 404.
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "fr") return {};
  return {
    title: LIVRET.metaTitle,
    description: LIVRET.metaDescription,
    alternates: { canonical: URL },
    openGraph: {
      title: LIVRET.metaTitle,
      description: LIVRET.metaDescription,
      url: URL,
      siteName: "Timevo",
      locale: "fr_FR",
      type: "website",
      images: [{ url: `${BASE}/ressources/livret-apercu-1.webp`, width: 620, height: 877 }],
    },
    twitter: { card: "summary_large_image", title: LIVRET.metaTitle, description: LIVRET.metaDescription },
  };
}

const h2Style = {
  fontFamily: "var(--font-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
  fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
  margin: 0, color: "var(--text)",
} as const;

export default async function LivretPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "fr") notFound();
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: "Modèle de livret d'accueil pour location courte durée",
    description: LIVRET.metaDescription,
    url: URL,
    inLanguage: "fr",
    isAccessibleForFree: true,
    encodingFormat: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    publisher: { "@type": "ProfessionalService", name: "Timevo", url: BASE },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${BASE}/fr` },
      { "@type": "ListItem", position: 2, name: "Conciergerie", item: `${BASE}${CONCIERGERIE}` },
      { "@type": "ListItem", position: 3, name: "Livret d'accueil", item: URL },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <NavDkdp />
      <main>
        <Breadcrumb
          label="Fil d'Ariane"
          items={[
            { href: "/fr", label: "Accueil" },
            { href: CONCIERGERIE, label: "Conciergerie" },
            { label: "Livret d'accueil" },
          ]}
        />

        {/* Hero + formulaire */}
        <section id="hero" style={{ padding: "72px 28px 96px" }}>
          <div className="livret-hero" style={{
            maxWidth: 1200, margin: "0 auto",
            display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)", gap: 64, alignItems: "start",
          }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "var(--accent-soft)", letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: 28, padding: "6px 12px",
                background: "var(--accent-tint)", border: "1px solid var(--accent-tint)", borderRadius: 999,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
                <span>{LIVRET.eyebrow}</span>
              </div>
              <h1 style={{
                fontFamily: "var(--font-sans)", fontSize: "clamp(38px, 5.2vw, 72px)", fontWeight: 500,
                letterSpacing: "-0.05em", lineHeight: 1.0, margin: 0, color: "var(--text)",
              }}>
                {LIVRET.h1}
              </h1>
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.5, color: "var(--dim)",
                margin: "28px 0 40px", maxWidth: 560,
              }}>
                {LIVRET.subtitle}
              </p>
              <div className="livret-preview" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, maxWidth: 560 }}>
                {[1, 2, 3].map(i => (
                  // eslint-disable-next-line @next/next/no-img-element -- aperçus statiques déjà en WebP
                  <img key={i} src={`/ressources/livret-apercu-${i}.webp`} width={620} height={877}
                    alt={`Page ${i} de l'exemple de livret d'accueil rempli`}
                    loading={i === 1 ? "eager" : "lazy"} decoding="async"
                    style={{ display: "block", width: "100%", height: "auto", borderRadius: 8, border: "1px solid var(--border)" }} />
                ))}
              </div>
            </div>

            <div id="telecharger" style={{
              background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: 32,
            }}>
              <h2 style={{ ...h2Style, fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 10 }}>{LIVRET.formH2}</h2>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--dim)", margin: "0 0 28px" }}>
                {LIVRET.formSubtitle}
              </p>
              <LivretForm />
            </div>
          </div>
        </section>

        {/* Contenu du livret */}
        <ScrollFadeIn>
          <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <MonoLabel>Le modèle</MonoLabel>
              <h2 style={{ ...h2Style, marginBottom: 48 }}>{LIVRET.contentsH2}</h2>
              <div className="pillars-row1" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
                {LIVRET.contents.map((c, i) => (
                  <div key={c.title} style={{ padding: 28, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim)", marginBottom: 12, letterSpacing: "0.08em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 10px", color: "var(--text)" }}>
                      {c.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        {/* Pont vers l'offre conciergerie */}
        <ScrollFadeIn>
          <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
            <div className="livret-digital" style={{
              maxWidth: 1200, margin: "0 auto",
              display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 300px)", gap: 64, alignItems: "center",
            }}>
              <div>
                <MonoLabel>Version digitale</MonoLabel>
                <h2 style={{ ...h2Style, marginBottom: 24 }}>{LIVRET.digitalH2}</h2>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.55, color: "var(--dim)", margin: "0 0 32px", maxWidth: 560 }}>
                  {LIVRET.digitalText}
                </p>
                <PillGhost href={CONCIERGERIE} large>
                  {LIVRET.digitalCta} <Arrow size={14} />
                </PillGhost>
              </div>
              <figure style={{ margin: 0, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- capture statique déjà en WebP */}
                <img src="/secteurs/conciergerie/guide.webp" alt={LIVRET.digitalAlt}
                  width={SCREEN_SIZES.mobile.width} height={SCREEN_SIZES.mobile.height} loading="lazy" decoding="async"
                  style={{ display: "block", width: "100%", height: "auto", borderBottom: "1px solid var(--border)" }} />
                <figcaption style={{ padding: "14px 18px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)" }}>
                  {LIVRET.digitalCaption}
                </figcaption>
              </figure>
            </div>
          </section>
        </ScrollFadeIn>
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
