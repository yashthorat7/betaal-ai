import { getAppBreakdown } from "@/lib/dummy-data";

export default function AppBreakdown() {
  const { apps } = getAppBreakdown();
  return (
    <div className="card-pro flex flex-col">
      <h3 className="heading-md mb-12 italic">Today's Data</h3>
      <div className="space-y-8">
        {apps.map((a, i) => (
          <div key={i} className="flex items-center gap-6 group">
            <div className="w-10 h-10 border border-border flex items-center justify-center font-black text-[10px] uppercase group-hover:bg-foreground group-hover:text-background transition-colors">
              {a.app_name.slice(0, 2)}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between label-pro mb-2 italic">
                 <span>{a.app_name}</span>
                 <span>{a.minutes}m</span>
              </div>
              <div className="h-1 bg-muted relative">
                 <div className="h-full bg-foreground transition-all duration-1000" style={{ width: `${Math.min(100, (a.minutes / 60) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
