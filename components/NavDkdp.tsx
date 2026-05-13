"use client";

import { useLocale, useTranslations } from "next-intl";
import { Arrow } from "./primitives";
import LocaleSwitcher from "./LocaleSwitcher";

const CALENDLY_URL = "https://calendly.com/timevo/audit";

export default function NavDkdp() {
  const t = useTranslations("nav");
  const locale = useLocale();

  const links = [
    { key: "solutions", href: `/${locale}/solutions` },
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
        {links.map(l => (
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
