'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useIsClient } from '@/lib/hooks/useIsClient';
import * as api from '@/lib/api';
import {
  Clock, Target, Unlock, Smartphone, Activity,
  Laptop, Monitor, Sparkles, ChevronRight, RefreshCw,
} from 'lucide-react';

/* ─────────────────── Helpers ─────────────────── */
function getHeatColor(value, max) {
  const t = Math.min(1, value / max);
  if (t < 0.2) return '#f0f0f0';
  if (t < 0.4) return '#d0d0d0';
  if (t < 0.6) return '#a0a0a0';
  if (t < 0.8) return '#606060';
  return '#1C1C1C';
}

const DEVICE_ICONS = { phone: Smartphone, laptop: Laptop, desktop: Monitor };

/* ─────────────────── Sub-cells ─────────────────── */

function StatCell({ label, value, subtext, icon: Icon, accent = '#1C1C1C', delay = 0 }) {
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
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setCount(Math.round(value * ease));
      if (step >= steps) clearInterval(iv);
    }, 1200 / steps);
    return () => clearInterval(iv);
  }, [visible, value, isNum]);

  return (
    <div
      className="relative flex flex-col justify-between p-8 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1 group"
      style={{ transitionDelay: `${delay * 0.08}s`, opacity: visible ? 1 : 0, transform: visible ? undefined : 'translateY(12px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
    >
      <div
        className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%, ${accent}09, transparent 70%)` }}
      />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/30">{label}</span>
        <div className="w-9 h-9 rounded-2xl bg-[#FAFAFA] border border-[#f0f0f0] flex items-center justify-center" style={{ color: accent }}>
          <Icon size={14} />
        </div>
      </div>

      <div className="relative z-10">
        <div className="text-3xl font-black tracking-tighter text-[#1C1C1C]">
          {isNum ? count : value}
          {isNum && <span className="text-lg text-[#1C1C1C]/20 ml-1">m</span>}
        </div>
        {subtext && (
          <p className="text-[10px] font-bold text-[#1C1C1C]/30 mt-3 leading-relaxed">{subtext}</p>
        )}
      </div>
    </div>
  );
}

function RingCell({ usage, quota }) {
  const r = 90;
  const c = 2 * Math.PI * r;
  const p = quota > 0 ? Math.min(100, (usage / quota) * 100) : 0;
  const isOver = usage > quota;
  const color = isOver ? '#ff3b30' : '#1C1C1C';
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnim(true), 400);
    return () => clearTimeout(t);
  }, []);

  const off = anim ? c - (p / 100) * c : c;

  return (
    <div className="relative flex flex-col items-center justify-center p-10 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white h-full transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] group">
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}07, transparent 70%)` }} />

      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/25 mb-8 relative z-10">Daily Recovery</span>

      <div className="relative flex items-center justify-center z-10">
        <svg className="-rotate-90" width="220" height="220">
          <circle cx="110" cy="110" r={r} stroke="#f5f5f5" strokeWidth="14" fill="none" />
          <circle
            cx="110" cy="110" r={r} stroke={color} strokeWidth="14" fill="none"
            strokeDasharray={c}
            style={{ strokeDashoffset: off, transition: 'stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-black tracking-tighter" style={{ color }}>{Math.round(p)}%</span>
          <span className="text-[9px] font-[900] uppercase tracking-widest text-[#1C1C1C]/20 mt-1">Used</span>
        </div>
      </div>

      <div className="mt-8 z-10 text-center">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#1C1C1C]/30">
          {usage}m <span className="text-[#1C1C1C]/10 mx-1">/</span> {quota}m
        </span>
        <div className={`mt-3 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-block ${isOver ? 'bg-[#ff3b30]/5 text-[#ff3b30]' : 'bg-[#34c759]/5 text-[#34c759]'}`}>
          {isOver ? 'Over Quota' : 'In Range'}
        </div>
      </div>
    </div>
  );
}

function ChartCell({ data }) {
  const isClient = useIsClient();

  return (
    <div className="relative p-8 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white h-full transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] group">
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 80% 20%, rgba(0,122,255,0.04), transparent 60%)' }} />

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/25 mb-2">Screen Time</h3>
          <p className="text-2xl font-black tracking-tighter text-[#1C1C1C]">14-Day Trend</p>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-[#FAFAFA] border border-[#f0f0f0] flex items-center justify-center text-[#1C1C1C]/20">
          <Activity size={14} />
        </div>
      </div>

      {isClient && (
        <div className="h-44 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1C1C1C" stopOpacity={0.07} />
                  <stop offset="100%" stopColor="#1C1C1C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#1C1C1C', opacity: 0.15, fontWeight: 900 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                cursor={{ stroke: '#1C1C1C', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="bg-[#1C1C1C] text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl">
                      {label} &mdash; {payload[0].value}M
                    </div>
                  ) : null
                }
              />
              <Area type="monotone" dataKey="mins" stroke="#1C1C1C" strokeWidth={2} fill="url(#areaGrad)" dot={false} activeDot={{ r: 3, fill: '#1C1C1C', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function AppCell({ apps }) {
  const sorted = [...apps].sort((a, b) => b.minutes - a.minutes);
  const max = sorted[0]?.minutes || 1;

  return (
    <div className="relative p-8 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white h-full transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] group">
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 20% 80%, rgba(175,82,222,0.05), transparent 70%)' }} />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/25">App Breakdown</h3>
        <span className="text-[9px] font-black uppercase tracking-widest text-[#1C1C1C]/15">Today</span>
      </div>

      <div className="space-y-5 relative z-10">
        {sorted.slice(0, 5).map((a, i) => (
          <div key={i}>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#1C1C1C]">{a.app_name}</span>
              <span className="text-[9px] font-black text-[#1C1C1C]/20">{a.minutes}M</span>
            </div>
            <div className="h-[3px] w-full bg-[#f5f5f5] rounded-full">
              <div
                className="h-full bg-[#1C1C1C] rounded-full transition-all duration-[1.4s] ease-out"
                style={{ width: `${Math.round((a.minutes / max) * 100)}%`, opacity: 0.2 + (a.minutes / max) * 0.8 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatCell({ weeks }) {
  const max = Math.max(...(weeks.flat()), 1);
  return (
    <div className="relative p-8 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white h-full transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] group">
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 80% 80%, rgba(0,212,255,0.04), transparent 60%)' }} />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/25">Usage Density</h3>
        <span className="text-[9px] font-black uppercase tracking-widest text-[#1C1C1C]/15">4-Week Grid</span>
      </div>

      <div className="flex gap-1.5 relative z-10">
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-col flex-1 gap-1.5">
            {w.map((v, di) => (
              <div
                key={di}
                title={`${v}m`}
                className="group/cell relative aspect-square w-full rounded-md transition-all duration-300 hover:scale-125 hover:z-10 cursor-default"
                style={{ backgroundColor: getHeatColor(v, max) }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/cell:flex bg-[#1C1C1C] text-white px-2 py-1 rounded-md text-[8px] font-black whitespace-nowrap z-50 uppercase tracking-widest shadow-2xl">
                  {v}m
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-6 relative z-10">
        <span className="text-[8px] font-black uppercase tracking-widest text-[#1C1C1C]/15 mr-1">Low</span>
        {['#f0f0f0', '#d0d0d0', '#a0a0a0', '#606060', '#1C1C1C'].map((c) => (
          <div key={c} className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: c }} />
        ))}
        <span className="text-[8px] font-black uppercase tracking-widest text-[#1C1C1C]/15 ml-1">High</span>
      </div>
    </div>
  );
}

function DeviceCell({ devices }) {
  return (
    <div className="relative p-8 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white h-full transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] group">
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,149,0,0.04), transparent 70%)' }} />

      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/25 mb-8 relative z-10">Devices</h3>

      <div className="space-y-4 relative z-10">
        {devices.map((d, i) => {
          const Icon = DEVICE_ICONS[d.type] || Smartphone;
          return (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAFA] border border-[#f0f0f0] transition-all duration-300 hover:bg-white hover:border-[#e0e0e0]">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#f0f0f0] flex items-center justify-center text-[#1C1C1C]/20 shadow-sm">
                  <Icon size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1C1C1C] block">{d.name}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={`w-1 h-1 rounded-full ${d.status === 'active' ? 'bg-[#34c759]' : 'bg-[#d0d0d0]'}`} />
                    <span className="text-[8px] font-[900] uppercase tracking-widest text-[#1C1C1C]/15">{d.status}</span>
                  </div>
                </div>
              </div>
              <span className="text-base font-black tracking-tighter text-[#1C1C1C]/60">{d.today_min}m</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RehabCell({ plan }) {
  if (!plan) return null;
  const pct = Math.round((plan.current_day / plan.duration_days) * 100);

  return (
    <div className="relative p-8 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white h-full transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] group">
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(175,82,222,0.05), transparent 70%)' }} />

      <div className="flex items-start justify-between mb-10 relative z-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/25 mb-2">Recovery Path</h3>
          <p className="text-2xl font-black tracking-tighter text-[#1C1C1C]">Phase {plan.current_phase} — {plan.phases.find(p => p.phase === plan.current_phase)?.name}</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1C]/15">Day {plan.current_day} / {plan.duration_days}</span>
      </div>

      {/* Timeline */}
      <div className="flex items-center relative z-10 mb-10">
        {plan.phases.map((ph, i) => {
          const isActive = ph.phase === plan.current_phase;
          const isPast = ph.phase < plan.current_phase;
          return (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div className={`absolute top-4 right-1/2 w-full h-[2px] ${isPast ? 'bg-[#1C1C1C]' : 'bg-[#f0f0f0]'} z-0`} />
              )}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-700 ${
                isActive ? 'bg-[#1C1C1C] text-white ring-8 ring-[#1C1C1C]/5 scale-[1.2]' : isPast ? 'bg-[#1C1C1C] text-white' : 'bg-[#f5f5f5] text-[#1C1C1C]/20 border border-[#e8e8e8]'
              }`}>{ph.phase}</div>
              <span className={`mt-3 text-[9px] font-black uppercase tracking-widest text-center ${isActive ? 'text-[#1C1C1C]' : 'text-[#1C1C1C]/15'}`}>{ph.name}</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="relative z-10 h-2 bg-[#f5f5f5] rounded-full overflow-hidden mb-4">
        <div className="h-full bg-[#1C1C1C] rounded-full transition-all duration-[2s] ease-out" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-[#1C1C1C]/15 relative z-10">{pct}% Complete</span>
    </div>
  );
}

function InsightCell({ topApp, usage, quota }) {
  const overQuota = usage > quota && quota > 0;
  const pct = quota > 0 ? Math.round((usage / quota) * 100) : 0;

  return (
    <div className="relative flex flex-col p-8 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white h-full transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] group">
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(175,82,222,0.05), transparent 70%)' }} />

      <div className="w-11 h-11 rounded-2xl bg-[#af52de]/5 border border-[#af52de]/10 flex items-center justify-center text-[#af52de] mb-6 relative z-10">
        <Sparkles size={18} />
      </div>

      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#af52de] mb-4 relative z-10">Today's Insight</span>
      <p className="text-sm font-medium leading-[1.85] text-[#6B6B6B] relative z-10 flex-1">
        {overQuota
          ? `You've used ${pct}% of your daily quota — ${usage - quota} minutes over limit. ${topApp} is your primary trigger today. Consider a 20-minute break before your next session.`
          : `You're at ${pct}% of your daily goal. ${topApp || 'Social media'} is your most-used app. You're pacing well — keep this rhythm through the evening.`}
      </p>

      <div className="mt-8 pt-6 border-t border-[#f5f5f5] relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#1C1C1C]/20">Betaal AI</span>
          <span className="text-[9px] font-bold text-[#1C1C1C]/15">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Main Page ─────────────────── */
export default function DashboardPage() {
  const { data: session } = useSession();
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const [data, setData] = useState({
    usageStats: null, weeklyReport: [], rehabPlan: null, heatMap: { weeks: [] },
  });
  const [loading, setLoading] = useState(true);

  const handleMouseMove = useCallback((e) => {
    setMouse({ x: e.clientX, y: e.clientY + window.scrollY });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [usage, weekly, plan, heat] = await Promise.all([
          api.getUsageStats(), api.getWeeklyReport(), api.getRehabPlan(), api.getHeatMap(),
        ]);
        setData({
          usageStats: usage,
          weeklyReport: weekly.map((i) => ({ name: i.date.split('-')[2], mins: i.total_min })),
          rehabPlan: plan,
          heatMap: heat,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-6">
        <div className="w-14 h-14 border-[10px] border-[#f0f0f0] border-t-[#1C1C1C] rounded-full animate-spin" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#1C1C1C]/20 animate-pulse">Loading System</span>
      </div>
    );
  }

  const quota = data.rehabPlan?.phases.find(
    (p) => p.phase === data.rehabPlan?.current_phase
  )?.daily_quota_min || 0;
  const usage = data.usageStats?.total_min || 0;
  const apps  = data.usageStats?.apps || [];
  const devices = data.usageStats?.devices || [];

  return (
    <div onMouseMove={handleMouseMove} className="relative min-h-screen bg-[#FAFAFA] text-[#1C1C1C]">

      {/* Grid reveal overlay */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right,rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.04) 1px,transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: `radial-gradient(circle 350px at ${mouse.x}px ${mouse.y}px,black 0%,transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 350px at ${mouse.x}px ${mouse.y}px,black 0%,transparent 100%)`,
        }}
      />

      <div className="relative z-10">
        {/* ── Header ── */}
        <div className="pt-28 lg:pt-36 pb-12 border-b border-[#1C1C1C]/[0.04]">
          <div className="container-pro flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-4">
                {(() => {
                  const h = new Date().getHours();
                  const name = session?.user?.name?.split(' ')[0] || 'There';
                  if (h < 12) return `Good Morning, ${name}`;
                  if (h < 17) return `Good Afternoon, ${name}`;
                  return `Good Evening, ${name}`;
                })()}
              </h1>
              <p className="text-xs font-[900] uppercase tracking-[0.15em] text-[#1C1C1C]/30">
                {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white border border-[#e8e8e8] text-[10px] font-black uppercase tracking-widest hover:border-[#1C1C1C]/20 hover:shadow-lg active:translate-y-0 transition-all">
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div className="container-pro py-12 pb-32">
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridAutoRows: 'minmax(0, auto)',
            }}
          >
            {/* Row 1: 4 stat cells */}
            <StatCell
              label="Screen Time"
              value={usage}
              subtext={quota > 0 ? `${Math.round((usage/quota)*100)}% of your ${quota}m daily goal` : 'No quota set yet'}
              icon={Clock} accent="#1C1C1C" delay={0}
            />
            <StatCell
              label="Daily Goal"
              value={quota}
              subtext={`Phase ${data.rehabPlan?.current_phase || '—'} target · ${quota > 0 ? (usage <= quota ? 'Staying within limit' : `${usage - quota}m over limit`) : '—'}`}
              icon={Target} accent="#34c759" delay={1}
            />
            <StatCell
              label="Unlocks Today"
              value={data.usageStats?.unlocks || 0}
              subtext="Phone pick-ups tracked by Betaal"
              icon={Unlock} accent="#af52de" delay={2}
            />
            <StatCell
              label="Most Used App"
              value={apps[0]?.app_name || '—'}
              subtext={apps[0] ? `${apps[0].minutes}m · ${apps[0].category || 'Social'}` : 'No data yet'}
              icon={Smartphone} accent="#007aff" delay={3}
            />

            {/* Row 2: Progress ring (1 col) + Chart (2 col) + App breakdown (1 col) */}
            <div style={{ gridColumn: 'span 1', minHeight: 480 }}>
              <RingCell usage={usage} quota={quota} />
            </div>
            <div style={{ gridColumn: 'span 2', minHeight: 480 }}>
              <ChartCell data={data.weeklyReport} />
            </div>
            <div style={{ gridColumn: 'span 1', minHeight: 480 }}>
              <AppCell apps={apps} />
            </div>

            {/* Row 3: Rehab (2 col) + Heatmap (1 col) + Devices (1 col) */}
            <div style={{ gridColumn: 'span 2', minHeight: 400 }}>
              <RehabCell plan={data.rehabPlan} />
            </div>
            <div style={{ gridColumn: 'span 1', minHeight: 400 }}>
              <HeatCell weeks={data.heatMap.weeks} />
            </div>
            <div style={{ gridColumn: 'span 1', minHeight: 400 }}>
              <DeviceCell devices={devices} />
            </div>

            {/* Row 4: AI Insight (1 col tall) + streak cell (1 col) + CTA cell (2 col) */}
            <div style={{ gridColumn: 'span 1', minHeight: 300 }}>
              <InsightCell topApp={apps[0]?.app_name} usage={usage} quota={quota} />
            </div>
            <div style={{ gridColumn: 'span 1', minHeight: 300 }} className="relative p-8 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] group">
              <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,149,0,0.05), transparent 70%)' }} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/25 mb-6 relative z-10">Recovery Streak</h3>
              <div className="relative z-10">
                <div className="text-6xl font-black tracking-tighter text-[#1C1C1C]">
                  {data.rehabPlan?.current_day || 0}
                  <span className="text-2xl text-[#1C1C1C]/20 ml-2">days</span>
                </div>
                <p className="text-[11px] font-bold text-[#1C1C1C]/30 mt-4 leading-relaxed">
                  Consistent tracking since Day 1 of your programme.
                </p>
                <div className="mt-6 grid grid-cols-7 gap-1.5">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`h-2 rounded-full ${ i < (data.rehabPlan?.current_day % 7 || 5) ? 'bg-[#1C1C1C]' : 'bg-[#f0f0f0]'}`} />
                  ))}
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#1C1C1C]/15 mt-2">This week</p>
              </div>
            </div>
            <div style={{ gridColumn: 'span 2', minHeight: 300 }} className="relative p-10 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-[#1C1C1C] text-white group transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:-translate-y-1">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(175,82,222,0.15), transparent 60%)' }} />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-6 relative z-10">Your Digital Rehabilitation Plan</p>
              <h3 className="text-3xl font-black tracking-tighter leading-tight relative z-10 mb-6">
                Phase {data.rehabPlan?.current_phase || '—'} in progress.<br/>
                <span className="text-white/40">
                  {data.rehabPlan?.duration_days - data.rehabPlan?.current_day || 0} days left in this programme.
                </span>
              </h3>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative z-10">
                <div
                  className="h-full bg-white rounded-full transition-all duration-[2s] ease-out"
                  style={{ width: `${data.rehabPlan ? Math.round((data.rehabPlan.current_day / data.rehabPlan.duration_days) * 100) : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Start</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{data.rehabPlan ? Math.round((data.rehabPlan.current_day / data.rehabPlan.duration_days) * 100) : 0}%</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Goal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
