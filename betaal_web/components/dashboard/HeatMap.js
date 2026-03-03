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
      <div className="flex gap-4 mt-8">
        {/* Day labels */}
        <div className="flex flex-col justify-between py-1 h-28 shrink-0">
          {DAYS.map((d) => (
            <span key={d} className="text-[8px] font-black text-[#1C1C1C]/15 uppercase tracking-widest">{d}</span>
          ))}
        </div>

        {/* Grid rows */}
        <div className="flex-1 flex gap-1.5 h-28">
          {weeks.map((w, wi) => (
            <div key={wi} className="flex-1 flex flex-col gap-1.5 h-full">
              {w.map((v, di) => (
                <div
                  key={di}
                  className={`group relative flex-1 w-full rounded-sm ${getColor(v, max)} transition-all duration-300 hover:scale-[1.15] hover:ring-2 hover:ring-[#1C1C1C]/10 cursor-default`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex bg-[#1C1C1C] text-white px-2 py-1 rounded-md text-[8px] font-black whitespace-nowrap z-50 shadow-2xl uppercase tracking-widest">
                    {v}M
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-8 border-t border-[#f5f5f5] pt-8">
        <span className="text-[9px] font-black text-[#1C1C1C]/15 uppercase tracking-[0.2em] mr-2">Intensity</span>
        {['bg-[#f5f5f5]', 'bg-[#d0d0d0]', 'bg-[#a0a0a0]', 'bg-[#606060]', 'bg-[#1C1C1C]'].map((c, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-sm ${c} border border-[#1C1C1C]/[0.02] shadow-[0_1px_4px_rgba(0,0,0,0.01)]`} />
        ))}
      </div>
    </DashboardCard>
  );
}
