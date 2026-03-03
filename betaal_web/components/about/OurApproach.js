'use client';
import { useInView } from '@/lib/hooks/useInView';

const PARAGRAPHS = [
  {
    title: 'Why Gradual Intervention?',
    text: 'Cold-turkey detoxes fail 87% of the time. Our research shows that gradual, AI-guided reduction creates lasting behavioral change. Betaal learns your habits and introduces gentle friction at the right moments — building awareness without triggering rebellion.',
  },
  {
    title: 'Adaptive Intelligence',
    text: "Our AI doesn't just track time. It understands context — differentiating productive screen use from mindless scrolling. Over time, it builds a personalized model that adapts to your schedule, stress levels, and recovery goals.",
  },
  {
    title: 'Our Vision',
    text: "We're building toward a future where technology serves human flourishing. Betaal AI is the first step — proving that the same AI powering addictive algorithms can be redirected to heal the damage they've caused.",
  },
];

export default function OurApproach() {
  const [ref, visible] = useInView({ threshold: 0.1, once: true });

  return (
    <section ref={ref} className="border-t border-[#f0f0f0] bg-white py-32">
      <div className="container-pro max-w-[800px] text-[#1C1C1C]">
        <div className="mb-24 text-center">
          <h2 className="heading-xl">Our Approach</h2>
        </div>
        <div className="space-y-16">
          {PARAGRAPHS.map((p, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <h3 className="mb-4 text-xl font-black tracking-tight uppercase">{p.title}</h3>
              <p className="text-base leading-[1.8] font-medium text-[#6B6B6B]">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
