import test from "node:test";
import assert from "node:assert/strict";
import { donneesSimulation, iaSimulation } from "../../lib/avis/simulation.ts";
import { avisSansReponse, choisirConcurrents } from "../../lib/avis/calculs.ts";

test("la simulation donne des fiches, 3 concurrents, puis des avis après quelques secondes", async () => {
  let t = 1_000_000;
  const d = donneesSimulation(() => t);
  const fiches = await d.rechercher("Atelier Cuisines Annecy");
  assert.ok(fiches.length >= 2);
  const concurrents = choisirConcurrents(await d.rechercher(`${fiches[0].categorie} Annecy`), fiches[0]);
  assert.equal(concurrents.length, 3);
  const id = await d.lancer(fiches[0].placeId);
  assert.deepEqual(await d.lire(id), { etat: "encours" });
  t += 5_000;
  const pret = await d.lire(id);
  assert.equal(pret.etat, "pret");
  assert.ok(pret.etat === "pret" && pret.avis.length >= 20 && pret.avis.some(a => !a.reponse));
});

test("l'IA simulée cite de vrais avis et répond aux avis demandés", async () => {
  const d = donneesSimulation(() => 0);
  const id = await d.lancer("P1");
  const pret = await donneesSimulation(() => 10_000).lire(id);
  assert.equal(pret.etat, "pret");
  if (pret.etat !== "pret") return;
  const sansReponse = avisSansReponse(pret.avis);
  const r = await iaSimulation().analyser({ entreprise: "X", categorie: "Cuisiniste", avis: pret.avis, sansReponse });
  assert.ok(r);
  assert.equal(r!.reponses.length, sansReponse.length);
  assert.ok(pret.avis.some(a => a.texte?.includes(r!.pointsForts[0].citations[0])));
});
