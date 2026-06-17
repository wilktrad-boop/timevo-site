import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LegalShell, Article, P, Strong, A, Ul } from "@/components/legal";
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
    title: "Politique de confidentialité",
    description:
      "Politique de confidentialité du site timevo.io : données collectées, finalités, base légale, durées de conservation et droits RGPD.",
    alternates: { canonical: `${BASE_URL}/${locale}/politique-de-confidentialite` },
    robots: { index: false, follow: true },
  };
}

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <LegalShell
      title="Politique de confidentialité"
      lastUpdate={LAST_UPDATE}
      intro={
        <P>
          La présente politique décrit la manière dont le site <Strong>timevo.io</Strong> traite les données
          personnelles de ses visiteurs, conformément au Règlement (UE) 2016/679 (<Strong>RGPD</Strong>) et à la
          loi Informatique et Libertés.
        </P>
      }
    >
      <Article n="1" title="Responsable de traitement">
        <P>
          Le responsable de traitement est <Strong>Maxime Doublet</Strong>, entrepreneur individuel exerçant
          sous le nom commercial «&nbsp;Timevo&nbsp;», 13 route de la Visitation, 74200 Thonon-les-Bains, France.
          Contact : <A href="mailto:hello@timevo.io">hello@timevo.io</A>.
        </P>
      </Article>

      <Article n="2" title="Données collectées et finalités">
        <P>Le site traite des données personnelles dans les cas suivants&nbsp;:</P>
        <Ul>
          <li>
            <Strong>Mesure d&apos;audience.</Strong> Des statistiques de fréquentation anonymisées (pages vues,
            provenance, type d&apos;appareil) sont collectées pour comprendre et améliorer l&apos;usage du site.
          </li>
          <li>
            <Strong>Prise de contact et réservation d&apos;un rendez-vous.</Strong> Lorsque vous nous écrivez ou
            réservez un audit, nous traitons les données que vous fournissez (nom, adresse e-mail, et le cas
            échéant nom de votre entreprise et informations communiquées) afin de répondre à votre demande et de
            préparer notre échange.
          </li>
        </Ul>
      </Article>

      <Article n="3" title="Base légale">
        <Ul>
          <li>
            <Strong>Mesure d&apos;audience</Strong> : intérêt légitime du responsable de traitement à mesurer et
            améliorer la performance de son site (art. 6.1.f du RGPD).
          </li>
          <li>
            <Strong>Prise de contact / réservation</Strong> : mesures précontractuelles prises à votre demande et
            intérêt légitime à traiter votre sollicitation (art. 6.1.b et 6.1.f du RGPD).
          </li>
        </Ul>
      </Article>

      <Article n="4" title="Cookies et traceurs">
        <P>
          La mesure d&apos;audience du site est réalisée avec <Strong>Rybbit</Strong>, un outil d&apos;analyse
          respectueux de la vie privée, <Strong>sans cookie</Strong> et sans suivi inter-sites. Les données sont
          agrégées et ne permettent pas de vous identifier individuellement. À ce titre, et conformément aux
          recommandations de la CNIL relatives aux solutions de mesure d&apos;audience exemptées, aucun
          consentement préalable n&apos;est requis pour cette mesure.
        </P>
        <P>
          Le site ne dépose pas de cookies publicitaires ni de traceurs tiers à des fins de profilage.
        </P>
      </Article>

      <Article n="5" title="Destinataires et sous-traitants">
        <P>
          Les données ne sont jamais vendues. Elles sont accessibles au seul responsable de traitement et, le cas
          échéant, à ses sous-traitants techniques agissant sur ses instructions&nbsp;:
        </P>
        <Ul>
          <li>
            <Strong>Vercel Inc.</Strong> (hébergement du site) — États-Unis&nbsp;;
          </li>
          <li>
            <Strong>Rybbit</Strong> (mesure d&apos;audience)&nbsp;;
          </li>
          <li>
            <Strong>Calendly</Strong> (réservation de rendez-vous, lorsque vous utilisez ce service)&nbsp;;
          </li>
          <li>le fournisseur de messagerie utilisé pour traiter vos e-mails.</li>
        </Ul>
        <P>
          Lorsqu&apos;un transfert de données hors de l&apos;Union européenne a lieu (notamment vers les
          États-Unis), il est encadré par les garanties appropriées prévues par le RGPD, telles que les clauses
          contractuelles types de la Commission européenne.
        </P>
      </Article>

      <Article n="6" title="Durée de conservation">
        <Ul>
          <li>
            <Strong>Statistiques d&apos;audience</Strong> : conservées sous forme agrégée pour une durée maximale
            de vingt-cinq (25) mois&nbsp;;
          </li>
          <li>
            <Strong>Demandes de contact</Strong> : conservées le temps nécessaire au traitement de votre demande,
            puis jusqu&apos;à trois (3) ans à compter du dernier contact à des fins de suivi commercial.
          </li>
        </Ul>
      </Article>

      <Article n="7" title="Vos droits">
        <P>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
          de limitation, d&apos;opposition et de portabilité de vos données, ainsi que du droit de définir des
          directives relatives à leur sort après votre décès.
        </P>
        <P>
          Pour exercer ces droits, écrivez à <A href="mailto:hello@timevo.io">hello@timevo.io</A>. Vous pouvez
          également introduire une réclamation auprès de la <Strong>CNIL</Strong> (
          <A href="https://www.cnil.fr">www.cnil.fr</A>).
        </P>
      </Article>

      <Article n="8" title="Sécurité">
        <P>
          Le responsable de traitement met en œuvre des mesures techniques et organisationnelles appropriées
          (connexion chiffrée HTTPS, accès restreints) pour protéger les données contre tout accès, altération ou
          divulgation non autorisés.
        </P>
      </Article>

      <Article n="9" title="Modification">
        <P>
          La présente politique peut être mise à jour pour refléter les évolutions du site ou de la
          réglementation. La version applicable est celle publiée sur cette page à la date de votre visite.
        </P>
      </Article>
    </LegalShell>
  );
}
