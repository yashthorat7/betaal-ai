'use client';
import { useEffect, useState } from 'react';

export default function RingCell({ usage, quota }) {
  const r = 90,
    c = 2 * Math.PI * r;
  const p = quota > 0 ? Math.min(100, (usage / quota) * 100) : 0;
  const isOver = usage > quota;
  const color = isOver ? '#ff3b30' : '#1C1C1C';
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnim(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="dash-card group flex h-full flex-col items-center justify-center p-10">
      <div
        className="dash-card-glow group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}07, transparent 70%)` }}
      />
      <span className="stat-label relative z-10 mb-8">Daily Recovery</span>
      <div className="relative z-10 flex items-center justify-center">
        <svg className="-rotate-90" width="220" height="220">
          <circle cx="110" cy="110" r={r} stroke="#f5f5f5" strokeWidth="14" fill="none" />
          <circle
            cx="110"
            cy="110"
            r={r}
            stroke={color}
            strokeWidth="14"
            fill="none"
            strokeDasharray={c}
            style={{
              strokeDashoffset: anim ? c - (p / 100) * c : c,
              transition: 'stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-black tracking-tighter" style={{ color }}>
            {Math.round(p)}%
          </span>
          <span className="mt-1 text-[9px] font-[900] tracking-widest text-[#1C1C1C]/20 uppercase">
            Used
          </span>
        </div>
      </div>
      <div className="z-10 mt-8 text-center">
        <span className="text-[11px] font-black tracking-widest text-[#1C1C1C]/30 uppercase">
          {usage}m <span className="mx-1 text-[#1C1C1C]/10">/</span> {quota}m
        </span>
        <div
          className={`mt-3 inline-block rounded-full px-4 py-1.5 text-[9px] font-black tracking-widest uppercase ${isOver ? 'bg-[#ff3b30]/5 text-[#ff3b30]' : 'bg-[#34c759]/5 text-[#34c759]'}`}
        >
          {isOver ? 'Over Quota' : 'In Range'}
        </div>
      </div>
    </div>
  );
}
