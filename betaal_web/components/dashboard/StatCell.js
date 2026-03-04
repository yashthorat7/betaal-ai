'use client';
import { useEffect, useState } from 'react';

export default function StatCell({
  label,
  value,
  subtext,
  icon: Icon,
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
      className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? undefined : 'translateY(8px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          <Icon size={16} />
        </div>
      </div>
      <div className="text-2xl font-semibold text-gray-900">
        {isNum ? count : value}
        {isNum && <span className="ml-1 text-base font-normal text-gray-300">min</span>}
      </div>
      {subtext && (
        <p className="mt-1.5 text-xs text-gray-400">{subtext}</p>
      )}
    </div>
  );
}
