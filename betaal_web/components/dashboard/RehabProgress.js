'use client';

import { Sparkles, Milestone } from 'lucide-react';
import DashboardCard from './DashboardCard';

export default function RehabProgress({ plan = null }) {
  if (!plan) return null;
  const current = plan.phases.find((p) => p.phase === plan.current_phase);
  const pct = Math.round((plan.current_day / plan.duration_days) * 100);

  return (
    <DashboardCard title="Recovery Journey" subtitle="Rehabilitation Progress" icon={Milestone}>
      <div className="flex flex-col lg:flex-row gap-12 mt-12">
        {/* Left: Phase timeline */}
        <div className="flex-1">
          <div className="flex items-center gap-0 mb-12">
            {plan.phases.map((phase, i) => {
              const isActive = phase.phase === plan.current_phase;
              const isPast = phase.phase < plan.current_phase;
              return (
                <div key={i} className="flex-1 flex flex-col items-center relative">
                  {/* Connector line */}
                  {i > 0 && (
                    <div
                      className={`absolute top-4 right-1/2 w-full h-0.5 -z-0 ${
                        isPast ? 'bg-[#1C1C1C]' : 'bg-[#f0f0f0]'
                      }`}
                    />
                  )}

                  {/* Phase dot */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-700 ${
                      isActive
                        ? 'bg-[#1C1C1C] text-white ring-8 ring-[#1C1C1C]/5 scale-125'
                        : isPast
                        ? 'bg-[#1C1C1C] text-white'
                        : 'bg-[#FAFAFA] text-[#1C1C1C]/20 border border-[#f0f0f0]'
                    }`}
                  >
                    {phase.phase}
                  </div>

                  {/* Phase label */}
                  <span
                    className={`mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-center ${
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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]">
              Projected Recovery
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C1C1C]/30 italic">
              Day {plan.current_day} of {plan.duration_days}
            </span>
          </div>

          <div className="h-4 w-full bg-[#f5f5f5] rounded-full overflow-hidden mb-6 p-1">
            <div
              className={`h-full bg-[#1C1C1C] rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${pct}%` }}
            />
          </div>
          
          <p className="text-[10px] font-bold text-[#1C1C1C]/20 uppercase tracking-widest text-right">
            {pct}% Path Complete
          </p>
        </div>

        {/* Right: AI Insight */}
        <div className="lg:w-80 shrink-0">
          <div className="h-full p-8 rounded-[32px] bg-[#FAFAFA] border border-[#f0f0f0] flex flex-col items-center text-center transition-all duration-500 hover:bg-white hover:border-[#af52de]/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)] group">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#f0f0f0] text-[#af52de] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <Sparkles size={20} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#af52de] block mb-4">
              AI Recommendation
            </span>
            <p className="text-sm font-medium leading-[1.8] text-[#6B6B6B] italic">
              "You've shown significant improvement in social media moderation. Focus on WhatsApp notifications during deep-work hours."
            </p>
            
            <button className="mt-8 px-6 py-2.5 rounded-full bg-white border border-[#f0f0f0] text-[10px] font-[900] uppercase tracking-widest text-[#1C1C1C]/50 hover:text-[#1C1C1C] transition-all hover:bg-[#FAFAFA] hover:shadow-sm">
              Full Insight
            </button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
