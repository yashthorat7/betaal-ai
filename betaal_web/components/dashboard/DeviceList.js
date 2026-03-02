import { getConnectedDevices } from "@/lib/dummy-data";

export default function DeviceList() {
  const devices = getConnectedDevices();
  return (
    <div className="card-pro h-full">
      <h3 className="heading-md mb-12 italic">Connected Devices</h3>
      <div className="space-y-12">
        {devices.map((d, i) => (
          <div key={i} className="flex justify-between items-center group">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 border border-border flex items-center justify-center font-black group-hover:bg-foreground group-hover:text-background transition-colors rounded-full italic text-xs">
                 {d.type[0]}
              </div>
              <div className="flex flex-col">
                 <span className="label-pro !text-foreground font-black italic">{d.name}</span>
                 <span className="label-pro text-[8px] mt-1">{d.status}</span>
              </div>
            </div>
            <div className="text-right">
               <span className="text-2xl font-black italic tracking-tighter">{d.today_min}m</span>
               <span className="label-pro block text-[8px]">Session Today</span>
            </div>
          </div>
        ))}
        <button className="btn-pro btn-solid py-2 text-[10px] w-full">Link New Device</button>
      </div>
    </div>
  );
}
