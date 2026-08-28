import { setRequestLocale } from "next-intl/server";
import NavDkdp from "@/components/NavDkdp";
import HeroDkdp from "@/components/HeroDkdp";
import LogoWall from "@/components/LogoWall";
import PainPoints from "@/components/PainPoints";
import Pillars from "@/components/Pillars";
import StatsBlock from "@/components/StatsBlock";
import MethodDkdp from "@/components/MethodDkdp";
import TestimonialBlock from "@/components/TestimonialBlock";
import TeamGrid from "@/components/TeamGrid";
import EstimatorCard from "@/components/EstimatorCard";
import DemoTeaser from "@/components/DemoTeaser";
import FaqDkdp from "@/components/FaqDkdp";
import ContactCard from "@/components/ContactCard";
import FooterDkdp from "@/components/FooterDkdp";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import StickyMobileCta from "@/components/StickyMobileCta";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Timevo",
  url: "https://www.timevo.io",
  logo: "https://www.timevo.io/icon.svg",
  email: "hello@timevo.io",
  address: {
    "@type": "PostalAddress",
    addressLocality: "France",
    addressCountry: "FR",
  },
  areaServed: ["FR", "BE", "CH"],
  description:
    "Agence d'automatisation pour PME. Devis, relances, rapports et support automatisés avec n8n et agents IA.",
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
        {/* <LogoWall /> */}
        <ScrollFadeIn><PainPoints /></ScrollFadeIn>
        <ScrollFadeIn><Pillars /></ScrollFadeIn>
        {/* La preuve arrive juste après ce qu'on sait faire, avant l'estimateur. */}
        <ScrollFadeIn><DemoTeaser /></ScrollFadeIn>
        {/* <ScrollFadeIn><StatsBlock /></ScrollFadeIn> */}
        <ScrollFadeIn><EstimatorCard /></ScrollFadeIn>
        <ScrollFadeIn><MethodDkdp /></ScrollFadeIn>
        {/* <ScrollFadeIn><TestimonialBlock /></ScrollFadeIn> */}
        <ScrollFadeIn><TeamGrid /></ScrollFadeIn>
        <ScrollFadeIn><FaqDkdp /></ScrollFadeIn>
        <ScrollFadeIn><ContactCard /></ScrollFadeIn>
      </main>
      <FooterDkdp />
      <StickyMobileCta />
    </>
  );
}
