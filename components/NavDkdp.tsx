"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Arrow } from "./primitives";
import LocaleSwitcher from "./LocaleSwitcher";

const CALENDLY_URL = "https://calendly.com/timevo/audit";
const SERVICE_SLUGS = ["automatisation", "agents-ia", "formation", "sites-web", "seo", "reseaux-sociaux"] as const;

export default function NavDkdp() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsItems = t.raw("solutions_items") as string[];

  const otherLinks = [
    { key: "methode", href: `/${locale}#methode` },
    { key: "resultats", href: `/${locale}#resultats` },
    { key: "equipe", href: `/${locale}#equipe` },
    { key: "contact", href: `/${locale}#contact` },
  ] as const;

  return (
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
        fontFamily: "var(--font-geist-sans)", fontSize: 20, fontWeight: 600,
        letterSpacing: "-0.04em", color: "var(--text)",
        textDecoration: "none",
      }}>
        Timevo<span style={{
          background: "var(--accent-gradient)",
          WebkitBackgroundClip: "text", backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>.</span>
      </a>

      <div style={{ display: "flex", gap: 28, fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--dim)" }}
        className="nav-links">
        {/* Solutions with dropdown */}
        <div
          onMouseEnter={() => setSolutionsOpen(true)}
          onMouseLeave={() => setSolutionsOpen(false)}
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
        <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{
          padding: "10px 18px",
          background: "var(--text)", color: "var(--bg)",
          borderRadius: 999,
          fontFamily: "var(--font-geist-sans)", fontSize: 13, fontWeight: 600,
          display: "inline-flex", alignItems: "center", gap: 8,
          textDecoration: "none", whiteSpace: "nowrap",
          transition: "opacity .15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          {t("cta")} <Arrow size={12} color="var(--bg)" />
        </a>
      </div>
    </nav>
  );
}
