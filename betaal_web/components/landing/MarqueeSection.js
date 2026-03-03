'use client';

const TEXT = 'Are you ready to leave smartphone addiction?';

export default function MarqueeSection() {
  return (
    <section style={{ padding: '44px 0', background: 'transparent', overflow: 'hidden', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform', animation: 'marqueeScroll 12s linear infinite' }}>
        {[...Array(8)].map((_, i) => (
          <span key={i} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 36, paddingRight: 36 }}>
            <span style={{ fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#1C1C1C' }}>{TEXT}</span>
            <span style={{ display: 'inline-block', width: 60, height: 60, borderRadius: 14, border: '1.5px solid #d0d0d0', background: 'linear-gradient(135deg, #f0f0f0, #e4e4e4)', flexShrink: 0 }} />
          </span>
        ))}
      </div>
      <style jsx>{`@keyframes marqueeScroll { 0% { transform: translate3d(0,0,0); } 100% { transform: translate3d(-25%,0,0); } }`}</style>
    </section>
  );
}
