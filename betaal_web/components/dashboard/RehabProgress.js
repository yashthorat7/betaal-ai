export default function RehabProgress({ plan = null }) {
  if (!plan) return null;
  const current = plan.phases.find((p) => p.phase === plan.current_phase);
  const pct = (plan.current_day / plan.duration_days) * 100;

  return (
    <div className="card-pro bg-muted/50 border-dashed">
      <h3 className="heading-md mb-12 italic">Rehabilitation Journey</h3>
      <div className="flex flex-col gap-10">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <span className="label-pro">Current Phase</span>
            <h4 className="text-4xl font-black tracking-tighter uppercase italic">
              {current?.name}
            </h4>
          </div>
          <span className="label-pro italic">
            Day {plan.current_day} / {plan.duration_days}
          </span>
        </div>
        <div className="bg-muted border-border h-4 w-full border p-1">
          <div
            className="bg-foreground h-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          ></div>
        </div>
        <div className="bg-background border-border label-pro border p-8 leading-loose italic">
          Insights: "Progressing well! Focus on Instagram; it remains your primary distraction
          trigger."
        </div>
      </div>
    </div>
  );
}
