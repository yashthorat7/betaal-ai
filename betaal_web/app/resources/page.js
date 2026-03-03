'use client';
import GridReveal from '@/components/common/GridReveal';
import ResourcesHero from '@/components/resources/ResourcesHero';
import VideoGrid from '@/components/resources/VideoGrid';
import BlogSection from '@/components/resources/BlogSection';
import ResourcesFAQ from '@/components/resources/ResourcesFAQ';

export default function ResourcesPage() {
  return (
    <GridReveal>
      <ResourcesHero />
      <VideoGrid />
      <BlogSection />

      <div className="overflow-hidden border-t border-b border-[#f0f0f0] py-16">
        <div className="animate-marquee-reverse flex whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="inline-flex shrink-0 items-center gap-8 pr-8">
              <span className="text-[13px] font-[900] tracking-[0.15em] text-[#1C1C1C]/20 uppercase">
                Recover • Rebuild • Reclaim • Rewire • Reflect • Restart
              </span>
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#1C1C1C]/15" />
            </span>
          ))}
        </div>
      </div>

      <ResourcesFAQ />
    </GridReveal>
  );
}
