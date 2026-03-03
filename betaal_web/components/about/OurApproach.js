'use client';

import { useEffect, useRef, useState } from 'react';

const PARAGRAPHS = [
  {
    title: 'Why Gradual Intervention?',
    text: 'Cold-turkey detoxes fail 87% of the time. Our research shows that gradual, AI-guided reduction creates lasting behavioral change. Betaal learns your habits and introduces gentle friction at the right moments . building awareness without triggering rebellion.',
  },
  {
    title: 'Adaptive Intelligence',
    text: 'Our AI doesn\'t just track time. It understands context . differentiating productive screen use from mindless scrolling. Over time, it builds a personalized model that adapts to your schedule, stress levels, and recovery goals.',
  },
  {
    title: 'Our Vision',
    text: 'We\'re building toward a future where technology serves human flourishing. Betaal AI is the first step . proving that the same AI powering addictive algorithms can be redirected to heal the damage they\'ve caused.',
  },
];

export default function OurApproach() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-32 bg-white border-t border-[#f0f0f0]">
      <div className="container-pro max-w-[800px] text-[#1C1C1C]">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="heading-xl">Our Approach</h2>
        </div>

        {/* Paragraphs */}
        <div className="space-y-16">
          {PARAGRAPHS.map((p, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <h3 className="text-xl font-black tracking-tight uppercase mb-4">
                {p.title}
              </h3>
              <p className="text-base font-medium leading-[1.8] text-[#6B6B6B]">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
