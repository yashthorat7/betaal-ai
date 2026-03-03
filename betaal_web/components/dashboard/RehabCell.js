'use client';

export default function RehabCell({ plan }) {
  if (!plan) return null;
  const pct = Math.round((plan.current_day / plan.duration_days) * 100);

  return (
    <div className="dash-card group h-full">
      <div
        className="dash-card-glow group-hover:opacity-100"
        style={{
          background: 'radial-gradient(ellipse at 60% 30%, rgba(175,82,222,0.05), transparent 70%)',
        }}
      />
      <div className="relative z-10 mb-10 flex items-start justify-between">
        <div>
          <h3 className="stat-label mb-2">Recovery Path</h3>
          <p className="text-2xl font-black tracking-tighter text-[#1C1C1C]">
            Phase {plan.current_phase} —{' '}
            {plan.phases.find((p) => p.phase === plan.current_phase)?.name}
          </p>
        </div>
        <span className="text-[10px] font-black tracking-widest text-[#1C1C1C]/15 uppercase">
          Day {plan.current_day} / {plan.duration_days}
        </span>
      </div>
      <div className="relative z-10 mb-10 flex items-center">
        {plan.phases.map((ph, i) => {
          const isActive = ph.phase === plan.current_phase;
          const isPast = ph.phase < plan.current_phase;
          return (
            <div key={i} className="relative flex flex-1 flex-col items-center">
              {i > 0 && (
                <div
                  className={`absolute top-4 right-1/2 h-[2px] w-full ${isPast ? 'bg-[#1C1C1C]' : 'bg-[#f0f0f0]'} z-0`}
                />
              )}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[9px] font-black transition-all duration-700 ${isActive ? 'scale-[1.2] bg-[#1C1C1C] text-white ring-8 ring-[#1C1C1C]/5' : isPast ? 'bg-[#1C1C1C] text-white' : 'border border-[#e8e8e8] bg-[#f5f5f5] text-[#1C1C1C]/20'}`}
              >
                {ph.phase}
              </div>
              <span
                className={`mt-3 text-center text-[9px] font-black tracking-widest uppercase ${isActive ? 'text-[#1C1C1C]' : 'text-[#1C1C1C]/15'}`}
              >
                {ph.name}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative z-10 mb-4 h-2 overflow-hidden rounded-full bg-[#f5f5f5]">
        <div
          className="h-full rounded-full bg-[#1C1C1C] transition-all duration-[2s] ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="relative z-10 text-[9px] font-black tracking-widest text-[#1C1C1C]/15 uppercase">
        {pct}% Complete
      </span>
    </div>
  );
}
