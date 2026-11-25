/**
 * Données et IA simulées pour les essais en local (AVIS_SIMULATION=1, jamais en production).
 * Déterministe : mêmes fiches et mêmes avis à chaque appel.
 */
import type { Analyse, Avis, Donnees, Fiche, Ia } from "./types.ts";

const CATEGORIE = "Cuisiniste";
const FICHES: Fiche[] = [
  { placeId: "SIM-1", nom: "Atelier Cuisines", adresse: "12 avenue de Genève, 74000 Annecy", categorie: CATEGORIE, note: 4.3, nbAvis: 48 },
  { placeId: "SIM-2", nom: "Cuisines du Lac", adresse: "3 rue Royale, 74000 Annecy", categorie: CATEGORIE, note: 4.8, nbAvis: 212 },
  { placeId: "SIM-3", nom: "L'Établi Cuisines", adresse: "8 rue Carnot, 74000 Annecy", categorie: CATEGORIE, note: 4.6, nbAvis: 95 },
  { placeId: "SIM-4", nom: "Cuisines Savoie Design", adresse: "21 route d'Albertville, 74320 Sevrier", categorie: CATEGORIE, note: 4.1, nbAvis: 31 },
  { placeId: "SIM-5", nom: "Menuiserie Duval", adresse: "5 impasse des Pins, 74960 Cran-Gevrier", categorie: "Menuisier", note: 4.9, nbAvis: 12 },
];

const TEXTES: [number, string][] = [
  [5, "Cuisine magnifique, la pose a été faite avec beaucoup de soin."],
  [2, "Trois semaines de retard sur la pose et personne ne nous prévenait."],
  [5, "Très bon conseil au showroom, le plan 3D nous a beaucoup aidés."],
  [4, "Beau résultat, mais il a fallu relancer pour la finition du plan de travail."],
  [1, "Devis jamais reçu malgré deux relances."],
  [5, "Équipe ponctuelle et chantier laissé propre."],
];

function avisSimules(): Avis[] {
  const base = Date.UTC(2026, 10, 15);
  return Array.from({ length: 30 }, (_, i) => {
    const [note, texte] = TEXTES[i % TEXTES.length];
    const date = new Date(base - i * 9 * 86_400_000);
    const repondu = i % 3 === 0;
    return {
      id: `SIM-AVIS-${i + 1}`, note, texte, date: date.toISOString(),
      reponse: repondu ? "Merci pour votre retour." : null,
      dateReponse: repondu ? new Date(date.getTime() + 2 * 86_400_000).toISOString() : null,
    };
  });
}

export function donneesSimulation(maintenant: () => number = Date.now): Donnees {
  return {
    async rechercher(motCle) {
      return motCle.toLowerCase().includes(CATEGORIE.toLowerCase()) ? FICHES : FICHES.slice(0, 2);
    },
    async lancer(placeId) {
      return `SIM-${maintenant()}-${placeId}`;
    },
    async lire(tacheId) {
      const debut = Number(tacheId.split("-")[1]);
      if (!Number.isFinite(debut) || maintenant() - debut < 4_000) return { etat: "encours" };
      const avis = avisSimules();
      return { etat: "pret", avis, total: avis.length };
    },
  };
}

export function iaSimulation(): Ia {
  return {
    async analyser(e): Promise<Analyse> {
      return {
        pointsForts: [{ titre: "Qualité de la pose", citations: ["la pose a été faite avec beaucoup de soin"] }, { titre: "Conseil", citations: ["le plan 3D nous a beaucoup aidés"] }],
        reproches: [{ titre: "Délais et suivi", citations: ["personne ne nous prévenait"] }, { titre: "Devis", citations: ["Devis jamais reçu malgré deux relances"] }],
        reponses: e.sansReponse.map(a => ({ avisId: a.id, texte: `Bonjour, merci pour votre avis. (réponse simulée à « ${(a.texte ?? "").slice(0, 40)} »)` })),
        recommandations: ["Prévenir chaque client dès qu'un délai glisse.", "Répondre à chaque avis sous 48 heures.", "Demander un avis à la fin de chaque pose."],
      };
    },
  };
}
