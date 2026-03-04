'use client';

import { useEffect, useState, useRef } from 'react';
import DashboardCard from './DashboardCard';
import { Target } from 'lucide-react';

export default function ProgressRing({ usage = 0, quota = 100 }) {
  const r = 85;
  const c = 2 * Math.PI * r;
  const p = quota > 0 ? Math.min(100, Math.max(0, (usage / quota) * 100)) : 0;
  const isOver = usage > quota;
  const strokeColor = isOver ? '#ff3b30' : '#1C1C1C';
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setAnimated(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const off = animated && !isNaN(p) ? c - (p / 100) * c : c;

  return (
    <DashboardCard
      title="Daily Recovery"
      subtitle="Usage Status"
      icon={Target}
      badge={isOver ? 'Alert' : 'Balanced'}
      className="flex h-full flex-col items-center justify-center text-center"
    >
      <div ref={ref} className="relative flex items-center justify-center p-8">
        <svg className="h-64 w-64 -rotate-90">
          {/* Background ring */}
          <circle cx="128" cy="128" r={r} stroke="#f0f0f0" strokeWidth="12" fill="transparent" />
          {/* Progress ring */}
          <circle
            cx="128"
            cy="128"
            r={r}
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={c}
            style={{
              strokeDashoffset: off,
              transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)',
              strokeLinecap: 'butt',
            }}
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span
            className="text-6xl font-black tracking-tighter text-[#1C1C1C] transition-colors duration-500"
            style={{ color: strokeColor }}
          >
            {Math.round(p)}%
          </span>
          <span className="mt-2 text-[10px] font-black tracking-[0.2em] text-[#1C1C1C]/30 uppercase">
            Consumed
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <span className="text-[11px] font-black tracking-[0.15em] text-[#1C1C1C]/40 uppercase">
          {usage}m used of {quota}m
        </span>
        <p className="mt-1 text-[10px] font-bold text-[#1C1C1C]/20 uppercase">
          {isOver ? 'Critical Alert: Exceeded Daily Quota' : 'Pacing Well Toward Goal'}
        </p>
      </div>
    </DashboardCard>
  );
}
