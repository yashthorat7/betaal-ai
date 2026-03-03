'use client';

import { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

export default function DashboardCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  className = "", 
  badge = null 
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative rounded-[32px] border border-[#f0f0f0] bg-white p-8 transition-all duration-700 ease-out hover:border-[#1C1C1C]/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          {badge && (
            <span className="inline-block px-3 py-1 rounded-full bg-[#1C1C1C]/5 text-[9px] font-black uppercase tracking-widest text-[#1C1C1C]/40 mb-3">
              {badge}
            </span>
          )}
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#1C1C1C]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] font-bold text-[#1C1C1C]/30 mt-1 uppercase tracking-wider uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-2xl bg-[#FAFAFA] border border-[#f0f0f0] flex items-center justify-center text-[#1C1C1C]/40 group-hover:text-[#1C1C1C] transition-colors">
            <Icon size={18} />
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
