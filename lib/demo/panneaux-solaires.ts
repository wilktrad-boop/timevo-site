import type { DemoDashboard } from "./types";

/**
 * Installateur photovoltaïque. DONNÉES ENTIÈREMENT FICTIVES.
 *
 * Le vocabulaire suit celui de la page secteur (lib/sectors.ts) : volume de
 * leads non qualifiés, éligibilité MaPrimeRénov, Consuel et mise en service,
 * monitoring de production post-pose.
 */

export const SOLAIRE_FR: DemoDashboard = {
  metaTitle: "Dashboard installateur photovoltaïque — démo interactive",
  metaDescription:
    "Démo du tableau de bord livré à un installateur solaire : qualification des leads, suivi d'installation, monitoring de production, facturation. Données fictives, interface réelle.",
  eyebrow: "DÉMONSTRATION · PHOTOVOLTAÏQUE",
  h1: "Le tableau de bord d'un installateur solaire.",
  subtitle:
    "Voilà ce qu'un installateur de 25 personnes a sous les yeux le matin. Cinq cents leads par mois deviennent une liste courte, les dossiers en cours ont chacun leur jalon, et la production des installations posées se surveille toute seule.",

  demoBadge: "Démonstration — données fictives",
  demoNote:
    "Scénario type, pas un client existant. Toutes les données de cette page sont fictives : noms, montants, transcriptions. L'interface, elle, est celle qu'on livre. Les chiffres réels sont établis pendant l'audit gratuit.",

  tabs: ["Dossiers", "Qualification", "Leads", "Facturation"],

  kpis: [
    { value: "38", label: "Dossiers en cours", detail: "12 en attente Consuel" },
    { value: "8 j", label: "Délai lead → signature", detail: "sur les 30 derniers jours" },
    { value: "142", label: "Leads qualifiés par l'IA", detail: "487 reçus ce mois" },
    { value: "3", label: "Alertes de production", detail: "sur 214 installations suivies" },
  ],

  quotesH2: "Dossiers en cours",
  quotesMeta: "5 dossiers · jalon en cours",
  quotesCols: { client: "Client & installation", amount: "Montant TTC", follow: "Jalons", outcome: "Statut" },
  quotes: [
    {
      client: "M. et Mme F. · Béziers",
      project: "6 kWc, toiture tuiles, revente surplus",
      amount: "14 200 €",
      steps: [
        { label: "Matériel", state: "done" },
        { label: "Pose", state: "done" },
        { label: "Consuel", state: "done" },
      ],
      outcome: { label: "En service", tone: "win" },
    },
    {
      client: "M. D. · Narbonne",
      project: "9 kWc + batterie 10 kWh",
      amount: "27 600 €",
      steps: [
        { label: "Matériel", state: "done" },
        { label: "Pose", state: "done" },
        { label: "Consuel", state: "active" },
      ],
      outcome: { label: "Attente Consuel", tone: "pending" },
    },
    {
      client: "Mme A. · Sète",
      project: "3 kWc autoconsommation totale",
      amount: "8 900 €",
      steps: [
        { label: "Matériel", state: "done" },
        { label: "Pose", state: "done" },
        { label: "Consuel", state: "done" },
      ],
      outcome: { label: "Abandonné", tone: "loss" },
    },
    {
      client: "SCI M. · Montpellier",
      project: "36 kWc, toiture bac acier, local commercial",
      amount: "62 400 €",
      steps: [
        { label: "Matériel", state: "active" },
        { label: "Pose", state: "pending" },
        { label: "Consuel", state: "pending" },
      ],
      outcome: { label: "Matériel commandé", tone: "pending" },
    },
    {
      client: "M. R. · Lunel",
      project: "6 kWc, remplacement onduleur inclus",
      amount: "16 800 €",
      steps: [
        { label: "Matériel", state: "done" },
        { label: "Pose", state: "active" },
        { label: "Consuel", state: "pending" },
      ],
      outcome: { label: "Pose en cours", tone: "pending" },
    },
  ],

  callsH2: "Qualification",
  callsMeta: "3 appels · dernier : aujourd'hui 10:38",
  urgentLabel: "Rappel prioritaire",
  transcriptLabel: "Voir la transcription",
  calls: [
    {
      from: "06 •• •• 27 15",
      at: "Aujourd'hui · 10:38",
      summary:
        "Maison individuelle, toiture sud sans masque, propriétaire occupant. L'agent a collecté les six paramètres d'éligibilité avant de passer la main.",
      transcript: [
        { who: "ia", text: "Bonjour, vous avez fait une simulation sur notre site. Je vous appelle pour cadrer le projet, ça prend deux minutes." },
        { who: "client", text: "Oui, allez-y." },
        { who: "ia", text: "Vous êtes propriétaire du logement, et il a plus de deux ans ?" },
        { who: "client", text: "Propriétaire, oui. La maison date de 2011." },
        { who: "ia", text: "Votre toiture est orientée comment, et y a-t-il un arbre ou un bâtiment qui fait de l'ombre ?" },
        { who: "client", text: "Plein sud, et rien devant, c'est dégagé." },
        { who: "ia", text: "Dernière question, votre facture d'électricité annuelle est plutôt autour de combien ?" },
        { who: "client", text: "Dans les 2 400 € l'an dernier." },
        { who: "ia", text: "Parfait, votre dossier est complet. Un conseiller vous rappelle avec le reste à charge après aides. Bonne journée." },
      ],
      action: "Qualifié · étude à produire",
    },
    {
      from: "04 •• •• 61 09",
      at: "Aujourd'hui · 09:12",
      summary:
        "Installation posée il y a 14 mois, production en baisse de 31 % sur trois semaines. L'alerte de monitoring avait précédé l'appel du client.",
      urgent: true,
      transcript: [
        { who: "client", text: "J'ai l'impression que ça produit moins qu'avant, je me trompe ?" },
        { who: "ia", text: "Non, vous avez raison. On a une alerte sur votre installation depuis le 28, la production est 31 % sous la référence saisonnière." },
        { who: "client", text: "Ah. C'est grave ?" },
        { who: "ia", text: "Le profil ressemble à une chaîne déconnectée, pas à un onduleur en panne. Un technicien doit monter voir." },
        { who: "client", text: "Vous pouvez venir quand ?" },
        { who: "ia", text: "Je passe le dossier au SAV, vous êtes sous garantie. Ils vous proposent un créneau aujourd'hui." },
      ],
      action: "SAV sous garantie · escaladé",
    },
    {
      from: "07 •• •• 84 30",
      at: "Hier · 15:22",
      summary: "Locataire d'un appartement en copropriété. L'agent a expliqué pourquoi le projet n'est pas réalisable en l'état.",
      transcript: [
        { who: "client", text: "Je voudrais des panneaux, j'habite au dernier étage." },
        { who: "ia", text: "Vous êtes propriétaire ou locataire ?" },
        { who: "client", text: "Locataire." },
        { who: "ia", text: "Dans ce cas la toiture appartient à la copropriété, l'installation passe par un vote en assemblée générale. Ce n'est pas quelque chose qu'on peut engager avec vous seul." },
        { who: "client", text: "D'accord, je comprends." },
        { who: "ia", text: "Je vous envoie par SMS la marche à suivre pour le porter en AG, si vous voulez tenter." },
      ],
      action: "Non éligible · sorti du pipeline",
    },
  ],

  leadsH2: "Leads du simulateur",
  leadsMeta: "3 leads · triés par score",
  scoreLabel: "Éligibilité",
  emailReadyLabel: "Étude prête à envoyer",
  sendLabel: "Envoyer l'étude",
  editLabel: "Modifier",
  leads: [
    {
      name: "H. Delcourt · Agde",
      request: "Maison de 2004, toiture sud 42 m², facture annuelle 2 900 €, propriétaire occupant, projet sous 3 mois.",
      score: 94,
      verdict: "Six paramètres d'éligibilité réunis, aides calculées, échéance donnée.",
      email: {
        subject: "Votre étude — 9 kWc à Agde",
        body:
          "Bonjour,\n\nVoici l'étude pour votre toiture sud de 42 m². En 9 kWc, la production estimée couvre environ 68 % de votre consommation actuelle.\n\nLe montant est de 21 400 € TTC. Après la prime à l'autoconsommation et la TVA réduite, le reste à charge ressort à 17 900 €.\n\nJe vous propose une visite technique pour valider la structure de charpente avant de figer le devis. Quel jour vous convient ?",
      },
    },
    {
      name: "S. Boulanger · Frontignan",
      request: "Maison de 1978, toiture est-ouest, souhaite une batterie, pas de date arrêtée.",
      score: 71,
      verdict: "Éligible, mais orientation moins favorable et projet non daté.",
      email: {
        subject: "Votre projet solaire à Frontignan",
        body:
          "Bonjour,\n\nUne toiture est-ouest reste tout à fait exploitable : la production est plus étalée sur la journée, ce qui va plutôt bien avec une batterie.\n\nAvant de chiffrer, il me faut deux informations : votre consommation annuelle en kWh, et l'année de réfection de la toiture si elle a été refaite.\n\nAvec ça je vous envoie une étude chiffrée sous 48 h.",
      },
    },
    {
      name: "Simulation incomplète",
      request: "Formulaire abandonné à la deuxième étape, code postal seul renseigné.",
      score: 14,
      verdict: "Aucun paramètre d'éligibilité, pas de coordonnées vérifiables.",
      rejected: "Écarté automatiquement — aucun commercial mobilisé, relance légère à J+2 pour compléter la simulation.",
    },
  ],

  billingH2: "Facturation & TVA",
  billingMeta: "Période en cours · 4 factures",
  billingStats: [
    { label: "CA encaissé ce mois", value: "286 400 €" },
    { label: "TVA collectée", value: "31 500 €" },
    { label: "En attente de règlement", value: "62 400 €" },
    { label: "Retard > 30 jours", value: "0 €" },
  ],
  splitLabel: "Répartition du chiffre",
  split: [
    { label: "Particuliers", value: 58, color: "var(--accent)" },
    { label: "Professionnels & agricole", value: 34, color: "var(--accent-soft)" },
    { label: "SAV & maintenance", value: 8, color: "var(--dim-2)" },
  ],
  invoicesCols: { ref: "Référence", client: "Client", amount: "Montant TTC", status: "Transmission" },
  invoices: [
    { ref: "F-2026-1184", client: "M. et Mme F. · Béziers", amount: "14 200 €", status: "Transmise", tone: "ok" },
    { ref: "F-2026-1183", client: "M. D. · Narbonne", amount: "27 600 €", status: "Transmise", tone: "ok" },
    { ref: "F-2026-1182", client: "GAEC des Garrigues", amount: "48 900 €", status: "Transmise", tone: "ok" },
    { ref: "F-2026-1181", client: "SCI M. · Montpellier", amount: "62 400 €", status: "En attente de règlement", tone: "wait" },
  ],

  readingH2: "Ce que l'automatisation fait dans cet écran.",
  readingSubtitle:
    "Le tableau ci-dessus n'affiche que des données. Voilà ce qui les produit, onglet par onglet.",
  readings: [
    {
      tab: "Dossiers",
      text: "Matériel, pose, Consuel, mise en service : quatre acteurs, quatre plannings, et jusqu'ici quatre sources de vérité. Chaque jalon franchi met la ligne à jour et prévient le client. Les 12 dossiers en attente de Consuel sont visibles sans que personne ait à faire le point.",
    },
    {
      tab: "Qualification",
      text: "L'agent appelle les simulations entrantes et collecte les six paramètres d'éligibilité avant qu'un commercial y touche. Le locataire en copropriété sort du pipeline en trois minutes au lieu d'occuper un rendez-vous. C'est ce qui ramène le délai lead → signature à 8 jours.",
    },
    {
      tab: "Leads",
      text: "487 leads dans le mois, 142 réellement exploitables. Les dossiers complets arrivent avec le reste à charge après aides déjà calculé, donc le commercial ouvre la conversation sur un chiffre net plutôt que sur un questionnaire.",
    },
    {
      tab: "Facturation",
      text: "Les factures suivent les jalons, les relances partent seules, et la TVA réduite s'applique selon l'éligibilité du dossier. Le monitoring de production tourne en parallèle : les 3 alertes ouvertes sur 214 installations ont été levées avant que le client appelle.",
    },
  ],

  ctaH2: "Le vôtre ressemblerait à quoi ?",
  ctaSubtitle:
    "En 30 minutes on regarde votre volume de leads, votre process de qualification et votre suivi d'installation. Vous repartez avec les points où l'automatisation rend le plus de marge.",
  ctaButton: "Réserver l'audit gratuit",
  ctaReassurance: "30 minutes · Gratuit · Sans engagement · Diagnostic écrit",
};

export const SOLAIRE_EN: DemoDashboard = {
  metaTitle: "Solar installer dashboard — interactive demo",
  metaDescription:
    "Demo of the dashboard we deliver to a solar installer: lead qualification, installation tracking, production monitoring, invoicing. Fictional data, real interface.",
  eyebrow: "DEMO · SOLAR",
  h1: "A solar installer's dashboard.",
  subtitle:
    "This is what a 25-person installer sees in the morning. Five hundred leads a month become a short list, every live job carries its own milestone, and the output of installed systems watches itself.",

  demoBadge: "Demonstration — fictional data",
  demoNote:
    "Typical scenario, not an existing client. Every figure on this page is fictional: names, amounts, transcripts. The interface is the one we ship. Real numbers come out of the free audit.",

  tabs: ["Jobs", "Qualification", "Leads", "Invoicing"],

  kpis: [
    { value: "38", label: "Live jobs", detail: "12 awaiting sign-off" },
    { value: "8 d", label: "Lead to signature", detail: "over the last 30 days" },
    { value: "142", label: "Leads qualified by AI", detail: "487 received this month" },
    { value: "3", label: "Output alerts", detail: "across 214 monitored systems" },
  ],

  quotesH2: "Live jobs",
  quotesMeta: "5 jobs · current milestone",
  quotesCols: { client: "Client & system", amount: "Amount incl. VAT", follow: "Milestones", outcome: "Status" },
  quotes: [
    {
      client: "Mr & Mrs F. · Béziers",
      project: "6 kWp, tiled roof, surplus export",
      amount: "€14,200",
      steps: [
        { label: "Hardware", state: "done" },
        { label: "Install", state: "done" },
        { label: "Sign-off", state: "done" },
      ],
      outcome: { label: "Commissioned", tone: "win" },
    },
    {
      client: "Mr D. · Narbonne",
      project: "9 kWp + 10 kWh battery",
      amount: "€27,600",
      steps: [
        { label: "Hardware", state: "done" },
        { label: "Install", state: "done" },
        { label: "Sign-off", state: "active" },
      ],
      outcome: { label: "Awaiting sign-off", tone: "pending" },
    },
    {
      client: "Ms A. · Sète",
      project: "3 kWp, full self-consumption",
      amount: "€8,900",
      steps: [
        { label: "Hardware", state: "done" },
        { label: "Install", state: "done" },
        { label: "Sign-off", state: "done" },
      ],
      outcome: { label: "Cancelled", tone: "loss" },
    },
    {
      client: "M. property co. · Montpellier",
      project: "36 kWp, steel deck roof, commercial unit",
      amount: "€62,400",
      steps: [
        { label: "Hardware", state: "active" },
        { label: "Install", state: "pending" },
        { label: "Sign-off", state: "pending" },
      ],
      outcome: { label: "Hardware ordered", tone: "pending" },
    },
    {
      client: "Mr R. · Lunel",
      project: "6 kWp, inverter replacement included",
      amount: "€16,800",
      steps: [
        { label: "Hardware", state: "done" },
        { label: "Install", state: "active" },
        { label: "Sign-off", state: "pending" },
      ],
      outcome: { label: "Install under way", tone: "pending" },
    },
  ],

  callsH2: "Qualification",
  callsMeta: "3 calls · latest: today 10:38",
  urgentLabel: "Priority callback",
  transcriptLabel: "View transcript",
  calls: [
    {
      from: "06 •• •• 27 15",
      at: "Today · 10:38",
      summary:
        "Detached house, south-facing roof with no shading, owner-occupier. The agent collected all six eligibility parameters before handing over.",
      transcript: [
        { who: "ia", text: "Hello, you ran a simulation on our site. I'm calling to scope the project, it takes two minutes." },
        { who: "client", text: "Sure, go ahead." },
        { who: "ia", text: "Do you own the property, and is it more than two years old?" },
        { who: "client", text: "I own it, yes. The house dates from 2011." },
        { who: "ia", text: "Which way does the roof face, and is there a tree or building casting shade?" },
        { who: "client", text: "Due south, and nothing in front, it's clear." },
        { who: "ia", text: "Last question, roughly what is your annual electricity bill?" },
        { who: "client", text: "Around €2,400 last year." },
        { who: "ia", text: "Your file is complete. An adviser will call you back with the net cost after grants. Have a good day." },
      ],
      action: "Qualified · study to produce",
    },
    {
      from: "04 •• •• 61 09",
      at: "Today · 09:12",
      summary:
        "System installed 14 months ago, output down 31% over three weeks. The monitoring alert had already fired before the client called.",
      urgent: true,
      transcript: [
        { who: "client", text: "I get the feeling it's producing less than it used to, am I wrong?" },
        { who: "ia", text: "No, you're right. We've had an alert on your system since the 28th, output is 31% below the seasonal baseline." },
        { who: "client", text: "Is that serious?" },
        { who: "ia", text: "The pattern looks like a disconnected string rather than a failed inverter. A technician needs to go up and look." },
        { who: "client", text: "When can you come?" },
        { who: "ia", text: "I'm passing this to the service team, you're under warranty. They'll offer you a slot today." },
      ],
      action: "Warranty callout · escalated",
    },
    {
      from: "07 •• •• 84 30",
      at: "Yesterday · 15:22",
      summary: "Tenant in a block of flats. The agent explained why the project isn't feasible as things stand.",
      transcript: [
        { who: "client", text: "I'd like panels, I'm on the top floor." },
        { who: "ia", text: "Do you own or rent?" },
        { who: "client", text: "I rent." },
        { who: "ia", text: "In that case the roof belongs to the building's owners, so an installation needs a vote at the residents' meeting. It isn't something we can commit to with you alone." },
        { who: "client", text: "Understood." },
        { who: "ia", text: "I'll text you how to put it on the agenda, if you want to try." },
      ],
      action: "Not eligible · removed from pipeline",
    },
  ],

  leadsH2: "Simulator leads",
  leadsMeta: "3 leads · sorted by score",
  scoreLabel: "Eligibility",
  emailReadyLabel: "Study ready to send",
  sendLabel: "Send study",
  editLabel: "Edit",
  leads: [
    {
      name: "H. Delcourt · Agde",
      request: "House built 2004, 42 m² south roof, €2,900 annual bill, owner-occupier, project within 3 months.",
      score: 94,
      verdict: "All six eligibility parameters met, grants calculated, deadline given.",
      email: {
        subject: "Your study — 9 kWp in Agde",
        body:
          "Hello,\n\nHere is the study for your 42 m² south-facing roof. At 9 kWp, estimated output covers around 68% of your current consumption.\n\nThe total is €21,400 including VAT. After the self-consumption grant and reduced VAT, the net cost comes to €17,900.\n\nI'd suggest a site visit to check the roof structure before we fix the quote. Which day suits you?",
      },
    },
    {
      name: "S. Boulanger · Frontignan",
      request: "House built 1978, east-west roof, wants a battery, no date fixed.",
      score: 71,
      verdict: "Eligible, but less favourable orientation and no timeline.",
      email: {
        subject: "Your solar project in Frontignan",
        body:
          "Hello,\n\nAn east-west roof works perfectly well: output is spread more evenly across the day, which suits a battery.\n\nBefore pricing, I need two things: your annual consumption in kWh, and the year the roof was redone if it has been.\n\nWith those I'll send a costed study within 48 hours.",
      },
    },
    {
      name: "Incomplete simulation",
      request: "Form abandoned at step two, postcode only.",
      score: 14,
      verdict: "No eligibility parameters, no verifiable contact details.",
      rejected: "Discarded automatically — no salesperson involved, light follow-up at D+2 to complete the simulation.",
    },
  ],

  billingH2: "Invoicing & VAT",
  billingMeta: "Current period · 4 invoices",
  billingStats: [
    { label: "Revenue collected", value: "€286,400" },
    { label: "VAT collected", value: "€31,500" },
    { label: "Awaiting payment", value: "€62,400" },
    { label: "Overdue > 30 days", value: "€0" },
  ],
  splitLabel: "Revenue split",
  split: [
    { label: "Consumers", value: 58, color: "var(--accent)" },
    { label: "Business & agricultural", value: 34, color: "var(--accent-soft)" },
    { label: "Service & maintenance", value: 8, color: "var(--dim-2)" },
  ],
  invoicesCols: { ref: "Reference", client: "Client", amount: "Amount incl. VAT", status: "Transmission" },
  invoices: [
    { ref: "F-2026-1184", client: "Mr & Mrs F. · Béziers", amount: "€14,200", status: "Transmitted", tone: "ok" },
    { ref: "F-2026-1183", client: "Mr D. · Narbonne", amount: "€27,600", status: "Transmitted", tone: "ok" },
    { ref: "F-2026-1182", client: "Garrigues farming co.", amount: "€48,900", status: "Transmitted", tone: "ok" },
    { ref: "F-2026-1181", client: "M. property co. · Montpellier", amount: "€62,400", status: "Awaiting payment", tone: "wait" },
  ],

  readingH2: "What the automation does in this screen.",
  readingSubtitle:
    "The dashboard above only shows data. Here is what produces it, tab by tab.",
  readings: [
    {
      tab: "Jobs",
      text: "Hardware, installation, sign-off, commissioning: four parties, four schedules, and until now four sources of truth. Each milestone reached updates the row and notifies the client. The 12 jobs awaiting sign-off are visible without anyone having to chase a status.",
    },
    {
      tab: "Qualification",
      text: "The agent calls incoming simulations and collects the six eligibility parameters before a salesperson touches them. The tenant in a block of flats leaves the pipeline in three minutes instead of taking up an appointment. That is what brings lead-to-signature down to 8 days.",
    },
    {
      tab: "Leads",
      text: "487 leads in the month, 142 genuinely usable. Complete files arrive with the net cost after grants already worked out, so the salesperson opens on a number rather than a questionnaire.",
    },
    {
      tab: "Invoicing",
      text: "Invoices follow the milestones, reminders go out on their own, and reduced VAT is applied according to each file's eligibility. Output monitoring runs alongside: the 3 open alerts across 214 systems were raised before the client called.",
    },
  ],

  ctaH2: "What would yours look like?",
  ctaSubtitle:
    "In 30 minutes we look at your lead volume, your qualification process and your installation tracking. You leave with the points where automation returns the most margin.",
  ctaButton: "Book the free audit",
  ctaReassurance: "30 minutes · Free · No commitment · Written diagnostic",
};
