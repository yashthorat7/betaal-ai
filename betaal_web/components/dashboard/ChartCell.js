'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity } from 'lucide-react';
import { useIsClient } from '@/lib/hooks/useIsClient';

export default function ChartCell({ data }) {
  const isClient = useIsClient();
  return (
    <div className="dash-card group h-full">
      <div
        className="dash-card-glow group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(0,122,255,0.04), transparent 60%)',
        }}
      />
      <div className="relative z-10 mb-8 flex items-start justify-between">
        <div>
          <h3 className="stat-label mb-2">Screen Time</h3>
          <p className="text-2xl font-black tracking-tighter text-[#1C1C1C]">14-Day Trend</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#f0f0f0] bg-[#FAFAFA] text-[#1C1C1C]/20">
          <Activity size={14} />
        </div>
      </div>
      {isClient && (
        <div className="relative z-10 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1C1C1C" stopOpacity={0.07} />
                  <stop offset="100%" stopColor="#1C1C1C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#1C1C1C', opacity: 0.15, fontWeight: 900 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ stroke: '#1C1C1C', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="rounded-xl bg-[#1C1C1C] px-3 py-2 text-[9px] font-black tracking-widest text-white uppercase shadow-2xl">
                      {label} &mdash; {payload[0].value}M
                    </div>
                  ) : null
                }
              />
              <Area
                type="monotone"
                dataKey="mins"
                stroke="#1C1C1C"
                strokeWidth={2}
                fill="url(#areaGrad)"
                dot={false}
                activeDot={{ r: 3, fill: '#1C1C1C', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
