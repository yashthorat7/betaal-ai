'use client';

const FEATURES = [
  { title: 'Adaptive AI Alerts', desc: 'Smart notifications that learn your patterns and intervene at the right moment to guide you back to focus.', span: 'span 2', rowSpan: 'span 1', gradient: 'radial-gradient(ellipse at 30% 30%, rgba(175,82,222,0.08), transparent 70%)' },
  { title: 'Real-Time Tracking', desc: 'Live dashboard showing your screen time, app usage, focus zones, and daily behavioral patterns.', span: 'span 1', rowSpan: 'span 2', gradient: 'radial-gradient(ellipse at 70% 20%, rgba(0,212,255,0.08), transparent 70%)' },
  { title: 'Focus Sessions', desc: 'Guided deep-work blocks with distraction blocking and ambient sounds for sustained concentration.', span: 'span 1', rowSpan: 'span 1', gradient: 'radial-gradient(ellipse at 50% 80%, rgba(255,45,85,0.07), transparent 70%)' },
  { title: 'Progress Analytics', desc: 'Weekly reports with trend analysis, streaks, and improvement scores to keep you motivated.', span: 'span 1', rowSpan: 'span 1', gradient: 'radial-gradient(ellipse at 20% 60%, rgba(90,200,250,0.08), transparent 70%)' },
  { title: 'Community Support', desc: 'Connect with accountability partners and support groups on similar rehabilitation journeys.', span: 'span 1', rowSpan: 'span 1', gradient: 'radial-gradient(ellipse at 80% 40%, rgba(175,82,222,0.07), transparent 70%)' },
  { title: 'Browser Extension', desc: 'Extends protection to desktop browsing with intelligent site blockers and customizable time limits.', span: 'span 2', rowSpan: 'span 1', gradient: 'radial-gradient(ellipse at 60% 30%, rgba(0,122,255,0.07), transparent 70%)' },
];

export default function BentoGrid() {
  return (
    <section style={{ padding: '100px 0', background: 'transparent' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 60px' }}>
        <h2 className="animate-fade-in" style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#1C1C1C', marginBottom: 60, lineHeight: 1 }}>
          Everything You Need
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 'minmax(280px, auto)', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="animate-fade-in"
              style={{
                gridColumn: f.span, gridRow: f.rowSpan, borderRadius: 20,
                position: 'relative', overflow: 'hidden', cursor: 'default',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                transition: 'box-shadow 0.35s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                animationDelay: `${i * 0.08}s`,
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
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #f2f2f2 0%, #eaeaea 50%, #f0f0f0 100%)', border: '1px solid #e0e0e0', borderRadius: 20 }} />
              <div data-mesh="" style={{ position: 'absolute', inset: 0, background: f.gradient, opacity: 0, transition: 'opacity 0.5s', pointerEvents: 'none', borderRadius: 20 }} />
              <div style={{ position: 'relative', zIndex: 1, padding: 40, background: 'linear-gradient(to top, rgba(250,250,250,0.95) 60%, transparent 100%)', borderRadius: '0 0 20px 20px' }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#1C1C1C', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.55, color: '#6B6B6B', margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
