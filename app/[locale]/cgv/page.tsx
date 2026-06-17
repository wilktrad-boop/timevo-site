import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LegalShell, Article, P, Strong, Ul } from "@/components/legal";
import type { Locale } from "@/lib/pageLabels";

const BASE_URL = "https://www.timevo.io";
const LAST_UPDATE = "17 juin 2026";

function isValidLocale(v: string): v is Locale {
  return (routing.locales as readonly string[]).includes(v);
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: "Conditions générales de vente",
    description:
      "Conditions générales de vente des prestations d'automatisation, de développement, de création de sites web et de référencement fournies par Timevo.",
    alternates: { canonical: `${BASE_URL}/${locale}/cgv` },
    robots: { index: false, follow: true },
  };
}

export default async function CgvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <LegalShell
      title="Conditions générales de vente"
      lastUpdate={LAST_UPDATE}
      intro={
        <P>
          Les présentes conditions générales de vente (les « <Strong>CGV</Strong> ») régissent
          l&apos;ensemble des prestations vendues par le Prestataire à ses clients professionnels. Toute
          commande emporte adhésion sans réserve aux présentes CGV, qui prévalent sur toute condition
          d&apos;achat du Client, sauf dérogation expresse et écrite acceptée par le Prestataire.
        </P>
      }
    >
      <Article n="Art. 1" title="Identité du Prestataire">
        <P>
          Les prestations sont fournies par <Strong>Maxime Doublet</Strong>, entrepreneur individuel sous le
          régime de la micro-entreprise, exerçant sous le nom commercial «&nbsp;<Strong>Timevo</Strong>&nbsp;»,
          immatriculé au Registre du Commerce et des Sociétés de Thonon-les-Bains sous le numéro
          843&nbsp;505&nbsp;249, SIRET (siège) 843&nbsp;505&nbsp;249&nbsp;00022, code APE 47.91A, dont le siège
          est situé 13 route de la Visitation, 74200 Thonon-les-Bains (ci-après le «&nbsp;<Strong>Prestataire</Strong>&nbsp;»).
        </P>
        <P>
          Contact :{" "}
          <a href="mailto:hello@timevo.io" style={{ color: "var(--accent)", textDecoration: "none" }}>
            hello@timevo.io
          </a>
          . Numéro de TVA intracommunautaire : FR32&nbsp;843&nbsp;505&nbsp;249.
        </P>
        <P>
          Le Prestataire relève de la franchise en base de TVA :{" "}
          <Strong>« TVA non applicable, art. 293 B du CGI »</Strong>. Aucune TVA n&apos;est facturée et les
          montants s&apos;entendent nets de taxe.
        </P>
      </Article>

      <Article n="Art. 2" title="Objet et champ d'application">
        <P>
          Le Prestataire exerce une activité d&apos;automatisation de processus, de développement logiciel, de
          mise en place d&apos;agents conversationnels, de création de sites web, de référencement (SEO) et de
          formation. Les présentes CGV s&apos;appliquent à toute prestation commandée par un client
          professionnel (le «&nbsp;<Strong>Client</Strong>&nbsp;»), à l&apos;exclusion des consommateurs.
        </P>
        <P>
          Elles forment, avec le devis accepté, l&apos;intégralité de l&apos;accord entre les Parties. En cas de
          contradiction, les conditions particulières du devis priment sur les présentes CGV.
        </P>
      </Article>

      <Article n="Art. 3" title="Devis, commande et formation du contrat">
        <P>
          Toute prestation fait l&apos;objet d&apos;un devis détaillé, gratuit et sans engagement, valable
          <Strong> trente (30) jours</Strong> à compter de son émission. Le contrat est formé, et la commande
          ferme, à la <Strong>double condition</Strong> de l&apos;acceptation écrite du devis par le Client
          (signature ou validation par voie électronique) et de l&apos;encaissement de l&apos;acompte prévu à
          l&apos;article 8.
        </P>
        <P>
          Toute demande de modification du périmètre après la commande fait l&apos;objet d&apos;un devis
          complémentaire et peut entraîner un ajustement des délais et du prix.
        </P>
      </Article>

      <Article n="Art. 4" title="Description et exécution des prestations">
        <P>
          Le contenu, le périmètre et les livrables des prestations sont définis dans le devis accepté. Le
          Prestataire est tenu à une <Strong>obligation de moyens</Strong> et non de résultat : il s&apos;engage
          à exécuter les prestations avec soin, diligence et selon les règles de l&apos;art.
        </P>
        <P>
          <Strong>Aucune garantie de performance commerciale</Strong>, de chiffre d&apos;affaires, de position de
          référencement, de trafic ou de gain n&apos;est consentie, ces résultats dépendant de facteurs
          extérieurs au Prestataire (algorithmes des moteurs, marché, concurrence, action du Client).
        </P>
        <P>
          Le Prestataire peut recourir à des <Strong>sous-traitants ou prestataires</Strong> de son choix pour
          l&apos;exécution de tout ou partie des prestations, tout en demeurant responsable de leur bonne
          exécution vis-à-vis du Client.
        </P>
      </Article>

      <Article n="Art. 5" title="Délais d'exécution">
        <P>
          Les délais sont communiqués à titre indicatif et de bonne foi. Ils courent à compter de la dernière
          des dates suivantes : signature du devis, encaissement de l&apos;acompte, et mise à disposition par le
          Client de l&apos;ensemble des accès, contenus et informations nécessaires.
        </P>
        <P>
          Tout retard imputable au Client (défaut d&apos;accès, de contenu, de validation ou de paiement)
          suspend les délais à due concurrence, sans report de responsabilité sur le Prestataire.
        </P>
      </Article>

      <Article n="Art. 6" title="Obligations du Client">
        <P>Le Client s&apos;engage à&nbsp;:</P>
        <Ul>
          <li>
            collaborer activement et fournir, en temps utile, l&apos;ensemble des accès, contenus, comptes,
            identifiants et informations nécessaires à l&apos;exécution des prestations&nbsp;;
          </li>
          <li>désigner un interlocuteur unique disposant du pouvoir de valider les livrables&nbsp;;</li>
          <li>
            conserver ses propres comptes et abonnements auprès des éditeurs de services tiers utilisés&nbsp;;
          </li>
          <li>régler les sommes dues aux échéances convenues.</li>
        </Ul>
      </Article>

      <Article n="Art. 7" title="Recette et livraison">
        <P>
          La «&nbsp;<Strong>recette</Strong>&nbsp;» désigne la phase de vérification au cours de laquelle le
          Client contrôle la conformité des livrables à ce qui a été convenu. À l&apos;achèvement des
          développements, le Prestataire met les livrables à disposition du Client.
        </P>
        <P>
          Le Client dispose d&apos;un délai de <Strong>dix (10) jours ouvrés</Strong> pour vérifier la
          conformité aux spécifications et notifier par écrit les éventuelles non-conformités. À défaut de
          réserve écrite dans ce délai, la recette est réputée définitivement acquise et les livrables acceptés
          sans réserve.
        </P>
      </Article>

      <Article n="Art. 8" title="Prix et modalités de paiement">
        <P>
          Les prix figurent au devis et sont exprimés nets de taxe (franchise en base de TVA, art. 293 B du
          CGI). Sauf stipulation contraire au devis, le paiement des prestations au forfait s&apos;effectue selon
          l&apos;échéancier suivant&nbsp;:
        </P>
        <Ul>
          <li>un <Strong>acompte de 30&nbsp;%</Strong> à la signature du devis&nbsp;;</li>
          <li>
            le solde réglé en <Strong>deux versements égaux</Strong>, à trente (30) puis soixante (60) jours
            suivant la signature.
          </li>
        </Ul>
        <P>
          L&apos;ensemble des paiements est effectué <Strong>exclusivement par virement bancaire</Strong> sur le
          compte du Prestataire. Les factures sont payables à <Strong>trente (30) jours</Strong> date de facture.
        </P>
        <P>
          Conformément aux articles L.441-10 et D.441-5 du Code de commerce, tout retard de paiement entraîne de
          plein droit des <Strong>pénalités de retard</Strong> calculées au taux d&apos;intérêt légal majoré,
          ainsi qu&apos;une <Strong>indemnité forfaitaire de 40&nbsp;€</Strong> pour frais de recouvrement. Aucun
          escompte n&apos;est consenti pour paiement anticipé.
        </P>
      </Article>

      <Article n="Art. 9" title="Maintenance et abonnement">
        <P>
          Lorsque le devis prévoit une prestation de maintenance et de support, celle-ci est facturée par
          abonnement et due à compter de la mise en production des livrables, payable mensuellement par virement
          bancaire.
        </P>
        <P>
          L&apos;abonnement couvre le support technique, la correction des anomalies, les mises à jour de
          maintien en condition opérationnelle et, le cas échéant, les abonnements et licences des outils prévus
          lors de la mise en place. Il <Strong>exclut</Strong> le développement de nouvelles fonctionnalités, les
          nouveaux cas d&apos;usage, la formation de nouveaux utilisateurs au-delà de la formation initiale et la
          reprise de données, qui font l&apos;objet d&apos;un devis distinct.
        </P>
        <P>
          Sauf stipulation contraire, l&apos;abonnement est conclu pour une durée initiale de{" "}
          <Strong>six (6) mois</Strong>, reconductible tacitement par périodes de six (6) mois. Le tarif peut
          être révisé à chaque renouvellement, le Prestataire en informant le Client par écrit au moins trente
          (30) jours avant l&apos;échéance.
        </P>
      </Article>

      <Article n="Art. 10" title="Propriété intellectuelle">
        <P>
          Les développements spécifiques réalisés sur-mesure pour le Client, ainsi que les contenus et le site
          livrés, lui sont cédés <Strong>à compter du paiement intégral</Strong> des sommes dues au titre de la
          prestation. Avant paiement intégral, le Client ne dispose d&apos;aucun droit de propriété ni
          d&apos;exploitation sur les livrables.
        </P>
        <P>
          Le Prestataire conserve la pleine propriété de ses outils, briques logicielles génériques, méthodes,
          modèles et savoir-faire préexistants ou réutilisables, et reste libre de les réemployer pour
          d&apos;autres clients. Les logiciels et services tiers demeurent soumis aux licences de leurs éditeurs
          respectifs.
        </P>
      </Article>

      <Article n="Art. 11" title="Confidentialité">
        <P>
          Chaque Partie s&apos;engage à conserver confidentielles les informations non publiques de l&apos;autre
          Partie auxquelles elle accède dans le cadre de la prestation, et à ne les utiliser que pour les besoins
          de l&apos;exécution du contrat. Cet engagement perdure pendant deux (2) ans après la fin de la relation
          contractuelle.
        </P>
      </Article>

      <Article n="Art. 12" title="Protection des données personnelles">
        <P>
          Chaque Partie respecte la réglementation applicable, notamment le Règlement (UE) 2016/679 (RGPD) et la
          loi Informatique et Libertés. Lorsque le Prestataire traite des données personnelles pour le compte du
          Client dans le cadre des prestations, il agit en qualité de <Strong>sous-traitant</Strong> au sens du
          RGPD, selon les instructions documentées du Client, qui demeure responsable de traitement.
        </P>
        <P>
          Les modalités de ce traitement (finalités, durées, mesures de sécurité) sont précisées en tant que de
          besoin dans le devis ou un avenant dédié. Le traitement des données des visiteurs du présent site est
          décrit dans la{" "}
          <a href={`/${locale}/politique-de-confidentialite`} style={{ color: "var(--accent)", textDecoration: "none" }}>
            politique de confidentialité
          </a>
          .
        </P>
      </Article>

      <Article n="Art. 13" title="Garantie">
        <P>
          Le Prestataire garantit la conformité des livrables aux spécifications validées pendant une durée de{" "}
          <Strong>trente (30) jours</Strong> à compter de la recette définitive&nbsp;; les anomalies signalées
          durant cette période sont corrigées sans frais.
        </P>
        <P>
          Sont exclues de la garantie les anomalies résultant d&apos;une modification par le Client ou un tiers,
          d&apos;un usage non conforme, d&apos;un défaut du matériel ou d&apos;un service tiers. Le matériel
          relève des seules garanties de ses fabricants et fournisseurs.
        </P>
      </Article>

      <Article n="Art. 14" title="Responsabilité">
        <P>
          La responsabilité du Prestataire, toutes causes confondues, est limitée aux dommages directs et
          prévisibles et ne saurait excéder le montant total hors taxe effectivement payé par le Client au titre
          de la prestation concernée. Le Prestataire n&apos;est pas responsable des dommages indirects (perte de
          chiffre d&apos;affaires, de clientèle, de données, préjudice commercial).
        </P>
      </Article>

      <Article n="Art. 15" title="Force majeure">
        <P>
          Aucune Partie ne peut être tenue responsable d&apos;un manquement résultant d&apos;un cas de force
          majeure au sens de l&apos;article 1218 du Code civil. Les obligations affectées sont suspendues pendant
          la durée de l&apos;événement&nbsp;; si celui-ci se prolonge au-delà de trente (30) jours, chaque Partie
          peut résilier le contrat de plein droit, sans indemnité.
        </P>
      </Article>

      <Article n="Art. 16" title="Résiliation">
        <P>
          <Strong>Maintenance.</Strong> Chaque Partie peut résilier l&apos;abonnement à chaque échéance moyennant
          un préavis écrit de trente (30) jours. Les sommes dues jusqu&apos;au terme effectif restent exigibles.
        </P>
        <P>
          <Strong>Manquement grave.</Strong> En cas de manquement grave d&apos;une Partie non réparé dans les
          quinze (15) jours suivant une mise en demeure restée sans effet, l&apos;autre Partie peut résilier le
          contrat de plein droit, sans préjudice de dommages et intérêts.
        </P>
        <P>
          <Strong>Travaux en cours.</Strong> En cas de résiliation du fait du Client, les prestations réalisées
          et engagées restent dues au prorata, et l&apos;acompte versé demeure acquis au Prestataire.
        </P>
      </Article>

      <Article n="Art. 17" title="Réversibilité">
        <P>
          Au terme du contrat, quelle qu&apos;en soit la cause, le Prestataire restitue au Client, sur sa demande
          écrite, ses données dans un format exploitable standard ainsi que les accès aux livrables dont il a la
          propriété. Les opérations de réversibilité excédant une simple remise (migration, accompagnement,
          export complexe) font l&apos;objet d&apos;un devis au temps passé.
        </P>
      </Article>

      <Article n="Art. 18" title="Références commerciales">
        <P>
          Sauf refus écrit du Client, le Prestataire est autorisé à mentionner le nom et le logo du Client à
          titre de référence commerciale (site, portfolio, supports de prospection), sans divulgation
          d&apos;information confidentielle.
        </P>
      </Article>

      <Article n="Art. 19" title="Modification des CGV">
        <P>
          Le Prestataire peut modifier les présentes CGV à tout moment. Les CGV applicables sont celles en
          vigueur à la date d&apos;acceptation du devis. La version applicable est conservée par les Parties.
        </P>
      </Article>

      <Article n="Art. 20" title="Droit applicable et juridiction">
        <P>
          Les présentes CGV sont régies par le <Strong>droit français</Strong>. À défaut de résolution amiable,
          tout litige relatif à leur validité, leur interprétation ou leur exécution relève de la compétence
          exclusive du <Strong>Tribunal de commerce de Thonon-les-Bains</Strong>, nonobstant pluralité de
          défendeurs ou appel en garantie.
        </P>
      </Article>
    </LegalShell>
  );
}
