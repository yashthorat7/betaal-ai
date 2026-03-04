'use client';

import DashboardCard from './DashboardCard';
import { LayoutGrid } from 'lucide-react';

const DAYS = ['M', 'W', 'F'];

function getColor(value, max) {
  const intensity = Math.min(1, value / max);
  if (intensity < 0.2) return 'bg-[#f5f5f5]';
  if (intensity < 0.4) return 'bg-[#d0d0d0]';
  if (intensity < 0.6) return 'bg-[#a0a0a0]';
  if (intensity < 0.8) return 'bg-[#606060]';
  return 'bg-[#1C1C1C]';
}

export default function HeatMap({ weeks = [] }) {
  const max = Math.max(...weeks.flat(), 1);

  return (
    <DashboardCard title="Usage Grid" subtitle="Density Map" icon={LayoutGrid}>
      <div className="mt-8 flex gap-4">
        {/* Day labels */}
        <div className="flex h-28 shrink-0 flex-col justify-between py-1">
          {DAYS.map((d) => (
            <span
              key={d}
              className="text-[8px] font-black text-[#1C1C1C]/15 uppercase"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Grid rows */}
        <div className="flex h-28 flex-1 gap-1.5">
          {weeks.map((w, wi) => (
            <div key={wi} className="flex h-full flex-1 flex-col gap-1.5">
              {w.map((v, di) => (
                <div
                  key={di}
                  className={`group relative w-full flex-1 rounded-sm ${getColor(v, max)} cursor-default transition-all duration-300 hover:scale-[1.15] hover:ring-2 hover:ring-[#1C1C1C]/10`}
                >
                  <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 rounded-md bg-[#1C1C1C] px-2 py-1 text-[8px] font-black whitespace-nowrap text-white uppercase shadow-2xl group-hover:flex">
                    {v}M
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-end gap-1.5 border-t border-[#f5f5f5] pt-8">
        <span className="mr-2 text-[9px] font-black tracking-[0.2em] text-[#1C1C1C]/15 uppercase">
          Intensity
        </span>
        {['bg-[#f5f5f5]', 'bg-[#d0d0d0]', 'bg-[#a0a0a0]', 'bg-[#606060]', 'bg-[#1C1C1C]'].map(
          (c, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-sm ${c} border border-[#1C1C1C]/[0.02] shadow-[0_1px_4px_rgba(0,0,0,0.01)]`}
            />
          ),
        )}
      </div>
    </DashboardCard>
  );
}
