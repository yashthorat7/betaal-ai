import HeroSection from '@/components/landing/HeroSection';
import ProblemStats from '@/components/landing/ProblemStats';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import ResearchSection from '@/components/landing/ResearchSection';
import CTABanner from '@/components/landing/CTABanner';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProblemStats />
      <HowItWorks />
      <FeaturesGrid />
      <ResearchSection />
      <CTABanner />
    </div>
  );
}
