'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useInView } from '@/lib/hooks/useInView';

const ALL_ICONS = [
  '/icons/icon_alarm_clock.png',
  '/icons/icon_brain_yoga.png',
  '/icons/icon_hourglass_nature.png',
  '/icons/icon_meditation_person.png',
  '/icons/icon_open_book.png',
  '/icons/icon_plant_phone.png',
  '/icons/icon_sunrise_walk.png',
];

// Seeded-random so positions are stable per mount but shuffle each reload
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildCards(seed) {
  const rand = seededRandom(seed);

  // Shuffle icons
  const shuffled = [...ALL_ICONS].sort(() => rand() - 0.5);
  const picked = shuffled.slice(0, 5);

  // Safe zone: icons must not overlap the center text (roughly 30%–70% x, 30%–70% y)
  const positions = [
    { top: `${6 + rand() * 10}%`, left: `${2 + rand() * 8}%`, rotate: -15 + rand() * 20, depth: 0.04 + rand() * 0.03 },
    { top: `${5 + rand() * 10}%`, right: `${2 + rand() * 8}%`, rotate: 10 + rand() * 25, depth: 0.05 + rand() * 0.03 },
    { bottom: `${8 + rand() * 8}%`, left: `${3 + rand() * 8}%`, rotate: -20 + rand() * 30, depth: 0.03 + rand() * 0.02 },
    { bottom: `${8 + rand() * 8}%`, right: `${3 + rand() * 8}%`, rotate: 15 + rand() * 20, depth: 0.05 + rand() * 0.03 },
    { top: `${40 + rand() * 10}%`, left: `${1 + rand() * 5}%`, rotate: -10 + rand() * 20, depth: 0.025 + rand() * 0.02 },
  ];

  return picked.map((src, i) => ({ src, ...positions[i] }));
}

export default function TypewriterHero({
  text,
  label = 'Our Mission',
  speed = 14,
}) {
  const [ref, started] = useInView({ threshold: 0.2, once: true });
  const [charCount, setCharCount] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const [cards, setCards] = useState([]);

  // Randomize once per mount using timestamp as seed, but do it inside useEffect
  // to avoid SSR hydration mismatches.
  useEffect(() => {
    setCards(buildCards(Date.now() % 99991));
  }, []);

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
    <section
      ref={ref}
      className="relative overflow-hidden bg-transparent py-[160px] md:py-[200px] mt-[40px] md:mt-0"
    >
      {/* Floating icon cards */}
      {cards.map((card, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={{
            top: card.top,
            left: card.left,
            right: card.right,
            bottom: card.bottom,
            transform: `rotate(${card.rotate}deg) translate(${parallax.x * card.depth}px, ${parallax.y * card.depth}px)`,
            transition: 'transform 0.5s ease-out',
            animation: `iconFloat${i % 3} ${3.5 + i * 0.4}s ease-in-out infinite`,
            zIndex: 0,
          }}
        >
          {/* Glass card background - now just a square container for the image */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              boxShadow: '0 8px 32px rgba(120,80,200,0.13), 0 2px 8px rgba(0,0,0,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden', // Crucial for cropping zoomed image
            }}
          >
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Image
                src={card.src}
                alt="icon"
                fill
                style={{
                  objectFit: 'cover',
                  transform: 'scale(1.2)', // 120% zoom as requested to crop borders
                }}
                sizes="100px"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Keyframe injection */}
      <style>{`
        @keyframes iconFloat0 {
          0%, 100% { translate: 0 0px; }
          50% { translate: 0 -10px; }
        }
        @keyframes iconFloat1 {
          0%, 100% { translate: 0 0px; }
          50% { translate: 0 -7px; }
        }
        @keyframes iconFloat2 {
          0%, 100% { translate: 0 0px; }
          50% { translate: 0 -13px; }
        }
      `}</style>

      {/* Hero text */}
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
