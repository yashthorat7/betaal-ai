'use client';

import { useEffect, useRef, useState } from 'react';

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

export default function AboutSection() {
  const ref = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => { i++; setCharCount(i); if (i >= ABOUT_TEXT.length) clearInterval(iv); }, 12);
    return () => clearInterval(iv);
  }, [started]);

  useEffect(() => {
    const fn = (e) => setParallax({ x: e.clientX - innerWidth / 2, y: e.clientY - innerHeight / 2 });
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section ref={ref} style={{ position: 'relative', padding: '120px 0', overflow: 'hidden', minHeight: 420 }}>
      {SQUARES.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', width: s.size, height: s.size, top: s.top, left: s.left, right: s.right, bottom: s.bottom,
          border: '1.5px solid rgba(0,212,255,0.2)', borderRadius: 10, background: 'rgba(0,212,255,0.02)',
          transform: `rotate(${s.rotate}deg) translate(${parallax.x * s.depth}px, ${parallax.y * s.depth}px)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', pointerEvents: 'none',
        }} />
      ))}

      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 40px' }}>
        <p style={{ fontSize: 'clamp(45px, 2.8vw, 60px)', fontWeight: 700, lineHeight: 1.1, color: '#1C1C1C', letterSpacing: '-0.02em', position: 'relative' }}>
          {/* Sizing shadow to prevent jitter */}
          <span style={{ visibility: 'hidden', pointerEvents: 'none' }}>{ABOUT_TEXT}</span>
          {/* Overlay text */}
          <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <span>{ABOUT_TEXT.slice(0, charCount)}</span>
            <span style={{ visibility: 'hidden' }}>{ABOUT_TEXT.slice(charCount)}</span>
          </span>
        </p>
      </div>
    </section>
  );
}
