import React from "react";
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "./LocaleSwitcher";
import ScrollFadeIn from "./ScrollFadeIn";
import Breadcrumb from "./Breadcrumb";
import StickyMobileCta from "./StickyMobileCta";
import { Arrow, Eyebrow, PillPrimary } from "./primitives";
import { SECTION, SECTION_INNER, SectionHead, Punchline, type Punch } from "./SectionParts";
import { IconAlert, IconSteps, IconGrid, IconSpark } from "./SectionIcons";
import { CONTACT_HREF, RESEARCH_EMAIL, RESEARCH_MAILTO } from "@/lib/contact";
import { LINK_LABELS, type Locale } from "@/lib/links";

/**
 * Page « /research » : chaînes de traduction pour les sociétés d'études.
 *
 * Elle s'adresse à des prospects contactés par email, qui ne connaissent pas
 * Timevo. D'où un écart avec le reste du site : un en-tête et un pied de page
 * propres, sans le menu, parce que le prospect arrive pour un seul sujet. Le
 * pied de page porte l'identité de l'expéditeur des emails (la même que les
 * mentions légales) et RESEARCH_EMAIL.
 *
 * Le bouton d'action, lui, est celui de tout le site : le diagnostic gratuit
 * (CONTACT_HREF), avec ses libellés tirés de `hero`, `nav` et `contact`.
 * L'email n'apparaît plus que dans le pied de page.
 *
 * La section « Données de répondants » (questions-réponses sur l'hébergement,
 * les sous-traitants, la conservation) a été retirée en attendant ces
 * réponses : elle est dans le commit 9e088f6, composant et copy.
 *
 * Toute la copy vit dans la clé `research` des messages.
 */

type Bullet = { lead: string; rest: string };
type Use = { when: string; title: string; in: string; out: string; human: string };

const BODY: React.CSSProperties = {
  fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.6,
  color: "var(--dim)", margin: 0,
};

const CARD: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20,
};

/** Lien dans le corps du texte. */
function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="rs-link">{children}</a>
  );
}

function FlowNode({ n, title, sub, out }: { n: string; title: string; sub: string; out?: boolean }) {
  return (
    <div className="rs-node" style={{
      ...CARD, borderRadius: 16, padding: "18px 16px",
      borderColor: out ? "var(--accent)" : "var(--border)",
    }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", marginBottom: 10 }}>{n}</div>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600,
        letterSpacing: "-0.015em", lineHeight: 1.25, color: "var(--text)",
      }}>{title}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, lineHeight: 1.4, color: "var(--dim)", marginTop: 6 }}>{sub}</div>
    </div>
  );
}

const FlowArrow = () => (
  <div className="rs-arrow" aria-hidden="true">
    <Arrow size={14} color="var(--border-strong)" />
  </div>
);

export default async function ResearchPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "research" });
  // Libellés du bouton d'action : ceux du reste du site, pas une copie.
  const tHero = await getTranslations({ locale, namespace: "hero" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tContact = await getTranslations({ locale, namespace: "contact" });
  const L = LINK_LABELS[locale];
  const path = `/${locale}/research`;

  const problem = t.raw("problem.bullets") as Bullet[];
  const problemPunch = t.raw("problem.punch") as Punch;
  const steps = t.raw("how.steps") as string[][];
  const uses = t.raw("uses.items") as Use[];
  const breaks = t.raw("who.breaks") as Bullet[];

  const ioLabel: React.CSSProperties = {
    fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "var(--dim-2)", paddingTop: 3,
  };
  const ioText: React.CSSProperties = {
    fontFamily: "var(--font-sans)", fontSize: 14.5, lineHeight: 1.55, color: "var(--text)", margin: 0,
  };

  return (
    <>
      {/* En-tête allégé : logo, langue, une seule action. */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 30, padding: "16px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
        background: "rgba(16,12,24,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <a href={`/${locale}`} aria-label={`Timevo — ${L.home}`} style={{
          fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 600,
          letterSpacing: "-0.04em", color: "var(--text)", textDecoration: "none",
        }}>
          Timevo<span style={{
            background: "var(--accent-gradient)", WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>.</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LocaleSwitcher />
          <a href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" className="rs-header-cta">
            {tNav("cta")} <Arrow size={12} color="var(--bg)" />
          </a>
        </div>
      </nav>

      <main>
        <Breadcrumb
          label={locale === "fr" ? "Fil d'Ariane" : "Breadcrumb"}
          items={[{ href: `/${locale}`, label: L.home }, { label: t("breadcrumb") }]}
        />

        {/* Hero */}
        <section id="hero" style={{ padding: "72px 28px 88px" }}>
          <div style={{
            maxWidth: 1000, margin: "0 auto",
            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          }}>
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
            <h1 style={{
              fontFamily: "var(--font-sans)", fontSize: "clamp(32px, 5.4vw, 68px)", fontWeight: 700,
              letterSpacing: "-0.04em", lineHeight: 1.05, margin: "28px 0 0", color: "var(--text)",
            }}>
              {t("hero.h1_line1")}<br />
              {t("hero.h1_line2")}{" "}
              <span style={{
                background: "var(--accent-gradient)", WebkitBackgroundClip: "text", backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {t("hero.h1_accent")}
              </span>
            </h1>
            <p style={{ ...BODY, fontSize: 18, lineHeight: 1.55, marginTop: 28, maxWidth: 660 }}>
              {t("hero.subtitle")}
            </p>
            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <PillPrimary href={CONTACT_HREF} large>
                {tHero("cta_primary")} <Arrow color="#fff" size={14} />
              </PillPrimary>
            </div>
          </div>
        </section>

        {/* Le problème */}
        <ScrollFadeIn>
          <section id="problem" style={SECTION}>
            <div style={SECTION_INNER}>
              <SectionHead
                label={t("problem.label")}
                icon={<IconAlert />}
                lines={[t("problem.h2_line1"), t("problem.h2_line2")]}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 860, margin: "0 auto" }}>
                {problem.map(b => (
                  <div key={b.lead} style={{ ...CARD, borderRadius: 14, padding: "18px 22px" }}>
                    <p style={{
                      fontFamily: "var(--font-sans)", fontSize: "clamp(15px, 1.5vw, 17px)", fontWeight: 600,
                      letterSpacing: "-0.01em", lineHeight: 1.5, margin: 0, color: "var(--text)",
                    }}>
                      {b.lead}{" "}
                      <span style={{ color: "var(--dim)", fontWeight: 400 }}>{b.rest}</span>
                    </p>
                  </div>
                ))}
              </div>
              <Punchline lead={problemPunch.lead} accent={problemPunch.accent} />
            </div>
          </section>
        </ScrollFadeIn>

        {/* Le fonctionnement : schéma du parcours, puis les six étapes */}
        <ScrollFadeIn>
          <section id="how" style={SECTION}>
            <div style={SECTION_INNER}>
              <SectionHead
                label={t("how.label")}
                icon={<IconSteps />}
                lines={[t("how.h2")]}
                subtitle={t("how.subtitle")}
              />

              <div className="rs-flow" role="img" aria-label={t("how.flow.aria")}>
                <FlowNode n="01" title={t("how.flow.file_in")} sub={t("how.flow.file_in_sub")} />
                <FlowArrow />
                <FlowNode n="02" title={t("how.flow.translate")} sub={t("how.flow.translate_sub")} />
                <FlowArrow />
                <FlowNode n="03" title={t("how.flow.review")} sub={t("how.flow.review_sub")} />
                <FlowArrow />
                <FlowNode n="04" title={t("how.flow.checks")} sub={t("how.flow.checks_sub")} />
                <FlowArrow />
                {/* L'embranchement : c'est lui qui dit où va le temps humain. */}
                <div className="rs-branch">
                  <div className="rs-lane">
                    <span className="rs-lane-title">{t("how.flow.passed")}</span>
                    <span className="rs-lane-sub">{t("how.flow.passed_sub")}</span>
                  </div>
                  <div className="rs-lane rs-lane-flag">
                    <span className="rs-lane-title">
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", marginRight: 8 }}>05</span>
                      {t("how.flow.flagged")}
                    </span>
                    <span className="rs-lane-sub">{t("how.flow.flagged_sub")}</span>
                  </div>
                </div>
                <FlowArrow />
                <FlowNode n="06" title={t("how.flow.file_out")} sub={t("how.flow.file_out_sub")} out />
              </div>

              <div style={{ maxWidth: 1000, margin: "56px auto 0" }}>
                {steps.map(([n, title, desc]) => (
                  <div key={n} className="method-row" style={{
                    display: "grid", gridTemplateColumns: "88px 1fr 1.4fr", gap: 32,
                    padding: "26px 0", borderTop: "1px solid var(--border)", alignItems: "baseline",
                  }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--accent)" }}>{n}</div>
                    <h3 style={{
                      fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 600,
                      letterSpacing: "-0.025em", lineHeight: 1.25, margin: 0, color: "var(--text)",
                    }}>{title}</h3>
                    <p className="method-desc" style={{
                      fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--dim)", margin: 0, lineHeight: 1.55,
                    }}>{desc}</p>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--border)" }} />
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        {/* Les quatre usages */}
        <ScrollFadeIn>
          <section id="uses" style={SECTION}>
            <div style={SECTION_INNER}>
              <SectionHead
                label={t("uses.label")}
                icon={<IconGrid />}
                lines={[t("uses.h2_line1"), t("uses.h2_line2")]}
              />
              <div className="rs-uses" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
                {uses.map((u, i) => (
                  <article key={u.title} style={{ ...CARD, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <div style={{
                        fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: "var(--accent)", marginBottom: 10,
                      }}>
                        {String(i + 1).padStart(2, "0")} · {u.when}
                      </div>
                      <h3 style={{
                        fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 600,
                        letterSpacing: "-0.025em", lineHeight: 1.2, margin: 0, color: "var(--text)",
                      }}>{u.title}</h3>
                    </div>
                    <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                      <div className="rs-io">
                        <dt style={ioLabel}>{t("uses.in")}</dt>
                        <dd style={ioText}>{u.in}</dd>
                      </div>
                      <div className="rs-io">
                        <dt style={ioLabel}>{t("uses.out")}</dt>
                        <dd style={ioText}>{u.out}</dd>
                      </div>
                      <div className="rs-io rs-io-human">
                        <dt style={{ ...ioLabel, color: "var(--accent-soft)" }}>{t("uses.human")}</dt>
                        <dd style={ioText}>{u.human}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        {/* Qui est derrière */}
        <ScrollFadeIn>
          <section id="who" style={SECTION}>
            <div style={SECTION_INNER}>
              <SectionHead
                label={t("who.label")}
                icon={<IconSpark />}
                lines={[t("who.h2_line1"), t("who.h2_line2")]}
              />
              <div className="rs-who" style={{
                display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 48, alignItems: "start",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <p style={{ ...BODY, color: "var(--text)" }}>{t("who.p1")}</p>
                  <p style={BODY}>
                    {t.rich("who.p2", {
                      home: chunks => <TextLink href={`/${locale}`}>{chunks}</TextLink>,
                      agents: chunks => <TextLink href={`/${locale}/solutions/agents-ia`}>{chunks}</TextLink>,
                    })}
                  </p>
                </div>
                <div style={{ ...CARD, padding: 28 }}>
                  <h3 style={{
                    fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600,
                    letterSpacing: "-0.02em", lineHeight: 1.3, margin: "0 0 8px", color: "var(--text)",
                  }}>{t("who.breaks_title")}</h3>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {breaks.map((b, i) => (
                      <li key={b.lead} style={{
                        padding: "16px 0",
                        borderTop: i === 0 ? "none" : "1px solid var(--border)",
                        fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.5,
                      }}>
                        <span style={{ color: "var(--text)", fontWeight: 500 }}>{b.lead}</span>{" "}
                        <span style={{ color: "var(--dim)" }}>{b.rest}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        {/* Essai */}
        <ScrollFadeIn>
          <section id="trial" style={SECTION}>
            <div style={{ ...SECTION_INNER, maxWidth: 860 }}>
              <div style={{ ...CARD, padding: "clamp(28px, 4vw, 48px)", display: "flex", flexDirection: "column", gap: 20 }}>
                <div><Eyebrow>{t("trial.label")}</Eyebrow></div>
                <h2 style={{
                  fontFamily: "var(--font-sans)", fontSize: "clamp(26px, 3.4vw, 40px)", fontWeight: 700,
                  letterSpacing: "-0.035em", lineHeight: 1.12, margin: 0, color: "var(--text)",
                }}>{t("trial.h2")}</h2>
                <p style={BODY}>{t("trial.text")}</p>
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        {/* Contact : une seule action */}
        <ScrollFadeIn>
          <section id="contact" style={SECTION}>
            <div style={{
              ...SECTION_INNER, maxWidth: 760,
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
            }}>
              <Eyebrow>{t("contact.label")}</Eyebrow>
              <h2 style={{
                fontFamily: "var(--font-sans)", fontSize: "clamp(29px, 4vw, 52px)", fontWeight: 700,
                letterSpacing: "-0.035em", lineHeight: 1.1, margin: "22px 0 0", color: "var(--text)",
              }}>{t("contact.h2")}</h2>
              <p style={{ ...BODY, marginTop: 20, maxWidth: 600 }}>{t("contact.text")}</p>
              <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <PillPrimary href={CONTACT_HREF} large>
                  {tHero("cta_primary")} <Arrow color="#fff" size={14} />
                </PillPrimary>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--dim)" }}>
                  {tContact("reassurance")}
                </span>
              </div>
            </div>
          </section>
        </ScrollFadeIn>
      </main>

      {/* Pied de page propre : identité de l'expéditeur des mails. */}
      <footer style={{ padding: "48px 28px 32px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="rs-footer" style={{
            display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 48, marginBottom: 36,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 560 }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 600,
                letterSpacing: "-0.04em", color: "var(--text)",
              }}>
                Timevo<span style={{ color: "var(--accent)" }}>.</span>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>
                {t("footer.sender")}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>
                {t("footer.identity")}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>
                <a href={RESEARCH_MAILTO} className="footer-link">{RESEARCH_EMAIL}</a>
                <br />
                {t("footer.optout")}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font-sans)", fontSize: 13 }}>
              <a href={`/${locale}`} className="footer-link">{t("footer.home")}</a>
              <a href={`/${locale}/politique-de-confidentialite`} className="footer-link">{t("footer.privacy")}</a>
              <a href={`/${locale}/mentions-legales`} className="footer-link">{t("footer.legal")}</a>
            </div>
          </div>
          <div style={{
            borderTop: "1px solid var(--border)", paddingTop: 24,
            fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)",
          }}>
            {t("footer.copyright")}
          </div>
        </div>
      </footer>
      <StickyMobileCta />
    </>
  );
}
