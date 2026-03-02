import { getRehabPlan } from "@/lib/dummy-data";

export default function RehabProgress() {
  const plan = getRehabPlan();
  const current = plan.phases.find(p => p.phase === plan.current_phase);
  const pct = (plan.current_day / plan.duration_days) * 100;

  return (
    <div className="card-pro border-dashed bg-muted/50">
      <h3 className="heading-md mb-12 italic">Rehabilitation Journey</h3>
      <div className="flex flex-col gap-10">
         <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
               <span className="label-pro">Current Phase</span>
               <h4 className="text-4xl font-black italic tracking-tighter uppercase">{current?.name}</h4>
            </div>
            <span className="label-pro italic">Day {plan.current_day} / {plan.duration_days}</span>
         </div>
         <div className="h-4 w-full bg-muted border border-border p-1">
            <div className="h-full bg-foreground transition-all duration-1000" style={{ width: `${pct}%` }}></div>
         </div>
         <div className="p-8 bg-background border border-border label-pro leading-loose italic">
            Insights: "Progressing well! Focus on Instagram; it remains your primary distraction trigger."
         </div>
      </div>
    </div>
  );
}
