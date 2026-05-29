"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Arrow } from "./primitives";

const CALENDLY = "https://calendly.com/hello-timevo/30min";

export default function StickyMobileCta() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  const show = scrolled && !contactVisible;

  return (
    <a
      href={CALENDLY}
      target="_blank"
      rel="noopener"
      className="sticky-cta-mobile"
      aria-hidden={!show}
      style={{
        position: "fixed",
        bottom: 16, left: 16, right: 16,
        display: "none",
        alignItems: "center", justifyContent: "center", gap: 10,
        padding: "14px 22px",
        background: "var(--accent-gradient)",
        color: "#fff", borderRadius: 999,
        fontFamily: "var(--font-geist-sans)", fontSize: 15, fontWeight: 600,
        textDecoration: "none",
        boxShadow: "0 0 0 1px var(--accent), 0 12px 32px var(--accent-glow)",
        zIndex: 25,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(80px)",
        pointerEvents: show ? "auto" : "none",
        transition: "opacity .2s ease, transform .2s ease",
      }}
    >
      {t("cta")} <Arrow size={14} color="#fff" />
    </a>
  );
}
