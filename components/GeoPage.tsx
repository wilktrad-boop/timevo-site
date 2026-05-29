"use client";

import { useState } from "react";
import { Arrow, PillPrimary, PillGhost, MonoLabel } from "./primitives";
import ScrollFadeIn from "./ScrollFadeIn";
import type { CityContent } from "@/lib/cities";
import { GEO_LABELS, type Locale } from "@/lib/pageLabels";

const CONTACT_HREF = "https://calendly.com/hello-timevo/30min";

export default function GeoPage({ c, locale }: { c: CityContent; locale: Locale }) {
  const L = GEO_LABELS[locale];
  return (
    <>
      <GeoHero c={c} L={L} />
      <ScrollFadeIn><GeoWhy c={c} L={L} /></ScrollFadeIn>
      <ScrollFadeIn><GeoWhat c={c} L={L} /></ScrollFadeIn>
      <ScrollFadeIn><GeoCase c={c} L={L} /></ScrollFadeIn>
      <ScrollFadeIn><GeoFaq c={c} L={L} /></ScrollFadeIn>
      <ScrollFadeIn><GeoCta c={c} L={L} /></ScrollFadeIn>
    </>
  );
}

type Labels = typeof GEO_LABELS[Locale];

function GeoHero({ c, L }: { c: CityContent; L: Labels }) {
  return (
    <section id="hero" style={{ padding: "72px 28px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          fontFamily: "var(--font-geist-mono)", fontSize: 11,
          color: "var(--accent-soft)", letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: 28,
          padding: "6px 12px",
          background: "var(--accent-tint)",
          border: "1px solid var(--accent-tint)",
          borderRadius: 999,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
          <span>{c.eyebrow}</span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "clamp(40px, 6.5vw, 92px)",
          fontWeight: 500,
          letterSpacing: "-0.05em",
          lineHeight: 0.98,
          margin: 0,
          maxWidth: 1100,
          color: "var(--text)",
        }}>
          {c.h1}
        </h1>

        <div style={{
          marginTop: 32,
          display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "end",
        }} className="hero-subrow">
          <p style={{
            fontFamily: "var(--font-geist-sans)", fontSize: 18, lineHeight: 1.5,
            color: "var(--dim)", margin: 0, maxWidth: 600,
          }}>
            {c.subtitle}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }} className="hero-ctas">
            <PillPrimary href={CONTACT_HREF} large>
              {L.cta_primary} <Arrow color="#fff" size={14} />
            </PillPrimary>
            <PillGhost href="#expertises" large>
              {L.cta_secondary}
            </PillGhost>
          </div>
        </div>

        <div style={{
          marginTop: 56,
          display: "flex", alignItems: "center", gap: 16,
          flexWrap: "wrap",
        }}>
          <span style={{
            fontFamily: "var(--font-geist-mono)", fontSize: 11,
            color: "var(--dim-2)", letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            {c.audienceLabel}
          </span>
          <span style={{ width: 24, height: 1, background: "var(--border-strong)" }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {c.audience.map(item => (
              <span key={item} style={{
                padding: "6px 12px",
                border: "1px solid var(--border-strong)",
                borderRadius: 999,
                fontFamily: "var(--font-geist-sans)", fontSize: 12,
                color: "var(--text)",
              }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GeoWhy({ c, L }: { c: CityContent; L: Labels }) {
  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{L.why}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: 0, marginBottom: 56, color: "var(--text)", maxWidth: 800,
        }}>
          {c.whyH2}
        </h2>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0,
          border: "1px solid var(--border)", borderRadius: 24, overflow: "hidden",
        }} className="pain-grid">
          {c.whyItems.map((p, i) => (
            <div key={p.n} style={{
              padding: 32,
              borderRight: i < c.whyItems.length - 1 ? "1px solid var(--border)" : "none",
              background: "var(--card)",
            }}>
              <div style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent-soft)",
                marginBottom: 16, letterSpacing: "0.08em",
              }}>{p.n}</div>
              <h3 style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 20, fontWeight: 500,
                letterSpacing: "-0.02em", margin: 0, marginBottom: 12, color: "var(--text)",
                lineHeight: 1.25,
              }}>{p.title}</h3>
              <p style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 14, lineHeight: 1.55,
                color: "var(--dim)", margin: 0,
              }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GeoWhat({ c, L }: { c: CityContent; L: Labels }) {
  return (
    <section id="expertises" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{L.expertises}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: 0, marginBottom: 16, color: "var(--text)", maxWidth: 800,
        }}>
          {c.whatH2}
        </h2>
        <p style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--dim)",
          maxWidth: 640, marginBottom: 48,
        }}>
          {c.whatSubtitle}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="pillars-row1">
          {c.whatItems.map(item => (
            <a key={item.title} href={item.href} style={{
              padding: 32,
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 20, textDecoration: "none",
              transition: "border-color .15s, transform .15s",
              display: "block",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
              <h3 style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 22, fontWeight: 500,
                letterSpacing: "-0.02em", margin: 0, marginBottom: 12, color: "var(--text)",
              }}>{item.title}</h3>
              <p style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 14, lineHeight: 1.55,
                color: "var(--dim)", margin: 0, marginBottom: 18,
              }}>{item.desc}</p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                color: "var(--accent-soft)", fontFamily: "var(--font-geist-sans)",
                fontSize: 13, fontWeight: 600,
              }}>
                {L.see_page} <Arrow size={12} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function GeoCase({ c, L }: { c: CityContent; L: Labels }) {
  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{L.case}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: 0, marginBottom: 56, color: "var(--text)", maxWidth: 800,
        }}>
          {c.caseH2}
        </h2>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
          border: "1px solid var(--border)", borderRadius: 24, overflow: "hidden",
        }} className="pain-grid">
          {[
            { label: L.before, items: c.before, accent: false },
            { label: L.after, items: c.after, accent: true },
          ].map((col, idx) => (
            <div key={col.label} style={{
              padding: 36,
              borderRight: idx === 0 ? "1px solid var(--border)" : "none",
              background: col.accent ? "var(--accent-tint)" : "var(--card)",
            }}>
              <div style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 11,
                color: col.accent ? "var(--accent-soft)" : "var(--dim)",
                letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: 24,
              }}>{col.label}</div>
              <ul style={{
                listStyle: "none", padding: 0, margin: 0,
                display: "flex", flexDirection: "column", gap: 14,
              }}>
                {col.items.map((it, i) => (
                  <li key={i} style={{
                    fontFamily: "var(--font-geist-sans)", fontSize: 15,
                    color: col.accent ? "var(--text)" : "var(--dim)",
                    lineHeight: 1.5,
                    paddingLeft: 28, position: "relative",
                  }}>
                    <span style={{
                      position: "absolute", left: 0, top: 4,
                      width: 16, height: 16, borderRadius: 999,
                      background: col.accent ? "var(--accent-tint)" : "transparent",
                      border: col.accent ? "none" : "1px solid var(--border-strong)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {col.accent ? (
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-5" stroke="var(--accent)" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <path d="M2 2l6 6M8 2l-6 6" stroke="var(--dim-2)" strokeWidth="1.5"
                            strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 32,
          display: "inline-flex", alignItems: "baseline", gap: 16,
          padding: "20px 28px",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 16,
        }}>
          <div style={{
            fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>{c.roiLabel}</div>
          <div style={{
            fontFamily: "var(--font-geist-sans)", fontSize: 32, fontWeight: 500,
            letterSpacing: "-0.03em",
            background: "var(--accent-gradient)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>{c.roiValue}</div>
        </div>

        <p style={{
          marginTop: 20,
          fontFamily: "var(--font-geist-sans)", fontSize: 12, lineHeight: 1.5,
          color: "var(--dim-2)", fontStyle: "italic",
          maxWidth: 720,
        }}>
          {c.caseFootnote}
        </p>
      </div>
    </section>
  );
}

function GeoFaq({ c, L }: { c: CityContent; L: Labels }) {
  const [open, setOpen] = useState<number>(0);

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <MonoLabel>{L.faq}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500,
          letterSpacing: "-0.04em", lineHeight: 1.0, margin: 0, marginBottom: 48, color: "var(--text)",
        }}>
          {c.faqH2}
        </h2>
        <div>
          {c.faqs.map(([q, a], idx) => (
            <div key={idx} onClick={() => setOpen(open === idx ? -1 : idx)}
              style={{
                borderTop: "1px solid var(--border)",
                borderBottom: idx === c.faqs.length - 1 ? "1px solid var(--border)" : "none",
                padding: "24px 0", cursor: "pointer",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
                <h3 style={{
                  fontFamily: "var(--font-geist-sans)", fontSize: 18, fontWeight: 500,
                  letterSpacing: "-0.01em", margin: 0, color: "var(--text)", flex: 1,
                }}>{q}</h3>
                <span style={{
                  width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                  border: "1px solid var(--border-strong)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: open === idx ? "var(--accent)" : "var(--dim)",
                  fontSize: 16,
                  transform: open === idx ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform .2s ease, color .2s ease",
                }}>+</span>
              </div>
              {open === idx && (
                <p style={{
                  fontFamily: "var(--font-geist-sans)", fontSize: 15, color: "var(--dim)",
                  margin: "14px 56px 0 0", lineHeight: 1.6,
                }}>{a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GeoCta({ c, L }: { c: CityContent; L: Labels }) {
  return (
    <section id="contact" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "80px 32px" }}>
          <h2 style={{
            fontFamily: "var(--font-geist-sans)", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 500,
            letterSpacing: "-0.05em", lineHeight: 1.0, margin: 0, marginBottom: 28, color: "var(--text)",
            maxWidth: 800, marginLeft: "auto", marginRight: "auto",
          }}>
            {c.ctaH2}
          </h2>
          <p style={{
            fontFamily: "var(--font-geist-sans)", fontSize: 18, lineHeight: 1.5,
            color: "var(--dim)", margin: "0 auto 40px", maxWidth: 600,
          }}>
            {c.ctaSubtitle}
          </p>
          <PillPrimary href={CONTACT_HREF} large>
            {L.cta_final} <Arrow color="#fff" />
          </PillPrimary>
          <p style={{
            marginTop: 24,
            fontFamily: "var(--font-geist-mono)", fontSize: 12,
            color: "var(--dim-2)", letterSpacing: "0.04em",
          }}>
            {L.reassurance}
          </p>
        </div>
      </div>
    </section>
  );
}
