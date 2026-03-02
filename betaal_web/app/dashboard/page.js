'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProgressRing from '@/components/dashboard/ProgressRing';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import AppBreakdown from '@/components/dashboard/AppBreakdown';
import RehabProgress from '@/components/dashboard/RehabProgress';
import DeviceList from '@/components/dashboard/DeviceList';
import HeatMap from '@/components/dashboard/HeatMap';
import * as api from '@/lib/api';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState({
    usageStats: null,
    weeklyReport: [],
    rehabPlan: null,
    heatMap: { weeks: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        try {
          const [usage, weekly, plan, heat] = await Promise.all([
            api.getUsageStats(),
            api.getWeeklyReport(),
            api.getRehabPlan(),
            api.getHeatMap(),
          ]);

          setData({
            usageStats: usage,
            weeklyReport: weekly.map((i) => ({ name: i.date.split('-')[2], mins: i.total_min })),
            rehabPlan: plan,
            heatMap: heat,
          });
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="container-pro flex h-screen items-center justify-center italic">
        Loading Dashboard...
      </div>
    );
  }

  if (!session) return null;

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container-pro mb-20 py-12">
      <header className="border-border mb-16 flex flex-col items-end justify-between gap-8 border-b pb-12 md:flex-row">
        <div>
          <h1 className="heading-lg italic">Welcome back, {session.user.name} 👋</h1>
          <span className="label-pro mt-4 inline-block font-black italic">{dateStr}</span>
        </div>
        <div className="flex gap-4">
          {['Settings', 'Sync Profile'].map((t) => (
            <button
              key={t}
              className={`btn-pro ${t === 'Settings' ? 'btn-outline' : 'btn-solid'} py-2`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="mb-8 grid gap-8 lg:grid-cols-3">
        <ProgressRing 
          usage={data.usageStats?.total_min} 
          quota={data.rehabPlan?.phases.find(p => p.phase === data.rehabPlan?.current_phase)?.daily_quota_min} 
        />
        <div className="lg:col-span-2">
          <WeeklyChart data={data.weeklyReport} />
        </div>
      </div>

      <div className="mb-8 grid gap-8 lg:grid-cols-3">
        <AppBreakdown apps={data.usageStats?.apps || []} />
        <DeviceList devices={data.usageStats?.devices || []} />
        <HeatMap weeks={data.heatMap.weeks} />
      </div>

      <RehabProgress plan={data.rehabPlan} />
    </div>
  );
}
