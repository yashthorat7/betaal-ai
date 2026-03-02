import { getConnectedDevices } from '@/lib/dummy-data';

export default function DeviceList() {
  const devices = getConnectedDevices();
  return (
    <div className="card-pro h-full">
      <h3 className="heading-md mb-12 italic">Connected Devices</h3>
      <div className="space-y-12">
        {devices.map((d, i) => (
          <div key={i} className="group flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="border-border group-hover:bg-foreground group-hover:text-background flex h-10 w-10 items-center justify-center rounded-full border text-xs font-black italic transition-colors">
                {d.type[0]}
              </div>
              <div className="flex flex-col">
                <span className="label-pro !text-foreground font-black italic">{d.name}</span>
                <span className="label-pro mt-1 text-[8px]">{d.status}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black tracking-tighter italic">{d.today_min}m</span>
              <span className="label-pro block text-[8px]">Session Today</span>
            </div>
          </div>
        ))}
        <button className="btn-pro btn-solid w-full py-2 text-[10px]">Link New Device</button>
      </div>
    </div>
  );
}
