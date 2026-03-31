'use client';

import { useEffect, useState, useRef } from 'react';

const STAT_CONFIG = [
  {
    key: 'screenTime',
    label: 'Screen Time',
    suffix: 'm',
    color: '#1C1C1C',
    trend: [80, 95, 110, 90, 130, 115, 105],
  },
  {
    key: 'dailyQuota',
    label: 'Daily Goal',
    suffix: 'm',
    color: '#34c759',
    trend: [60, 60, 55, 60, 58, 60, 60],
  },
  {
    key: 'unlocks',
    label: 'Unlocks',
    suffix: '',
    color: '#af52de',
    trend: [12, 18, 22, 15, 30, 25, 20],
  },
  {
    key: 'topApp',
    label: 'Top App',
    suffix: '',
    color: '#007aff',
    trend: [40, 50, 45, 60, 55, 70, 65],
  },
];

function Sparkline({ data, color, animate }) {
  const W = 56, H = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polyRef = useRef(null);
  const [len, setLen] = useState(200);
  useEffect(() => {
    if (polyRef.current && polyRef.current.getTotalLength) {
      setLen(polyRef.current.getTotalLength());
    }
  }, []);

  const lastPt = pts[pts.length - 1].split(',');

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        ref={polyRef}
        points={pts.join(' ')}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: len,
          strokeDashoffset: animate ? 0 : len,
          transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      <circle
        cx={lastPt[0]}
        cy={lastPt[1]}
        r="2.5"
        fill={color}
        style={{
          opacity: animate ? 1 : 0,
          transition: 'opacity 0.4s ease 1.2s',
        }}
      />
    </svg>
  );
}

export default function QuickStats({ screenTime = 0, dailyQuota = 0, unlocks = 0, topApp = '-' }) {
  const [counts, setCounts] = useState({ screenTime: 0, dailyQuota: 0, unlocks: 0 });
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const targets = { screenTime, dailyQuota, unlocks };
    const steps = 40;
    const interval = 1200 / steps;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
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
      {STAT_CONFIG.map((stat, i) => (
        <div
          key={stat.key}
          className={`group rounded-3xl border border-[#f0f0f0] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all duration-700 ease-out hover:border-[#1C1C1C]/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          style={{ transitionDelay: `${i * 0.08}s` }}
        >
          {/* Label + sparkline row */}
          <div className="mb-4 flex items-end justify-between">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#1C1C1C]/30 uppercase transition-colors group-hover:text-[#1C1C1C]/50">
              {stat.label}
            </span>
            <Sparkline data={stat.trend} color={stat.color} animate={visible} />
          </div>

          <div className="text-2xl font-black tracking-tighter text-[#1C1C1C]">
            {typeof values[i] === 'number' ? `${values[i]}${stat.suffix}` : values[i]}
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#34c759]" />
            <span className="text-[9px] leading-none font-black text-[#1C1C1C]/20 uppercase">
              Optimal
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
