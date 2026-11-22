/**
 * Analyse des avis par Claude (clé dédiée timevo-site-avis, plafond de dépense).
 * Sortie structurée (output_config.format + zod) : Sonnet 5.5 refuse le tool_choice forcé.
 * Les chiffres ne viennent jamais d'ici (cf. calculs.ts) ; les citations sont revérifiées
 * dans construireRapport.
 */
import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { Analyse, EntreeAnalyse, Ia } from "./types.ts";
import { REPONSES_MAX } from "./calculs.ts";

export const MODELE = "claude-sonnet-5-5";
const TEXTE_MAX = 1500;

const Theme = z.object({ titre: z.string(), citations: z.array(z.string()) });
const SchemaAnalyse = z.object({
  pointsForts: z.array(Theme),
  reproches: z.array(Theme),
  reponses: z.array(z.object({ avisId: z.string(), texte: z.string() })),
  recommandations: z.array(z.string()),
});

const SYSTEME = [
  "Tu analyses les avis Google d'une petite entreprise française pour son dirigeant.",
  "Réponds en français, sans emoji, sur un ton sobre et concret.",
  "pointsForts et reproches : 3 à 5 thèmes chacun (moins s'il n'y a pas matière), titre court, et 1 ou 2 citations recopiées mot pour mot depuis le texte des avis, sans guillemets.",
  "Ne donne aucun chiffre, aucune note, aucun pourcentage : ils sont calculés ailleurs.",
  "reponses : une réponse par avis de la liste « à répondre », avec son avisId exact. Rédige-la dans la langue de l'avis, au nom de l'entreprise, en 2 à 4 phrases : remercier, reprendre le point précis soulevé, et pour un avis négatif reconnaître le problème et proposer d'en parler directement, sans promettre de remise ni de geste commercial.",
  "recommandations : exactement 3 actions concrètes, adaptées au métier, d'une ou deux phrases chacune.",
].join("\n");

const borne = (s: string | null) => (s ?? "").slice(0, TEXTE_MAX);

function message(e: EntreeAnalyse): string {
  const tous = e.avis.map(a => ({ avisId: a.id, note: a.note, date: a.date, texte: borne(a.texte), reponseDuProprietaire: a.reponse ? borne(a.reponse) : null }));
  const aRepondre = e.sansReponse.map(a => ({ avisId: a.id, note: a.note, texte: borne(a.texte) }));
  return [
    `Entreprise : ${e.entreprise}`,
    `Métier : ${e.categorie || "non précisé"}`,
    "",
    `Tous les avis (${tous.length}) :`,
    JSON.stringify(tous),
    "",
    `Avis à répondre (${aRepondre.length}) :`,
    JSON.stringify(aRepondre),
  ].join("\n");
}

/** Bornes et cohérence : réponses aux seuls avis demandés, une par avis, listes limitées. */
export function nettoyerAnalyse(a: Analyse, e: EntreeAnalyse): Analyse {
  const demandes = new Set(e.sansReponse.map(x => x.id));
  const vus = new Set<string>();
  const themes = (t: Analyse["pointsForts"]) =>
    t.slice(0, 5).map(x => ({ titre: x.titre.trim(), citations: x.citations.slice(0, 2) })).filter(x => x.titre);
  return {
    pointsForts: themes(a.pointsForts),
    reproches: themes(a.reproches),
    reponses: a.reponses
      .filter(r => demandes.has(r.avisId) && !vus.has(r.avisId) && r.texte.trim() && vus.add(r.avisId))
      .slice(0, REPONSES_MAX),
    recommandations: a.recommandations.map(r => r.trim()).filter(Boolean).slice(0, 3),
  };
}

export function iaClaude(client: Pick<Anthropic, "messages">): Ia {
  return {
    async analyser(e) {
      try {
        const reponse = await client.messages.parse({
          model: MODELE,
          max_tokens: 16000,
          system: SYSTEME,
          messages: [{ role: "user", content: message(e) }],
          output_config: { effort: "medium", format: zodOutputFormat(SchemaAnalyse) },
        });
        if (reponse.stop_reason !== "end_turn" || !reponse.parsed_output) {
          console.error("[avis] analyse non exploitable :", reponse.stop_reason);
          return null;
        }
        return nettoyerAnalyse(reponse.parsed_output, e);
      } catch (err) {
        console.error("[avis] analyse en échec :", err instanceof Error ? err.message : err);
        return null;
      }
    },
  };
}
