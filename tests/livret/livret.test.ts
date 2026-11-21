import test from "node:test";
import assert from "node:assert/strict";
import {
  brouillonVide, remplir, lignes, couleurValide, restaurerBrouillon,
  construireLivret, nomFichier, pourPdf, type LivretData,
} from "../../lib/livret/livret.ts";
import { CHAMPS, COULEUR_DEFAUT } from "../../lib/livret/contenu.ts";

const avec = (valeurs: Record<string, string>): LivretData => {
  const d = brouillonVide();
  return { ...d, valeurs: { ...d.valeurs, ...valeurs } };
};

test("brouillonVide reprend les textes par défaut et laisse le reste vide", () => {
  const d = brouillonVide();
  assert.equal(Object.keys(d.valeurs).length, CHAMPS.length);
  assert.match(d.valeurs.intro, /^Merci d'avoir choisi/);
  assert.equal(d.valeurs.nomLogement, "");
  assert.deepEqual(d.marque, { couleur: COULEUR_DEFAUT, logo: null });
});

test("remplir remplace les champs et renvoie null si un champ manque", () => {
  assert.equal(remplir("Avant {heureDepart}", { heureDepart: "11 h" }), "Avant 11 h");
  assert.equal(remplir("Réseau {a} · mot de passe {b}", { a: "X", b: "" }), null);
  assert.equal(remplir("112", {}), "112");
  assert.equal(remplir("{a}", { a: "  " }), null);
});

test("lignes découpe une liste et ignore les lignes vides", () => {
  assert.deepEqual(lignes(" un \n\n deux\n  "), ["un", "deux"]);
});

test("couleurValide garde un hexa à six chiffres, sinon la couleur par défaut", () => {
  assert.equal(couleurValide("#1a2b3c"), "#1a2b3c");
  assert.equal(couleurValide("red"), COULEUR_DEFAUT);
});

test("restaurerBrouillon ignore les champs inconnus et les types invalides", () => {
  const d = restaurerBrouillon({ valeurs: { nomLogement: "Chalet", inconnu: "x", intro: 3 }, marque: { couleur: "#000000", logo: "data:image/png;base64,AA" } });
  assert.equal(d.valeurs.nomLogement, "Chalet");
  assert.equal("inconnu" in d.valeurs, false);
  assert.match(d.valeurs.intro, /^Merci/);
  assert.equal(d.marque.couleur, "#000000");
  assert.equal(d.marque.logo, "data:image/png;base64,AA");
  assert.deepEqual(restaurerBrouillon("n'importe quoi"), brouillonVide());
  assert.equal(restaurerBrouillon({ marque: { logo: "javascript:alert(1)" } }).marque.logo, null);
});

test("construireLivret retire les lignes, blocs et sections vides", () => {
  const vide = construireLivret(avec({ intro: "", arriveeTardive: "", souci: "", reglesIntro: "", regles: "", quartierIntro: "", departInfo: "", checklist: "", motFin: "" }));
  const titres = vide.sections.map(s => s.titre);
  assert.deepEqual(titres, ["Numéros utiles"]);
  // Numéros utiles se remplit à l'étape « Le départ », la dernière.
  assert.equal(vide.sections[0].etape, 5);
  assert.deepEqual(vide.sections[0].blocs[0], {
    type: "tableau", lignes: [
      { label: "Urgences (Europe)", valeur: "112" }, { label: "SAMU", valeur: "15" },
      { label: "Police", valeur: "17" }, { label: "Pompiers", valeur: "18" },
      { label: "Pharmacie de garde", valeur: "3237" },
    ],
  });
  assert.equal(vide.couverture.intro, null);
  assert.deepEqual(vide.couverture.tableau, []);
});

test("construireLivret remplit couverture, listes et pied de page", () => {
  const l = construireLivret(avec({
    nomConciergerie: "Rive Gauche", nomLogement: "Loft", heureDepart: "11 h",
    contactPrenom: "Camille", contactTelephone: "01 99 00 12 34",
  }));
  assert.equal(l.couverture.surtitre, "Rive Gauche");
  assert.equal(l.couverture.sousTitre, "Livret d'accueil · Loft");
  assert.deepEqual(l.couverture.tableau.map(r => r.label), ["Départ", "Votre contact"]);
  assert.equal(l.pied, "Rive Gauche · 01 99 00 12 34");
  const depart = l.sections.find(s => s.titre === "Votre départ")!;
  assert.equal(depart.sautAvant, true);
  const cases = depart.blocs.find(b => b.type === "liste")!;
  assert.equal(cases.type === "liste" && cases.style, "cases");
  assert.equal(cases.type === "liste" && cases.items.length, 6);
});

test("nomFichier produit un nom de fichier sans accents ni espaces", () => {
  assert.equal(nomFichier(avec({ nomLogement: "Le Loft du Marais — 3e" })), "livret-accueil-le-loft-du-marais-3e.pdf");
  assert.equal(nomFichier(avec({ nomLogement: "" })), "livret-accueil.pdf");
});

test("pourPdf retire ce que la police ne sait pas dessiner et garde le français", () => {
  assert.equal(pourPdf("Appelez-nous 📞 vite"), "Appelez-nous vite");
  assert.equal(pourPdf("8 h → 21 h"), "8 h -> 21 h");
  assert.equal(pourPdf("a ← b"), "a <- b");
  assert.equal(pourPdf("11\u202Fh 9\u2009h 5\u2007h"), "11\u00A0h 9\u00A0h 5\u00A0h");
  assert.equal(pourPdf("Cœur à l’œuvre : 20 € … « oui » – ça"), "Cœur à l’œuvre : 20 € … « oui » – ça");
  assert.equal(pourPdf("Łódź"), "ód");
  assert.equal(pourPdf("une\nligne"), "une\nligne");
  assert.equal(pourPdf("e\u0301te\u0301"), "été");
});
