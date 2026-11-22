import test from "node:test";
import assert from "node:assert/strict";
import {
  dateDfs, tauxReponse, delaiMoyenJours, noteParTrimestre, avisSansReponse,
  choisirConcurrents, verifierCitations, construireRapport, ficheValide, AVIS_MAX,
} from "../../lib/avis/calculs.ts";
import type { Avis, Fiche } from "../../lib/avis/types.ts";

const avis = (p: Partial<Avis> & { id: string }): Avis => ({
  note: 5, texte: null, date: null, reponse: null, dateReponse: null, ...p,
});
const fiche = (p: Partial<Fiche> & { placeId: string }): Fiche => ({
  nom: p.placeId, adresse: "", categorie: "Cuisiniste", note: 4.5, nbAvis: 10, ...p,
});

test("dateDfs lit le format DataForSEO et refuse le reste", () => {
  assert.equal(dateDfs("2026-05-15 14:09:32 +00:00"), "2026-05-15T14:09:32.000Z");
  assert.equal(dateDfs("2026-05-15 16:09:32 +02:00"), "2026-05-15T14:09:32.000Z");
  assert.equal(dateDfs("hier"), null);
  assert.equal(dateDfs(null), null);
});

test("tauxReponse arrondit au pourcent et vaut null sans avis", () => {
  assert.equal(tauxReponse([]), null);
  assert.equal(tauxReponse([avis({ id: "a", reponse: "Merci" }), avis({ id: "b" }), avis({ id: "c" })]), 33);
});

test("delaiMoyenJours ne compte que les avis datés avec réponse datée", () => {
  const a = [
    avis({ id: "a", date: "2026-01-01T00:00:00.000Z", reponse: "ok", dateReponse: "2026-01-03T00:00:00.000Z" }),
    avis({ id: "b", date: "2026-01-01T00:00:00.000Z", reponse: "ok", dateReponse: "2026-01-02T00:00:00.000Z" }),
    avis({ id: "c", date: "2026-01-01T00:00:00.000Z", reponse: "ok" }),
  ];
  assert.equal(delaiMoyenJours(a), 1.5);
  assert.equal(delaiMoyenJours([avis({ id: "d" })]), null);
});

test("noteParTrimestre donne les 4 derniers trimestres, du plus ancien au plus récent", () => {
  const t = noteParTrimestre([
    avis({ id: "a", note: 4, date: "2026-11-02T10:00:00.000Z" }),
    avis({ id: "b", note: 5, date: "2026-10-20T10:00:00.000Z" }),
    avis({ id: "c", note: 2, date: "2026-02-10T10:00:00.000Z" }),
  ], new Date("2026-11-22T12:00:00.000Z"));
  assert.deepEqual(t.map(x => x.libelle), ["T1 2026", "T2 2026", "T3 2026", "T4 2026"]);
  assert.deepEqual(t[3], { libelle: "T4 2026", note: 4.5, nb: 2 });
  assert.deepEqual(t[1], { libelle: "T2 2026", note: null, nb: 0 });
  assert.equal(t[0].note, 2);
});

test("avisSansReponse garde les plus récents, au maximum demandé", () => {
  const a = [
    avis({ id: "vieux", date: "2025-01-01T00:00:00.000Z" }),
    avis({ id: "recent", date: "2026-06-01T00:00:00.000Z" }),
    avis({ id: "repondu", date: "2026-07-01T00:00:00.000Z", reponse: "Merci" }),
    avis({ id: "sansdate" }),
  ];
  assert.deepEqual(avisSansReponse(a).map(x => x.id), ["recent", "vieux", "sansdate"]);
  assert.deepEqual(avisSansReponse(a, 1).map(x => x.id), ["recent"]);
});

test("choisirConcurrents : même catégorie, sans la fiche choisie, les plus suivis d'abord", () => {
  const choisie = fiche({ placeId: "moi" });
  const liste = [
    choisie,
    fiche({ placeId: "petit", nbAvis: 5 }),
    fiche({ placeId: "gros", nbAvis: 200 }),
    fiche({ placeId: "autre-metier", categorie: "Plombier", nbAvis: 999 }),
    fiche({ placeId: "sans-avis", nbAvis: 0 }),
    fiche({ placeId: "moyen", nbAvis: 40, categorie: " cuisiniste " }),
    fiche({ placeId: "dernier", nbAvis: 3 }),
  ];
  assert.deepEqual(choisirConcurrents(liste, choisie).map(f => f.placeId), ["gros", "moyen", "petit"]);
});

test("verifierCitations retire ce qui n'est pas dans un avis, mot pour mot", () => {
  const a = [avis({ id: "a", texte: "Pose  impeccable, l’équipe était à l'heure." })];
  const themes = verifierCitations([{ titre: "Ponctualité", citations: ["« L'équipe était à l'heure »", "toujours en avance"] }], a);
  assert.deepEqual(themes, [{ titre: "Ponctualité", citations: ["« L'équipe était à l'heure »"] }]);
});

test("construireRapport assemble les chiffres et signale la troncature", () => {
  const a = [avis({ id: "a", note: 4, date: "2026-11-01T00:00:00.000Z" })];
  const r = construireRapport({
    fiche: fiche({ placeId: "moi" }), concurrents: [], avis: a, total: 350, analyse: null,
    maintenant: new Date("2026-11-22T00:00:00.000Z"),
  });
  assert.equal(r.nbAvisAnalyses, 1);
  assert.equal(r.tronque, true);
  assert.equal(r.tauxReponse, 0);
  assert.equal(r.sansReponse.length, 1);
  assert.equal(r.analyse, null);
  assert.equal(r.genereLe, "2026-11-22T00:00:00.000Z");
  assert.equal(AVIS_MAX, 200);
});

test("ficheValide accepte une fiche bien formée et refuse le reste", () => {
  assert.deepEqual(ficheValide({ placeId: "p1", nom: "A", adresse: "B", categorie: "C", note: 4.2, nbAvis: 3 }),
    { placeId: "p1", nom: "A", adresse: "B", categorie: "C", note: 4.2, nbAvis: 3 });
  assert.equal(ficheValide({ placeId: "", nom: "A" }), null);
  assert.equal(ficheValide("x"), null);
  assert.equal(ficheValide({ placeId: "p", nom: "A", adresse: "", categorie: "", note: "4", nbAvis: 1 })?.note, null);
});
