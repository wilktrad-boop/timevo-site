/**
 * Ressource « Livret d'accueil Airbnb » (page /fr/ressources/livret-accueil-airbnb).
 *
 * Page en français uniquement : le modèle s'adresse aux conciergeries
 * françaises et n'existe qu'en français. La route /en/... renvoie 404 et la
 * page n'a pas d'alternate hreflang.
 *
 * Les fichiers sont générés par scripts/livret-accueil/build-livret.cjs.
 * Ils sont dans public/ : l'email est demandé, mais un lien direct reste
 * accessible. C'est assumé — le formulaire sert à récupérer le contact, pas
 * à protéger le fichier.
 */

export const LIVRET_PATH = "/fr/ressources/livret-accueil-airbnb";

/** Ressource « Répondre à un avis Google » et son outil d'analyse (français uniquement). */
export const AVIS_PATH = "/fr/ressources/repondre-avis-google";

export const LIVRET_FILES = {
  modele: { href: "/ressources/livret-accueil-modele.docx", label: "Modèle Word à compléter", meta: "DOCX · 4 pages" },
  exemple: { href: "/ressources/livret-accueil-exemple.pdf", label: "Exemple rempli", meta: "PDF · 4 pages" },
} as const;

/** Choix proposés dans le formulaire. Sert aussi de liste blanche côté serveur. */
export const LOGEMENTS_OPTIONS = ["1 à 5", "6 à 15", "16 à 30", "Plus de 30", "Je me lance"] as const;

export const LIVRET = {
  // Titre ≤ 51 caractères (+ « | Timevo » = 60) ; description ≤ 155. Distincte de
  // celle du générateur (GENERATEUR) pour que les deux pages ne se concurrencent pas.
  metaTitle: "Livret d'accueil Airbnb : modèle gratuit en ligne",
  metaDescription:
    "Modèle de livret d'accueil Airbnb gratuit : à créer en ligne avec votre logo et votre photo, ou en Word. Arrivée, Wi-Fi, règles, quartier, départ.",
  eyebrow: "RESSOURCE GRATUITE · CONCIERGERIES",
  h1: "Livret d'accueil Airbnb : le modèle à télécharger.",
  subtitle:
    "Le livret qu'on recommande aux conciergeries que l'on accompagne : quatre pages, tout ce qu'un voyageur cherche pendant son séjour, à compléter pour chacun de vos logements.",
  contentsH2: "Ce que contient le livret.",
  contents: [
    { title: "La première page", desc: "Adresse, horaires d'arrivée et de départ, Wi-Fi, votre contact : l'essentiel, visible d'un coup d'œil." },
    { title: "L'arrivée", desc: "Accès à l'immeuble, remise des clés, stationnement, arrivée tardive." },
    { title: "Le logement", desc: "Wi-Fi, télévision, équipements, et quoi faire en cas de souci." },
    { title: "Les règles de la maison", desc: "Capacité, calme, tabac, animaux, tri des déchets. Formulées sans ton de règlement." },
    { title: "Le quartier", desc: "Vos bonnes adresses, le quotidien, les transports : la rubrique que les voyageurs lisent le plus." },
    { title: "Le départ", desc: "Une liste à cocher avant de partir, les numéros utiles, et la demande d'avis au bon moment." },
  ],
  creerCta: "Créer mon livret en ligne",
  creerNote: "Gratuit. Le PDF vous est envoyé par email.",
  formH2: "Ou recevez le modèle Word.",
  formSubtitle: "Le Word modifiable et l'exemple rempli, en téléchargement immédiat.",
  form: {
    email: "Email professionnel",
    company: "Nom de la conciergerie",
    companyHint: "Facultatif",
    logements: "Logements gérés",
    logementsPlaceholder: "Choisir",
    consent:
      "J'accepte que Timevo utilise ces informations pour m'envoyer ce modèle et me recontacter au sujet de ma conciergerie. Je peux m'y opposer à tout moment.",
    privacy: "Politique de confidentialité",
    submit: "Télécharger le modèle",
    pending: "Envoi…",
    errorEmail: "Indiquez une adresse email valide.",
    errorConsent: "Cochez la case pour recevoir le modèle.",
    errorLogements: "Indiquez le nombre de logements.",
    successTitle: "C'est à vous.",
    successText: "Vos deux fichiers sont prêts. Remplacez les champs surlignés en jaune, ajoutez votre logo, et le livret est prêt à imprimer ou à envoyer.",
  },
  digitalH2: "Et quand le livret ne suffit plus.",
  digitalText:
    "Chez les conciergeries qu'on accompagne, ce livret devient un guide voyageur digital : un lien par séjour, en plusieurs langues, avec un assistant IA qui répond aux questions du voyageur à toute heure, à partir du contenu du livret.",
  digitalCta: "Voir l'offre conciergerie",
  digitalAlt: "Guide voyageur digital sur mobile, version de démonstration",
  digitalCaption: "Le guide voyageur, version de démonstration (données fictives).",
};

export const GENERATEUR = {
  metaTitle: "Créer son livret d'accueil Airbnb en ligne",
  metaDescription:
    "Créez votre livret d'accueil Airbnb en ligne : arrivée, Wi-Fi, règles, bonnes adresses, départ. Votre logo, votre couleur, un PDF prêt à envoyer. Gratuit.",
  h1: "Créez votre livret d'accueil.",
  subtitle:
    "Six étapes, un aperçu en direct, et un PDF à votre marque prêt à envoyer à vos voyageurs. Votre brouillon reste dans votre navigateur ; le PDF terminé vous est envoyé par email.",
  acces: {
    h2: "Avant de commencer.",
    texte: "Indiquez votre email : vous y recevrez un code pour ouvrir l'outil, puis votre livret en PDF une fois terminé.",
    consent:
      "J'accepte que Timevo utilise ces informations pour m'envoyer mon livret et me recontacter au sujet de ma conciergerie. Je peux m'y opposer à tout moment.",
    errorConsent: "Cochez la case pour recevoir votre livret.",
    errorEnvoi: "Le code n'a pas pu être envoyé. Vérifiez votre adresse, ou réessayez dans un instant.",
    submit: "Recevoir mon code",
    codeH2: "Votre code.",
    codeEnvoye: "Nous venons d'envoyer un code à 6 chiffres à",
    codeAide: "Pensez à regarder dans les indésirables.",
    codeLabel: "Code reçu par email",
    ouvrir: "Ouvrir l'outil",
    autreAdresse: "Changer d'adresse ou recevoir un nouveau code",
  },
  bridge:
    "Chez les conciergeries qu'on accompagne, ce livret devient un guide voyageur digital, multilingue, avec un assistant qui répond aux voyageurs à toute heure.",
  bridgeCta: "Voir l'offre conciergerie",
};
