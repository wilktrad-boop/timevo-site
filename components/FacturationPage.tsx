import { getTranslations } from "next-intl/server";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import DeadlineCountdown from "@/components/DeadlineCountdown";
import { Eyebrow, MonoLabel, PillPrimary, PillGhost, Check, Arrow } from "@/components/primitives";

const CONTACT_HREF = "https://calendly.com/hello-timevo/30min";

type T = Awaited<ReturnType<typeof getTranslations>>;

type Row = { name: string; reception: string; emission: string; late: boolean };
type Item = { tag: string; title: string; desc: string };
type Step = { title: string; desc: string };
type Card = { title: string; desc: string };

const H2: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "clamp(32px, 4.5vw, 56px)",
  fontWeight: 500,
  letterSpacing: "-0.04em",
  lineHeight: 1.0,
  margin: 0,
  color: "var(--text)",
  maxWidth: 800,
};

const BODY: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  lineHeight: 1.55,
  color: "var(--dim)",
  margin: 0,
};

export default async function FacturationPage() {
  const t = await getTranslations("facturation");

  return (
    <>
      <FeHero t={t} />
      <FeConcerne t={t} />
      <FeRisques t={t} />
      <FeRoadmap t={t} />
      <FeAutomation t={t} />
      <FeOffre t={t} />
      <FePourquoi t={t} />
      <FeFaq t={t} />
      <FeFinal t={t} />
      <FeSources t={t} />
    </>
  );
}

// ── 1. Hero ───────────────────────────────────────────────────────────

function FeHero({ t }: { t: T }) {
  return (
    <section id="hero" style={{ padding: "72px 28px 88px", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{
        position: "absolute", top: -120, right: -80, width: 620, height: 420,
        background: "radial-gradient(closest-side, var(--accent-glow), transparent)",
        pointerEvents: "none",
      }} />
      <div className="fe-hero-grid" style={{
        maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1,
        display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: 56, alignItems: "center",
      }}>
        <div>
          <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          <h1 style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(36px, 5.4vw, 68px)",
            fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.02,
            margin: "20px 0 0", color: "var(--text)", maxWidth: 900,
          }}>
            {t("hero.h1_line1")}{" "}
            <span style={{
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {t("hero.h1_accent")}
            </span>
          </h1>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.6,
            color: "var(--dim)", margin: "24px 0 0", maxWidth: 620,
          }}>
            {t("hero.sub")}
          </p>
          <div className="hero-ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
            <PillPrimary large href={CONTACT_HREF}>
              {t("hero.cta_primary")} <Arrow />
            </PillPrimary>
            <PillGhost large href="#concerne">{t("hero.cta_secondary")}</PillGhost>
          </div>
        </div>

        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 24,
        }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)",
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
          }}>
            {t("countdown.label")}
          </div>
          <DeadlineCountdown
            labels={{
              days: t("countdown.days"),
              hours: t("countdown.hours"),
              minutes: t("countdown.minutes"),
              seconds: t("countdown.seconds"),
            }}
            passedLabel={t("countdown.passed")}
          />
          <p style={{ ...BODY, fontSize: 13, marginTop: 18, color: "var(--dim-2)" }}>
            {t("countdown.foot")}
          </p>
        </div>
      </div>
    </section>
  );
}

// ── 2. Qui est concerné ───────────────────────────────────────────────

function FeConcerne({ t }: { t: T }) {
  const rows = t.raw("concerne.rows") as Row[];
  const th = t.raw("concerne.th") as string[];

  const cell: React.CSSProperties = {
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    color: "var(--dim)",
    textAlign: "left",
    whiteSpace: "nowrap",
  };

  return (
    <section id="concerne" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{t("concerne.eyebrow")}</MonoLabel>
        <h2 style={{ ...H2, marginBottom: 16 }}>{t("concerne.h2")}</h2>
        <p style={{ ...BODY, fontSize: 16, maxWidth: 700, marginBottom: 44 }}>{t("concerne.intro")}</p>

        <ScrollFadeIn>
          <div style={{
            overflowX: "auto",
            border: "1px solid var(--border)",
            borderRadius: 20,
            background: "var(--card)",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr>
                  {th.map(label => (
                    <th key={label} scope="col" style={{
                      ...cell,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--dim-2)",
                      background: "var(--card-soft)",
                      fontWeight: 400,
                    }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.name}>
                    <th scope="row" style={{
                      ...cell,
                      color: "var(--text)",
                      fontWeight: 500,
                      whiteSpace: "normal",
                      borderBottom: i === rows.length - 1 ? "none" : cell.borderBottom,
                    }}>
                      {row.name}
                    </th>
                    <td style={{ ...cell, borderBottom: i === rows.length - 1 ? "none" : cell.borderBottom }}>
                      {row.reception}
                    </td>
                    <td style={{
                      ...cell,
                      color: row.late ? "var(--accent-soft)" : "var(--dim)",
                      fontWeight: row.late ? 500 : 400,
                      borderBottom: i === rows.length - 1 ? "none" : cell.borderBottom,
                    }}>
                      {row.emission}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <div style={{
            marginTop: 20,
            padding: "18px 22px",
            background: "var(--accent-tint)",
            border: "1px solid var(--accent-tint)",
            borderRadius: 14,
          }}>
            <p style={{ ...BODY, fontSize: 14 }}>
              <strong style={{ color: "var(--accent-soft)", fontWeight: 500 }}>
                {t("concerne.note_strong")}
              </strong>{" "}
              {t("concerne.note")}
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}

// ── 3. Ce que coûte l'attentisme ──────────────────────────────────────

function FeRisques({ t }: { t: T }) {
  const items = t.raw("risques.items") as Item[];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{t("risques.eyebrow")}</MonoLabel>
        <h2 style={{ ...H2, marginBottom: 56 }}>{t("risques.h2")}</h2>

        <div className="fe-risk-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16,
        }}>
          {items.map((item, i) => (
            <ScrollFadeIn key={item.title} delay={i * 60}>
              <div style={{
                padding: 28,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                height: "100%",
              }}>
                <div style={{
                  display: "inline-block",
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "var(--accent-soft)",
                  background: "var(--accent-tint)",
                  padding: "4px 10px", borderRadius: 999,
                  marginBottom: 16,
                }}>
                  {item.tag}
                </div>
                <h3 style={{
                  fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500,
                  letterSpacing: "-0.02em", margin: "0 0 10px", color: "var(--text)",
                  lineHeight: 1.25,
                }}>
                  {item.title}
                </h3>
                <p style={BODY}>{item.desc}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 4. Roadmap ────────────────────────────────────────────────────────

function FeRoadmap({ t }: { t: T }) {
  const steps = t.raw("roadmap.steps") as Step[];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{t("roadmap.eyebrow")}</MonoLabel>
        <h2 style={{ ...H2, marginBottom: 16 }}>{t("roadmap.h2")}</h2>
        <p style={{ ...BODY, fontSize: 16, maxWidth: 640, marginBottom: 48 }}>{t("roadmap.intro")}</p>

        <div className="fe-steps" style={{
          display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14,
        }}>
          {steps.map((step, i) => (
            <ScrollFadeIn key={step.title} delay={i * 60}>
              <div style={{
                padding: 24,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                height: "100%",
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  color: "var(--accent-soft)", letterSpacing: "0.08em", marginBottom: 14,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 style={{
                  fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 500,
                  letterSpacing: "-0.02em", margin: "0 0 8px", color: "var(--text)",
                }}>
                  {step.title}
                </h3>
                <p style={{ ...BODY, fontSize: 13.5 }}>{step.desc}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 5. Au-delà de la conformité ───────────────────────────────────────

function FeAutomation({ t }: { t: T }) {
  const items = t.raw("automation.items") as string[];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div className="fe-auto-grid" style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start",
      }}>
        <div>
          <MonoLabel>{t("automation.eyebrow")}</MonoLabel>
          <h2 style={{ ...H2, fontSize: "clamp(28px, 3.6vw, 44px)", marginBottom: 20 }}>
            {t("automation.h2")}
          </h2>
          <p style={{ ...BODY, fontSize: 16, marginBottom: 28, maxWidth: 520 }}>
            {t("automation.sub")}
          </p>
          <PillPrimary href="#offre">{t("automation.cta")} <Arrow /></PillPrimary>
        </div>

        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((item, i) => (
            <li key={item} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: "16px 0",
              borderBottom: i === items.length - 1 ? "none" : "1px solid var(--border)",
            }}>
              <span style={{ marginTop: 1 }}><Check color="var(--accent)" size={18} /></span>
              <span style={{ ...BODY, fontSize: 15, color: "var(--text)" }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── 6. L'offre ────────────────────────────────────────────────────────

function FeOffre({ t }: { t: T }) {
  const items = t.raw("offre.items") as string[];

  return (
    <section id="offre" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <MonoLabel>{t("offre.eyebrow")}</MonoLabel>
          <h2 style={{ ...H2, maxWidth: 720, margin: "0 auto" }}>{t("offre.h2")}</h2>
        </div>

        <ScrollFadeIn>
          <div style={{
            maxWidth: 560, margin: "0 auto",
            background: "var(--card)",
            border: "1px solid var(--border-strong)",
            borderRadius: 24,
            padding: "40px 36px",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: "var(--accent-soft)", marginBottom: 14,
            }}>
              {t("offre.name")}
            </div>
            <div style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(40px, 7vw, 60px)", fontWeight: 500,
              letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1,
            }}>
              {t("offre.price")}
              <sup style={{ fontSize: "0.32em", fontWeight: 400, color: "var(--dim)", marginLeft: 6, top: "-1.1em" }}>
                {t("offre.price_sup")}
              </sup>
            </div>
            <p style={{ ...BODY, fontSize: 13, color: "var(--dim-2)", margin: "12px 0 30px" }}>
              {t("offre.price_note")}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", textAlign: "left" }}>
              {items.map((item, i) => (
                <li key={item} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  padding: "11px 0",
                  borderBottom: i === items.length - 1 ? "none" : "1px solid var(--border)",
                }}>
                  <span style={{ marginTop: 1 }}><Check color="var(--accent)" size={17} /></span>
                  <span style={{ ...BODY, fontSize: 14.5, color: "var(--text)" }}>{item}</span>
                </li>
              ))}
            </ul>

            <PillPrimary large fullWidth href={CONTACT_HREF}>
              {t("offre.cta")} <Arrow />
            </PillPrimary>
            <p style={{ ...BODY, fontSize: 13, color: "var(--dim-2)", marginTop: 18 }}>
              {t("offre.guarantee")}
            </p>
            <p style={{ ...BODY, fontSize: 12.5, color: "var(--dim-2)", marginTop: 12 }}>
              {t("offre.note")}
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}

// ── 7. Pourquoi nous ──────────────────────────────────────────────────

function FePourquoi({ t }: { t: T }) {
  const items = t.raw("pourquoi.items") as Card[];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{t("pourquoi.eyebrow")}</MonoLabel>
        <h2 style={{ ...H2, marginBottom: 48 }}>{t("pourquoi.h2")}</h2>

        <div className="pillars-row1" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
        }}>
          {items.map((item, i) => (
            <ScrollFadeIn key={item.title} delay={i * 60}>
              <div style={{
                padding: 28,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                height: "100%",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 500,
                  letterSpacing: "-0.02em", margin: "0 0 10px", color: "var(--text)",
                }}>
                  {item.title}
                </h3>
                <p style={BODY}>{item.desc}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 8. FAQ ────────────────────────────────────────────────────────────

function FeFaq({ t }: { t: T }) {
  const items = t.raw("faq.items") as [string, string][];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <MonoLabel>{t("faq.eyebrow")}</MonoLabel>
        <h2 style={{ ...H2, fontSize: "clamp(28px, 3.6vw, 44px)", marginBottom: 40 }}>
          {t("faq.h2")}
        </h2>
        <FaqAccordion items={items} idPrefix="fe-faq" />
      </div>
    </section>
  );
}

// ── 9. CTA final ──────────────────────────────────────────────────────

function FeFinal({ t }: { t: T }) {
  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ ...H2, fontSize: "clamp(28px, 4vw, 48px)", margin: "0 auto 20px" }}>
          {t("final.h2")}
        </h2>
        <p style={{ ...BODY, fontSize: 16, margin: "0 auto 32px", maxWidth: 520 }}>
          {t("final.sub")}
        </p>
        <PillPrimary large href={CONTACT_HREF}>{t("final.cta")} <Arrow /></PillPrimary>
      </div>
    </section>
  );
}

// ── 10. Sources ───────────────────────────────────────────────────────

function FeSources({ t }: { t: T }) {
  return (
    <section style={{ padding: "40px 28px 64px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          textTransform: "uppercase", letterSpacing: "0.12em",
          color: "var(--dim-2)", marginBottom: 10,
        }}>
          {t("sources.label")}
        </div>
        <p style={{ ...BODY, fontSize: 12.5, color: "var(--dim-2)", lineHeight: 1.7 }}>
          {t("sources.text")}
        </p>
      </div>
    </section>
  );
}
