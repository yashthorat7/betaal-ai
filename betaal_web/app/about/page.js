'use client';
import GridReveal from '@/components/common/GridReveal';
import TypewriterHero from '@/components/common/TypewriterHero';
import TeamSection from '@/components/about/TeamSection';
import ContactForm from '@/components/about/ContactForm';

const MISSION_TEXT =
  'We believe technology should empower, not enslave. Betaal AI exists to help people build a healthier relationship with their screens — through science-backed, gradual intervention that actually works.';

export default function AboutPage() {
  return (
    <GridReveal>
      <TypewriterHero text={MISSION_TEXT} label="Our Mission" />
      <TeamSection />
      <ContactForm />
    </GridReveal>
  );
}
