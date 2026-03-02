export default function ProblemStats() {
  const stats = [
    { v: '9+ hrs', l: 'Avg Daily Usage' },
    { v: '68%', l: 'Feel Addicted' },
    { v: '12%', l: 'Tried Detox' }
  ];
  return (
    <section className="section-pad container-pro flex justify-between text-center gap-12">
      {stats.map(s => (
        <div key={s.l} className="flex flex-col gap-4">
           <span className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase">{s.v}</span>
           <span className="label-pro">{s.l}</span>
        </div>
      ))}
    </section>
  );
}
