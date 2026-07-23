import type { DemoDashboard } from "./types";

/**
 * Pisciniste. DONNÉES ENTIÈREMENT FICTIVES.
 *
 * Le vocabulaire suit celui de la page secteur (lib/sectors.ts) : saison qui
 * sature, devis à J+10, hivernages oubliés, financement multi-acteurs.
 */

export const PISCINISTE_FR: DemoDashboard = {
  metaTitle: "Dashboard pisciniste — démo interactive",
  metaDescription:
    "Démo du tableau de bord livré à un pisciniste : suivi des devis, agent IA téléphonique, demandes qualifiées, facturation. Données fictives, interface réelle.",
  eyebrow: "DÉMONSTRATION · PISCINISTE",
  h1: "Le tableau de bord d'un pisciniste.",
  subtitle:
    "Voilà ce qu'un pisciniste de 12 personnes a sous les yeux le lundi matin, une fois les workflows en place. Devis, appels, demandes entrantes, facturation : tout au même endroit, mis à jour sans personne pour le faire.",

  demoBadge: "Démonstration — données fictives",
  demoNote:
    "Scénario type, pas un client existant. Toutes les données de cette page sont fictives : noms, montants, transcriptions. L'interface, elle, est celle qu'on livre. Les chiffres réels sont établis pendant l'audit gratuit.",

  tabs: ["Devis", "Appels", "Demandes", "Facturation"],

  kpis: [
    { value: "14", label: "Devis en cours", detail: "6 en relance programmée" },
    { value: "8 400 €", label: "Signé ce mois", detail: "2 devis" },
    { value: "11", label: "Appels traités", detail: "26 reçus depuis lundi" },
    { value: "23", label: "Demandes reçues", detail: "18 qualifiées · 5 écartées" },
  ],

  quotesH2: "Suivi des devis",
  quotesMeta: "5 devis · 30 derniers jours",
  quotesCols: { client: "Client & projet", amount: "Montant HT", follow: "Relances", outcome: "Statut" },
  quotes: [
    {
      client: "Famille M. · Publier",
      project: "Coque 8×4 + local technique",
      amount: "32 400 €",
      steps: [
        { label: "Envoyé", state: "done" },
        { label: "J+3", state: "done" },
        { label: "J+7", state: "done" },
      ],
      outcome: { label: "Signé", tone: "win" },
    },
    {
      client: "M. B. · Thonon-les-Bains",
      project: "Rénovation liner + margelles",
      amount: "11 800 €",
      steps: [
        { label: "Envoyé", state: "done" },
        { label: "J+3", state: "done" },
        { label: "J+7", state: "active" },
      ],
      outcome: { label: "En attente", tone: "pending" },
    },
    {
      client: "Mme D. · Évian",
      project: "Abri télescopique bas",
      amount: "9 200 €",
      steps: [
        { label: "Envoyé", state: "done" },
        { label: "J+3", state: "done" },
        { label: "J+7", state: "done" },
      ],
      outcome: { label: "Perdu", tone: "loss" },
    },
    {
      client: "SCI L. · Annemasse",
      project: "Bassin béton 10×5 + PAC",
      amount: "48 700 €",
      steps: [
        { label: "Envoyé", state: "done" },
        { label: "J+3", state: "active" },
        { label: "J+7", state: "pending" },
      ],
      outcome: { label: "En attente", tone: "pending" },
    },
    {
      client: "M. et Mme R. · Douvaine",
      project: "Contrat entretien annuel",
      amount: "1 140 €",
      steps: [
        { label: "Envoyé", state: "done" },
        { label: "J+3", state: "done" },
        { label: "J+7", state: "pending" },
      ],
      outcome: { label: "Signé", tone: "win" },
    },
  ],

  callsH2: "Appels",
  callsMeta: "3 appels · dernier : aujourd'hui 09:12",
  urgentLabel: "À rappeler",
  transcriptLabel: "Voir la transcription",
  calls: [
    {
      from: "06 •• •• 41 22",
      at: "Aujourd'hui · 09:12",
      summary:
        "Demande de devis pour une coque 7×3,5 avec terrasse. Terrain accessible, projet pour le printemps prochain.",
      transcript: [
        { who: "ia", text: "Bonjour, vous êtes bien chez votre pisciniste. Que puis-je faire pour vous ?" },
        { who: "client", text: "Bonjour, je voudrais un devis pour une piscine, une coque je pense, dans les 7 mètres." },
        { who: "ia", text: "Très bien. Vous avez une idée de la largeur, et le terrain est accessible pour un camion-grue ?" },
        { who: "client", text: "7 sur 3,5 à peu près. Oui, l'accès est large, c'est un terrain plat." },
        { who: "ia", text: "Parfait. Vous visez quelle période pour les travaux ?" },
        { who: "client", text: "Le printemps prochain, on n'est pas pressés." },
        { who: "ia", text: "Je note tout ça. Un commercial vous rappelle sous 24 h pour caler une visite. Bonne journée." },
      ],
      action: "Visite technique à planifier",
    },
    {
      from: "04 •• •• 08 76",
      at: "Aujourd'hui · 08:41",
      summary:
        "Client sous contrat d'entretien. Pompe qui siffle et perte de pression depuis deux jours. L'agent a écarté les causes simples.",
      urgent: true,
      transcript: [
        { who: "client", text: "La pompe fait un bruit anormal depuis avant-hier, et j'ai moins de pression." },
        { who: "ia", text: "Je vérifie votre contrat… vous êtes bien couvert. Le panier du préfiltre est propre ?" },
        { who: "client", text: "Oui, je l'ai vidé hier, ça n'a rien changé." },
        { who: "ia", text: "Et le niveau d'eau, il est au-dessus du milieu des skimmers ?" },
        { who: "client", text: "Oui, niveau normal." },
        { who: "ia", text: "Alors ce n'est pas un désamorçage. Je passe le dossier en intervention, un technicien vous rappelle ce matin." },
      ],
      action: "SAV sous contrat · escaladé",
    },
    {
      from: "07 •• •• 93 04",
      at: "Hier · 17:55",
      summary: "Question sur le tarif d'un hivernage passif pour un bassin de 32 m². Réponse donnée, pas de suite nécessaire.",
      transcript: [
        { who: "client", text: "Bonsoir, c'est combien un hivernage pour une piscine de 8 sur 4 ?" },
        { who: "ia", text: "Pour un bassin de cette taille, l'hivernage passif est à 290 € TTC, produits compris." },
        { who: "client", text: "D'accord, et ça se fait quand ?" },
        { who: "ia", text: "Entre mi-octobre et fin novembre, dès que l'eau passe sous 12 °C. Je vous envoie le détail par SMS ?" },
        { who: "client", text: "Oui, merci." },
      ],
      action: "Traité · aucune action",
    },
  ],

  leadsH2: "Demandes du formulaire",
  leadsMeta: "3 demandes · triées par score",
  scoreLabel: "Sérieux",
  emailReadyLabel: "Réponse prête à envoyer",
  sendLabel: "Envoyer l'email",
  editLabel: "Modifier",
  leads: [
    {
      name: "C. Vernier · Sciez",
      request: "Bassin 9×4 enterré, terrain en pente, projet financé, travaux souhaités avant juin.",
      score: 92,
      verdict: "Projet cadré, budget confirmé, échéance claire.",
      email: {
        subject: "Votre projet de bassin 9×4 à Sciez",
        body:
          "Bonjour,\n\nMerci pour votre demande. Un bassin de 9×4 sur terrain en pente demande une étude de soutènement : c'est le premier point qu'on regardera ensemble sur place.\n\nPour tenir une mise en eau avant juin, il faut caler la visite technique dans les trois semaines. Je vous propose mardi ou jeudi prochain en fin de journée.\n\nQuel créneau vous arrange ?",
      },
    },
    {
      name: "L. Ferrand · Bons-en-Chablais",
      request: "Remplacement de liner sur bassin 8×4 de 2009, plus reprise des margelles.",
      score: 78,
      verdict: "Besoin précis, mais pas d'échéance ni de budget donné.",
      email: {
        subject: "Remplacement de liner — bassin 8×4",
        body:
          "Bonjour,\n\nSur un bassin de 2009, le liner arrive en effet en fin de vie. Avant de chiffrer, deux questions : le support est-il en béton ou en panneaux, et avez-vous constaté des fuites cette saison ?\n\nAvec ces deux réponses je vous envoie une fourchette sous 48 h, margelles comprises.",
      },
    },
    {
      name: "Demande anonyme",
      request: "« combien coute une piscine »",
      score: 12,
      verdict: "Aucune information exploitable, coordonnées incomplètes.",
      rejected: "Écartée automatiquement — relance légère programmée à J+2 pour obtenir les manquants.",
    },
  ],

  billingH2: "Facturation & TVA",
  billingMeta: "Période en cours · 4 factures",
  billingStats: [
    { label: "CA encaissé ce mois", value: "94 200 €" },
    { label: "TVA collectée", value: "18 840 €" },
    { label: "En attente de règlement", value: "12 600 €" },
    { label: "Retard > 30 jours", value: "0 €" },
  ],
  splitLabel: "Répartition du chiffre",
  split: [
    { label: "Particuliers", value: 72, color: "var(--accent)" },
    { label: "Professionnels", value: 21, color: "var(--accent-soft)" },
    { label: "Contrats d'entretien", value: 7, color: "var(--dim-2)" },
  ],
  invoicesCols: { ref: "Référence", client: "Client", amount: "Montant TTC", status: "Transmission" },
  invoices: [
    { ref: "F-2026-0418", client: "Famille M. · Publier", amount: "38 880 €", status: "Transmise", tone: "ok" },
    { ref: "F-2026-0417", client: "SCI L. · Annemasse", amount: "14 400 €", status: "Transmise", tone: "ok" },
    { ref: "F-2026-0416", client: "M. et Mme R. · Douvaine", amount: "1 368 €", status: "Transmise", tone: "ok" },
    { ref: "F-2026-0415", client: "Camping des Rives", amount: "12 600 €", status: "En attente de règlement", tone: "wait" },
  ],

  readingH2: "Ce que l'automatisation fait dans cet écran.",
  readingSubtitle:
    "Le tableau ci-dessus n'affiche que des données. Voilà ce qui les produit, onglet par onglet.",
  readings: [
    {
      tab: "Devis",
      text: "Chaque devis part avec sa séquence de relance. Personne ne la déclenche à la main, et personne n'oublie de la couper quand le client répond. Les 8 400 € signés ce mois viennent de deux devis relancés à J+7 : sans la séquence, ils seraient restés sans réponse.",
    },
    {
      tab: "Appels",
      text: "En saison, l'agent prend les appels que personne n'a le temps de prendre. Il qualifie, il résume, et il ne dérange un humain que quand ça le mérite : ici 11 appels traités sur 26, dont un seul escaladé en SAV.",
    },
    {
      tab: "Demandes",
      text: "Chaque demande est notée avant d'arriver chez vous. Celles qui tiennent la route arrivent avec une réponse déjà écrite ; les autres ne vous font pas perdre de temps. Sur 23 demandes, 5 n'ont jamais atteint un commercial.",
    },
    {
      tab: "Facturation",
      text: "Les factures partent, les relances aussi, et la TVA se calcule au fil de l'eau. Le comptable reçoit l'export sans le demander — c'est ce qui explique la ligne à 0 € de retard au-delà de 30 jours.",
    },
  ],

  ctaH2: "Le vôtre ressemblerait à quoi ?",
  ctaSubtitle:
    "En 30 minutes on regarde votre volume d'appels, votre délai de devis et votre récurrence d'entretien. Vous repartez avec la liste des workflows qui paient avant la prochaine saison.",
  ctaButton: "Réserver l'audit gratuit",
  ctaReassurance: "30 minutes · Gratuit · Sans engagement · Diagnostic écrit",
};

export const PISCINISTE_EN: DemoDashboard = {
  metaTitle: "Pool builder dashboard — interactive demo",
  metaDescription:
    "Demo of the dashboard we deliver to a pool builder: quote tracking, AI phone agent, qualified enquiries, invoicing. Fictional data, real interface.",
  eyebrow: "DEMO · POOL BUILDERS",
  h1: "A pool builder's dashboard.",
  subtitle:
    "This is what a 12-person pool builder sees on Monday morning once the workflows are running. Quotes, calls, incoming enquiries, invoicing — all in one place, updated without anyone doing it.",

  demoBadge: "Demonstration — fictional data",
  demoNote:
    "Typical scenario, not an existing client. Every figure on this page is fictional: names, amounts, transcripts. The interface is the one we ship. Real numbers come out of the free audit.",

  tabs: ["Quotes", "Calls", "Enquiries", "Invoicing"],

  kpis: [
    { value: "14", label: "Open quotes", detail: "6 in scheduled follow-up" },
    { value: "€8,400", label: "Signed this month", detail: "2 quotes" },
    { value: "11", label: "Calls handled", detail: "26 received since Monday" },
    { value: "23", label: "Enquiries received", detail: "18 qualified · 5 discarded" },
  ],

  quotesH2: "Quote tracking",
  quotesMeta: "5 quotes · last 30 days",
  quotesCols: { client: "Client & project", amount: "Amount excl. VAT", follow: "Follow-ups", outcome: "Status" },
  quotes: [
    {
      client: "M. family · Publier",
      project: "8×4 shell + plant room",
      amount: "€32,400",
      steps: [
        { label: "Sent", state: "done" },
        { label: "D+3", state: "done" },
        { label: "D+7", state: "done" },
      ],
      outcome: { label: "Signed", tone: "win" },
    },
    {
      client: "Mr B. · Thonon-les-Bains",
      project: "Liner and coping renovation",
      amount: "€11,800",
      steps: [
        { label: "Sent", state: "done" },
        { label: "D+3", state: "done" },
        { label: "D+7", state: "active" },
      ],
      outcome: { label: "Pending", tone: "pending" },
    },
    {
      client: "Ms D. · Évian",
      project: "Low telescopic enclosure",
      amount: "€9,200",
      steps: [
        { label: "Sent", state: "done" },
        { label: "D+3", state: "done" },
        { label: "D+7", state: "done" },
      ],
      outcome: { label: "Lost", tone: "loss" },
    },
    {
      client: "L. property co. · Annemasse",
      project: "10×5 concrete pool + heat pump",
      amount: "€48,700",
      steps: [
        { label: "Sent", state: "done" },
        { label: "D+3", state: "active" },
        { label: "D+7", state: "pending" },
      ],
      outcome: { label: "Pending", tone: "pending" },
    },
    {
      client: "Mr & Mrs R. · Douvaine",
      project: "Annual maintenance contract",
      amount: "€1,140",
      steps: [
        { label: "Sent", state: "done" },
        { label: "D+3", state: "done" },
        { label: "D+7", state: "pending" },
      ],
      outcome: { label: "Signed", tone: "win" },
    },
  ],

  callsH2: "Calls",
  callsMeta: "3 calls · latest: today 09:12",
  urgentLabel: "Call back",
  transcriptLabel: "View transcript",
  calls: [
    {
      from: "06 •• •• 41 22",
      at: "Today · 09:12",
      summary:
        "Quote request for a 7×3.5 shell pool with decking. Site accessible, project planned for next spring.",
      transcript: [
        { who: "ia", text: "Hello, you've reached your pool builder. How can I help?" },
        { who: "client", text: "Hi, I'd like a quote for a pool, a shell one I think, around 7 metres." },
        { who: "ia", text: "Of course. Do you have a width in mind, and can a crane truck reach the site?" },
        { who: "client", text: "About 7 by 3.5. Yes, wide access, the ground is flat." },
        { who: "ia", text: "Great. What timeframe are you aiming for?" },
        { who: "client", text: "Next spring, we're not in a rush." },
        { who: "ia", text: "Noted. A rep will call you back within 24 hours to book a site visit. Have a good day." },
      ],
      action: "Site visit to schedule",
    },
    {
      from: "04 •• •• 08 76",
      at: "Today · 08:41",
      summary:
        "Client under maintenance contract. Whistling pump and pressure loss for two days. The agent ruled out the simple causes.",
      urgent: true,
      transcript: [
        { who: "client", text: "The pump has been making an odd noise since the day before yesterday, and pressure is down." },
        { who: "ia", text: "Checking your contract… yes, you're covered. Is the pre-filter basket clean?" },
        { who: "client", text: "Yes, I emptied it yesterday, no change." },
        { who: "ia", text: "And is the water level above the middle of the skimmers?" },
        { who: "client", text: "Yes, normal level." },
        { who: "ia", text: "Then it isn't loss of prime. I'm escalating this as a callout, a technician will ring you this morning." },
      ],
      action: "Contract callout · escalated",
    },
    {
      from: "07 •• •• 93 04",
      at: "Yesterday · 17:55",
      summary: "Question about passive winterising pricing for a 32 m² pool. Answered, no follow-up needed.",
      transcript: [
        { who: "client", text: "Evening, how much is winterising for an 8 by 4 pool?" },
        { who: "ia", text: "For that size, passive winterising is €290 including VAT and products." },
        { who: "client", text: "Right, and when does that happen?" },
        { who: "ia", text: "Between mid-October and late November, once the water drops below 12 °C. Shall I text you the details?" },
        { who: "client", text: "Yes, thanks." },
      ],
      action: "Handled · no action",
    },
  ],

  leadsH2: "Form enquiries",
  leadsMeta: "3 enquiries · sorted by score",
  scoreLabel: "Quality",
  emailReadyLabel: "Reply ready to send",
  sendLabel: "Send email",
  editLabel: "Edit",
  leads: [
    {
      name: "C. Vernier · Sciez",
      request: "9×4 in-ground pool, sloping site, financing confirmed, wants work done before June.",
      score: 92,
      verdict: "Scoped project, confirmed budget, clear deadline.",
      email: {
        subject: "Your 9×4 pool project in Sciez",
        body:
          "Hello,\n\nThanks for your enquiry. A 9×4 pool on a sloping site needs a retaining study — that's the first thing we'll look at together on site.\n\nTo fill before June, the site visit needs to happen within three weeks. I can offer next Tuesday or Thursday, late afternoon.\n\nWhich suits you?",
      },
    },
    {
      name: "L. Ferrand · Bons-en-Chablais",
      request: "Liner replacement on an 8×4 pool from 2009, plus coping rework.",
      score: 78,
      verdict: "Specific need, but no deadline or budget given.",
      email: {
        subject: "Liner replacement — 8×4 pool",
        body:
          "Hello,\n\nOn a pool built in 2009 the liner is indeed near end of life. Two questions before quoting: is the structure concrete or panel-built, and have you noticed any leaks this season?\n\nWith those two answers I'll send a price range within 48 hours, coping included.",
      },
    },
    {
      name: "Anonymous enquiry",
      request: "\"how much is a pool\"",
      score: 12,
      verdict: "No usable information, incomplete contact details.",
      rejected: "Discarded automatically — a light follow-up is scheduled at D+2 to collect what's missing.",
    },
  ],

  billingH2: "Invoicing & VAT",
  billingMeta: "Current period · 4 invoices",
  billingStats: [
    { label: "Revenue collected", value: "€94,200" },
    { label: "VAT collected", value: "€18,840" },
    { label: "Awaiting payment", value: "€12,600" },
    { label: "Overdue > 30 days", value: "€0" },
  ],
  splitLabel: "Revenue split",
  split: [
    { label: "Consumers", value: 72, color: "var(--accent)" },
    { label: "Businesses", value: 21, color: "var(--accent-soft)" },
    { label: "Maintenance contracts", value: 7, color: "var(--dim-2)" },
  ],
  invoicesCols: { ref: "Reference", client: "Client", amount: "Amount incl. VAT", status: "Transmission" },
  invoices: [
    { ref: "F-2026-0418", client: "M. family · Publier", amount: "€38,880", status: "Transmitted", tone: "ok" },
    { ref: "F-2026-0417", client: "L. property co. · Annemasse", amount: "€14,400", status: "Transmitted", tone: "ok" },
    { ref: "F-2026-0416", client: "Mr & Mrs R. · Douvaine", amount: "€1,368", status: "Transmitted", tone: "ok" },
    { ref: "F-2026-0415", client: "Rives campsite", amount: "€12,600", status: "Awaiting payment", tone: "wait" },
  ],

  readingH2: "What the automation does in this screen.",
  readingSubtitle:
    "The dashboard above only shows data. Here is what produces it, tab by tab.",
  readings: [
    {
      tab: "Quotes",
      text: "Every quote ships with its follow-up sequence. Nobody triggers it by hand, and nobody forgets to stop it when the client replies. The €8,400 signed this month came from two quotes chased at D+7 — without the sequence they would have gone unanswered.",
    },
    {
      tab: "Calls",
      text: "In season, the agent takes the calls nobody has time to take. It qualifies, it summarises, and it only interrupts a human when that's warranted: 11 calls handled out of 26 here, with a single one escalated to a callout.",
    },
    {
      tab: "Enquiries",
      text: "Every enquiry is scored before it reaches you. The solid ones arrive with a reply already written; the rest don't cost you time. Of 23 enquiries, 5 never reached a salesperson.",
    },
    {
      tab: "Invoicing",
      text: "Invoices go out, so do the reminders, and VAT adds up as it goes. The accountant gets the export without asking — which is why the overdue line sits at €0 beyond 30 days.",
    },
  ],

  ctaH2: "What would yours look like?",
  ctaSubtitle:
    "In 30 minutes we look at your call volume, your quote turnaround and your maintenance recurrence. You leave with the list of workflows that pay for themselves before next season.",
  ctaButton: "Book the free audit",
  ctaReassurance: "30 minutes · Free · No commitment · Written diagnostic",
};
