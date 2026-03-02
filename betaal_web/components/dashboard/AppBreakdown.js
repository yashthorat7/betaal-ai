export default function AppBreakdown({ apps = [] }) {
  return (
    <div className="card-pro flex flex-col">
      <h3 className="heading-md mb-12 italic">Today's Data</h3>
      <div className="space-y-8">
        {apps.map((a, i) => (
          <div key={i} className="group flex items-center gap-6">
            <div className="border-border group-hover:bg-foreground group-hover:text-background flex h-10 w-10 items-center justify-center border text-[10px] font-black uppercase transition-colors">
              {a.app_name.slice(0, 2)}
            </div>
            <div className="flex-grow">
              <div className="label-pro mb-2 flex justify-between italic">
                <span>{a.app_name}</span>
                <span>{a.minutes}m</span>
              </div>
              <div className="bg-muted relative h-1">
                <div
                  className="bg-foreground h-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (a.minutes / 60) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
