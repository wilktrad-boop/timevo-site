"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Arrow } from "./primitives";
import { CONTACT_HREF } from "@/lib/contact";

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
      href={CONTACT_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="sticky-cta-mobile"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      style={{
        position: "fixed",
        bottom: 16, left: 16, right: 16,
        display: "none",
        alignItems: "center", justifyContent: "center", gap: 10,
        height: 48, padding: "0 20px",
        background: "var(--accent)",
        color: "var(--accent-ink)", borderRadius: 12,
        fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500,
        textDecoration: "none",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), var(--shadow)",
        zIndex: 25,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(80px)",
        pointerEvents: show ? "auto" : "none",
        transition: "opacity .2s var(--ease), transform .2s var(--ease)",
      }}
    >
      {t("cta")} <Arrow size={14} />
    </a>
  );
}
