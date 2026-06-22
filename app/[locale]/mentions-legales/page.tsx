import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LegalShell, Article, P, Strong, A } from "@/components/legal";
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
    title: "Mentions légales",
    description:
      "Mentions légales du site timevo.io : éditeur, responsable de publication et hébergeur.",
    alternates: { canonical: `${BASE_URL}/${locale}/mentions-legales` },
    robots: { index: false, follow: true },
  };
}

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <LegalShell
      title="Mentions légales"
      lastUpdate={LAST_UPDATE}
      intro={
        <P>
          Conformément à l&apos;article 6 de la loi n°&nbsp;2004-575 du 21 juin 2004 pour la confiance dans
          l&apos;économie numérique (LCEN), voici les informations relatives à l&apos;éditeur et à
          l&apos;hébergeur du site <Strong>timevo.io</Strong>.
        </P>
      }
    >
      <Article n="1" title="Éditeur du site">
        <P>
          Le site <Strong>timevo.io</Strong> est édité par <Strong>Maxime Doublet</Strong>, entrepreneur
          individuel sous le régime de la micro-entreprise, exerçant sous le nom commercial
          «&nbsp;<Strong>Timevo</Strong>&nbsp;».
        </P>
        <P>
          Siège : 13 route de la Visitation, 74200 Thonon-les-Bains, France.
          <br />
          Immatriculé au RCS de Thonon-les-Bains sous le numéro 843&nbsp;505&nbsp;249.
          <br />
          SIRET (siège) : 843&nbsp;505&nbsp;249&nbsp;00022.
        </P>
        <P>
          Contact : <A href="mailto:hello@timevo.io">hello@timevo.io</A>.
        </P>
      </Article>

      <Article n="2" title="Responsable de la publication">
        <P>
          Le directeur de la publication est <Strong>Maxime Doublet</Strong>, en qualité d&apos;éditeur du site,
          joignable à l&apos;adresse <A href="mailto:hello@timevo.io">hello@timevo.io</A>.
        </P>
      </Article>

      <Article n="3" title="Hébergeur">
        <P>
          Le site est hébergé par <Strong>Vercel Inc.</Strong>, 340 S Lemon Ave #4133, Walnut, CA 91789,
          États-Unis.
          <br />
          Téléphone : +1&nbsp;951-381-9319.
        </P>
        <P>
          Site : <A href="https://vercel.com">vercel.com</A>.
        </P>
      </Article>

      <Article n="4" title="Propriété intellectuelle">
        <P>
          L&apos;ensemble des contenus du site (textes, identité visuelle, logo, structure, mise en page) est la
          propriété exclusive de l&apos;éditeur, sauf mention contraire, et est protégé par le droit de la
          propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans autorisation
          écrite préalable de l&apos;éditeur, est interdite et constitutive de contrefaçon.
        </P>
      </Article>

      <Article n="5" title="Données personnelles et cookies">
        <P>
          Les modalités de traitement des données personnelles des visiteurs et l&apos;usage éventuel de cookies
          ou de mesure d&apos;audience sont décrits dans la{" "}
          <A href={`/${locale}/politique-de-confidentialite`}>politique de confidentialité</A>.
        </P>
      </Article>

      <Article n="6" title="Responsabilité">
        <P>
          L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur le site,
          sans garantir qu&apos;elles soient exhaustives ou exemptes d&apos;erreurs. Les liens vers des sites
          tiers sont fournis à titre indicatif&nbsp;; l&apos;éditeur n&apos;exerce aucun contrôle sur leur
          contenu et décline toute responsabilité à leur égard.
        </P>
      </Article>

      <Article n="7" title="Droit applicable">
        <P>
          Le présent site et les présentes mentions sont régis par le <Strong>droit français</Strong>. Tout
          litige relève de la compétence des tribunaux du ressort de Thonon-les-Bains, sous réserve des règles
          impératives applicables.
        </P>
      </Article>
    </LegalShell>
  );
}
