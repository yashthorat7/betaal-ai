'use client';
import { Sparkles } from 'lucide-react';

export default function InsightCell({ topApp, usage, quota }) {
  const overQuota = usage > quota && quota > 0;
  const pct = quota > 0 ? Math.round((usage / quota) * 100) : 0;

  return (
    <div className="dash-card group flex h-full flex-col">
      <div
        className="dash-card-glow group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(175,82,222,0.05), transparent 70%)',
        }}
      />
      <div className="relative z-10 mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#af52de]/10 bg-[#af52de]/5 text-[#af52de]">
        <Sparkles size={18} />
      </div>
      <span className="relative z-10 mb-4 text-[9px] font-black tracking-[0.25em] text-[#af52de] uppercase">
        Today's Insight
      </span>
      <p className="relative z-10 flex-1 text-sm leading-[1.85] font-medium text-[#6B6B6B]">
        {overQuota
          ? `You've used ${pct}% of your daily quota — ${usage - quota} minutes over limit. ${topApp} is your primary trigger today. Consider a 20-minute break before your next session.`
          : `You're at ${pct}% of your daily goal. ${topApp || 'Social media'} is your most-used app. You're pacing well — keep this rhythm through the evening.`}
      </p>
      <div className="relative z-10 mt-8 border-t border-[#f5f5f5] pt-6">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black text-[#1C1C1C]/20 uppercase">
            Betaal AI
          </span>
          <span className="text-[9px] font-bold text-[#1C1C1C]/15">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
