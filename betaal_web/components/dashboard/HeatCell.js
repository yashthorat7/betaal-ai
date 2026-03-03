'use client';

function getHeatColor(value, max) {
  const t = Math.min(1, value / max);
  if (t < 0.2) return '#f0f0f0';
  if (t < 0.4) return '#d0d0d0';
  if (t < 0.6) return '#a0a0a0';
  if (t < 0.8) return '#606060';
  return '#1C1C1C';
}

export default function HeatCell({ weeks }) {
  const max = Math.max(...weeks.flat(), 1);
  return (
    <div className="dash-card group h-full">
      <div
        className="dash-card-glow group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at 80% 80%, rgba(0,212,255,0.04), transparent 60%)',
        }}
      />
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <h3 className="stat-label">Usage Density</h3>
        <span className="text-[9px] font-black tracking-widest text-[#1C1C1C]/15 uppercase">
          4-Week Grid
        </span>
      </div>
      <div className="relative z-10 flex gap-1.5">
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-1 flex-col gap-1.5">
            {w.map((v, di) => (
              <div
                key={di}
                title={`${v}m`}
                className="group/cell relative aspect-square w-full cursor-default rounded-md transition-all duration-300 hover:z-10 hover:scale-125"
                style={{ backgroundColor: getHeatColor(v, max) }}
              >
                <div className="absolute bottom-full left-1/2 z-50 mb-1.5 hidden -translate-x-1/2 rounded-md bg-[#1C1C1C] px-2 py-1 text-[8px] font-black tracking-widest whitespace-nowrap text-white uppercase shadow-2xl group-hover/cell:flex">
                  {v}m
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="relative z-10 mt-6 flex items-center gap-1.5">
        <span className="mr-1 text-[8px] font-black tracking-widest text-[#1C1C1C]/15 uppercase">
          Low
        </span>
        {['#f0f0f0', '#d0d0d0', '#a0a0a0', '#606060', '#1C1C1C'].map((c) => (
          <div key={c} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: c }} />
        ))}
        <span className="ml-1 text-[8px] font-black tracking-widest text-[#1C1C1C]/15 uppercase">
          High
        </span>
      </div>
    </div>
  );
}
