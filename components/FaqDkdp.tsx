import { getTranslations } from "next-intl/server";
import FaqAccordion from "./FaqAccordion";

export default async function FaqDkdp() {
  const t = await getTranslations("faq");
  const items = t.raw("items") as [string, string][];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <section id="faq" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim)",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
        }}>
          {t("label")}
        </div>
        <h2 style={{
          fontFamily: "var(--font-sans)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500,
          letterSpacing: "-0.04em", lineHeight: 1.0, margin: 0, marginBottom: 48, color: "var(--text)",
        }}>
          {t("h2")}
        </h2>
        <FaqAccordion items={items} idPrefix="faq" />
      </div>
    </section>
  );
}
