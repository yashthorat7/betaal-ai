'use client';

const FEATURES = [
  {
    title: 'Adaptive AI Alerts',
    desc: 'Smart notifications that learn your patterns and intervene at the right moment to guide you back to focus.',
    span: 'col-span-2',
    gradient: 'radial-gradient(ellipse at 30% 30%, rgba(175,82,222,0.08), transparent 70%)',
  },
  {
    title: 'Real-Time Tracking',
    desc: 'Live dashboard showing your screen time, app usage, focus zones, and daily behavioral patterns.',
    span: 'col-span-1 row-span-2',
    gradient: 'radial-gradient(ellipse at 70% 20%, rgba(0,212,255,0.08), transparent 70%)',
  },
  {
    title: 'Focus Sessions',
    desc: 'Guided deep-work blocks with distraction blocking and ambient sounds for sustained concentration.',
    span: 'col-span-1',
    gradient: 'radial-gradient(ellipse at 50% 80%, rgba(255,45,85,0.07), transparent 70%)',
  },
  {
    title: 'Progress Analytics',
    desc: 'Weekly reports with trend analysis, streaks, and improvement scores to keep you motivated.',
    span: 'col-span-1',
    gradient: 'radial-gradient(ellipse at 20% 60%, rgba(90,200,250,0.08), transparent 70%)',
  },
  {
    title: 'Community Support',
    desc: 'Connect with accountability partners and support groups on similar rehabilitation journeys.',
    span: 'col-span-1',
    gradient: 'radial-gradient(ellipse at 80% 40%, rgba(175,82,222,0.07), transparent 70%)',
  },
  {
    title: 'Browser Extension',
    desc: 'Extends protection to desktop browsing with intelligent site blockers and customizable time limits.',
    span: 'col-span-2',
    gradient: 'radial-gradient(ellipse at 60% 30%, rgba(0,122,255,0.07), transparent 70%)',
  },
];

export default function BentoGrid() {
  return (
    <section className="bg-transparent py-[140px] md:py-[100px]">
      <div className="mx-auto max-w-[1200px] px-[60px]">
        <h2 className="animate-fade-in mb-[80px] md:mb-[60px] text-[clamp(32px,3.5vw,52px)] leading-none font-[900] tracking-tight text-[#1C1C1C]">
          Everything You Need
        </h2>
        <div className="grid auto-rows-[minmax(280px,auto)] grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`${f.span} animate-fade-in group relative flex cursor-default flex-col justify-end overflow-hidden rounded-[20px] transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_10px_36px_rgba(0,0,0,0.08)]`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="absolute inset-0 rounded-[20px] border border-[#e0e0e0] bg-gradient-to-br from-[#f2f2f2] via-[#eaeaea] to-[#f0f0f0]" />
              <div
                className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: f.gradient }}
              />
              <div className="relative z-[1] rounded-b-[20px] bg-gradient-to-t from-[rgba(250,250,250,0.95)] from-60% to-transparent p-10">
                <h3 className="mb-2.5 text-[22px] font-[800] tracking-tight text-[#1C1C1C]">
                  {f.title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.55] font-medium text-[#6B6B6B]">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
