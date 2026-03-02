export default function HeroSection() {
  return (
    <section className="section-pad container-pro flex flex-col items-center text-center">
      <h1 className="heading-xl max-w-5xl">Reclaim Your Focus with Betaal AI</h1>
      <p className="text-pro mt-8 mb-16 max-w-2xl">
        An AI-powered digital rehabilitation ecosystem that combats smartphone addiction through
        adaptive, gradual interruptions.
      </p>
      <div className="flex gap-4">
        <button className="btn-pro btn-solid">Download App</button>
        <button className="btn-pro btn-outline">Get Extension</button>
      </div>
      <div className="border-border text-muted-foreground mt-24 flex h-80 w-full items-center justify-center border border-dashed text-[10px] tracking-widest uppercase italic">
        [REHAB VISUAL MOCKUP]
      </div>
    </section>
  );
}
