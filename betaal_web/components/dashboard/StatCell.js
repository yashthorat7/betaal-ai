'use client';
import { useEffect, useState } from 'react';

export default function StatCell({
  label,
  value,
  subtext,
  icon: Icon,
  accent = '#1C1C1C',
  delay = 0,
}) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const isNum = typeof value === 'number';

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120 * delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!visible || !isNum) return;
    let step = 0;
    const steps = 36;
    const iv = setInterval(() => {
      step++;
      setCount(Math.round(value * (1 - Math.pow(1 - step / steps, 3))));
      if (step >= steps) clearInterval(iv);
    }, 1200 / steps);
    return () => clearInterval(iv);
  }, [visible, value, isNum]);

  return (
    <div
      className="dash-card group"
      style={{
        transitionDelay: `${delay * 0.08}s`,
        opacity: visible ? 1 : 0,
        transform: visible ? undefined : 'translateY(12px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <div
        className="dash-card-glow group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at 30% 30%, ${accent}09, transparent 70%)` }}
      />
      <div className="relative z-10 mb-6 flex items-center justify-between">
        <span className="stat-label">{label}</span>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#f0f0f0] bg-[#FAFAFA]"
          style={{ color: accent }}
        >
          <Icon size={14} />
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-black tracking-tighter text-[#1C1C1C]">
          {isNum ? count : value}
          {isNum && <span className="ml-1 text-lg text-[#1C1C1C]/20">m</span>}
        </div>
        {subtext && (
          <p className="mt-3 text-[10px] leading-relaxed font-bold text-[#1C1C1C]/30">{subtext}</p>
        )}
      </div>
    </div>
  );
}
