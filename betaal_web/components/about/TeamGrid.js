const team = [
    { n: "Yash", r: "AI Lead", b: "Focusing on addictive behavior modeling." },
    { n: "Divesh", r: "Mobile Lead", b: "Flutter developer for core experience." },
    { n: "Bhumika", r: "UI Lead", b: "Designing the dashboard engine." },
    { n: "Diya", r: "Research", b: "Studying digital dependencies." }
];

export default function TeamGrid() {
  return (
    <div className="section-pad container-pro grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {team.map((m, i) => (
        <div key={i} className="card-pro group flex flex-col gap-8">
           <div className="w-12 h-12 border border-border flex items-center justify-center font-black italic group-hover:bg-foreground group-hover:text-background transition-colors text-xl">
              {m.n[0]}
           </div>
           <div className="space-y-4">
              <h3 className="heading-md italic">{m.n}</h3>
              <span className="label-pro block">{m.r}</span>
              <p className="text-pro text-xs font-black uppercase tracking-widest">{m.b}</p>
           </div>
        </div>
      ))}
    </div>
  );
}
