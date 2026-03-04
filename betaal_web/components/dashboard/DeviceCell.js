'use client';
import { Smartphone, Laptop, Monitor } from 'lucide-react';

const ICONS = { phone: Smartphone, laptop: Laptop, desktop: Monitor };

export default function DeviceCell({ devices }) {
  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-5 text-sm font-semibold text-gray-900">Connected Devices</h3>
      <div className="space-y-3">
        {devices.map((d, i) => {
          const Icon = ICONS[d.type] || Smartphone;
          return (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm">
                  <Icon size={16} />
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700">{d.name}</span>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${d.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    />
                    <span className="text-xs text-gray-400 capitalize">{d.status}</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-600">{d.today_min}m</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
