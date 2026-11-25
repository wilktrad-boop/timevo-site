import test from "node:test";
import assert from "node:assert/strict";
import { donneesDataForSEO } from "../../lib/avis/dataforseo.ts";

type Appel = { url: string; init?: RequestInit };
function faux(reponses: unknown[]) {
  const appels: Appel[] = [];
  const f = (async (url: string, init?: RequestInit) => {
    appels.push({ url, init });
    return new Response(JSON.stringify(reponses.shift()), { status: 200 });
  }) as unknown as typeof fetch;
  return { f, appels };
}

test("rechercher : envoie la recherche Maps et garde les fiches", async () => {
  const { f, appels } = faux([{ tasks: [{ status_code: 20000, result: [{ items: [
    { type: "maps_search", title: "Atelier Cuisines", address: "1 rue A, Annecy", category: "Cuisiniste", rating: { value: 4.3, votes_count: 48 }, place_id: "P1" },
    { type: "maps_paid_item", title: "Pub", place_id: "PUB" },
    { type: "maps_search", title: "Sans place id" },
  ] }] }] }]);
  const d = donneesDataForSEO("log", "mdp", f);
  const fiches = await d.rechercher("Atelier Cuisines Annecy");
  assert.deepEqual(fiches, [{ placeId: "P1", nom: "Atelier Cuisines", adresse: "1 rue A, Annecy", categorie: "Cuisiniste", note: 4.3, nbAvis: 48 }]);
  assert.equal(appels[0].url, "https://api.dataforseo.com/v3/serp/google/maps/live/advanced");
  assert.equal((appels[0].init?.headers as Record<string, string>).Authorization, "Basic " + Buffer.from("log:mdp").toString("base64"));
  const corps = JSON.parse(String(appels[0].init?.body));
  assert.deepEqual(corps, [{ keyword: "Atelier Cuisines Annecy", location_name: "France", language_code: "fr", depth: 20 }]);
});

test("lancer : crée la tâche d'avis en file prioritaire et rend son id", async () => {
  const { f, appels } = faux([{ tasks: [{ id: "T-1", status_code: 20100 }] }]);
  const id = await donneesDataForSEO("l", "m", f).lancer("P1");
  assert.equal(id, "T-1");
  assert.deepEqual(JSON.parse(String(appels[0].init?.body)), [{ place_id: "P1", location_name: "France", language_code: "fr", depth: 200, sort_by: "newest", priority: 2 }]);
});

test("lancer : lève une erreur si la tâche n'est pas créée", async () => {
  const { f } = faux([{ tasks: [{ status_code: 40501 }] }]);
  await assert.rejects(() => donneesDataForSEO("l", "m", f).lancer("P1"));
});

test("lire : en cours, prêt, erreur", async () => {
  const { f, appels } = faux([
    { tasks: [{ status_code: 40602, result: null }] },
    { tasks: [{ status_code: 20000, result: [{ reviews_count: 350, items: [
      { review_id: "R1", review_text: "Très bien", rating: { value: 5 }, timestamp: "2026-05-15 14:09:32 +00:00", owner_answer: "Merci", owner_timestamp: "2026-05-16 14:09:32 +00:00" },
      { review_id: "R2", review_text: null, rating: { value: 2 }, timestamp: "2026-05-10 10:00:00 +00:00", owner_answer: null, owner_timestamp: null },
    ] }] }] },
    { tasks: [{ status_code: 50000 }] },
  ]);
  const d = donneesDataForSEO("l", "m", f);
  assert.deepEqual(await d.lire("T-1"), { etat: "encours" });
  assert.equal(appels[0].url, "https://api.dataforseo.com/v3/business_data/google/reviews/task_get/T-1");
  assert.deepEqual(await d.lire("T-1"), { etat: "pret", total: 350, avis: [
    { id: "R1", note: 5, texte: "Très bien", date: "2026-05-15T14:09:32.000Z", reponse: "Merci", dateReponse: "2026-05-16T14:09:32.000Z" },
    { id: "R2", note: 2, texte: null, date: "2026-05-10T10:00:00.000Z", reponse: null, dateReponse: null },
  ] });
  assert.deepEqual(await d.lire("T-1"), { etat: "erreur" });
});
