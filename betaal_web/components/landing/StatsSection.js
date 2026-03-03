'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/lib/hooks/useInView';

const STATS = [
  { value: 10000, suffix: '+', label: 'Active Users' },
  { value: 95, suffix: '%', label: 'Success Rate' },
  { value: 2, suffix: 'M+', label: 'Sessions Tracked' },
  { value: 50, suffix: '+', label: 'Partner Clinics' },
];

export default function StatsSection() {
  const [sectionRef, visible] = useInView({ threshold: 0.2, once: true });
  const nums = useRef([]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!visible) return;
    let mounted = true;
    const ids = [];
    STATS.forEach((s, i) => {
      const el = nums.current[i];
      if (!el) return;
      const start = performance.now();
      const tick = (now) => {
        if (!mounted) return;
        const p = Math.min((now - start) / 2000, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * s.value).toLocaleString() + s.suffix;
        if (p < 1) ids.push(requestAnimationFrame(tick));
      };
      ids.push(requestAnimationFrame(tick));
    });
    return () => {
      mounted = false;
      ids.forEach(cancelAnimationFrame);
    };
  }, [visible]);

  useEffect(() => {
    const fn = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight - r.top) / (innerHeight + r.height), 0), 1);
      setScale(1 + p * 0.1);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [sectionRef]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-[100px]">
      <div
        className="absolute -inset-5 z-0 bg-[radial-gradient(ellipse_at_center,#252525_0%,#1C1C1C_70%)] will-change-transform"
        style={{ transform: `scale(${scale})` }}
      />
      <div className="relative z-[1] mx-auto grid max-w-[1200px] grid-cols-4 gap-6 px-[60px]">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="animate-fade-in rounded-[20px] border border-white/10 bg-white/[0.04] p-12 text-center backdrop-blur-sm transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_16px_40px_rgba(0,212,255,0.08)]"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              ref={(el) => (nums.current[i] = el)}
              className="text-[clamp(36px,4vw,56px)] leading-none font-[900] tracking-[-0.03em] text-[#FAFAFA]"
            >
              0
            </div>
            <div className="mt-4 text-xs font-bold tracking-[0.18em] text-[rgba(250,250,250,0.45)] uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
