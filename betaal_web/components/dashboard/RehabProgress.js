'use client';

import { Sparkles, Milestone } from 'lucide-react';
import DashboardCard from './DashboardCard';

export default function RehabProgress({ plan = null }) {
  if (!plan) return null;
  const current = plan.phases.find((p) => p.phase === plan.current_phase);
  const pct = Math.round((plan.current_day / plan.duration_days) * 100);

  return (
    <DashboardCard title="Recovery Journey" subtitle="Rehabilitation Progress" icon={Milestone}>
      <div className="mt-12 flex flex-col gap-12 lg:flex-row">
        {/* Left: Phase timeline */}
        <div className="flex-1">
          <div className="mb-12 flex items-center gap-0">
            {plan.phases.map((phase, i) => {
              const isActive = phase.phase === plan.current_phase;
              const isPast = phase.phase < plan.current_phase;
              return (
                <div key={i} className="relative flex flex-1 flex-col items-center">
                  {/* Connector line */}
                  {i > 0 && (
                    <div
                      className={`absolute top-4 right-1/2 -z-0 h-0.5 w-full ${
                        isPast ? 'bg-[#1C1C1C]' : 'bg-[#f0f0f0]'
                      }`}
                    />
                  )}

                  {/* Phase dot */}
                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[9px] font-black transition-all duration-700 ${
                      isActive
                        ? 'scale-125 bg-[#1C1C1C] text-white ring-8 ring-[#1C1C1C]/5'
                        : isPast
                          ? 'bg-[#1C1C1C] text-white'
                          : 'border border-[#f0f0f0] bg-[#FAFAFA] text-[#1C1C1C]/20'
                    }`}
                  >
                    {phase.phase}
                  </div>

                  {/* Phase label */}
                  <span
                    className={`mt-6 text-center text-[10px] font-black tracking-[0.2em] uppercase ${
                      isActive ? 'text-[#1C1C1C]' : 'text-[#1C1C1C]/20'
                    }`}
                  >
                    {phase.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar info */}
          <div className="mb-4 flex items-end justify-between">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#1C1C1C] uppercase">
              Projected Recovery
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-[#1C1C1C]/30 uppercase italic">
              Day {plan.current_day} of {plan.duration_days}
            </span>
          </div>

          <div className="mb-6 h-4 w-full overflow-hidden rounded-full bg-[#f5f5f5] p-1">
            <div
              className={`h-full rounded-full bg-[#1C1C1C] transition-all duration-1000 ease-out`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="text-right text-[10px] font-bold tracking-widest text-[#1C1C1C]/20 uppercase">
            {pct}% Path Complete
          </p>
        </div>

        {/* Right: AI Insight */}
        <div className="shrink-0 lg:w-80">
          <div className="group flex h-full flex-col items-center rounded-[32px] border border-[#f0f0f0] bg-[#FAFAFA] p-8 text-center transition-all duration-500 hover:border-[#af52de]/10 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f0f0f0] bg-white text-[#af52de] shadow-sm transition-transform group-hover:scale-110">
              <Sparkles size={20} />
            </div>
            <span className="mb-4 block text-[11px] font-black tracking-[0.2em] text-[#af52de] uppercase">
              AI Recommendation
            </span>
            <p className="text-sm leading-[1.8] font-medium text-[#6B6B6B] italic">
              "You've shown significant improvement in social media moderation. Focus on WhatsApp
              notifications during deep-work hours."
            </p>

            <button className="mt-8 rounded-full border border-[#f0f0f0] bg-white px-6 py-2.5 text-[10px] font-[900] tracking-widest text-[#1C1C1C]/50 uppercase transition-all hover:bg-[#FAFAFA] hover:text-[#1C1C1C] hover:shadow-sm">
              Full Insight
            </button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
