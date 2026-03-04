'use client';

import { useEffect, useState, useRef } from 'react';
import { Clock, Target, Unlock, Smartphone } from 'lucide-react';

const STAT_CONFIG = [
  { key: 'screenTime', label: 'Screen Time', icon: Clock, suffix: 'm', color: 'text-[#1C1C1C]' },
  { key: 'dailyQuota', label: 'Daily Goal', icon: Target, suffix: 'm', color: 'text-[#34c759]' },
  { key: 'unlocks', label: 'Unlocks', icon: Unlock, suffix: '', color: 'text-[#af52de]' },
  { key: 'topApp', label: 'Top App', icon: Smartphone, suffix: '', color: 'text-[#007aff]' },
];

export default function QuickStats({ screenTime = 0, dailyQuota = 0, unlocks = 0, topApp = '—' }) {
  const [counts, setCounts] = useState({ screenTime: 0, dailyQuota: 0, unlocks: 0 });
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const targets = { screenTime, dailyQuota, unlocks };
    const duration = 1200;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts({
        screenTime: Math.round(targets.screenTime * ease),
        dailyQuota: Math.round(targets.dailyQuota * ease),
        unlocks: Math.round(targets.unlocks * ease),
      });
      if (step >= steps) clearInterval(iv);
    }, interval);
    return () => clearInterval(iv);
  }, [visible, screenTime, dailyQuota, unlocks]);

  const values = [counts.screenTime, counts.dailyQuota, counts.unlocks, topApp];

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STAT_CONFIG.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.key}
            className={`group rounded-3xl border border-[#f0f0f0] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all duration-700 ease-out hover:border-[#1C1C1C]/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)] ${
              visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-[0.2em] text-[#1C1C1C]/30 uppercase transition-colors group-hover:text-[#1C1C1C]/50">
                {stat.label}
              </span>
              <div
                className={`rounded-xl border border-[#f0f0f0] bg-[#FAFAFA] p-2 ${stat.color} transition-all duration-300 group-hover:scale-110`}
              >
                <Icon size={14} />
              </div>
            </div>

            <div className="text-2xl font-black tracking-tighter text-[#1C1C1C]">
              {typeof values[i] === 'number' ? `${values[i]}${stat.suffix}` : values[i]}
            </div>

            {/* Subtle trend indicator (mock) */}
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#34c759]" />
              <span className="text-[9px] leading-none font-[900] text-[#1C1C1C]/20 uppercase">
                Optimal
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
