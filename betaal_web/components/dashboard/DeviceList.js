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
      <div className="space-y-4 mt-6">
        {devices.map((d, i) => {
          const Icon = ICONS[d.type] || Smartphone;
          return (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAFA] border border-[#f0f0f0] transition-all duration-300 hover:border-[#1C1C1C]/10 hover:bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#f0f0f0] flex items-center justify-center text-[#1C1C1C]/30 shadow-[0_4px_10px_rgba(0,0,0,0.012)]">
                  <Icon size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-[900] uppercase tracking-widest text-[#1C1C1C] truncate max-w-[120px]">
                    {d.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span 
                      className={`w-1 h-1 rounded-full ${d.status === 'active' ? 'bg-[#34c759]' : 'bg-[#f0f0f0]'}`} 
                    />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1C]/20 leading-none">
                      {d.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black tracking-tighter text-[#1C1C1C]/80">
                  {d.today_min}M
                </span>
                <span className="text-[8px] font-bold text-[#1C1C1C]/10 uppercase tracking-widest mt-1 block">
                  Today
                </span>
              </div>
            </div>
          );
        })}

        <button className="w-full h-14 flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-[#e0e0e0] group transition-all duration-300 hover:border-[#1C1C1C]/10 hover:bg-[#FAFAFA]">
          <Plus size={14} className="text-[#1C1C1C]/20 group-hover:text-[#1C1C1C]/40 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/20 group-hover:text-[#1C1C1C]/40 transition-colors">
            Link New
          </span>
        </button>
      </div>
    </DashboardCard>
  );
}
