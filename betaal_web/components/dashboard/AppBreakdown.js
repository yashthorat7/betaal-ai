'use client';

import DashboardCard from './DashboardCard';
import { LayoutGrid } from 'lucide-react';

export default function AppBreakdown({ apps = [] }) {
  const sorted = [...apps].sort((a, b) => b.minutes - a.minutes);
  const maxMin = sorted[0]?.minutes || 60;

  return (
    <DashboardCard title="Popular Apps" subtitle="Usage Breakdown" icon={LayoutGrid}>
      <div className="space-y-6 mt-6">
        {sorted.map((a, i) => {
          const pct = Math.round((a.minutes / maxMin) * 100);
          return (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#1C1C1C]">
                  {a.app_name}
                </span>
                <span className="text-[10px] font-black text-[#1C1C1C]/20 ml-2">
                  {a.minutes}M
                </span>
              </div>
              
              <div className="relative h-1 w-full bg-[#f5f5f5] rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-[#1C1C1C] rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${pct}%`,
                    opacity: Math.max(0.1, (pct / 100)) 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-8 border-t border-[#f5f5f5]">
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/25">
          <span>Active Tracking</span>
          <span>Updated 2m ago</span>
        </div>
      </div>
    </DashboardCard>
  );
}
