"use client";

import React from "react";

// ── SVG Glyphs ────────────────────────────────────────────────────────

export const Arrow = ({ size = 14, color = "currentColor", stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flex: "0 0 auto" }}>
    <path d="M2 7h10M8 3l4 4-4 4" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowDown = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M7 2v10M3 8l4 4 4-4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Check = ({ color, size = 18 }: { color: string; size?: number }) => (
  <span style={{
    width: size, height: size, flex: `0 0 ${size}px`, borderRadius: 999,
    background: color, display: "inline-flex", alignItems: "center", justifyContent: "center",
  }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 10 10">
      <path d="M2 5l2 2 4-5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

export const Sparkle = ({ size = 10, color }: { size?: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={{ flex: "0 0 auto" }}>
    <path d="M5 0l1.2 3.8L10 5l-3.8 1.2L5 10l-1.2-3.8L0 5l3.8-1.2z" fill={color} />
  </svg>
);

// ── Eyebrow ───────────────────────────────────────────────────────────

export const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "6px 12px",
    background: "var(--accent-tint)",
    color: "var(--accent-soft)",
    borderRadius: 999,
    fontSize: 11, fontWeight: 500,
    fontFamily: "var(--font-geist-sans)",
    border: "1px solid var(--accent-tint)",
    letterSpacing: "0.01em",
  }}>
    <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)", flexShrink: 0 }} />
    {children}
  </div>
);

// ── Buttons ───────────────────────────────────────────────────────────

export const PillPrimary = ({
  children, large, fullWidth, href, onClick,
}: {
  children: React.ReactNode;
  large?: boolean;
  fullWidth?: boolean;
  href?: string;
  onClick?: () => void;
}) => {
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
    padding: large ? "16px 26px" : "13px 22px",
    background: "var(--accent-gradient)",
    color: "#fff", borderRadius: 999,
    fontSize: large ? 14 : 13, fontWeight: 600,
    border: "none",
    fontFamily: "var(--font-geist-sans)",
    cursor: "pointer",
    width: fullWidth ? "100%" : "auto",
    boxShadow: "0 0 0 1px var(--accent), 0 12px 32px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.18)",
    letterSpacing: "-0.01em",
    transition: "transform .15s ease, box-shadow .15s ease",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };
  if (href) return (
    <a href={href} style={style}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
      {children}
    </a>
  );
  return (
    <button style={style} onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
      {children}
    </button>
  );
};

export const PillGhost = ({
  children, large, href,
}: {
  children: React.ReactNode;
  large?: boolean;
  href?: string;
}) => {
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: large ? "15px 25px" : "12px 21px",
    background: "transparent", color: "var(--text)",
    borderRadius: 999,
    fontSize: large ? 14 : 13, fontWeight: 600,
    border: "1px solid var(--border-strong)",
    fontFamily: "var(--font-geist-sans)",
    cursor: "pointer",
    letterSpacing: "-0.01em",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };
  if (href) return <a href={href} style={style}>{children}</a>;
  return <button style={style}>{children}</button>;
};

// ── Mono label ────────────────────────────────────────────────────────

export const MonoLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "var(--font-geist-mono)",
    fontSize: 11, color: "var(--dim)",
    letterSpacing: "0.12em", textTransform: "uppercase",
    marginBottom: 16,
  }}>
    {children}
  </div>
);
