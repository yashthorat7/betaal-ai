'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Clock, Target, Unlock, Smartphone, RefreshCw } from 'lucide-react';
import * as api from '@/lib/api';
import GridReveal from '@/components/common/GridReveal';
import StatCell from '@/components/dashboard/StatCell';
import RingCell from '@/components/dashboard/RingCell';
import ChartCell from '@/components/dashboard/ChartCell';
import AppCell from '@/components/dashboard/AppCell';
import HeatCell from '@/components/dashboard/HeatCell';
import DeviceCell from '@/components/dashboard/DeviceCell';
import RehabCell from '@/components/dashboard/RehabCell';
import InsightCell from '@/components/dashboard/InsightCell';
import BadgeCell from '@/components/dashboard/BadgeCell';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState({
    usageStats: null,
    weeklyReport: [],
    rehabPlan: null,
    heatMap: { weeks: [] },
    userProfile: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [usage, weekly, plan, heat, profile] = await Promise.all([
        api.getUsageStats(),
        api.getWeeklyReport(),
        api.getRehabPlan(),
        api.getHeatMap(),
        api.getUserProfile(),
      ]);
      setData({
        usageStats: usage,
        weeklyReport: weekly.map((i) => ({ name: i.date.split('-')[2], mins: i.total_min })),
        rehabPlan: plan,
        heatMap: heat,
        userProfile: profile,
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchData();
      setLoading(false);
    })();
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        <span className="text-sm text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  const quota =
    data.rehabPlan?.phases.find((p) => p.phase === data.rehabPlan?.current_phase)
      ?.daily_quota_min || 0;
  const usage = data.usageStats?.total_min || 0;
  const apps = data.usageStats?.apps || [];
  const devices = data.usageStats?.devices || [];
  const greeting = (() => {
    const h = new Date().getHours();
    const name = data.userProfile?.name || session?.user?.name?.split(' ')[0] || 'There';
    return h < 12
      ? `Good Morning, ${name}`
      : h < 17
        ? `Good Afternoon, ${name}`
        : `Good Evening, ${name}`;
  })();

  return (
    <GridReveal className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white pt-24 pb-8 lg:pt-28">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{greeting}</h1>
            <p className="mt-1 text-sm text-gray-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Row 1: Quick stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCell
            label="Screen Time"
            value={usage}
            subtext={quota > 0 ? `${Math.round((usage / quota) * 100)}% of ${quota}m goal` : 'No quota set'}
            icon={Clock}
            delay={0}
          />
          <StatCell
            label="Daily Goal"
            value={quota}
            subtext={`Phase ${data.rehabPlan?.current_phase || '—'} target`}
            icon={Target}
            delay={1}
          />
          <StatCell
            label="Unlocks"
            value={data.usageStats?.unlocks || 0}
            subtext="Phone pick-ups today"
            icon={Unlock}
            delay={2}
          />
          <StatCell
            label="Top App"
            value={apps[0]?.app_name || '—'}
            subtext={apps[0] ? `${apps[0].minutes}m · ${apps[0].category}` : 'No data'}
            icon={Smartphone}
            delay={3}
          />
        </div>

        {/* Row 2: Ring + Chart + Apps */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <RingCell usage={usage} quota={quota} />
          </div>
          <div className="lg:col-span-2">
            <ChartCell data={data.weeklyReport} />
          </div>
          <div className="lg:col-span-1">
            <AppCell apps={apps} />
          </div>
        </div>

        {/* Row 3: Rehab + Heatmap + Devices */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <RehabCell plan={data.rehabPlan} />
          </div>
          <div className="lg:col-span-1">
            <HeatCell weeks={data.heatMap.weeks} />
          </div>
          <div className="lg:col-span-1">
            <DeviceCell devices={devices} />
          </div>
        </div>

        {/* Row 4: Insight + Badges + Recovery Streak + Rehab Progress */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <InsightCell topApp={apps[0]?.app_name} usage={usage} quota={quota} />
          </div>
          <div className="lg:col-span-1">
            <BadgeCell />
          </div>

          {/* Recovery Streak */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Recovery Streak</h3>
            <div className="text-4xl font-semibold text-gray-900">
              {data.rehabPlan?.current_day || 0}
              <span className="ml-2 text-lg font-normal text-gray-300">days</span>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Consistent tracking since Day 1
            </p>
            <div className="mt-5 grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full ${i < (data.rehabPlan?.current_day % 7 || 5) ? 'bg-gray-900' : 'bg-gray-100'}`}
                />
              ))}
            </div>
            <p className="mt-2 text-[10px] text-gray-400">This week</p>
          </div>

          {/* Rehab Overview */}
          <div className="rounded-2xl border border-gray-200 bg-gray-900 p-6 text-white lg:col-span-1">
            <p className="mb-3 text-xs font-medium text-gray-400">Digital Rehab Plan</p>
            <h3 className="mb-4 text-lg font-semibold leading-snug">
              Phase {data.rehabPlan?.current_phase || '—'}
              <br />
              <span className="text-gray-500">
                {(data.rehabPlan?.duration_days || 0) - (data.rehabPlan?.current_day || 0)} days left
              </span>
            </h3>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white transition-all duration-[2s] ease-out"
                style={{
                  width: `${data.rehabPlan ? Math.round((data.rehabPlan.current_day / data.rehabPlan.duration_days) * 100) : 0}%`,
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-gray-500">Start</span>
              <span className="text-xs font-medium text-gray-400">
                {data.rehabPlan
                  ? Math.round((data.rehabPlan.current_day / data.rehabPlan.duration_days) * 100)
                  : 0}%
              </span>
              <span className="text-[10px] text-gray-500">Goal</span>
            </div>
          </div>
        </div>
      </div>
    </GridReveal>
  );
}
