'use client';

export default function AppCell({ apps }) {
  const sorted = [...apps].sort((a, b) => b.minutes - a.minutes);
  const max = sorted[0]?.minutes || 1;

  return (
    <div className="dash-card group h-full">
      <div
        className="dash-card-glow group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(175,82,222,0.05), transparent 70%)',
        }}
      />
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <h3 className="stat-label">App Breakdown</h3>
        <span className="text-[9px] font-black tracking-widest text-[#1C1C1C]/15 uppercase">
          Today
        </span>
      </div>
      <div className="relative z-10 space-y-5">
        {sorted.slice(0, 5).map((a, i) => (
          <div key={i}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-[11px] font-black tracking-[0.12em] text-[#1C1C1C] uppercase">
                {a.app_name}
              </span>
              <span className="text-[9px] font-black text-[#1C1C1C]/20">{a.minutes}M</span>
            </div>
            <div className="h-[3px] w-full rounded-full bg-[#f5f5f5]">
              <div
                className="h-full rounded-full bg-[#1C1C1C] transition-all duration-[1.4s] ease-out"
                style={{
                  width: `${Math.round((a.minutes / max) * 100)}%`,
                  opacity: 0.2 + (a.minutes / max) * 0.8,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
