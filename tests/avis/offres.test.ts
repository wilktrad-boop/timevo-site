import test from "node:test";
import assert from "node:assert/strict";
import { construireRapport, indicateurs, objectifNote } from "../../lib/avis/calculs.ts";
import { offres } from "../../lib/avis/offres.ts";
import type { Avis, Fiche } from "../../lib/avis/types.ts";

const MAINTENANT = new Date("2026-11-25T00:00:00.000Z");
const ilYa = (j: number) => new Date(MAINTENANT.getTime() - j * 86_400_000).toISOString();
const avis = (p: Partial<Avis> & { id: string }): Avis => ({ note: 5, texte: null, date: null, reponse: null, dateReponse: null, ...p });
const fiche = (p: Partial<Fiche> & { placeId: string }): Fiche => ({ nom: p.placeId, adresse: "", categorie: "Pisciniste", note: 4.5, nbAvis: 10, ...p });

const LOT: Avis[] = [
  avis({ id: "1", note: 5, texte: "Super", date: ilYa(10), reponse: "Merci" }),
  avis({ id: "2", note: 2, texte: "Retard", date: ilYa(40) }),
  avis({ id: "3", note: 3, date: ilYa(100), reponse: "Désolé" }),
  avis({ id: "4", note: 1, texte: "Jamais rappelé", date: ilYa(200) }),
  avis({ id: "5", note: 5, date: ilYa(500) }),
];

test("indicateurs compte le rythme, la répartition et les avis négatifs", () => {
  const i = indicateurs(LOT, fiche({ placeId: "moi" }), [], MAINTENANT);
  assert.equal(i.douzeMois, 4);
  assert.equal(i.parMois, 0.3);
  assert.deepEqual(i.repartition, [2, 0, 1, 1, 1]);
  assert.equal(i.partSansTexte, 40);
  assert.equal(i.sansReponseTotal, 3);
  assert.deepEqual(i.negatifs, { douzeMois: 3, sansReponse: 2, plusAncienJours: 200 });
});

test("objectifNote vise le dixième suivant, ou le concurrent mieux noté", () => {
  assert.deepEqual(objectifNote(fiche({ placeId: "a", note: 4.6, nbAvis: 40 }), []), { cible: 4.7, avisNecessaires: 6, concurrent: null });
  const o = objectifNote(fiche({ placeId: "a", note: 4.2, nbAvis: 30 }), [fiche({ placeId: "b", nom: "Piscines du Lac", note: 4.8 }), fiche({ placeId: "c", note: 5 })]);
  assert.equal(o?.cible, 4.8);
  assert.equal(o?.concurrent, "Piscines du Lac");
  assert.equal(o?.avisNecessaires, 66);
  assert.equal(objectifNote(fiche({ placeId: "a", note: 5, nbAvis: 2 }), []), null);
  assert.equal(objectifNote(fiche({ placeId: "a", note: null, nbAvis: 0 }), []), null);
});

test("offres s'appuie sur les chiffres de l'entreprise", () => {
  const r = construireRapport({ fiche: fiche({ placeId: "moi", note: 4.6, nbAvis: 40 }), concurrents: [], avis: LOT, total: 5, analyse: null, maintenant: MAINTENANT });
  const [demande, reponse, alerte] = offres(r);
  assert.equal(demande.cle, "demande");
  assert.match(demande.constat, /4 avis sur les 12 derniers mois, soit 0,3 par mois/);
  assert.match(demande.constat, /6 avis 5 étoiles de plus pour passer à 4,7 \/ 5\./);
  assert.match(demande.constat, /40 % de vos avis n'ont aucun commentaire/);
  assert.match(reponse.constat, /^3 avis attendent encore une réponse \(taux de réponse : 40 %\)\.$/);
  assert.match(alerte.constat, /^3 avis de 3 étoiles ou moins sur les 12 derniers mois, dont 2 sans réponse : le plus ancien attend depuis 200 jours\.$/);
  for (const o of offres(r)) assert.doesNotMatch(`${o.titre} ${o.constat} ${o.solution}`, /audit/i);
});

test("offres garde un texte neutre sans avis", () => {
  const r = construireRapport({ fiche: fiche({ placeId: "moi", note: null, nbAvis: 0 }), concurrents: [], avis: [], total: 0, analyse: null, maintenant: MAINTENANT });
  const [demande, reponse, alerte] = offres(r);
  assert.equal(demande.constat, "Vous n'avez reçu aucun avis sur les 12 derniers mois.");
  assert.equal(reponse.constat, "Chaque avis à venir mérite une réponse, positif comme négatif.");
  assert.match(alerte.constat, /^Aucun avis négatif/);
});
