import { getHeatMap } from "@/lib/dummy-data";

export default function HeatMap() {
  const { weeks } = getHeatMap();
  return (
    <div className="card-pro h-full">
      <h3 className="heading-md mb-12 italic">Usage Density</h3>
      <div className="flex flex-col gap-4">
        {weeks.map((w, wi) => (
          <div key={wi} className="flex gap-2">
            {w.map((v, di) => (
              <div 
                key={di} 
                className="flex-1 aspect-square border border-border group relative transition-all duration-500 hover:scale-110" 
                style={{ opacity: Math.max(0.05, v / 500), backgroundColor: '#000' }}
              >
                <div className="hidden group-hover:flex absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 text-[8px] font-black italic whitespace-nowrap z-50">
                  {v}M
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between label-pro italic !text-[8px]">
         <span>Mon - Sun</span>
         <span>Week 1 - 4</span>
      </div>
    </div>
  );
}
