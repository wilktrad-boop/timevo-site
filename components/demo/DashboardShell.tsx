import { Arrow, PillPrimary } from "../primitives";
import DemoTabs from "./DemoTabs";
import { KpiRow, QuotesPanel, CallsPanel, LeadsPanel, BillingPanel } from "./panels";
import type { DemoDashboard } from "@/lib/demoDashboards";

const CONTACT_HREF = "https://calendly.com/hello-timevo/30min";

/**
 * Ossature d'une page de démo. Server Component.
 *
 * Deux règles de composition :
 * - Dans le cadre, uniquement ce qu'une vraie application afficherait :
 *   libellés opérationnels, compteurs, filtres. Aucun argumentaire.
 * - L'argumentaire Timevo vit sous le cadre, dans la lecture commentée.
 *
 * C'est aussi là que se trouvent les deux signaux « données fictives » :
 * la barre de titre et la mention complète.
 */
export default function DashboardShell({ d }: { d: DemoDashboard }) {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section style={{ padding: "56px 28px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--accent-soft)", letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: 28, padding: "6px 12px",
            background: "var(--accent-tint)", border: "1px solid var(--accent-tint)", borderRadius: 999,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
            <span>{d.eyebrow}</span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-sans)", fontSize: "clamp(36px, 5.5vw, 76px)", fontWeight: 500,
            letterSpacing: "-0.05em", lineHeight: 1.0, margin: 0, maxWidth: 1000, color: "var(--text)",
          }}>
            {d.h1}
          </h1>

          <p style={{
            fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.5,
            color: "var(--dim)", margin: 0, marginTop: 26, maxWidth: 760,
          }}>
            {d.subtitle}
          </p>
        </div>
      </section>

      {/* ── Le dashboard ────────────────────────────────────────── */}
      <section style={{ padding: "0 28px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            position: "relative", overflow: "hidden",
            border: "1px solid var(--border-strong)", borderRadius: 24,
            background: "var(--bg)",
          }}>
            {/* Barre de titre : c'est elle qui porte le signal « données
                fictives » pendant la lecture. La mention complète sous le cadre
                prend le relais une fois qu'on a scrollé. */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
              padding: "15px 24px",
              borderBottom: "1px solid var(--accent-tint)",
              background: "var(--accent-tint)",
            }}>
              <span aria-hidden="true" style={{
                width: 7, height: 7, borderRadius: 999,
                background: "var(--accent)", flex: "0 0 auto",
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11.5,
                color: "var(--accent-soft)", letterSpacing: "0.14em", textTransform: "uppercase",
              }}>
                {d.demoBadge}
              </span>
            </div>

            <div style={{ padding: "32px 24px 40px" }}>
              <KpiRow d={d} />
              <DemoTabs labels={d.tabs}>
                <QuotesPanel d={d} />
                <CallsPanel d={d} />
                <LeadsPanel d={d} />
                <BillingPanel d={d} />
              </DemoTabs>
            </div>
          </div>

          {/* Mention explicite, sous le cadre pour être lue comme une note d'auteur. */}
          <p style={{
            marginTop: 20, maxWidth: 820,
            fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.6, color: "var(--dim-2)",
          }}>
            {d.demoNote}
          </p>
        </div>
      </section>

      {/* ── Lecture commentée ───────────────────────────────────
          Tout l'argumentaire Timevo est ici, hors du cadre : dans le
          dashboard, seule l'application parle. */}
      <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-sans)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 500,
            letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0, marginBottom: 16,
            color: "var(--text)", maxWidth: 800,
          }}>
            {d.readingH2}
          </h2>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.5,
            color: "var(--dim)", margin: 0, marginBottom: 56, maxWidth: 680,
          }}>
            {d.readingSubtitle}
          </p>

          <div className="demo-reading-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "48px 64px",
          }}>
            {d.readings.map((r, i) => (
              <div key={r.tab}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
                }}>
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
              {d.ctaH2}
            </h2>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.5,
              color: "var(--dim)", margin: "0 auto 40px", maxWidth: 620,
            }}>
              {d.ctaSubtitle}
            </p>
            <PillPrimary href={CONTACT_HREF} large>
              {d.ctaButton} <Arrow color="#fff" />
            </PillPrimary>
            <p style={{
              marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 12,
              color: "var(--dim-2)", letterSpacing: "0.04em",
            }}>
              {d.ctaReassurance}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
