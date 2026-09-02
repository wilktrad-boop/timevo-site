import { getTranslations } from "next-intl/server";
import FaqAccordion from "./FaqAccordion";
import { SECTION, SectionHead } from "./SectionParts";
import { IconQuestion } from "./SectionIcons";

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
    <section id="faq" style={SECTION}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <SectionHead label={t("label")} icon={<IconQuestion />} lines={[t("h2")]} />
        <FaqAccordion items={items} idPrefix="faq" />
      </div>
    </section>
  );
}
