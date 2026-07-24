import { Arrow, PillPrimary } from "../primitives";
import DemoApp from "./DemoApp";
import type { DemoCopy, Locale, SectorData } from "@/lib/demo/types";

const CONTACT_HREF = "https://calendly.com/hello-timevo/30min";

/**
 * Ossature d'une page de démo.
 *
 * La page s'ouvre sur l'application, pleine largeur — pas sur un argumentaire
 * avec une capture au milieu. Le bloc marketing (sous-titre, lecture commentée,
 * CTA) passe SOUS le dashboard.
 *
 * Un `<h1>` compact reste au-dessus du cadre : une page qui s'ouvre sur une
 * application sans titre perd son orientation pour quelqu'un qui arrive d'une
 * recherche, et c'est un signal que ces pages sont censées porter.
 *
 * Deux règles de composition, inchangées :
 * - dans le cadre, uniquement ce qu'une vraie application afficherait ;
 * - l'argumentaire Timevo vit sous le cadre, dans la lecture commentée.
 */
export default function DashboardShell({
  data,
  copy,
  locale,
}: {
  data: SectorData;
  copy: DemoCopy;
  locale: Locale;
}) {
  return (
    <>
      {/* ── Titre compact + application ─────────────────────────── */}
      <section style={{ padding: "28px 28px 64px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            fontFamily: "var(--font-mono)", fontSize: 10.5,
            color: "var(--accent-soft)", letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: 14, padding: "5px 11px",
            background: "var(--accent-tint)", border: "1px solid var(--accent-tint)", borderRadius: 999,
          }}>
            <span aria-hidden="true" style={{
              width: 6, height: 6, borderRadius: 999, background: "var(--accent)",
            }} />
            <span>{copy.eyebrow}</span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-sans)", fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 500,
            letterSpacing: "-0.035em", lineHeight: 1.1, margin: "0 0 24px", color: "var(--text)",
          }}>
            {copy.h1}
          </h1>

          <DemoApp data={data} copy={copy} locale={locale} />

          {/* Mention explicite, sous le cadre, lue comme une note d'auteur. */}
          <p style={{
            marginTop: 18, maxWidth: 860,
            fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.6, color: "var(--dim-2)",
          }}>
            {copy.demoNote}
          </p>
        </div>
      </section>

      {/* ── Le contexte, sous l'application ─────────────────────── */}
      <section style={{ padding: "80px 28px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "clamp(19px, 2.2vw, 26px)",
            lineHeight: 1.45, color: "var(--text)", margin: 0, maxWidth: 880,
            letterSpacing: "-0.015em",
          }}>
            {copy.subtitle}
          </p>
        </div>
      </section>

      {/* ── Lecture commentée ───────────────────────────────────
          Tout l'argumentaire Timevo est ici, hors du cadre : dans le
          dashboard, seule l'application parle. */}
      <section style={{ padding: "80px 28px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-sans)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 500,
            letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0, marginBottom: 16,
            color: "var(--text)", maxWidth: 800,
          }}>
            {copy.readingH2}
          </h2>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.5,
            color: "var(--dim)", margin: 0, marginBottom: 56, maxWidth: 680,
          }}>
            {copy.readingSubtitle}
          </p>

          <div className="demo-reading-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "48px 64px",
          }}>
            {copy.readings.map((r, i) => (
              <div key={r.tab}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)",
                    letterSpacing: "0.12em",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 500,
                    letterSpacing: "-0.02em", color: "var(--text)",
                  }}>
                    {r.tab}
                  </span>
                </div>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6,
                  color: "var(--dim)", margin: 0, maxWidth: 520,
                }}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", padding: "72px 32px" }}>
            <h2 style={{
              fontFamily: "var(--font-sans)", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 500,
              letterSpacing: "-0.05em", lineHeight: 1.0, margin: 0, marginBottom: 28, color: "var(--text)",
              maxWidth: 800, marginLeft: "auto", marginRight: "auto",
            }}>
              {copy.ctaH2}
            </h2>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.5,
              color: "var(--dim)", margin: "0 auto 40px", maxWidth: 620,
            }}>
              {copy.ctaSubtitle}
            </p>
            <PillPrimary href={CONTACT_HREF} large>
              {copy.ctaButton} <Arrow color="#fff" />
            </PillPrimary>
            <p style={{
              marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 12,
              color: "var(--dim-2)", letterSpacing: "0.04em",
            }}>
              {copy.ctaReassurance}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
