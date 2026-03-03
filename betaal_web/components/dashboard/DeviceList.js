'use client';

import { Smartphone, Laptop, Monitor, Plus } from 'lucide-react';
import DashboardCard from './DashboardCard';

const ICONS = {
  phone: Smartphone,
  laptop: Laptop,
  desktop: Monitor,
};

export default function DeviceList({ devices = [] }) {
  return (
    <DashboardCard title="Active Network" subtitle="Connected Hardware" icon={Monitor}>
      <div className="mt-6 space-y-4">
        {devices.map((d, i) => {
          const Icon = ICONS[d.type] || Smartphone;
          return (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-[#f0f0f0] bg-[#FAFAFA] p-4 transition-all duration-300 hover:border-[#1C1C1C]/10 hover:bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#f0f0f0] bg-white text-[#1C1C1C]/30 shadow-[0_4px_10px_rgba(0,0,0,0.012)]">
                  <Icon size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="max-w-[120px] truncate text-[11px] font-[900] tracking-widest text-[#1C1C1C] uppercase">
                    {d.name}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`h-1 w-1 rounded-full ${d.status === 'active' ? 'bg-[#34c759]' : 'bg-[#f0f0f0]'}`}
                    />
                    <span className="text-[9px] leading-none font-bold tracking-widest text-[#1C1C1C]/20 uppercase">
                      {d.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black tracking-tighter text-[#1C1C1C]/80">
                  {d.today_min}M
                </span>
                <span className="mt-1 block text-[8px] font-bold tracking-widest text-[#1C1C1C]/10 uppercase">
                  Today
                </span>
              </div>
            </div>
          );
        })}

        <button className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#e0e0e0] p-4 transition-all duration-300 hover:border-[#1C1C1C]/10 hover:bg-[#FAFAFA]">
          <Plus
            size={14}
            className="text-[#1C1C1C]/20 transition-colors group-hover:text-[#1C1C1C]/40"
          />
          <span className="text-[10px] font-black tracking-[0.2em] text-[#1C1C1C]/20 uppercase transition-colors group-hover:text-[#1C1C1C]/40">
            Link New
          </span>
        </button>
      </div>
    </DashboardCard>
  );
}
