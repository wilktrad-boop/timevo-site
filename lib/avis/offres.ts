/**
 * Les trois offres présentées en fin de rapport (écran et PDF), chacune adossée
 * aux chiffres de l'entreprise analysée. Texte pur, sans IA ; testé dans tests/avis/offres.test.ts.
 */
import type { Rapport } from "./types.ts";

export type Offre = { cle: "demande" | "reponse" | "alerte"; titre: string; constat: string; solution: string };

const virgule = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
const pluriel = (n: number, un: string, plusieurs: string) => `${n.toLocaleString("fr-FR")} ${n > 1 ? plusieurs : un}`;

export function offres(r: Rapport): Offre[] {
  const i = r.indicateurs;

  const demande: string[] = [
    i.douzeMois > 0
      ? `Vous avez reçu ${pluriel(i.douzeMois, "avis", "avis")} sur les 12 derniers mois, soit ${virgule(i.parMois)} par mois.`
      : "Vous n'avez reçu aucun avis sur les 12 derniers mois.",
  ];
  if (i.objectif) {
    const cible = `${virgule(i.objectif.cible)} / 5`;
    demande.push(
      `Il vous faudrait ${pluriel(i.objectif.avisNecessaires, "avis 5 étoiles", "avis 5 étoiles")} de plus pour passer à ${cible}${i.objectif.concurrent ? `, la note de ${i.objectif.concurrent}` : ""}.`,
    );
  }
  if (i.partSansTexte !== null && i.partSansTexte >= 30) {
    demande.push(`${i.partSansTexte} % de vos avis n'ont aucun commentaire : ce sont eux qui rassurent les prochains clients.`);
  }

  const reponse =
    i.sansReponseTotal > 0
      ? `${pluriel(i.sansReponseTotal, "avis attend", "avis attendent")} encore une réponse${r.tauxReponse !== null ? ` (taux de réponse : ${r.tauxReponse} %)` : ""}.`
      : r.nbAvisAnalyses > 0
        ? "Vous répondez à tous vos avis : c'est du temps qu'un agent IA peut vous rendre."
        : "Chaque avis à venir mérite une réponse, positif comme négatif.";

  const n = i.negatifs;
  const alerte =
    n.douzeMois > 0
      ? `${pluriel(n.douzeMois, "avis de 3 étoiles ou moins", "avis de 3 étoiles ou moins")} sur les 12 derniers mois${
          n.sansReponse > 0
            ? `, dont ${n.sansReponse} sans réponse${n.plusAncienJours !== null && n.plusAncienJours > 0 ? ` : le plus ancien attend depuis ${pluriel(n.plusAncienJours, "jour", "jours")}` : ""}`
            : ""
        }.`
      : "Aucun avis négatif sur les 12 derniers mois. Le jour où il arrive, chaque heure sans réponse compte.";

  return [
    {
      cle: "demande",
      titre: "Demander les avis automatiquement",
      constat: demande.join(" "),
      solution: "Après chaque intervention, votre client reçoit par SMS ou par email une demande d'avis avec le lien direct vers votre fiche, puis une relance s'il n'a pas répondu.",
    },
    {
      cle: "reponse",
      titre: "Répondre à chaque avis",
      constat: reponse,
      solution: "Un agent IA rédige la réponse à chaque nouvel avis, dans le ton de votre entreprise. Vous la validez en un clic.",
    },
    {
      cle: "alerte",
      titre: "Être prévenu d'un avis négatif",
      constat: alerte,
      solution: "Dès qu'un avis de 3 étoiles ou moins arrive, vous êtes prévenu par SMS ou par email, avec une réponse déjà rédigée pour réagir le jour même.",
    },
  ];
}
