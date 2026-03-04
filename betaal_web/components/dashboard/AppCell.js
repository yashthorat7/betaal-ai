'use client';

export default function AppCell({ apps }) {
  const sorted = [...apps].sort((a, b) => b.minutes - a.minutes);
  const max = sorted[0]?.minutes || 1;

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Top Apps</h3>
        <span className="text-xs text-gray-400">Today</span>
      </div>
      <div className="space-y-3">
        {sorted.slice(0, 6).map((a, i) => (
          <div key={i}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{a.app_name}</span>
              <span className="text-xs font-medium text-gray-400">{a.minutes}m</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gray-900 transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.round((a.minutes / max) * 100)}%`,
                  opacity: 0.3 + (a.minutes / max) * 0.7,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
