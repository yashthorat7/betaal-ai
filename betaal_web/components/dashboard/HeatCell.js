'use client';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getColor(value, max) {
  const t = Math.min(1, value / max);
  if (t < 0.15) return 'bg-gray-100';
  if (t < 0.35) return 'bg-teal-200';
  if (t < 0.55) return 'bg-teal-400';
  if (t < 0.75) return 'bg-teal-600';
  return 'bg-teal-800';
}

export default function HeatCell({ weeks }) {
  const max = Math.max(...weeks.flat(), 1);

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Activity</h3>
        <span className="text-xs text-gray-400">{weeks.length} weeks</span>
      </div>

      {/* Day column headers: 7 columns */}
      <div className="mb-1.5 grid grid-cols-7 gap-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-gray-400">
            {d}
          </div>
        ))}
      </div>

      {/* Each row = 1 week, each cell = 1 day */}
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((val, di) => (
              <div
                key={di}
                title={`${val}m`}
                className={`aspect-square rounded-[3px] ${getColor(val, max)} cursor-default transition-transform duration-200 hover:scale-110`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-1">
        <span className="mr-1 text-[10px] text-gray-400">Less</span>
        {['bg-gray-100', 'bg-teal-200', 'bg-teal-400', 'bg-teal-600', 'bg-teal-800'].map(
          (c, i) => (
            <div key={i} className={`h-2.5 w-2.5 rounded-[2px] ${c}`} />
          ),
        )}
        <span className="ml-1 text-[10px] text-gray-400">More</span>
      </div>
    </div>
  );
}
