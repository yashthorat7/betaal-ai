'use client';
import { useEffect, useRef, useState } from 'react';

const TRENDS = {
  'Screen Time': [80, 95, 110, 90, 130, 115, 105],
  'Daily Goal': [60, 60, 55, 60, 58, 60, 60],
  'Unlocks': [12, 18, 22, 15, 30, 25, 20],
  'Top App': [40, 50, 45, 60, 55, 70, 65],
};

const COLORS = {
  'Screen Time': '#1C1C1C',
  'Daily Goal': '#34c759',
  'Unlocks': '#af52de',
  'Top App': '#007aff',
};

function Sparkline({ data, color, animate }) {
  const W = 56, H = 26;
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
    if (polyRef.current?.getTotalLength) setLen(polyRef.current.getTotalLength());
  }, []);

  const lastPt = pts[pts.length - 1].split(',');

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
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

export default function StatCell({ label, value, subtext, delay = 0 }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const isNum = typeof value === 'number';

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

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

  const trend = TRENDS[label] || TRENDS['Screen Time'];
  const color = COLORS[label] || '#1C1C1C';

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? undefined : 'translateY(8px)',
        transition: `opacity 0.5s ease ${delay * 0.08}s, transform 0.5s ease ${delay * 0.08}s`,
      }}
    >
      <div className="mb-4 flex items-end justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <Sparkline data={trend} color={color} animate={visible} />
      </div>
      <div className="text-2xl font-semibold text-gray-900">
        {isNum ? count : value}
        {isNum && <span className="ml-1 text-base font-normal text-gray-300">min</span>}
      </div>
      {subtext && <p className="mt-1.5 text-xs text-gray-400">{subtext}</p>}
    </div>
  );
}
