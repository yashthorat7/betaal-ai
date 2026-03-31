'use client';

export default function InsightCell({ topApp, usage, quota }) {
  const overQuota = usage > quota && quota > 0;
  const pct = quota > 0 ? Math.round((usage / quota) * 100) : 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Today&apos;s Insight</h3>
      <p className="flex-1 text-sm leading-relaxed text-gray-500">
        {overQuota
          ? `You've used ${pct}% of your daily quota - ${usage - quota} minutes over. ${topApp} is your primary trigger today. Consider taking a break.`
          : `You're at ${pct}% of your daily goal. ${topApp || 'Social media'} is most used. You're pacing well - keep it up through the evening.`}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-xs font-medium text-gray-400">Betaal AI</span>
        <span className="text-xs text-gray-300">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
