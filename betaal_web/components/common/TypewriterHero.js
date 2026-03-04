'use client';
import { useEffect, useState } from 'react';
import { useInView } from '@/lib/hooks/useInView';

const DEFAULT_SQUARES = [
  { size: 70, top: '8%', left: '4%', rotate: -20, depth: 0.04 },
  { size: 60, top: '12%', right: '6%', rotate: 55, depth: 0.06 },
  { size: 85, bottom: '15%', left: '6%', rotate: 130, depth: 0.035 },
  { size: 50, bottom: '20%', right: '5%', rotate: -50, depth: 0.05 },
];

export default function TypewriterHero({
  text,
  label = 'Our Mission',
  squares = DEFAULT_SQUARES,
  speed = 14,
}) {
  const [ref, started] = useInView({ threshold: 0.2, once: true });
  const [charCount, setCharCount] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setCharCount(i);
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [started, text, speed]);

  useEffect(() => {
    const fn = (e) =>
      setParallax({ x: e.clientX - innerWidth / 2, y: e.clientY - innerHeight / 2 });
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-[160px] md:py-[200px] mt-[40px] md:mt-0">
      {squares.map((s, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-[10px] border-[1.5px] border-purple-500/15 bg-purple-500/[0.02] transition-transform duration-500 ease-out"
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
        <span className="animate-fade-in label-pro mb-8 block">{label}</span>
        <p className="text-foreground relative mx-auto max-w-none text-[clamp(24px,3.5vw,42px)] leading-[1.2] font-bold tracking-tight px-4">
          <span className="pointer-events-none invisible">{text}</span>
          <span className="pointer-events-none absolute inset-0">
            <span>{text.slice(0, charCount)}</span>
            <span className="invisible">{text.slice(charCount)}</span>
          </span>
        </p>
      </div>
    </section>
  );
}
