'use client';

import { useRef, useState } from 'react';
import { Download, Puzzle } from 'lucide-react';

const CTA_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 12,
  padding: '18px 36px',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  background: '#FAFAFA',
  border: '1.5px solid #1C1C1C',
  borderRadius: 50,
  color: '#1C1C1C',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
};

function CtaButton({ icon: Icon, label, delay }) {
  return (
    <div className="animate-fade-in" style={{ zIndex: 2, marginTop: 400, animationDelay: delay }}>
      <button
        style={CTA_STYLE}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 14px 32px rgba(28,28,28,0.13)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <Icon size={18} />
        {label}
      </button>
    </div>
  );
}

export default function HeroSection() {
  const headingRef = useRef(null);
  const [mask, setMask] = useState({ x: -999, y: -999 });

  return (
    <section style={{ position: 'relative', paddingTop: 100, background: 'transparent' }}>
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 60px' }}>
        <div
          ref={headingRef}
          onMouseMove={(e) => {
            const r = headingRef.current.getBoundingClientRect();
            setMask({ x: e.clientX - r.left, y: e.clientY - r.top });
          }}
          onMouseLeave={() => setMask({ x: -999, y: -999 })}
          style={{ 
            position: 'relative', 
            display: 'inline-block', 
            cursor: 'default',
            padding: '80px 120px',
            margin: '-80px -120px'
          }}
        >
          <h1 style={{ fontSize: 'clamp(48px, 5.5vw, 88px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, textTransform: 'uppercase', color: '#1C1C1C', margin: 0 }}>
            Reclaim Your Life From<br />Digital Addiction
          </h1>
          <h1
            aria-hidden="true"
            style={{
              position: 'absolute', 
              top: 80, left: 120, right: 120, bottom: 80,
              fontSize: 'clamp(48px, 5.5vw, 88px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, textTransform: 'uppercase', margin: 0,
              background: 'linear-gradient(90deg, #ff2d55, #af52de, #5ac8fa, #007aff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              maskImage: `radial-gradient(circle 480px at ${mask.x}px ${mask.y}px, black 0%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle 480px at ${mask.x}px ${mask.y}px, black 0%, transparent 100%)`,
              pointerEvents: 'none',
            }}
          >
            Reclaim Your Life From<br />Digital Addiction
          </h1>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 40, marginTop: 40, position: 'relative', zIndex: 2 }}>
        <CtaButton icon={Download} label="Download the App" delay="0.3s" />
        <div
          className="animate-slide-up"
          style={{
            width: 570, height: 1020,
            border: '1px solid #d0d0d0', borderRadius: 60,
            background: 'linear-gradient(180deg, #F0F0F0 0%, #E8E8E8 100%)',
            boxShadow: '0 -40px 80px 20px rgba(250,250,250,0.9), 0 12px 40px rgba(0,0,0,0.04)',
            position: 'relative', overflow: 'hidden', flexShrink: 0, zIndex: 3,
          }}
        >
          <div style={{ width: 160, height: 36, background: '#d0d0d0', borderRadius: '0 0 20px 20px', margin: '0 auto' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: '#c0c0c0', letterSpacing: '-0.03em' }}>BETAAL</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#b0b0b0', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 6 }}>App Preview</div>
          </div>
        </div>
        <CtaButton icon={Puzzle} label="Get Extension" delay="0.3s" />
      </div>
    </section>
  );
}
