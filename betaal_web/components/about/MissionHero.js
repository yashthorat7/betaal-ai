'use client';

import { useEffect, useRef, useState } from 'react';

const MISSION_TEXT =
  'We believe technology should empower, not enslave. Betaal AI exists to help people build a healthier relationship with their screens  through science-backed, gradual intervention that actually works.';

const SQUARES = [
  { size: 70, top: '8%', left: '4%', rotate: -20, depth: 0.04 },
  { size: 60, top: '12%', right: '6%', rotate: 55, depth: 0.06 },
  { size: 85, bottom: '15%', left: '6%', rotate: 130, depth: 0.035 },
  { size: 50, bottom: '20%', right: '5%', rotate: -50, depth: 0.05 },
];

export default function MissionHero() {
  const ref = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setCharCount(i);
      if (i >= MISSION_TEXT.length) clearInterval(iv);
    }, 14);
    return () => clearInterval(iv);
  }, [started]);

  useEffect(() => {
    const fn = (e) => setParallax({ x: e.clientX - innerWidth / 2, y: e.clientY - innerHeight / 2 });
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden pt-36 pb-32 bg-white min-h-[420px]">
      {/* Parallax shapes */}
      {SQUARES.map((s, i) => (
        <div
          key={i}
          className="absolute border-[1.5px] border-purple-500/15 rounded-[10px] bg-purple-500/[0.02] pointer-events-none transition-transform duration-500 ease-out"
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            transform: `rotate(${s.rotate}deg) translate(${parallax.x * s.depth}px, ${parallax.y * s.depth}px)`,
          }}
        />
      ))}

      <div className="container-pro relative z-10 text-center">
        {/* Label */}
        <span className="animate-fade-in label-pro block mb-8">Our Mission</span>

        {/* Mission quote with typewriter */}
        <p className="text-[clamp(32px,3vw,52px)] font-bold leading-[1.15] text-[#1C1C1C] tracking-tight relative max-w-5xl mx-auto">
          {/* Sizing shadow */}
          <span className="invisible pointer-events-none">{MISSION_TEXT}</span>
          {/* Overlay */}
          <span className="absolute inset-0 pointer-events-none">
            <span>{MISSION_TEXT.slice(0, charCount)}</span>
            <span className="invisible">{MISSION_TEXT.slice(charCount)}</span>
          </span>
        </p>
      </div>
    </section>
  );
}
