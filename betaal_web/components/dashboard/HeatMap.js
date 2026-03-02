export default function HeatMap({ weeks = [] }) {
  return (
    <div className="card-pro h-full">
      <h3 className="heading-md mb-12 italic">Usage Density</h3>
      <div className="flex flex-col gap-4">
        {weeks.map((w, wi) => (
          <div key={wi} className="flex gap-2">
            {w.map((v, di) => (
              <div
                key={di}
                className="border-border group relative aspect-square flex-1 border transition-all duration-500 hover:scale-110"
                style={{ opacity: Math.max(0.05, v / 500), backgroundColor: '#000' }}
              >
                <div className="bg-foreground text-background absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 px-2 py-1 text-[8px] font-black whitespace-nowrap italic group-hover:flex">
                  {v}M
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="label-pro mt-8 flex justify-between !text-[8px] italic">
        <span>Mon - Sun</span>
        <span>Week 1 - 4</span>
      </div>
    </div>
  );
}
