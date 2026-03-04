'use client';

const TEXT = 'Are you ready to leave smartphone addiction?';

export default function MarqueeSection() {
  return (
    <section className="overflow-hidden border-t border-b border-[#e0e0e0] bg-transparent py-[80px] md:py-11 mt-[100px] md:mt-0">
      <div className="animate-marquee flex whitespace-nowrap will-change-transform">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="inline-flex shrink-0 items-center gap-9 pr-9">
            <span className="text-[clamp(40px,5vw,72px)] font-[900] tracking-tight text-[#1C1C1C]">
              {TEXT}
            </span>
            <span className="inline-block h-[60px] w-[60px] shrink-0 rounded-[14px] border-[1.5px] border-[#d0d0d0] bg-gradient-to-br from-[#f0f0f0] to-[#e4e4e4]" />
          </span>
        ))}
      </div>
    </section>
  );
}
