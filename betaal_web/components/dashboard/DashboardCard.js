'use client';

import { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

export default function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
  badge = null,
}) {
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

  return (
    <div
      ref={ref}
      className={`relative rounded-[32px] border border-[#f0f0f0] bg-white p-8 transition-all duration-700 ease-out hover:border-[#1C1C1C]/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)] ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      <div className="mb-8 flex items-start justify-between">
        <div>
          {badge && (
            <span className="mb-3 inline-block rounded-full bg-[#1C1C1C]/5 px-3 py-1 text-[9px] font-black tracking-widest text-[#1C1C1C]/40 uppercase">
              {badge}
            </span>
          )}
          <h3 className="text-sm font-black tracking-[0.2em] text-[#1C1C1C] uppercase">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-[11px] font-bold tracking-wider text-[#1C1C1C]/30 uppercase">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#f0f0f0] bg-[#FAFAFA] text-[#1C1C1C]/40 transition-colors group-hover:text-[#1C1C1C]">
            <Icon size={18} />
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
