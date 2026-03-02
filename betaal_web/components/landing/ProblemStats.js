export default function ProblemStats() {
  const stats = [
    { v: '9+ hrs', l: 'Avg Daily Usage' },
    { v: '68%', l: 'Feel Addicted' },
    { v: '12%', l: 'Tried Detox' },
  ];
  return (
    <section className="section-pad container-pro flex justify-between gap-12 text-center">
      {stats.map((s) => (
        <div key={s.l} className="flex flex-col gap-4">
          <span className="text-5xl font-black tracking-tighter uppercase italic md:text-7xl">
            {s.v}
          </span>
          <span className="label-pro">{s.l}</span>
        </div>
      ))}
    </section>
  );
}
