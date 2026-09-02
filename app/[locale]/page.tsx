import { setRequestLocale } from "next-intl/server";
import NavDkdp from "@/components/NavDkdp";
import HeroDkdp from "@/components/HeroDkdp";
import StatsBand from "@/components/StatsBand";
import BulletSection from "@/components/BulletSection";
import SolutionCards from "@/components/SolutionCards";
import CardSection from "@/components/CardSection";
import MethodDkdp from "@/components/MethodDkdp";
import FaqDkdp from "@/components/FaqDkdp";
import ContactCard from "@/components/ContactCard";
import FooterDkdp from "@/components/FooterDkdp";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import {
  IconAlert, IconTarget, IconTrend, IconGrid, IconSpark,
} from "@/components/SectionIcons";
import StickyMobileCta from "@/components/StickyMobileCta";

/**
 * Fiche d'établissement plutôt que service national : le copy v5 ancre
 * l'agence à Thonon-les-Bains et la FAQ répond « Vous êtes où ? ». La
 * déclaration doit dire la même chose que la page.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Timevo",
  url: "https://www.timevo.io",
  logo: "https://www.timevo.io/icon.svg",
  email: "hello@timevo.io",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Thonon-les-Bains",
    addressRegion: "Haute-Savoie",
    postalCode: "74200",
    addressCountry: "FR",
  },
  areaServed: [
    { "@type": "City", name: "Thonon-les-Bains" },
    { "@type": "City", name: "Évian-les-Bains" },
    { "@type": "City", name: "Annemasse" },
    { "@type": "City", name: "Genève" },
    { "@type": "Country", name: "France" },
  ],
  description:
    "Agence IA à Thonon-les-Bains. Automatisations sur mesure, agents IA et contenu pour les PME, construits puis maintenus dans la durée.",
  serviceType: [
    "Automatisation de processus",
    "Agents IA",
    "Création de sites web",
    "SEO",
  ],
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavDkdp />
      <main>
        <HeroDkdp />
        <StatsBand />
        <ScrollFadeIn><BulletSection ns="pain" id="probleme" icon={<IconAlert />} /></ScrollFadeIn>
        <ScrollFadeIn><SolutionCards /></ScrollFadeIn>
        <ScrollFadeIn><BulletSection ns="pourqui" id="pour-qui" icon={<IconTarget />} /></ScrollFadeIn>
        <ScrollFadeIn><MethodDkdp /></ScrollFadeIn>
        <ScrollFadeIn><BulletSection ns="results" id="resultats" icon={<IconTrend />} /></ScrollFadeIn>
        <ScrollFadeIn><CardSection ns="usecases" id="cas-usage" icon={<IconGrid />} /></ScrollFadeIn>
        <ScrollFadeIn><CardSection ns="why" id="pourquoi-nous" icon={<IconSpark />} /></ScrollFadeIn>
        <ScrollFadeIn><FaqDkdp /></ScrollFadeIn>
        <ScrollFadeIn><ContactCard /></ScrollFadeIn>
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
