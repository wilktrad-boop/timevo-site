"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Arrow } from "./primitives";
import LocaleSwitcher from "./LocaleSwitcher";

const CALENDLY_URL = "https://calendly.com/timevo/audit";

export default function NavDkdp() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = [
    { key: "solutions", href: "#solutions" },
    { key: "methode", href: "#methode" },
    { key: "resultats", href: "#resultats" },
    { key: "equipe", href: "#equipe" },
    { key: "contact", href: "#contact" },
  ] as const;

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
        <div style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 20, fontWeight: 600,
          letterSpacing: "-0.04em", color: "var(--text)",
        }}>
          Timevo<span style={{
            background: "var(--accent-gradient)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>.</span>
        </div>

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
          <button
            className="nav-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
            style={{
              background: "transparent", border: "1px solid var(--border)",
              borderRadius: 8, padding: "8px 10px", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 5, alignItems: "center",
            }}>
            {open ? (
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 18, color: "var(--text)", lineHeight: 1 }}>✕</span>
            ) : (
              <>
                <span style={{ width: 20, height: 1.5, background: "var(--text)", borderRadius: 2, display: "block" }} />
                <span style={{ width: 20, height: 1.5, background: "var(--text)", borderRadius: 2, display: "block" }} />
                <span style={{ width: 14, height: 1.5, background: "var(--text)", borderRadius: 2, display: "block", alignSelf: "flex-start" }} />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`nav-mobile${open ? " open" : ""}`} style={{
        position: "fixed", top: 61, left: 0, right: 0, zIndex: 29,
        background: "rgba(10,10,10,0.97)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        flexDirection: "column",
        padding: "24px 20px 32px",
        gap: 0,
      }}>
        {links.map(l => (
          <a key={l.key} href={l.href}
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "var(--font-geist-sans)", fontSize: 18, fontWeight: 500,
              color: "var(--text)", textDecoration: "none",
              padding: "16px 0", borderBottom: "1px solid var(--border)",
              display: "block",
            }}>
            {t(l.key)}
          </a>
        ))}
        <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          style={{
            marginTop: 24, padding: "14px 20px",
            background: "var(--text)", color: "var(--bg)",
            borderRadius: 999, fontFamily: "var(--font-geist-sans)",
            fontSize: 15, fontWeight: 600, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
          {t("cta")} <Arrow size={13} color="var(--bg)" />
        </a>
      </div>
    </>
  );
}
