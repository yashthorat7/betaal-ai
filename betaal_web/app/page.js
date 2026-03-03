'use client';

import { useState, useCallback } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import StatsSection from '@/components/landing/StatsSection';
import BentoGrid from '@/components/landing/BentoGrid';
import MarqueeSection from '@/components/landing/MarqueeSection';


export default function Home() {
  const [mouse, setMouse] = useState({ x: -999, y: -999 });

  const handleMouseMove = useCallback((e) => {
    setMouse({ x: e.clientX, y: e.clientY + window.scrollY });
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ 
        background: '#FAFAFA', 
        color: '#1C1C1C', 
        position: 'relative',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}
    >
      {/* Universal Grid Reveal Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: `radial-gradient(circle 350px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 350px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 100%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <BentoGrid />
        <MarqueeSection />

      </div>
    </div>
  );
}
