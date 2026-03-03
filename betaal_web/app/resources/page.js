'use client';

import { useState, useCallback } from 'react';
import ResourcesHero from '@/components/resources/ResourcesHero';
import VideoGrid from '@/components/resources/VideoGrid';
import BlogSection from '@/components/resources/BlogSection';

import ResourcesFAQ from '@/components/resources/ResourcesFAQ';

export default function ResourcesPage() {
  const [mouse, setMouse] = useState({ x: -999, y: -999 });

  const handleMouseMove = useCallback((e) => {
    setMouse({ x: e.clientX, y: e.clientY + window.scrollY });
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        background: '#FFFFFF',
        color: '#1C1C1C',
        position: 'relative',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Grid reveal background */}
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
        <ResourcesHero />

        <VideoGrid />
        <BlogSection />


        {/* Second marquee before FAQ */}
        <div className="overflow-hidden border-t border-b border-[#f0f0f0] py-16">
          <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marqueeScrollReverse 28s linear infinite' }}>
            {[...Array(10)].map((_, i) => (
              <span key={i} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 32, paddingRight: 32 }}>
                <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(28,28,28,0.2)' }}>
                  Recover • Rebuild • Reclaim • Rewire • Reflect • Restart
                </span>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'rgba(28,28,28,0.15)', flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>

        <ResourcesFAQ />
      </div>

      <style jsx>{`
        @keyframes marqueeScroll { 0% { transform: translate3d(0,0,0); } 100% { transform: translate3d(-50%,0,0); } }
        @keyframes marqueeScrollReverse { 0% { transform: translate3d(-50%,0,0); } 100% { transform: translate3d(0,0,0); } }
      `}</style>
    </div>
  );
}
