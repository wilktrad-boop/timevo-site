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
import FaqDkdp from "@/components/FaqDkdp";
import ContactCard from "@/components/ContactCard";
import FooterDkdp from "@/components/FooterDkdp";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export default function Home() {
  return (
    <>
      <NavDkdp />
      <main>
        <HeroDkdp />
        <LogoWall />
        <ScrollFadeIn><PainPoints /></ScrollFadeIn>
        <ScrollFadeIn><Pillars /></ScrollFadeIn>
        <ScrollFadeIn><StatsBlock /></ScrollFadeIn>
        <ScrollFadeIn><MethodDkdp /></ScrollFadeIn>
        <ScrollFadeIn><TestimonialBlock /></ScrollFadeIn>
        <ScrollFadeIn><TeamGrid /></ScrollFadeIn>
        <ScrollFadeIn><EstimatorCard /></ScrollFadeIn>
        <ScrollFadeIn><FaqDkdp /></ScrollFadeIn>
        <ScrollFadeIn><ContactCard /></ScrollFadeIn>
      </main>
      <FooterDkdp />
    </>
  );
}
