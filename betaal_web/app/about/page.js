'use client';

import { useState, useCallback } from 'react';
import MissionHero from '@/components/about/MissionHero';
import TeamSection from '@/components/about/TeamSection';
import ContactForm from '@/components/about/ContactForm';

export default function AboutPage() {
  const [mouse, setMouse] = useState({ x: -999, y: -999 });

  const handleMouseMove = useCallback((e) => {
    setMouse({ x: e.clientX, y: e.clientY + window.scrollY });
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-x-hidden bg-white text-[#1C1C1C]"
    >
      {/* Grid reveal background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: `radial-gradient(circle 350px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 350px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 100%)`,
        }}
      />

      <div className="relative z-1">
        <MissionHero />
        <TeamSection />
        <ContactForm />
      </div>
    </div>
  );
}
