'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useIsClient } from '@/lib/hooks/useIsClient';

export default function WeeklyChart({ data = [] }) {
  const isC = useIsClient();

  if (!isC)
    return (
      <div className="card-pro label-pro flex h-96 animate-pulse items-center justify-center italic">
        Loading Timeline...
      </div>
    );

  return (
    <div className="card-pro flex h-96 flex-col">
      <h3 className="heading-md mb-12">Weekly History</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 900 }} stroke="#e5e5e5" />
          <YAxis tick={{ fontSize: 10, fontWeight: 900 }} stroke="#e5e5e5" />
          <Tooltip
            contentStyle={{ background: '#000', color: '#fff', border: 'none', borderRadius: '0' }}
          />
          <Line
            type="monotone"
            dataKey="mins"
            stroke="#000"
            strokeWidth={4}
            dot={{ r: 4, fill: '#000' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
