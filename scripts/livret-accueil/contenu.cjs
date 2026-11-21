/**
 * Texte du livret d'accueil. Un champ s'écrit [Libellé|valeur d'exemple] :
 * le modèle affiche « [Libellé] » surligné, l'exemple affiche la valeur.
 *
 * Les valeurs d'exemple sont fictives (conciergerie de la démo). Le numéro
 * de téléphone est dans la tranche 01 99 00 réservée par l'Arcep à la fiction.
 */
const COVER = {
  eyebrow: "[NOM DE LA CONCIERGERIE|CONCIERGERIE RIVE GAUCHE]",
  title: "Bienvenue chez vous.",
  subtitle: "Livret d'accueil · [Nom du logement|Le Loft du Marais]",
  rows: [
    ["Adresse", "[Adresse complète|8 rue de l'Exemple, 75003 Paris]"],
    ["Arrivée", "À partir de [heure d'arrivée|16 h]"],
    ["Départ", "Avant [heure de départ|11 h]"],
    ["Wi-Fi", "Réseau [nom du réseau|LoftMarais] · mot de passe [mot de passe|bienvenue-2026]"],
    ["Votre contact", "[Prénom|Camille], [téléphone|01 99 00 12 34], [disponibilités|tous les jours de 8 h à 21 h]"],
  ],
  intro:
    "Merci d'avoir choisi [nom du logement|Le Loft du Marais]. Ce livret rassemble tout ce qu'il faut savoir pendant votre séjour : l'arrivée, le logement, le quartier et le départ. Gardez-le à portée de main, et écrivez-nous au moindre doute : nous préférons une question de trop à un souci pendant votre séjour.",
  howto:
    "Modèle proposé par Timevo (timevo.io). Remplacez chaque champ surligné, supprimez les rubriques qui ne concernent pas votre logement et ajoutez votre logo en haut de cette page. Supprimez ensuite ce paragraphe.",
  exampleNote:
    "Exemple rempli pour une conciergerie fictive. Le modèle Word à compléter est disponible sur timevo.io.",
  footer: "[Nom de la conciergerie|Conciergerie Rive Gauche] · [téléphone|01 99 00 12 34]",
};

const SECTIONS = [
  {
    title: "Votre arrivée",
    blocks: [
      { type: "h2", text: "Accès au logement" },
      { type: "table", rows: [
        ["Adresse", "[Adresse complète|8 rue de l'Exemple, 75003 Paris]"],
        ["Code de l'immeuble", "[code|4815B]"],
        ["Étage, porte", "[étage et porte|3e étage, porte de droite, ascenseur au fond de la cour]"],
        ["Clés", "[mode de remise|Boîte à clés à gauche de la porte, code envoyé le jour de l'arrivée]"],
      ] },
      { type: "h2", text: "Stationnement" },
      { type: "p", text: "[Informations parking|Pas de place privée. Le parking public le plus proche est à 4 minutes à pied ; le stationnement en rue est payant de 9 h à 20 h.]" },
      { type: "h2", text: "Arrivée tardive" },
      { type: "p", text: "Vous arrivez après [heure limite|22 h] ? Prévenez-nous la veille : l'accès autonome par la boîte à clés fonctionne à toute heure, mais nous préférons savoir que vous êtes bien arrivés." },
    ],
  },
  {
    title: "Le logement",
    blocks: [
      { type: "h2", text: "Wi-Fi et télévision" },
      { type: "table", rows: [
        ["Réseau Wi-Fi", "[nom du réseau|LoftMarais]"],
        ["Mot de passe", "[mot de passe|bienvenue-2026]"],
        ["Télévision", "[mode d'emploi|Télécommande dans le tiroir du meuble TV. Chaînes et applications de streaming via le bouton Accueil.]"],
      ] },
      { type: "h2", text: "Équipements" },
      { type: "bullets", items: [
        "Chauffage : [fonctionnement|thermostat dans l'entrée, réglé sur 20 °C. Merci de le baisser en partant.]",
        "Cuisine : [équipements|plaques induction, four, lave-vaisselle, cafetière à capsules, bouilloire]",
        "Linge : [linge fourni|draps et serviettes fournis, lave-linge dans la salle de bains]",
        "Bébé : [équipement bébé|lit parapluie et chaise haute sur demande]",
        "Sèche-cheveux, fer à repasser : [emplacement|placard de l'entrée]",
      ] },
      { type: "h2", text: "En cas de souci" },
      { type: "p", text: "Une panne, un équipement qui ne fonctionne pas, une ampoule grillée : écrivez-nous ou appelez le [téléphone|01 99 00 12 34]. Nous intervenons [délai d'intervention|dans la journée], et plus vite en cas d'urgence (fuite, coupure, serrure)." },
      { type: "table", rows: [
        ["Compteur électrique", "[emplacement|placard de l'entrée, en haut à droite]"],
        ["Arrivée d'eau", "[emplacement|sous l'évier de la cuisine]"],
        ["Extincteur", "[emplacement|à côté de la porte d'entrée]"],
      ] },
    ],
  },
  {
    title: "Les règles de la maison",
    blocks: [
      { type: "p", text: "Le logement est un lieu de vie dans un immeuble habité. Quelques règles pour que votre séjour se passe bien, pour vous comme pour les voisins :" },
      { type: "bullets", items: [
        "Nombre de personnes : [capacité|4 personnes maximum], selon votre réservation",
        "Fêtes et événements : non autorisés",
        "Calme : à partir de [heure|22 h], dans le logement comme dans les parties communes",
        "Tabac : [règle tabac|logement non-fumeur, y compris à la fenêtre]",
        "Animaux : [règle animaux|non acceptés]",
        "Clés : à ne pas reproduire ni confier à des personnes extérieures à la réservation",
      ] },
      { type: "h2", text: "Tri et déchets" },
      { type: "p", text: "[Consignes de tri|Les poubelles de l'immeuble sont dans la cour, à gauche en entrant. Bac jaune : emballages et papiers. Bac vert : déchets ménagers. Le verre se dépose dans la colonne au coin de la rue.]" },
    ],
  },
  {
    title: "Le quartier",
    blocks: [
      { type: "p", text: "Nos adresses préférées, testées par l'équipe. [Personnalisez cette liste : c'est la rubrique que vos voyageurs lisent le plus.|]" },
      { type: "h2", text: "Pour manger" },
      { type: "bullets", items: [
        "[Restaurant 1|Le Petit Comptoir], [adresse ou distance|à 3 minutes] : [pourquoi y aller|cuisine de saison, réservez le week-end]",
        "[Restaurant 2|Chez Margot], [adresse ou distance|à 5 minutes] : [pourquoi y aller|brunch le dimanche]",
        "[Boulangerie|La Fournée], [adresse ou distance|en bas de la rue] : [pourquoi y aller|ouverte dès 7 h]",
      ] },
      { type: "h2", text: "Au quotidien" },
      { type: "bullets", items: [
        "Supérette : [nom et horaires|au coin de la rue, ouverte jusqu'à 22 h]",
        "Pharmacie : [nom et distance|à 2 minutes, place du marché]",
        "Marché : [jours et lieu|mardi et samedi matin]",
      ] },
      { type: "h2", text: "Se déplacer" },
      { type: "bullets", items: [
        "Métro, bus : [station la plus proche|métro à 4 minutes, ligne 11]",
        "Gare, aéroport : [trajet|gare de Lyon en 15 minutes ; aéroport en 45 minutes en RER]",
        "Taxi : [numéro ou application|via l'application de votre choix, prise en charge devant l'immeuble]",
      ] },
    ],
    pageBreakAfter: true,
  },
  {
    title: "Votre départ",
    blocks: [
      { type: "p", text: "Le départ se fait avant [heure de départ|11 h]. Besoin de plus de temps ? Demandez-nous la veille : selon les réservations, nous pouvons parfois décaler l'heure." },
      { type: "h2", text: "Avant de partir" },
      { type: "checks", items: [
        "Fermer les fenêtres et baisser le chauffage",
        "Lancer le lave-vaisselle avec la vaisselle utilisée",
        "Sortir les poubelles dans les bacs de la cour",
        "Laisser les serviettes utilisées dans la salle de bains",
        "Éteindre les lumières et les appareils",
        "Remettre les clés : [consigne|dans la boîte à clés, puis brouiller le code]",
      ] },
      { type: "h2", text: "Un dernier mot" },
      { type: "p", text: "Merci de votre séjour. Si quelque chose vous a manqué, dites-le-nous directement : c'est comme ça que le logement s'améliore. Et si vous avez aimé votre séjour, un avis sur [plateforme|la plateforme de réservation] nous aide énormément." },
    ],
  },
  {
    title: "Numéros utiles",
    blocks: [
      { type: "table", rows: [
        ["Votre conciergerie", "[Prénom|Camille], [téléphone|01 99 00 12 34]"],
        ["Urgences (Europe)", "112"],
        ["SAMU", "15"],
        ["Police", "17"],
        ["Pompiers", "18"],
        ["Pharmacie de garde", "3237"],
        ["Médecin le plus proche", "[nom et adresse|cabinet médical, 20 rue de l'Exemple]"],
      ] },
    ],
  },
];

module.exports = { COVER, SECTIONS };
