"use client";

import { useTranslations } from "next-intl";
import { Arrow } from "./primitives";
import {
  IllustrationAutomatisation, IllustrationAgentsIA, IllustrationConseil,
  IllustrationSitesWeb, IllustrationSEO,
} from "./PillarIllustrations";

const illustrations = [
  <IllustrationAutomatisation key="auto" />,
  <IllustrationAgentsIA key="ia" />,
  <IllustrationConseil key="conseil" />,
  <IllustrationSitesWeb key="sites" />,
  <IllustrationSEO key="seo" />,
];

export default function Pillars() {
  const t = useTranslations("pillars");
  const items = t.raw("items") as { tag: string; count: string; title: string; items: string[]; cta: string }[];
  const [row1, row2] = [items.slice(0, 3), items.slice(3)];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
        }}>
          {t("label")}
        </div>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500,
          letterSpacing: "-0.04em", lineHeight: 1.0, margin: 0, marginBottom: 16,
          color: "var(--text)", maxWidth: 900,
        }}>
          {t("h2_line1")}<br />
          <span style={{ color: "var(--dim)" }}>{t("h2_line2")}</span>
        </h2>
        <p style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--dim)",
          maxWidth: 640, marginBottom: 48,
        }}>
          {t("subtitle")}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}
          className="pillars-row1">
          {row1.map((p, i) => <PillarCard key={p.tag} {...p} illustration={illustrations[i]} />)}
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16,
          maxWidth: "calc(66.666% + 8px)", margin: "0 auto",
        }} className="pillars-row2">
          {row2.map((p, i) => <PillarCard key={p.tag} {...p} illustration={illustrations[3 + i]} />)}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ tag, count, title, items, cta, illustration }: {
  tag: string; count: string; title: string; items: string[]; cta: string; illustration: React.ReactNode;
}) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      <div style={{
        height: 200,
        background: "linear-gradient(135deg, var(--accent-tint), var(--card-soft))",
        borderBottom: "1px solid var(--border)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 30%, var(--accent-glow) 0, transparent 50%), radial-gradient(circle at 80% 70%, var(--accent-tint) 0, transparent 60%)",
        }} />
        {illustration}
        <div style={{
          position: "absolute", top: 18, left: 18,
          fontSize: 11, padding: "4px 10px", borderRadius: 999,
          background: "rgba(0,0,0,0.4)", color: "var(--text)",
          backdropFilter: "blur(6px)", fontFamily: "var(--font-geist-sans)",
        }}>{tag}</div>
      </div>
      <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)", marginBottom: 6 }}>{count}</div>
        <h3 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 26, fontWeight: 500,
          letterSpacing: "-0.02em", margin: 0, marginBottom: 18, color: "var(--text)",
        }}>{title}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
          {items.map(it => (
            <span key={it} style={{
              padding: "5px 10px", borderRadius: 999,
              border: "1px solid var(--border-strong)",
              fontFamily: "var(--font-geist-sans)", fontSize: 12, color: "var(--dim)",
            }}>{it}</span>
          ))}
        </div>
        <div style={{
          marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 8,
          color: "var(--accent-soft)", fontFamily: "var(--font-geist-sans)", fontSize: 13, fontWeight: 600,
        }}>
          {cta} <Arrow size={12} />
        </div>
      </div>
    </div>
  );
}
