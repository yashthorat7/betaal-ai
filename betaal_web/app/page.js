'use client';
import GridReveal from '@/components/common/GridReveal';
import TypewriterHero from '@/components/common/TypewriterHero';
import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import BentoGrid from '@/components/landing/BentoGrid';
import MarqueeSection from '@/components/landing/MarqueeSection';

const ABOUT_TEXT =
  'Betaal AI is an intelligent digital rehabilitation ecosystem that uses adaptive AI alerts, real-time usage tracking, and personalized interventions to help you break free from smartphone addiction.';

const SQUARES = [
  { size: 80, top: '6%', left: '5%', rotate: -25, depth: 0.035 },
  { size: 70, top: '14%', right: '7%', rotate: 45, depth: 0.055 },
  { size: 90, bottom: '18%', left: '8%', rotate: 120, depth: 0.04 },
  { size: 65, bottom: '10%', right: '4%', rotate: -60, depth: 0.065 },
  { size: 55, top: '48%', left: '2%', rotate: 200, depth: 0.03 },
  { size: 75, top: '38%', right: '2%', rotate: -140, depth: 0.045 },
];

export default function Home() {
  return (
    <GridReveal className="bg-[#FAFAFA]">
      <HeroSection />
      <TypewriterHero text={ABOUT_TEXT} label="What is Betaal AI?" squares={SQUARES} speed={12} />
      <StatsSection />
      <BentoGrid />
      <MarqueeSection />
    </GridReveal>
  );
}
