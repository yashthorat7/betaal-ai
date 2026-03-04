'use client';

import { useEffect, useRef, useState } from 'react';

export default function DashboardCard({
  title,
  subtitle,
  children,
  className = '',
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
      className={`relative h-full rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-700 ease-out hover:shadow-md ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${className}`}
    >
      {title && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
