'use client';

import DashboardCard from './DashboardCard';
import { LayoutGrid } from 'lucide-react';

const DAYS = ['M', 'W', 'F'];

function getColor(value, max) {
  const intensity = Math.min(1, value / max);
  if (intensity < 0.2) return 'bg-gray-100';
  if (intensity < 0.4) return 'bg-blue-200';
  if (intensity < 0.6) return 'bg-blue-400';
  if (intensity < 0.8) return 'bg-blue-600';
  return 'bg-blue-800';
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
              className="text-xs font-medium text-gray-400"
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
                  <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white shadow-xl group-hover:flex">
                    {v}M
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-end gap-1.5 border-t border-gray-100 pt-8">
        <span className="mr-2 text-xs font-medium text-gray-400">Less</span>
        {['bg-gray-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800'].map(
          (c, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-sm ${c} border border-black/5`}
            />
          ),
        )}
        <span className="ml-2 text-xs font-medium text-gray-400">More</span>
      </div>
    </DashboardCard>
  );
}
