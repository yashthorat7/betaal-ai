'use client';
import { useEffect, useState } from 'react';

export default function RingCell({ usage, quota }) {
  const r = 80;
  const c = 2 * Math.PI * r;
  const p = quota > 0 ? Math.min(100, (usage / quota) * 100) : 0;
  const isOver = usage > quota;
  const color = isOver ? '#991b1b' : '#0d9488';
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnim(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-6 text-sm font-semibold text-gray-900">Daily Progress</h3>
      <div className="relative flex items-center justify-center">
        <svg className="-rotate-90" width="180" height="180">
          <circle cx="90" cy="90" r={r} stroke="#f3f4f6" strokeWidth="10" fill="none" />
          <circle
            cx="90"
            cy="90"
            r={r}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            style={{
              strokeDashoffset: anim ? c - (p / 100) * c : c,
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-semibold text-gray-900">
            {Math.round(p)}%
          </span>
          <span className="text-xs text-gray-400">of quota</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {usage}m <span className="text-gray-300">/</span> {quota}m
        </p>
        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${isOver ? 'bg-gray-100 text-gray-600' : 'bg-teal-50 text-teal-700'}`}
        >
          {isOver ? 'Over limit' : 'On track'}
        </span>
      </div>
    </div>
  );
}
