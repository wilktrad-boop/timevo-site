"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === "fr" ? "en" : "fr";
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/") || "/");
  };

  return (
    <button onClick={toggle} style={{
      background: "transparent",
      border: "1px solid var(--border-strong)",
      borderRadius: 8,
      height: 36, padding: "0 12px",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 500,
      color: "var(--dim)",
      cursor: "pointer",
      transition: "color .15s, border-color .15s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.color = "var(--text)";
        e.currentTarget.style.borderColor = "var(--text)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = "var(--dim)";
        e.currentTarget.style.borderColor = "var(--border-strong)";
      }}>
      {locale === "fr" ? "EN" : "FR"}
    </button>
  );
}
