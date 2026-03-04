'use client';
import { Award } from 'lucide-react';

const BADGES = [
  { name: '7-Day Streak', earned: true },
  { name: 'Under Quota', earned: true },
  { name: 'Early Riser', earned: false },
  { name: 'Focus Master', earned: false },
];

export default function BadgeCell() {
  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-5 text-sm font-semibold text-gray-900">Achievements</h3>
      <div className="grid grid-cols-2 gap-3">
        {BADGES.map((b, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center rounded-xl border px-3 py-5 ${
              b.earned
                ? 'border-teal-200 bg-teal-50'
                : 'border-dashed border-gray-200 bg-gray-50'
            }`}
          >
            <div
              className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                b.earned ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-300'
              }`}
            >
              <Award size={18} />
            </div>
            <span
              className={`text-center text-xs font-medium ${b.earned ? 'text-gray-700' : 'text-gray-400'}`}
            >
              {b.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
