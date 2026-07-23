import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

/**
 * Rendu partagé des images Open Graph.
 *
 * Chaque `opengraph-image.tsx` fournit son texte, la mise en page vit ici.
 *
 * Contraintes de Satori, le moteur derrière ImageResponse :
 * - flexbox uniquement, `display: grid` ne fonctionne pas ;
 * - 500 Ko de bundle maximum, police comprise — d'où un seul poids d'Inter ;
 * - ttf/otf/woff seulement, pas de woff2 (ce que produit next/font).
 *
 * Sans police fournie, @vercel/og retombe sur Geist. Or le site est passé de
 * Geist à Inter volontairement : on embarque donc Inter 600.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

let cachedFont: ArrayBuffer | null = null;

async function interFont(): Promise<ArrayBuffer> {
  if (!cachedFont) {
    // Chemin relatif à la racine du projet, comme documenté pour les assets
    // locaux lus depuis un opengraph-image.
    const buf = await readFile(join(process.cwd(), "assets", "inter-600.ttf"));
    cachedFont = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  }
  return cachedFont;
}

export async function ogImage({
  eyebrow,
  title,
  footnote,
}: {
  /** Court, en capitales. Ex. « Démonstration · Pisciniste ». */
  eyebrow: string;
  /** Le message. Deux lignes maximum à la lecture. */
  title: string;
  /** Optionnel, en bas à droite. Ex. « Données fictives ». */
  footnote?: string;
}) {
  const font = await interFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#0a0a0a",
          // Halo d'accent en haut à droite, discret, dans l'esprit du site.
          backgroundImage:
            "radial-gradient(circle at 88% 8%, rgba(124,77,255,0.30) 0%, rgba(124,77,255,0) 46%)",
          fontFamily: "Inter",
          color: "#ededed",
        }}
      >
        {/* Signature */}
        <div style={{ display: "flex", alignItems: "center", fontSize: 30, letterSpacing: "-1.2px" }}>
          <span>Timevo</span>
          <span style={{ color: "#7c4dff" }}>.</span>
        </div>

        {/* Corps */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 21,
              letterSpacing: "3.4px",
              textTransform: "uppercase",
              color: "#a98aff",
              marginBottom: 26,
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: title.length > 58 ? 62 : 76,
              lineHeight: 1.06,
              letterSpacing: "-3px",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        {/* Pied */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#8a8a8a",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 52,
                height: 4,
                borderRadius: 999,
                marginRight: 18,
                backgroundImage: "linear-gradient(90deg, #4ec3ff 0%, #7c4dff 100%)",
              }}
            />
            <span>timevo.io</span>
          </div>
          {footnote ? <span style={{ color: "#7a7a7a" }}>{footnote}</span> : null}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Inter", data: font, weight: 600, style: "normal" }],
    }
  );
}
