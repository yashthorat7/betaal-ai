'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 10000, suffix: '+', label: 'Active Users' },
  { value: 95, suffix: '%', label: 'Success Rate' },
  { value: 2, suffix: 'M+', label: 'Sessions Tracked' },
  { value: 50, suffix: '+', label: 'Partner Clinics' },
];

export default function StatsSection() {
  const ref = useRef(null);
  const nums = useRef([]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      nums.current.forEach((el, i) => {
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: STATS[i].value, duration: 2.4, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', toggleActions: 'play none none none' },
          onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString() + STATS[i].suffix; },
        });
      });
      gsap.to({}, {
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1.5, onUpdate: (s) => setScale(1 + s.progress * 0.1) },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(ellipse at center, #252525 0%, #1C1C1C 70%)', transform: `scale(${scale})`, willChange: 'transform', zIndex: 0 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 60px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative', zIndex: 1 }}>
        {STATS.map((s, i) => (
          <div
            key={i}
            className="animate-fade-in"
            style={{
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '48px 32px', textAlign: 'center',
              background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(4px)',
              transition: 'border-color 0.4s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s',
              animationDelay: `${i * 0.1}s`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,212,255,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div ref={(el) => (nums.current[i] = el)} style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#FAFAFA', lineHeight: 1 }}>0</div>
            <div style={{ marginTop: 16, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(250,250,250,0.45)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
