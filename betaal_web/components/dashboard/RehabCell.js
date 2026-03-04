'use client';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { updateStrictness } from '@/lib/api';

export default function RehabCell({ plan }) {
  const [currentStrictness, setCurrentStrictness] = useState('Normal');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!plan) return null;
  const pct = Math.round((plan.current_day / plan.duration_days) * 100);
  const currentPhase = plan.phases.find((p) => p.phase === plan.current_phase);

  const handleStrictnessChange = async (level) => {
    setIsUpdating(true);
    try {
      await updateStrictness('child_123', 'parent_456', level);
      setCurrentStrictness(level);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to update strictness', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Recovery Path</h3>
          <p className="mt-1 text-lg font-semibold text-gray-800">
            Phase {plan.current_phase} — {currentPhase?.name}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-gray-400">
            Day {plan.current_day}/{plan.duration_days}
          </span>
          <div className="flex gap-1.5">
            {['Normal', 'Strict', 'Extreme'].map((lv) => (
              <button
                key={lv}
                onClick={() => handleStrictnessChange(lv)}
                disabled={isUpdating}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all ${currentStrictness === lv ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {lv}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phase stepper */}
      <div className="mb-6 flex items-center">
        {plan.phases.map((ph, i) => {
          const isActive = ph.phase === plan.current_phase;
          const isPast = ph.phase < plan.current_phase;
          return (
            <div key={i} className="relative flex flex-1 flex-col items-center">
              {i > 0 && (
                <div
                  className={`absolute top-3.5 right-1/2 h-0.5 w-full ${isPast ? 'bg-gray-900' : 'bg-gray-200'} z-0`}
                />
              )}
              <div
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gray-900 text-white ring-4 ring-gray-200'
                    : isPast
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {ph.phase}
              </div>
              <span
                className={`mt-2 text-center text-[10px] font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {ph.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-900 transition-all duration-[2s] ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{pct}% Complete</span>
        {showSuccess && (
          <span className="flex items-center gap-1 text-xs font-medium text-teal-600">
            <Check size={12} /> Updated
          </span>
        )}
      </div>
    </div>
  );
}
