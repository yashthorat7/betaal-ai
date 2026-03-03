'use client';
import { Smartphone, Laptop, Monitor } from 'lucide-react';

const ICONS = { phone: Smartphone, laptop: Laptop, desktop: Monitor };

export default function DeviceCell({ devices }) {
  return (
    <div className="dash-card group h-full">
      <div
        className="dash-card-glow group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,149,0,0.04), transparent 70%)',
        }}
      />
      <h3 className="stat-label relative z-10 mb-8">Devices</h3>
      <div className="relative z-10 space-y-4">
        {devices.map((d, i) => {
          const Icon = ICONS[d.type] || Smartphone;
          return (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-[#f0f0f0] bg-[#FAFAFA] p-4 transition-all duration-300 hover:border-[#e0e0e0] hover:bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0f0f0] bg-white text-[#1C1C1C]/20 shadow-sm">
                  <Icon size={14} />
                </div>
                <div>
                  <span className="block text-[10px] font-black tracking-wider text-[#1C1C1C] uppercase">
                    {d.name}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <div
                      className={`h-1 w-1 rounded-full ${d.status === 'active' ? 'bg-[#34c759]' : 'bg-[#d0d0d0]'}`}
                    />
                    <span className="text-[8px] font-[900] tracking-widest text-[#1C1C1C]/15 uppercase">
                      {d.status}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-base font-black tracking-tighter text-[#1C1C1C]/60">
                {d.today_min}m
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
