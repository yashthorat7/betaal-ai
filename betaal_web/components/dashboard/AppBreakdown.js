'use client';

import DashboardCard from './DashboardCard';
import { LayoutGrid } from 'lucide-react';

export default function AppBreakdown({ apps = [] }) {
  const sorted = [...apps].sort((a, b) => b.minutes - a.minutes);
  const maxMin = sorted[0]?.minutes || 60;

  return (
    <DashboardCard title="Popular Apps" subtitle="Usage Breakdown" icon={LayoutGrid}>
      <div className="mt-6 space-y-6">
        {sorted.map((a, i) => {
          const pct = Math.round((a.minutes / maxMin) * 100);
          return (
            <div key={i} className="group">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest text-[#1C1C1C] uppercase">
                  {a.app_name}
                </span>
                <span className="ml-2 text-[10px] font-black text-[#1C1C1C]/20">{a.minutes}M</span>
              </div>

              <div className="relative h-1 w-full overflow-hidden rounded-full bg-[#f5f5f5]">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-[#1C1C1C] transition-all duration-1000 ease-out"
                  style={{
                    width: `${pct}%`,
                    opacity: Math.max(0.1, pct / 100),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-[#f5f5f5] pt-8">
        <div className="flex items-center justify-between text-[9px] font-black tracking-[0.2em] text-[#1C1C1C]/25 uppercase">
          <span>Active Tracking</span>
          <span>Updated 2m ago</span>
        </div>
      </div>
    </DashboardCard>
  );
}
