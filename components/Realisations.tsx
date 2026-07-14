import { getTranslations } from "next-intl/server";
import { Arrow } from "./primitives";
import { REALISATIONS, SHOT_WIDTH, SHOT_HEIGHT } from "@/lib/realisations";

type Item = { meta: string; title: string; description: string; chips: string[] };

export default async function Realisations() {
  const t = await getTranslations("realisations");
  const items = t.raw("items") as Item[];

  return (
    <section style={{ padding: "24px 28px 96px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24,
        }}>
          {t("section_label")}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          className="realisations-grid">
          {REALISATIONS.map((site, i) => (
            <RealisationCard
              key={site.slug}
              {...items[i]}
              url={site.url}
              image={site.image}
              alt={t("shot_alt", { name: items[i].title })}
              cta={t("cta_site")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RealisationCard({ meta, title, description, chips, url, image, alt, cta }: Item & {
  url: string; image: string; alt: string; cta: string;
}) {
  return (
    <article style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      <div style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--card-soft)",
        lineHeight: 0,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- capture statique, pas de gain à l'optimiser */}
        <img
          src={image}
          alt={alt}
          width={SHOT_WIDTH}
          height={SHOT_HEIGHT}
          loading="lazy"
          decoding="async"
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>

      <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--dim-2)", marginBottom: 8,
        }}>
          {meta}
        </div>

        <h3 style={{
          fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500,
          letterSpacing: "-0.02em", margin: 0, marginBottom: 12, color: "var(--text)",
        }}>
          {title}
        </h3>

        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6,
          color: "var(--dim)", margin: 0, marginBottom: 20,
        }}>
          {description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
          {chips.map(chip => (
            <span key={chip} style={{
              padding: "5px 10px", borderRadius: 999,
              border: "1px solid var(--border-strong)",
              fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--dim)",
            }}>
              {chip}
            </span>
          ))}
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${cta} — ${title}`}
          style={{
            marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 8,
            color: "var(--accent-soft)", fontFamily: "var(--font-sans)",
            fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}
        >
          {cta} <Arrow size={12} />
        </a>
      </div>
    </article>
  );
}
