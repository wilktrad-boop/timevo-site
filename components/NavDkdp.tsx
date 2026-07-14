"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Arrow } from "./primitives";
import LocaleSwitcher from "./LocaleSwitcher";

const CONTACT_HREF = "https://calendly.com/hello-timevo/30min";
const SERVICE_SLUGS = ["automatisation", "agents-ia", "formation", "sites-web", "seo", "reseaux-sociaux"] as const;

export default function NavDkdp() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const solutionsItems = t.raw("solutions_items") as string[];

  const otherLinks = [
    { key: "methode", href: `/${locale}#methode` },
    { key: "realisations", href: `/${locale}/realisations` },
    { key: "resultats", href: `/${locale}#resultats` },
    { key: "equipe", href: `/${locale}#equipe` },
    { key: "contact", href: `/${locale}#contact` },
  ] as const;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
    <nav style={{
      position: "sticky", top: 0, zIndex: 30,
      padding: "20px 28px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "rgba(10,10,10,0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <a href={`/${locale}`} aria-label="Timevo — accueil" style={{
        fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 600,
        letterSpacing: "-0.04em", color: "var(--text)",
        textDecoration: "none",
      }}>
        Timevo<span style={{
          background: "var(--accent-gradient)",
          WebkitBackgroundClip: "text", backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>.</span>
      </a>

      <div style={{ display: "flex", gap: 28, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)" }}
        className="nav-links">
        {/* Solutions with dropdown */}
        <div
          onMouseEnter={() => setSolutionsOpen(true)}
          onMouseLeave={() => setSolutionsOpen(false)}
          onFocus={() => setSolutionsOpen(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setSolutionsOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSolutionsOpen(false);
          }}
          style={{ position: "relative" }}
        >
          <a
            href={`/${locale}/solutions`}
            aria-haspopup="menu"
            aria-expanded={solutionsOpen}
            style={{
              color: solutionsOpen ? "var(--text)" : "var(--dim)",
              textDecoration: "none",
              transition: "color .15s",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            {t("solutions")}
            <svg width="9" height="9" viewBox="0 0 10 6" fill="none" style={{
              transition: "transform .2s",
              transform: solutionsOpen ? "rotate(180deg)" : "rotate(0)",
            }}>
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {solutionsOpen && (
            <div style={{
              position: "absolute", top: "100%", left: "-12px",
              paddingTop: 14, /* hover gap bridge */
              zIndex: 40,
            }}>
              <div role="menu" style={{
                background: "var(--card)",
                border: "1px solid var(--border-strong)",
                borderRadius: 14,
                padding: 8,
                minWidth: 220,
                boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
              }}>
                {solutionsItems.map((label, i) => (
                  <a
                    key={SERVICE_SLUGS[i]}
                    href={`/${locale}/solutions/${SERVICE_SLUGS[i]}`}
                    role="menuitem"
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      color: "var(--dim)",
                      fontSize: 13,
                      borderRadius: 8,
                      textDecoration: "none",
                      transition: "background .12s, color .12s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "var(--accent-tint)";
                      e.currentTarget.style.color = "var(--text)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--dim)";
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Other links */}
        {otherLinks.map(l => (
          <a key={l.key} href={l.href} style={{ color: "var(--dim)", textDecoration: "none", transition: "color .15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--dim)")}>
            {t(l.key)}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <LocaleSwitcher />
        <a
          href={CONTACT_HREF}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "10px 18px",
            background: "var(--text)", color: "var(--bg)",
            borderRadius: 999,
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            display: "inline-flex", alignItems: "center", gap: 8,
            textDecoration: "none", whiteSpace: "nowrap",
            transition: "opacity .15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {t("cta")} <Arrow size={12} color="var(--bg)" />
        </a>

        <button
          type="button"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
          className="nav-hamburger"
          style={{
            display: "none",
            width: 40, height: 40,
            background: "transparent",
            border: "1px solid var(--border-strong)",
            borderRadius: 999,
            alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: "var(--text)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {mobileOpen ? (
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <>
                <path d="M2 5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M2 11h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>
    </nav>

    <div
      className={`nav-mobile ${mobileOpen ? "open" : ""}`}
      style={{
        position: "fixed", top: 64, left: 0, right: 0, bottom: 0,
        background: "var(--bg)",
        padding: "32px 24px 48px",
        flexDirection: "column",
        gap: 4,
        overflowY: "auto",
        zIndex: 29,
      }}
    >
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--dim-2)", letterSpacing: "0.12em",
          textTransform: "uppercase", margin: "12px 16px 8px",
        }}>
          {t("solutions")}
        </div>
        {solutionsItems.map((label, i) => (
          <a
            key={SERVICE_SLUGS[i]}
            href={`/${locale}/solutions/${SERVICE_SLUGS[i]}`}
            onClick={() => setMobileOpen(false)}
            style={{
              padding: "14px 16px",
              fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 500,
              color: "var(--text)", textDecoration: "none",
              borderRadius: 10,
            }}
          >
            {label}
          </a>
        ))}

        <div style={{ height: 1, background: "var(--border)", margin: "16px 16px" }} />

        {otherLinks.map(l => (
          <a
            key={l.key}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            style={{
              padding: "14px 16px",
              fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 500,
              color: "var(--text)", textDecoration: "none",
              borderRadius: 10,
            }}
          >
            {t(l.key)}
          </a>
        ))}

        <a
          href={CONTACT_HREF}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
          style={{
            marginTop: 24,
            padding: "16px 22px",
            background: "var(--accent-gradient)",
            color: "#fff", borderRadius: 999,
            fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            textDecoration: "none",
            boxShadow: "0 0 0 1px var(--accent), 0 12px 32px var(--accent-glow)",
          }}
        >
          {t("cta")} <Arrow size={14} color="#fff" />
        </a>
    </div>
    </>
  );
}
