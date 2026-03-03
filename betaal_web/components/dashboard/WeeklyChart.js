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
import { useIsClient } from '@/lib/hooks/useIsClient';
import DashboardCard from './DashboardCard';
import { History } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-[#1C1C1C] px-2 py-1.5 text-[9px] font-black tracking-widest text-white uppercase shadow-2xl">
      <span className="mr-2 text-white/40">D{label}</span>
      <span>{payload[0].value}M</span>
    </div>
  );
}

export default function WeeklyChart({ data = [] }) {
  const isC = useIsClient();

  if (!isC) {
    return (
      <DashboardCard title="Screen Time" subtitle="Trend Analysis" icon={History}>
        <div className="flex h-64 animate-pulse items-center justify-center">
          <span className="text-[10px] font-black tracking-[0.2em] text-[#1C1C1C]/10 uppercase">
            Loading Data...
          </span>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Screen Time" subtitle="Weekly Trend Analysis" icon={History}>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1C1C1C" stopOpacity={0.07} />
                <stop offset="100%" stopColor="#1C1C1C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f5f5f5" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fontWeight: 900, fill: '#1C1C1C', opacity: 0.1 }}
              stroke="#f0f0f0"
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 9, fontWeight: 900, fill: '#1C1C1C', opacity: 0.1 }}
              stroke="#f0f0f0"
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#1C1C1C', strokeWidth: 1, strokeDasharray: '4 4' }}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="mins"
              stroke="#1C1C1C"
              strokeWidth={2}
              fill="url(#gradientFill)"
              dot={false}
              activeDot={{ r: 3, fill: '#1C1C1C', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
