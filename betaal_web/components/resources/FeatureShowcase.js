'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Play, BookOpen, Users } from 'lucide-react';
import { RESOURCE_FEATURES } from '@/lib/resources-data';

const ICON_MAP = { MessageCircle, Play, BookOpen, Users };

export default function FeatureShowcase() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardsRef = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisibleCards(prev => new Set([...prev, e.target.dataset.idx]));
      });
    }, { threshold: 0.15 });
    cardsRef.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const GRADIENTS = [
    'radial-gradient(ellipse at 30% 30%, rgba(175,82,222,0.08), transparent 70%)',
    'radial-gradient(ellipse at 70% 20%, rgba(0,212,255,0.08), transparent 70%)',
    'radial-gradient(ellipse at 50% 80%, rgba(255,45,85,0.07), transparent 70%)',
    'radial-gradient(ellipse at 20% 60%, rgba(90,200,250,0.08), transparent 70%)',
  ];

  const ACCENT_COLORS = ['#af52de', '#00d4ff', '#ff2d55', '#5ac8fa'];

  return (
    <section className="py-20">
      <div className="container-pro">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-[#1C1C1C]">
            Resources Built for Recovery
          </h2>
        </div>

        {/* 2×2 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {RESOURCE_FEATURES.map((f, i) => {
            const Icon = ICON_MAP[f.icon];
            return (
              <div
                key={i}
                ref={el => (cardsRef.current[i] = el)}
                data-idx={i}
                style={{
                  borderRadius: 20, position: 'relative', overflow: 'hidden',
                  padding: '48px 40px', cursor: 'default', minHeight: 220,
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: visibleCards.has(String(i)) ? 1 : 0,
                  transform: visibleCards.has(String(i)) ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 36px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.querySelector('[data-mesh]').style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.querySelector('[data-mesh]').style.opacity = '0';
                }}
              >
                {/* Base bg */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #f2f2f2 0%, #eaeaea 50%, #f0f0f0 100%)', border: '1px solid #e0e0e0', borderRadius: 20 }} />
                {/* Mesh gradient */}
                <div data-mesh="" style={{ position: 'absolute', inset: 0, background: GRADIENTS[i], opacity: 0, transition: 'opacity 0.5s', pointerEvents: 'none', borderRadius: 20 }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Icon */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${ACCENT_COLORS[i]}12`, border: `1px solid ${ACCENT_COLORS[i]}25`, marginBottom: 24,
                  }}>
                    {Icon && <Icon size={22} style={{ color: ACCENT_COLORS[i] }} />}
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#1C1C1C', marginBottom: 12 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.6, color: '#6B6B6B', margin: 0, maxWidth: 420 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
