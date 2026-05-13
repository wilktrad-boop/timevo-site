"use client";

import { useTranslations } from "next-intl";
import { Arrow, PillPrimary, PillGhost, MonoLabel } from "./primitives";
import ScrollFadeIn from "./ScrollFadeIn";
import {
  IllustrationAutomatisation, IllustrationAgentsIA, IllustrationFormation,
  IllustrationSitesWeb, IllustrationSEO,
} from "./PillarIllustrations";

const CALENDLY_URL = "https://calendly.com/timevo/audit";

const HERO_ILLUSTRATIONS: Record<string, React.ReactNode> = {
  "automatisation": <IllustrationAutomatisation />,
  "agents-ia": <IllustrationAgentsIA />,
  "formation": <IllustrationFormation />,
  "sites-web": <IllustrationSitesWeb />,
  "seo": <IllustrationSEO />,
};

export default function ServiceTemplate({ slug }: { slug: string }) {
  const t = useTranslations(`services.${slug}`);

  return (
    <>
      <ServiceHero t={t} slug={slug} />
      <ScrollFadeIn><ServiceProblem t={t} /></ScrollFadeIn>
      <ScrollFadeIn><ServiceDeliverables t={t} /></ScrollFadeIn>
      <ScrollFadeIn><ServiceCase t={t} /></ScrollFadeIn>
      <ScrollFadeIn><ServiceMethod t={t} /></ScrollFadeIn>
      <ScrollFadeIn><ServiceFaq t={t} /></ScrollFadeIn>
      <ScrollFadeIn><ServiceCta t={t} /></ScrollFadeIn>
    </>
  );
}

type T = ReturnType<typeof useTranslations>;

// ── 1. Hero ──────────────────────────────────────────────────────────

function ServiceHero({ t, slug }: { t: T; slug: string }) {
  const audienceItems = t.raw("audience.items") as string[];
  const illustration = HERO_ILLUSTRATIONS[slug];

  return (
    <section id="hero" style={{ padding: "72px 28px 80px", position: "relative", overflow: "hidden" }}>
      {illustration && (
        <div style={{
          position: "absolute",
          top: "20%",
          right: "-8%",
          width: "55%",
          maxWidth: 720,
          opacity: 0.22,
          pointerEvents: "none",
          filter: "blur(0.5px)",
        }}>
          <div style={{ position: "relative", paddingBottom: "50%" }}>
            {illustration}
          </div>
        </div>
      )}

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
          <span>{t("hero.eyebrow")}</span>
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
          {t("hero.h1")}
        </h1>

        <div style={{
          marginTop: 32,
          display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "end",
        }} className="hero-subrow">
          <p style={{
            fontFamily: "var(--font-geist-sans)", fontSize: 18, lineHeight: 1.5,
            color: "var(--dim)", margin: 0, maxWidth: 560,
          }}>
            {t("hero.subtitle")}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }} className="hero-ctas">
            <PillPrimary href={CALENDLY_URL} large>
              {t("hero.cta_primary")} <Arrow color="#fff" size={14} />
            </PillPrimary>
            <PillGhost href="#deliverables" large>
              {t("hero.cta_secondary")}
            </PillGhost>
          </div>
        </div>

        {/* Audience chips */}
        <div style={{
          marginTop: 56,
          display: "flex", alignItems: "center", gap: 16,
          flexWrap: "wrap",
        }}>
          <span style={{
            fontFamily: "var(--font-geist-mono)", fontSize: 11,
            color: "var(--dim-2)", letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            {t("audience.label")}
          </span>
          <span style={{ width: 24, height: 1, background: "var(--border-strong)" }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {audienceItems.map((item) => (
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

// ── 2. Problème ──────────────────────────────────────────────────────

function ServiceProblem({ t }: { t: T }) {
  const items = t.raw("problem.items") as { n: string; title: string; desc: string }[];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{t("problem.label")}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: 0, marginBottom: 56, color: "var(--text)", maxWidth: 800,
        }}>
          {t("problem.h2")}
        </h2>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0,
          border: "1px solid var(--border)", borderRadius: 24, overflow: "hidden",
        }} className="pain-grid">
          {items.map((item, i) => (
            <div key={item.n} style={{
              padding: 32,
              borderRight: i < items.length - 1 ? "1px solid var(--border)" : "none",
              background: "var(--card)",
            }}>
              <div style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent-soft)",
                marginBottom: 16, letterSpacing: "0.08em",
              }}>{item.n}</div>
              <h3 style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 20, fontWeight: 500,
                letterSpacing: "-0.02em", margin: 0, marginBottom: 12, color: "var(--text)",
                lineHeight: 1.25,
              }}>{item.title}</h3>
              <p style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 14, lineHeight: 1.55,
                color: "var(--dim)", margin: 0,
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 3. Deliverables ──────────────────────────────────────────────────

function ServiceDeliverables({ t }: { t: T }) {
  const items = t.raw("deliverables.items") as { title: string; desc: string }[];

  return (
    <section id="deliverables" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{t("deliverables.label")}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: 0, marginBottom: 16, color: "var(--text)", maxWidth: 800,
        }}>
          {t("deliverables.h2")}
        </h2>
        <p style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--dim)",
          maxWidth: 640, marginBottom: 48,
        }}>
          {t("deliverables.subtitle")}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="pillars-row1">
          {items.map((item, i) => (
            <div key={item.title} style={{
              padding: 28,
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 20, position: "relative",
            }}>
              <div style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)",
                marginBottom: 12, letterSpacing: "0.08em",
              }}>{String(i + 1).padStart(2, "0")}</div>
              <h3 style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 18, fontWeight: 500,
                letterSpacing: "-0.02em", margin: 0, marginBottom: 10, color: "var(--text)",
              }}>{item.title}</h3>
              <p style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 14, lineHeight: 1.55,
                color: "var(--dim)", margin: 0,
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 4. Cas concret ───────────────────────────────────────────────────

function ServiceCase({ t }: { t: T }) {
  const before = t.raw("case.before") as string[];
  const after = t.raw("case.after") as string[];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{t("case.label")}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: 0, marginBottom: 56, color: "var(--text)", maxWidth: 800,
        }}>
          {t("case.h2")}
        </h2>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
          border: "1px solid var(--border)", borderRadius: 24, overflow: "hidden",
        }} className="pain-grid">
          {[
            { label: t("case.before_label"), items: before, accent: false },
            { label: t("case.after_label"), items: after, accent: true },
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
          }}>{t("case.roi_label")}</div>
          <div style={{
            fontFamily: "var(--font-geist-sans)", fontSize: 32, fontWeight: 500,
            letterSpacing: "-0.03em",
            background: "var(--accent-gradient)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>{t("case.roi_value")}</div>
        </div>

        <p style={{
          marginTop: 20,
          fontFamily: "var(--font-geist-sans)", fontSize: 12, lineHeight: 1.5,
          color: "var(--dim-2)", fontStyle: "italic",
          maxWidth: 720,
        }}>
          {t("case.footnote")}
        </p>
      </div>
    </section>
  );
}

// ── 5. Méthode ───────────────────────────────────────────────────────

function ServiceMethod({ t }: { t: T }) {
  const steps = t.raw("method.steps") as [string, string, string][];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{t("method.label")}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: 0, marginBottom: 56, color: "var(--text)", maxWidth: 800,
        }}>
          {t("method.h2")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map(([n, title, desc], i) => (
            <div key={n} style={{
              display: "grid", gridTemplateColumns: "100px 1fr 1fr",
              gap: 32, alignItems: "start",
              padding: "32px 0",
              borderTop: "1px solid var(--border)",
              borderBottom: i === steps.length - 1 ? "1px solid var(--border)" : "none",
            }} className="method-row">
              <div style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 14,
                color: "var(--dim)", letterSpacing: "0.08em",
              }}>{n}</div>
              <h3 style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 26, fontWeight: 500,
                letterSpacing: "-0.03em", margin: 0, color: "var(--text)", lineHeight: 1.1,
              }}>{title}</h3>
              <p style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.55,
                color: "var(--dim)", margin: 0,
              }} className="method-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 6. Tarifs ────────────────────────────────────────────────────────

function ServicePricing({ t }: { t: T }) {
  const includes = t.raw("pricing.includes") as string[];
  const upsell = t.raw("pricing.upsell") as string[];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{t("pricing.label")}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: 0, marginBottom: 56, color: "var(--text)", maxWidth: 800,
        }}>
          {t("pricing.h2")}
        </h2>

        <div style={{
          display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24,
        }} className="pain-grid">
          {/* Bloc gauche : prix + inclus */}
          <div style={{
            padding: 36,
            background: "var(--card)", border: "1px solid var(--border-strong)",
            borderRadius: 24,
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24, marginBottom: 36,
              paddingBottom: 28, borderBottom: "1px solid var(--border)",
            }} className="estimator-result-grid">
              {[
                { v: t("pricing.price"), s: t("pricing.price_suffix") },
                { v: t("pricing.monthly"), s: t("pricing.monthly_suffix") },
                { v: t("pricing.delay"), s: t("pricing.delay_suffix") },
              ].map((b, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: "var(--font-geist-sans)", fontSize: 24, fontWeight: 500,
                    letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6,
                  }}>{b.v}</div>
                  <div style={{
                    fontFamily: "var(--font-geist-mono)", fontSize: 11,
                    color: "var(--dim)", letterSpacing: "0.08em",
                  }}>{b.s}</div>
                </div>
              ))}
            </div>

            <div style={{
              fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)",
              letterSpacing: "0.12em", textTransform: "uppercase",
              marginBottom: 16,
            }}>{t("pricing.includes_label")}</div>
            <ul style={{
              listStyle: "none", padding: 0, margin: 0,
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              {includes.map((it, i) => (
                <li key={i} style={{
                  fontFamily: "var(--font-geist-sans)", fontSize: 14, lineHeight: 1.5,
                  color: "var(--text)", paddingLeft: 22, position: "relative",
                }}>
                  <span style={{
                    position: "absolute", left: 0, top: 8,
                    width: 8, height: 8,
                    background: "var(--accent-gradient)",
                    borderRadius: 2,
                    transform: "rotate(45deg)",
                  }} />
                  {it}
                </li>
              ))}
            </ul>
          </div>

          {/* Bloc droit : à la carte */}
          <div style={{
            padding: 36,
            background: "transparent", border: "1px solid var(--border)",
            borderRadius: 24,
          }}>
            <div style={{
              fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)",
              letterSpacing: "0.12em", textTransform: "uppercase",
              marginBottom: 16,
            }}>{t("pricing.upsell_label")}</div>
            <ul style={{
              listStyle: "none", padding: 0, margin: 0,
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              {upsell.map((it, i) => (
                <li key={i} style={{
                  fontFamily: "var(--font-geist-sans)", fontSize: 14, lineHeight: 1.5,
                  color: "var(--dim)", paddingLeft: 22, position: "relative",
                }}>
                  <span style={{
                    position: "absolute", left: 0, top: 9,
                    width: 6, height: 6,
                    border: "1px solid var(--border-strong)",
                    borderRadius: 2,
                    transform: "rotate(45deg)",
                  }} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p style={{
          marginTop: 24,
          fontFamily: "var(--font-geist-sans)", fontSize: 13,
          color: "var(--dim-2)", maxWidth: 700,
        }}>
          {t("pricing.footnote")}
        </p>
      </div>
    </section>
  );
}

// ── 7. FAQ ───────────────────────────────────────────────────────────

function ServiceFaq({ t }: { t: T }) {
  const items = t.raw("faq.items") as [string, string][];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <MonoLabel>{t("faq.label")}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: 0, marginBottom: 48, color: "var(--text)",
        }}>
          {t("faq.h2")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {items.map(([q, a], i) => (
            <details key={i} style={{
              borderTop: "1px solid var(--border)",
              borderBottom: i === items.length - 1 ? "1px solid var(--border)" : "none",
              padding: "24px 0",
            }}>
              <summary style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 18, fontWeight: 500,
                color: "var(--text)", cursor: "pointer",
                listStyle: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                gap: 24,
              }}>
                <span>{q}</span>
                <span style={{ color: "var(--dim)", fontSize: 20, lineHeight: 1 }}>+</span>
              </summary>
              <p style={{
                marginTop: 16, marginBottom: 0,
                fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.6,
                color: "var(--dim)",
              }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 8. CTA final ─────────────────────────────────────────────────────

function ServiceCta({ t }: { t: T }) {
  return (
    <section id="contact" style={{
      padding: "120px 28px", borderTop: "1px solid var(--border)",
      background: "linear-gradient(180deg, transparent, var(--accent-tint))",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.05,
          margin: 0, marginBottom: 24, color: "var(--text)",
        }}>
          {t("cta.h2")}
        </h2>
        <p style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 18, lineHeight: 1.55,
          color: "var(--dim)", margin: 0, marginBottom: 36,
          maxWidth: 640, marginLeft: "auto", marginRight: "auto",
        }}>
          {t("cta.subtitle")}
        </p>
        <PillPrimary href={CALENDLY_URL} large>
          {t("cta.cta")} <Arrow color="#fff" size={14} />
        </PillPrimary>
        <div style={{
          marginTop: 16,
          fontFamily: "var(--font-geist-mono)", fontSize: 11,
          color: "var(--dim-2)", letterSpacing: "0.08em",
        }}>
          {t("cta.reassurance")}
        </div>
      </div>
    </section>
  );
}
