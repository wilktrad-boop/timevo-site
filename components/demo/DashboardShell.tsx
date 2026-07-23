import { Arrow, PillPrimary } from "../primitives";
import DemoTabs from "./DemoTabs";
import { KpiRow, QuotesPanel, CallsPanel, LeadsPanel, BillingPanel } from "./panels";
import type { DemoDashboard } from "@/lib/demoDashboards";

const CONTACT_HREF = "https://calendly.com/hello-timevo/30min";

/**
 * Filigrane : une tuile SVG répétée en background-image.
 *
 * La première version empilait 60 <span> dans un calque tourné et étendu à
 * `inset: -20%`. Sur un conteneur de plusieurs milliers de pixels de haut, ça
 * produisait une couche composite géante que la nav en `backdrop-filter`
 * devait recalculer à chaque scroll : le rendu bloquait. Une tuile répétée
 * coûte une seule passe de peinture.
 */
function watermarkTile(text: string): string {
  // Les caractères non-ASCII passent en référence XML pour rester dans un
  // data URI sûr (le É de « DÉMO »).
  const safe = [...text].map(c => (c.charCodeAt(0) > 127 ? `&#${c.charCodeAt(0)};` : c)).join("");
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='190'>` +
    `<text x='150' y='100' text-anchor='middle' transform='rotate(-24 150 100)' ` +
    `font-family='monospace' font-size='30' letter-spacing='8' ` +
    `fill='#ededed' fill-opacity='0.05'>${safe}</text></svg>`;
  // Le `#` doit être encodé en dernier : il sert à la fois pour la couleur et
  // pour les entités XML, et un `#` brut couperait le data URI.
  const encoded = svg
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/#/g, "%23");
  return `url("data:image/svg+xml,${encoded}")`;
}

/**
 * Ossature d'une page de démo. Server Component.
 *
 * Porte les deux dispositifs qui signalent que les données sont fictives :
 * le filigrane répété en fond de la zone de données, et la mention explicite
 * sous le dashboard.
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
          {/* Le filigrane est un motif de fond : décoratif, non sélectionnable,
              et invisible pour les lecteurs d'écran (la mention sous le cadre
              porte l'information). */}
          <div style={{
            position: "relative", overflow: "hidden",
            border: "1px solid var(--border-strong)", borderRadius: 24,
            background: "var(--bg)",
            backgroundImage: watermarkTile(d.watermark),
            backgroundRepeat: "repeat",
          }}>
            {/* Barre de titre façon application */}
            <div style={{
              position: "relative", zIndex: 1,
              display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
              padding: "16px 24px", borderBottom: "1px solid var(--border)",
              background: "var(--card)",
            }}>
              <span aria-hidden="true" style={{ display: "inline-flex", gap: 6 }}>
                {["#f87171", "#fbbf24", "#4ade80"].map(c => (
                  <span key={c} style={{ width: 9, height: 9, borderRadius: 999, background: c, opacity: 0.55 }} />
                ))}
              </span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "var(--dim-2)", letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                {d.demoBadge}
              </span>
            </div>

            <div style={{ position: "relative", zIndex: 1, padding: "32px 24px 40px" }}>
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
