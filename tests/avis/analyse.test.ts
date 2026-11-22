import test from "node:test";
import assert from "node:assert/strict";
import { iaClaude, nettoyerAnalyse, MODELE } from "../../lib/avis/analyse.ts";
import type { Avis, EntreeAnalyse } from "../../lib/avis/types.ts";

const a = (id: string, texte: string): Avis => ({ id, note: 2, texte, date: null, reponse: null, dateReponse: null });
const entree: EntreeAnalyse = {
  entreprise: "Atelier Cuisines", categorie: "Cuisiniste",
  avis: [a("R1", "Trois semaines de retard."), a("R2", "Belle cuisine.")],
  sansReponse: [a("R1", "Trois semaines de retard.")],
};
const analyse = {
  pointsForts: [{ titre: "Qualité", citations: ["Belle cuisine"] }],
  reproches: [{ titre: "Délais", citations: ["Trois semaines de retard"] }],
  reponses: [{ avisId: "R1", texte: "Bonjour, merci..." }, { avisId: "INCONNU", texte: "x" }, { avisId: "R1", texte: "doublon" }],
  recommandations: ["Un", "Deux", "Trois", "Quatre"],
};

function client(reponse: unknown, capture: unknown[] = []) {
  return { messages: { parse: async (p: unknown) => { capture.push(p); return reponse; } } } as never;
}

test("iaClaude envoie Sonnet en sortie structurée et nettoie le résultat", async () => {
  const capture: unknown[] = [];
  const res = await iaClaude(client({ stop_reason: "end_turn", parsed_output: analyse }, capture)).analyser(entree);
  const p = capture[0] as { model: string; output_config: { format: unknown }; messages: { content: string }[] };
  assert.equal(p.model, MODELE);
  assert.ok(p.output_config.format);
  assert.match(p.messages[0].content, /R1/);
  assert.deepEqual(res?.reponses, [{ avisId: "R1", texte: "Bonjour, merci..." }]);
  assert.equal(res?.recommandations.length, 3);
});

test("iaClaude rend null si la réponse est tronquée, refusée ou en erreur", async () => {
  assert.equal(await iaClaude(client({ stop_reason: "max_tokens", parsed_output: analyse })).analyser(entree), null);
  assert.equal(await iaClaude(client({ stop_reason: "refusal", parsed_output: null })).analyser(entree), null);
  const enErreur = { messages: { parse: async () => { throw new Error("boom"); } } } as never;
  assert.equal(await iaClaude(enErreur).analyser(entree), null);
});

test("nettoyerAnalyse borne les listes", () => {
  const beaucoup = Array.from({ length: 8 }, (_, i) => ({ titre: `T${i}`, citations: ["a", "b", "c"] }));
  const n = nettoyerAnalyse({ ...analyse, pointsForts: beaucoup, reproches: beaucoup }, entree);
  assert.equal(n.pointsForts.length, 5);
  assert.equal(n.pointsForts[0].citations.length, 2);
});
