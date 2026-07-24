import type { DemoCopy } from "./types";

/**
 * Textes de la démo cuisiniste.
 *
 * Les nombres cités dans la lecture commentée proviennent de la sortie réelle
 * du module de calcul en période 30 jours, pas d'une estimation.
 */

export const CUISINISTE_FR: DemoCopy = {
  metaTitle: "Dashboard cuisiniste — démo interactive",
  metaDescription:
    "Démo du tableau de bord livré à un cuisiniste : devis configurés, relances post-showroom, suivi de chantier, facturation. Données fictives, interface réelle.",
  eyebrow: "DÉMONSTRATION · CUISINISTE",
  h1: "Le tableau de bord d'un cuisiniste.",
  subtitle:
    "Voilà ce qu'un cuisiniste de 8 personnes a sous les yeux en arrivant au showroom. Devis configurés, prospects à relancer, chantiers en cours, facturation : la journée est lisible avant d'avoir ouvert un email.",

  demoBadge: "Démonstration — données fictives",
  demoNote:
    "Scénario type, pas un client existant. Toutes les données de cette page sont fictives : noms, montants, transcriptions. Les boutons réagissent mais n'envoient rien. L'interface, elle, est celle qu'on livre. Les chiffres réels sont établis pendant l'audit gratuit.",

  sections: {
    overview: "Vue d'ensemble",
    quotes: "Devis",
    calls: "Chantiers",
    leads: "Showroom",
    billing: "Facturation",
  },

  kpis: {
    openQuotes: "Devis en cours",
    signed: "Signé sur la période",
    calls: "Messages chantier traités",
    leads: "Visites et demandes",
  },

  charts: {
    signedOverTime: "Chiffre signé par période",
    quotesSentVsSigned: "Devis envoyés et signés",
    revenueMix: "Répartition du chiffre signé",
    scoreSpread: "Distribution des scores",
    sent: "Envoyés",
    signed: "Signés",
    other: "Autres",
  },

  ui: {
    rangeLabel: "Période",
    range7: "7 jours",
    range30: "30 jours",
    range90: "90 jours",
    all: "Tous",
    empty: "Aucune ligne sur cette période.",
    close: "Fermer",
    detail: "Détail",
    fictionalReminder: "Données fictives",
    rowHint: "Cliquez une ligne pour le détail",
  },

  quotesH2: "Suivi des devis",
  quotesCols: {
    client: "Client & projet",
    amount: "Montant HT",
    follow: "Relances",
    outcome: "Statut",
    age: "Envoyé",
  },
  outcomes: { win: "Signé", loss: "Perdu", pending: "En attente" },
  quoteActions: { remind: "Relancer maintenant", markWon: "Marquer signé" },
  quoteToasts: {
    remind: "Relance programmée pour demain 9h00",
    markWon: "Devis marqué signé · séquence de relance arrêtée",
  },

  callsH2: "Chantiers",
  urgentLabel: "Arbitrage requis",
  transcriptLabel: "Échange",
  callOutcomes: { handled: "Traité par l'agent", escalated: "Remonté au chargé de projet" },
  callActions: { callBack: "Programmer un rappel" },
  callToasts: { callBack: "Rappel ajouté à l'agenda · aujourd'hui 17h30" },

  leadsH2: "Visites showroom",
  scoreLabel: "Score",
  emailReadyLabel: "Relance prête à envoyer",
  leadFilters: { accepted: "Exploitables", rejected: "Écartées" },
  leadActions: { send: "Envoyer la relance", edit: "Modifier" },
  leadToasts: { send: "Relance envoyée · visite passée en suivi commercial" },

  billingH2: "Facturation & TVA",
  billingStats: {
    collected: "Encaissé",
    vat: "TVA collectée",
    outstanding: "En attente de règlement",
    overdue: "Dont en retard",
  },
  invoicesCols: {
    ref: "Référence",
    client: "Client",
    amount: "Montant HT",
    status: "Statut",
    due: "Échéance",
  },
  invoiceStatus: { paid: "Réglée", waiting: "En attente", late: "En retard" },
  invoiceActions: { remind: "Relancer le règlement" },
  invoiceToasts: { remind: "Relance de règlement envoyée · copie au comptable" },

  readingH2: "Ce que l'automatisation fait dans cet écran.",
  readingSubtitle:
    "Le tableau ci-dessus n'affiche que des données. Voilà ce qui les produit, section par section. Les chiffres cités sont ceux de la vue 30 jours.",
  readings: [
    {
      tab: "Devis",
      text: "Le commercial saisit la configuration sur tablette pendant le rendez-vous. Le devis se met en page et part avant que le client ait quitté le showroom. La séquence de relance démarre seule et s'arrête dès que le client répond : sur les 9 devis en cours, 6 sont déjà en relance programmée.",
    },
    {
      tab: "Chantiers",
      text: "« Où en êtes-vous ? » est la question qui coûte le plus cher à un chargé de projet. L'agent y répond en lisant le planning réel : 10 messages traités sur la période, 2 seulement remontés — l'arrivée d'eau non conforme et la façade laquée rayée, les deux seuls qui demandaient un vrai arbitrage.",
    },
    {
      tab: "Showroom",
      text: "Chaque visite est notée à partir de ce que le commercial a saisi. Les projets datés repartent avec une relance déjà écrite, plan joint ; les visites sans coordonnées sortent du pipeline au lieu de le gonfler. Sur 12 visites, 4 n'ont mobilisé personne.",
    },
    {
      tab: "Facturation",
      text: "L'acompte part à la signature, le solde à la réception, les relances suivent sans intervention. Le comptable reçoit l'export sans le demander. C'est aussi ce qui fait remonter les 18 300 € en retard au lieu de les laisser passer entre deux chantiers.",
    },
  ],

  ctaH2: "Le vôtre ressemblerait à quoi ?",
  ctaSubtitle:
    "En 30 minutes on regarde votre flux devis → showroom → chantier. Vous repartez avec les 2 ou 3 points où l'automatisation rend du temps tout de suite.",
  ctaButton: "Réserver l'audit gratuit",
  ctaReassurance: "30 minutes · Gratuit · Sans engagement · Diagnostic écrit",
};

export const CUISINISTE_EN: DemoCopy = {
  metaTitle: "Kitchen installer dashboard — interactive demo",
  metaDescription:
    "Demo of the dashboard we ship to a kitchen installer: configured quotes, post-showroom follow-ups, site tracking, invoicing. Fictional data, real interface.",
  eyebrow: "DEMONSTRATION · KITCHEN INSTALLER",
  h1: "A kitchen installer's dashboard.",
  subtitle:
    "This is what an eight-person kitchen installer sees on walking into the showroom. Configured quotes, prospects to chase, jobs in progress, invoicing: the day is readable before opening a single email.",

  demoBadge: "Demonstration — fictional data",
  demoNote:
    "Typical scenario, not an existing client. Every piece of data on this page is fictional: names, amounts, transcripts. The buttons respond but send nothing. The interface is the one we ship. Real figures are established during the free audit.",

  sections: {
    overview: "Overview",
    quotes: "Quotes",
    calls: "Jobs",
    leads: "Showroom",
    billing: "Invoicing",
  },

  kpis: {
    openQuotes: "Open quotes",
    signed: "Signed in period",
    calls: "Site messages handled",
    leads: "Visits and enquiries",
  },

  charts: {
    signedOverTime: "Signed revenue by period",
    quotesSentVsSigned: "Quotes sent and signed",
    revenueMix: "Signed revenue mix",
    scoreSpread: "Score distribution",
    sent: "Sent",
    signed: "Signed",
    other: "Other",
  },

  ui: {
    rangeLabel: "Period",
    range7: "7 days",
    range30: "30 days",
    range90: "90 days",
    all: "All",
    empty: "No rows in this period.",
    close: "Close",
    detail: "Detail",
    fictionalReminder: "Fictional data",
    rowHint: "Click a row for the detail",
  },

  quotesH2: "Quote tracking",
  quotesCols: {
    client: "Client & project",
    amount: "Amount excl. VAT",
    follow: "Follow-ups",
    outcome: "Status",
    age: "Sent",
  },
  outcomes: { win: "Signed", loss: "Lost", pending: "Waiting" },
  quoteActions: { remind: "Follow up now", markWon: "Mark as signed" },
  quoteToasts: {
    remind: "Follow-up scheduled for tomorrow 9:00am",
    markWon: "Quote marked signed · follow-up sequence stopped",
  },

  callsH2: "Jobs",
  urgentLabel: "Decision needed",
  transcriptLabel: "Exchange",
  callOutcomes: { handled: "Handled by the agent", escalated: "Raised to the project manager" },
  callActions: { callBack: "Schedule a call back" },
  callToasts: { callBack: "Call back added to the calendar · today 5:30pm" },

  leadsH2: "Showroom visits",
  scoreLabel: "Score",
  emailReadyLabel: "Follow-up ready to send",
  leadFilters: { accepted: "Workable", rejected: "Discarded" },
  leadActions: { send: "Send the follow-up", edit: "Edit" },
  leadToasts: { send: "Follow-up sent · visit moved to sales tracking" },

  billingH2: "Invoicing & VAT",
  billingStats: {
    collected: "Collected",
    vat: "VAT collected",
    outstanding: "Awaiting payment",
    overdue: "Of which overdue",
  },
  invoicesCols: {
    ref: "Reference",
    client: "Client",
    amount: "Amount excl. VAT",
    status: "Status",
    due: "Due",
  },
  invoiceStatus: { paid: "Paid", waiting: "Awaiting", late: "Overdue" },
  invoiceActions: { remind: "Chase payment" },
  invoiceToasts: { remind: "Payment reminder sent · copied to the accountant" },

  readingH2: "What the automation does in this screen.",
  readingSubtitle:
    "The dashboard above only shows data. Here is what produces it, section by section. The figures quoted are those of the 30-day view.",
  readings: [
    {
      tab: "Quotes",
      text: "The salesperson enters the configuration on a tablet during the meeting. The quote is laid out and sent before the client has left the showroom. The follow-up sequence starts on its own and stops as soon as the client replies: of the 9 open quotes, 6 are already in a scheduled sequence.",
    },
    {
      tab: "Jobs",
      text: "\"Where are you up to?\" is the question that costs a project manager the most. The agent answers it by reading the actual schedule: 10 messages handled over the period, only 2 escalated — the mismatched water inlet and the scratched lacquered front, the only two that needed a real decision.",
    },
    {
      tab: "Showroom",
      text: "Every visit is scored from what the salesperson entered. Dated projects leave with a follow-up already written, plan attached; visits with no contact details drop out of the pipeline instead of inflating it. Of 12 visits, 4 tied up nobody.",
    },
    {
      tab: "Invoicing",
      text: "The deposit goes out on signature, the balance on handover, the reminders follow without anyone acting. The accountant gets the export without asking. It is also what surfaces the €18,300 overdue instead of letting it slip between two jobs.",
    },
  ],

  ctaH2: "What would yours look like?",
  ctaSubtitle:
    "In 30 minutes we look at your quote → showroom → site flow. You leave with the 2 or 3 points where automation gives time back straight away.",
  ctaButton: "Book the free audit",
  ctaReassurance: "30 minutes · Free · No commitment · Written diagnostic",
};
