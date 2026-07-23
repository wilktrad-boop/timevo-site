import type { DemoDashboard } from "./types";

/**
 * Cuisiniste. DONNÉES ENTIÈREMENT FICTIVES.
 *
 * Le vocabulaire suit celui de la page secteur (lib/sectors.ts) : devis
 * configurés à 40 paramètres, prospects perdus après le showroom, chantier
 * multi-corps de métier qui déclenche 20 SMS par jour.
 */

export const CUISINISTE_FR: DemoDashboard = {
  metaTitle: "Dashboard cuisiniste — démo interactive",
  metaDescription:
    "Démo du tableau de bord livré à un cuisiniste : devis configurés, relances post-showroom, suivi de chantier, facturation. Données fictives, interface réelle.",
  eyebrow: "DÉMONSTRATION · CUISINISTE",
  h1: "Le tableau de bord d'un cuisiniste.",
  subtitle:
    "Voilà ce qu'un cuisiniste de 8 personnes a sous les yeux en arrivant au showroom. Devis configurés, prospects à relancer, chantiers en cours, facturation : la journée est lisible avant d'avoir ouvert un email.",

  demoBadge: "Démonstration — données fictives",
  demoNote:
    "Scénario type, pas un client existant. Toutes les données de cette page sont fictives : noms, montants, transcriptions. L'interface, elle, est celle qu'on livre. Les chiffres réels sont établis pendant l'audit gratuit.",

  tabs: ["Devis", "Chantiers", "Showroom", "Facturation"],

  kpis: [
    { value: "23", label: "Devis en cours", detail: "9 en relance programmée" },
    { value: "14 min", label: "Délai moyen de devis", detail: "après sortie du showroom" },
    { value: "18", label: "Messages chantier traités", detail: "31 reçus cette semaine" },
    { value: "31", label: "Visites showroom", detail: "22 avec coordonnées · 9 sans" },
  ],

  quotesH2: "Suivi des devis",
  quotesMeta: "5 devis · 30 derniers jours",
  quotesCols: { client: "Client & projet", amount: "Montant HT", follow: "Relances", outcome: "Statut" },
  quotes: [
    {
      client: "Famille V. · Écully",
      project: "Cuisine en L, 14 caissons, plan quartz",
      amount: "18 400 €",
      steps: [
        { label: "Envoyé", state: "done" },
        { label: "J+2", state: "done" },
        { label: "J+7", state: "done" },
      ],
      outcome: { label: "Signé", tone: "win" },
    },
    {
      client: "M. G. · Tassin",
      project: "Îlot central + électroménager encastré",
      amount: "24 900 €",
      steps: [
        { label: "Envoyé", state: "done" },
        { label: "J+2", state: "done" },
        { label: "J+7", state: "active" },
      ],
      outcome: { label: "En attente", tone: "pending" },
    },
    {
      client: "Mme P. · Villeurbanne",
      project: "Rénovation façades, plan inchangé",
      amount: "7 200 €",
      steps: [
        { label: "Envoyé", state: "done" },
        { label: "J+2", state: "done" },
        { label: "J+15", state: "done" },
      ],
      outcome: { label: "Perdu", tone: "loss" },
    },
    {
      client: "SCI B. · Lyon 6e",
      project: "3 cuisines identiques, programme locatif",
      amount: "41 700 €",
      steps: [
        { label: "Envoyé", state: "done" },
        { label: "J+2", state: "active" },
        { label: "J+7", state: "pending" },
      ],
      outcome: { label: "En attente", tone: "pending" },
    },
    {
      client: "M. et Mme C. · Charbonnières",
      project: "Cuisine ouverte + cellier",
      amount: "29 300 €",
      steps: [
        { label: "Envoyé", state: "done" },
        { label: "J+2", state: "done" },
        { label: "J+7", state: "pending" },
      ],
      outcome: { label: "Signé", tone: "win" },
    },
  ],

  callsH2: "Chantiers",
  callsMeta: "3 échanges · dernier : aujourd'hui 11:24",
  urgentLabel: "Arbitrage requis",
  transcriptLabel: "Voir l'échange",
  calls: [
    {
      from: "Famille V. · Écully",
      at: "Aujourd'hui · 11:24",
      summary:
        "Demande d'avancement à J+12 de la pose. L'agent a répondu avec le jalon en cours et la date de fin prévue, sans solliciter le chargé de projet.",
      transcript: [
        { who: "client", text: "Bonjour, où en est le chantier ? On devait avoir le plan de travail cette semaine." },
        { who: "ia", text: "Bonjour. Les caissons sont posés depuis mardi. Le marbrier est passé prendre le gabarit jeudi." },
        { who: "client", text: "Et la pose du quartz, c'est quand ?" },
        { who: "ia", text: "Sous 8 jours ouvrés après le gabarit, soit au plus tard le 12. L'électricien repasse ensuite pour les raccordements." },
        { who: "client", text: "Parfait, merci." },
        { who: "ia", text: "Je vous envoie une photo à chaque étape. Bonne journée." },
      ],
      action: "Traité · aucune action",
    },
    {
      from: "M. et Mme C. · Charbonnières",
      at: "Aujourd'hui · 09:05",
      summary:
        "Le plombier signale une arrivée d'eau non conforme au plan. Décalage de pose probable : l'agent n'a pas tranché et a remonté le dossier.",
      urgent: true,
      transcript: [
        { who: "client", text: "Le plombier dit que l'arrivée d'eau n'est pas là où c'est marqué sur le plan." },
        { who: "ia", text: "Je vérifie… le plan de pose date du 3, la visite technique du 28. L'écart est réel." },
        { who: "client", text: "Ça décale la pose ?" },
        { who: "ia", text: "Probablement, mais c'est une décision de chantier. Je transmets à votre chargé de projet avec les deux plans, il vous rappelle avant midi." },
      ],
      action: "Escaladé · chargé de projet notifié",
    },
    {
      from: "SCI B. · Lyon 6e",
      at: "Hier · 16:40",
      summary: "Question sur le délai de livraison des trois cuisines du programme. Réponse donnée, pas de suite nécessaire.",
      transcript: [
        { who: "client", text: "Les trois cuisines sont livrées en même temps ou étalées ?" },
        { who: "ia", text: "Livraison groupée prévue semaine 12, pose étalée sur trois semaines pour ne mobiliser qu'une équipe." },
        { who: "client", text: "D'accord, ça me va." },
      ],
      action: "Traité · aucune action",
    },
  ],

  leadsH2: "Visites showroom",
  leadsMeta: "3 visites · triées par score",
  scoreLabel: "Sérieux",
  emailReadyLabel: "Relance prête à envoyer",
  sendLabel: "Envoyer l'email",
  editLabel: "Modifier",
  leads: [
    {
      name: "A. Ruiz · Sainte-Foy",
      request: "Cuisine ouverte 16 m², maison en cours d'achat, emménagement prévu dans 4 mois. Repartie avec un plan 3D.",
      score: 88,
      verdict: "Projet daté, budget évoqué en showroom, plan déjà réalisé.",
      email: {
        subject: "Votre plan 3D — cuisine ouverte 16 m²",
        body:
          "Bonjour,\n\nMerci pour votre visite. Vous trouverez le plan 3D en pièce jointe, dans la configuration qu'on a arrêtée ensemble : îlot déporté et cellier au fond.\n\nUn point à trancher avant le chiffrage définitif : le plan de travail. Le stratifié tient dans votre enveloppe, le quartz la dépasse d'environ 2 200 €.\n\nVous voulez que je chiffre les deux ?",
      },
    },
    {
      name: "T. Amrani · Dardilly",
      request: "Remplacement des façades sur caissons existants, pas de modification de plan.",
      score: 64,
      verdict: "Besoin clair, mais pas d'échéance et budget non abordé.",
      email: {
        subject: "Remplacement de façades — votre visite de mardi",
        body:
          "Bonjour,\n\nPour chiffrer un remplacement de façades sans toucher aux caissons, il me manque deux choses : les dimensions relevées et la marque des caissons d'origine.\n\nSi vous m'envoyez trois photos avec un mètre déplié, je vous fais un chiffrage sous 48 h. Pas besoin de repasser au showroom.",
      },
    },
    {
      name: "Visite sans coordonnées",
      request: "Passage de 10 minutes, aucune fiche renseignée, aucun contact laissé.",
      score: 9,
      verdict: "Rien d'exploitable, pas de moyen de recontact.",
      rejected: "Écartée automatiquement — comptée dans la fréquentation, exclue du pipeline commercial.",
    },
  ],

  billingH2: "Facturation & TVA",
  billingMeta: "Période en cours · 4 factures",
  billingStats: [
    { label: "CA encaissé ce mois", value: "112 800 €" },
    { label: "TVA collectée", value: "22 560 €" },
    { label: "En attente de règlement", value: "18 300 €" },
    { label: "Retard > 30 jours", value: "0 €" },
  ],
  splitLabel: "Répartition du chiffre",
  split: [
    { label: "Particuliers", value: 64, color: "var(--accent)" },
    { label: "Promoteurs & SCI", value: 29, color: "var(--accent-soft)" },
    { label: "Rénovation partielle", value: 7, color: "var(--dim-2)" },
  ],
  invoicesCols: { ref: "Référence", client: "Client", amount: "Montant TTC", status: "Transmission" },
  invoices: [
    { ref: "F-2026-0912", client: "Famille V. · Écully", amount: "22 080 €", status: "Transmise", tone: "ok" },
    { ref: "F-2026-0911", client: "M. et Mme C. · Charbonnières", amount: "35 160 €", status: "Transmise", tone: "ok" },
    { ref: "F-2026-0910", client: "Mme L. · Craponne", amount: "9 840 €", status: "Transmise", tone: "ok" },
    { ref: "F-2026-0909", client: "SCI B. · Lyon 6e", amount: "18 300 €", status: "En attente de règlement", tone: "wait" },
  ],

  readingH2: "Ce que l'automatisation fait dans cet écran.",
  readingSubtitle:
    "Le tableau ci-dessus n'affiche que des données. Voilà ce qui les produit, onglet par onglet.",
  readings: [
    {
      tab: "Devis",
      text: "Le commercial saisit la configuration sur tablette pendant le rendez-vous. Le devis se met en page et part avant que le client ait quitté le showroom — d'où les 14 minutes de délai moyen. La séquence de relance démarre seule et s'arrête dès que le client répond.",
    },
    {
      tab: "Chantiers",
      text: "« Où en êtes-vous ? » est la question qui coûte le plus cher à un chargé de projet. L'agent y répond en lisant le planning réel : 18 messages traités sur 31 cette semaine, un seul remonté — celui qui demandait un vrai arbitrage sur l'arrivée d'eau.",
    },
    {
      tab: "Showroom",
      text: "Chaque visite est notée à partir de ce que le commercial a saisi. Les projets datés repartent avec une relance déjà écrite, plan joint ; les visites sans coordonnées sortent du pipeline au lieu de le gonfler. Ici 22 visites exploitables sur 31.",
    },
    {
      tab: "Facturation",
      text: "L'acompte part à la signature, le solde à la réception, les relances suivent sans intervention. Le comptable reçoit l'export sans le demander — c'est ce qui explique la ligne à 0 € de retard au-delà de 30 jours.",
    },
  ],

  ctaH2: "Le vôtre ressemblerait à quoi ?",
  ctaSubtitle:
    "En 30 minutes on regarde votre flux devis → showroom → chantier. Vous repartez avec les 2 ou 3 points où l'automatisation rend du temps tout de suite.",
  ctaButton: "Réserver l'audit gratuit",
  ctaReassurance: "30 minutes · Gratuit · Sans engagement · Diagnostic écrit",
};

export const CUISINISTE_EN: DemoDashboard = {
  metaTitle: "Kitchen installer dashboard — interactive demo",
  metaDescription:
    "Demo of the dashboard we deliver to a kitchen installer: configured quotes, showroom follow-up, project tracking, invoicing. Fictional data, real interface.",
  eyebrow: "DEMO · KITCHEN INSTALLERS",
  h1: "A kitchen installer's dashboard.",
  subtitle:
    "This is what an 8-person kitchen installer sees on walking into the showroom. Configured quotes, prospects to chase, live projects, invoicing: the day is readable before a single email is opened.",

  demoBadge: "Demonstration — fictional data",
  demoNote:
    "Typical scenario, not an existing client. Every figure on this page is fictional: names, amounts, transcripts. The interface is the one we ship. Real numbers come out of the free audit.",

  tabs: ["Quotes", "Projects", "Showroom", "Invoicing"],

  kpis: [
    { value: "23", label: "Open quotes", detail: "9 in scheduled follow-up" },
    { value: "14 min", label: "Average quote turnaround", detail: "after leaving the showroom" },
    { value: "18", label: "Project messages handled", detail: "31 received this week" },
    { value: "31", label: "Showroom visits", detail: "22 with contact details · 9 without" },
  ],

  quotesH2: "Quote tracking",
  quotesMeta: "5 quotes · last 30 days",
  quotesCols: { client: "Client & project", amount: "Amount excl. VAT", follow: "Follow-ups", outcome: "Status" },
  quotes: [
    {
      client: "V. family · Écully",
      project: "L-shaped kitchen, 14 units, quartz worktop",
      amount: "€18,400",
      steps: [
        { label: "Sent", state: "done" },
        { label: "D+2", state: "done" },
        { label: "D+7", state: "done" },
      ],
      outcome: { label: "Signed", tone: "win" },
    },
    {
      client: "Mr G. · Tassin",
      project: "Central island + built-in appliances",
      amount: "€24,900",
      steps: [
        { label: "Sent", state: "done" },
        { label: "D+2", state: "done" },
        { label: "D+7", state: "active" },
      ],
      outcome: { label: "Pending", tone: "pending" },
    },
    {
      client: "Ms P. · Villeurbanne",
      project: "Door fronts only, layout unchanged",
      amount: "€7,200",
      steps: [
        { label: "Sent", state: "done" },
        { label: "D+2", state: "done" },
        { label: "D+15", state: "done" },
      ],
      outcome: { label: "Lost", tone: "loss" },
    },
    {
      client: "B. property co. · Lyon 6",
      project: "3 identical kitchens, rental scheme",
      amount: "€41,700",
      steps: [
        { label: "Sent", state: "done" },
        { label: "D+2", state: "active" },
        { label: "D+7", state: "pending" },
      ],
      outcome: { label: "Pending", tone: "pending" },
    },
    {
      client: "Mr & Mrs C. · Charbonnières",
      project: "Open kitchen + utility room",
      amount: "€29,300",
      steps: [
        { label: "Sent", state: "done" },
        { label: "D+2", state: "done" },
        { label: "D+7", state: "pending" },
      ],
      outcome: { label: "Signed", tone: "win" },
    },
  ],

  callsH2: "Projects",
  callsMeta: "3 threads · latest: today 11:24",
  urgentLabel: "Decision needed",
  transcriptLabel: "View thread",
  calls: [
    {
      from: "V. family · Écully",
      at: "Today · 11:24",
      summary:
        "Progress request on day 12 of the fit. The agent answered with the current milestone and the expected finish date, without involving the project manager.",
      transcript: [
        { who: "client", text: "Hello, how's the job going? The worktop was due this week." },
        { who: "ia", text: "Hello. The units have been in since Tuesday. The stone fitter took the template on Thursday." },
        { who: "client", text: "And when does the quartz go in?" },
        { who: "ia", text: "Within 8 working days of templating, so the 12th at the latest. The electrician comes back after that for the connections." },
        { who: "client", text: "Great, thanks." },
        { who: "ia", text: "I'll send a photo at each stage. Have a good day." },
      ],
      action: "Handled · no action",
    },
    {
      from: "Mr & Mrs C. · Charbonnières",
      at: "Today · 09:05",
      summary:
        "The plumber reports a water inlet that doesn't match the drawing. Likely delay to the fit: the agent did not decide and escalated instead.",
      urgent: true,
      transcript: [
        { who: "client", text: "The plumber says the water inlet isn't where the drawing shows it." },
        { who: "ia", text: "Checking… the fitting drawing is dated the 3rd, the site survey the 28th. The discrepancy is real." },
        { who: "client", text: "Does that push the fit back?" },
        { who: "ia", text: "Probably, but that's a site decision. I'm passing it to your project manager with both drawings, they'll call you before midday." },
      ],
      action: "Escalated · project manager notified",
    },
    {
      from: "B. property co. · Lyon 6",
      at: "Yesterday · 16:40",
      summary: "Question about delivery timing for the three kitchens in the scheme. Answered, no follow-up needed.",
      transcript: [
        { who: "client", text: "Are the three kitchens delivered together or staggered?" },
        { who: "ia", text: "Grouped delivery in week 12, fitting staggered over three weeks so only one crew is tied up." },
        { who: "client", text: "Fine by me." },
      ],
      action: "Handled · no action",
    },
  ],

  leadsH2: "Showroom visits",
  leadsMeta: "3 visits · sorted by score",
  scoreLabel: "Quality",
  emailReadyLabel: "Follow-up ready to send",
  sendLabel: "Send email",
  editLabel: "Edit",
  leads: [
    {
      name: "A. Ruiz · Sainte-Foy",
      request: "Open kitchen, 16 m², house purchase under way, moving in within 4 months. Left with a 3D plan.",
      score: 88,
      verdict: "Dated project, budget discussed in the showroom, plan already drawn.",
      email: {
        subject: "Your 3D plan — 16 m² open kitchen",
        body:
          "Hello,\n\nThanks for coming in. The 3D plan is attached, in the layout we settled on: offset island and utility room at the back.\n\nOne thing to decide before the final quote: the worktop. Laminate fits your budget, quartz goes about €2,200 over it.\n\nWould you like me to price both?",
      },
    },
    {
      name: "T. Amrani · Dardilly",
      request: "Replacement door fronts on existing units, no layout change.",
      score: 64,
      verdict: "Clear need, but no deadline and budget not discussed.",
      email: {
        subject: "Replacement fronts — your visit on Tuesday",
        body:
          "Hello,\n\nTo price replacement fronts without touching the units, I need two things: measured dimensions and the make of the original units.\n\nSend me three photos with a tape measure extended and I'll price it within 48 hours. No need to come back in.",
      },
    },
    {
      name: "Visit without contact details",
      request: "Ten-minute walk-through, no form filled in, no contact left.",
      score: 9,
      verdict: "Nothing usable, no way to get back in touch.",
      rejected: "Discarded automatically — counted in footfall, excluded from the sales pipeline.",
    },
  ],

  billingH2: "Invoicing & VAT",
  billingMeta: "Current period · 4 invoices",
  billingStats: [
    { label: "Revenue collected", value: "€112,800" },
    { label: "VAT collected", value: "€22,560" },
    { label: "Awaiting payment", value: "€18,300" },
    { label: "Overdue > 30 days", value: "€0" },
  ],
  splitLabel: "Revenue split",
  split: [
    { label: "Consumers", value: 64, color: "var(--accent)" },
    { label: "Developers & property cos.", value: 29, color: "var(--accent-soft)" },
    { label: "Partial refits", value: 7, color: "var(--dim-2)" },
  ],
  invoicesCols: { ref: "Reference", client: "Client", amount: "Amount incl. VAT", status: "Transmission" },
  invoices: [
    { ref: "F-2026-0912", client: "V. family · Écully", amount: "€22,080", status: "Transmitted", tone: "ok" },
    { ref: "F-2026-0911", client: "Mr & Mrs C. · Charbonnières", amount: "€35,160", status: "Transmitted", tone: "ok" },
    { ref: "F-2026-0910", client: "Ms L. · Craponne", amount: "€9,840", status: "Transmitted", tone: "ok" },
    { ref: "F-2026-0909", client: "B. property co. · Lyon 6", amount: "€18,300", status: "Awaiting payment", tone: "wait" },
  ],

  readingH2: "What the automation does in this screen.",
  readingSubtitle:
    "The dashboard above only shows data. Here is what produces it, tab by tab.",
  readings: [
    {
      tab: "Quotes",
      text: "The salesperson enters the configuration on a tablet during the appointment. The quote is laid out and sent before the client has left the showroom — hence the 14-minute average. The follow-up sequence starts on its own and stops as soon as the client replies.",
    },
    {
      tab: "Projects",
      text: "\"How's it going?\" is the question that costs a project manager the most. The agent answers it by reading the live schedule: 18 messages handled out of 31 this week, with one escalated — the one that needed a real decision about the water inlet.",
    },
    {
      tab: "Showroom",
      text: "Every visit is scored from what the salesperson recorded. Dated projects leave with a follow-up already written and the plan attached; visits with no contact details drop out of the pipeline instead of inflating it. Here, 22 usable visits out of 31.",
    },
    {
      tab: "Invoicing",
      text: "The deposit goes out on signature, the balance on handover, and the reminders follow without anyone touching them. The accountant gets the export without asking — which is why the overdue line sits at €0 beyond 30 days.",
    },
  ],

  ctaH2: "What would yours look like?",
  ctaSubtitle:
    "In 30 minutes we map your quote → showroom → project flow. You leave with the 2 or 3 points where automation gives time back straight away.",
  ctaButton: "Book the free audit",
  ctaReassurance: "30 minutes · Free · No commitment · Written diagnostic",
};
