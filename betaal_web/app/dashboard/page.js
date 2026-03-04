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
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#FAFAFA]">
        <div className="h-14 w-14 animate-spin rounded-full border-[10px] border-[#f0f0f0] border-t-[#1C1C1C]" />
        <span className="animate-pulse text-[9px] font-black tracking-[0.4em] text-[#1C1C1C]/20 uppercase">
          Loading System
        </span>
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
    <GridReveal className="bg-[#FAFAFA]">
      {/* Header */}
      <div className="border-b border-[#1C1C1C]/[0.04] pt-28 pb-12 lg:pt-36">
        <div className="container-pro flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h1 className="mb-4 text-4xl leading-[0.9] font-black tracking-tighter uppercase lg:text-5xl">
              {greeting}
            </h1>
            <p className="text-xs font-[900] tracking-[0.15em] text-[#1C1C1C]/30 uppercase">
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
            className="flex items-center gap-2.5 rounded-full border border-[#e8e8e8] bg-white px-7 py-3.5 text-[10px] font-black uppercase transition-all hover:border-[#1C1C1C]/20 hover:shadow-lg disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="container-pro py-12 pb-32">
        <div className="grid grid-cols-4 gap-5" style={{ gridAutoRows: 'minmax(0, auto)' }}>
          {/* Row 1 */}
          <StatCell
            label="Screen Time"
            value={usage}
            subtext={
              quota > 0
                ? `${Math.round((usage / quota) * 100)}% of your ${quota}m daily goal`
                : 'No quota set yet'
            }
            icon={Clock}
            delay={0}
          />
          <StatCell
            label="Daily Goal"
            value={quota}
            subtext={`Phase ${data.rehabPlan?.current_phase || '—'} target · ${quota > 0 ? (usage <= quota ? 'Staying within limit' : `${usage - quota}m over limit`) : '—'}`}
            icon={Target}
            accent="#34c759"
            delay={1}
          />
          <StatCell
            label="Unlocks Today"
            value={data.usageStats?.unlocks || 0}
            subtext="Phone pick-ups tracked by Betaal"
            icon={Unlock}
            accent="#af52de"
            delay={2}
          />
          <StatCell
            label="Most Used App"
            value={apps[0]?.app_name || '—'}
            subtext={
              apps[0] ? `${apps[0].minutes}m · ${apps[0].category || 'Social'}` : 'No data yet'
            }
            icon={Smartphone}
            accent="#007aff"
            delay={3}
          />

          {/* Row 2 */}
          <div className="col-span-1" style={{ minHeight: 480 }}>
            <RingCell usage={usage} quota={quota} />
          </div>
          <div className="col-span-2" style={{ minHeight: 480 }}>
            <ChartCell data={data.weeklyReport} />
          </div>
          <div className="col-span-1" style={{ minHeight: 480 }}>
            <AppCell apps={apps} />
          </div>

          {/* Row 3 */}
          <div className="col-span-2" style={{ minHeight: 400 }}>
            <RehabCell plan={data.rehabPlan} />
          </div>
          <div className="col-span-1" style={{ minHeight: 400 }}>
            <HeatCell weeks={data.heatMap.weeks} />
          </div>
          <div className="col-span-1" style={{ minHeight: 400 }}>
            <DeviceCell devices={devices} />
          </div>

          {/* Row 4 */}
          <div className="col-span-1" style={{ minHeight: 300 }}>
            <InsightCell topApp={apps[0]?.app_name} usage={usage} quota={quota} />
          </div>
          <div className="dash-card group col-span-1" style={{ minHeight: 300 }}>
            <div
              className="dash-card-glow group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(circle at 50% 0%, rgba(255,149,0,0.05), transparent 70%)',
              }}
            />
            <h3 className="stat-label relative z-10 mb-6">Recovery Streak</h3>
            <div className="relative z-10">
              <div className="text-6xl font-black tracking-tighter text-[#1C1C1C]">
                {data.rehabPlan?.current_day || 0}
                <span className="ml-2 text-2xl text-[#1C1C1C]/20">days</span>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed font-bold text-[#1C1C1C]/30">
                Consistent tracking since Day 1 of your programme.
              </p>
              <div className="mt-6 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full ${i < (data.rehabPlan?.current_day % 7 || 5) ? 'bg-[#1C1C1C]' : 'bg-[#f0f0f0]'}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-[9px] font-black text-[#1C1C1C]/15 uppercase">
                This week
              </p>
            </div>
          </div>
          <div
            className="dash-card group col-span-2 bg-[#1C1C1C] text-white hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            style={{ minHeight: 300 }}
          >
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(ellipse at 80% 50%, rgba(175,82,222,0.15), transparent 60%)',
              }}
            />
            <p className="relative z-10 mb-6 text-[10px] font-black tracking-[0.25em] text-white/30 uppercase">
              Your Digital Rehabilitation Plan
            </p>
            <h3 className="relative z-10 mb-6 text-3xl leading-tight font-black tracking-tighter">
              Phase {data.rehabPlan?.current_phase || '—'} in progress.
              <br />
              <span className="text-white/40">
                {(data.rehabPlan?.duration_days || 0) - (data.rehabPlan?.current_day || 0)} days
                left in this programme.
              </span>
            </h3>
            <div className="relative z-10 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white transition-all duration-[2s] ease-out"
                style={{
                  width: `${data.rehabPlan ? Math.round((data.rehabPlan.current_day / data.rehabPlan.duration_days) * 100) : 0}%`,
                }}
              />
            </div>
            <div className="relative z-10 mt-3 flex items-center justify-between">
              <span className="text-[9px] font-black text-white/20 uppercase">
                Start
              </span>
              <span className="text-[9px] font-black text-white/40 uppercase">
                {data.rehabPlan
                  ? Math.round((data.rehabPlan.current_day / data.rehabPlan.duration_days) * 100)
                  : 0}
                %
              </span>
              <span className="text-[9px] font-black text-white/20 uppercase">
                Goal
              </span>
            </div>
          </div>
        </div>
      </div>
    </GridReveal>
  );
}
