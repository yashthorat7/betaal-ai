export default function CTABanner() {
  return (
    <section className="section-pad container-pro text-center flex flex-col items-center">
      <h2 className="heading-xl italic">Ready to break free?</h2>
      <p className="label-pro mt-8 mb-16 tracking-[0.5em] font-black italic">Join the rehab revolution today.</p>
      <div className="flex flex-col md:flex-row gap-6">
        <button className="btn-pro btn-solid">Download Mobile App</button>
        <button className="btn-pro btn-outline">Install Extension</button>
      </div>
    </section>
  );
}
