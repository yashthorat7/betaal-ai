'use client';

export default function ProgressRing() {
  const r = 90;
  const c = 2 * Math.PI * r;
  const p = 65;
  const off = c - (p / 100) * c;

  return (
    <div className="card-pro flex flex-col items-center justify-center">
      <h3 className="heading-md mb-12">Usage Today</h3>
      <div className="relative flex items-center justify-center">
        <svg className="h-56 w-56 -rotate-90">
          <circle
            cx="112"
            cy="112"
            r={r}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx="112"
            cy="112"
            r={r}
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={c}
            style={{ strokeDashoffset: off }}
            strokeLinecap="round"
            fill="transparent"
            className="text-foreground transition-all duration-1000"
          />
        </svg>
        <div className="absolute flex flex-col text-center">
          <span className="text-5xl font-black italic">185m</span>
          <span className="label-pro mt-2">of 273m</span>
        </div>
      </div>
      <div className="label-pro mt-12">Under Quota</div>
    </div>
  );
}
