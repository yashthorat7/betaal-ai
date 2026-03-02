const steps = [
    { t: "Sign Up", c: "Create your profile and let AI analyze your behavior." },
    { t: "AI Tracks", c: "The system monitors usage across all devices." },
    { t: "Recovery", c: "Gradual interruptions help rewire your brain." }
];

export default function HowItWorks() {
  return (
    <section className="section-pad container-pro">
      <h2 className="heading-lg mb-16 italic tracking-tighter">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {steps.map((s, i) => (
           <div key={i} className="card-pro group cursor-pointer hover:bg-foreground hover:text-background transition-colors duration-500">
              <span className="text-4xl font-black italic">0{i+1}</span>
              <h3 className="heading-md mt-6 mb-4">{s.t}</h3>
              <p className="text-pro group-hover:text-background/80 transition-colors uppercase text-xs font-black tracking-widest">{s.c}</p>
           </div>
         ))}
      </div>
    </section>
  );
}
