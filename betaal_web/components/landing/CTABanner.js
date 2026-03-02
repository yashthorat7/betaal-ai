export default function CTABanner() {
  return (
    <section className="section-pad container-pro flex flex-col items-center text-center">
      <h2 className="heading-xl italic">Ready to break free?</h2>
      <p className="label-pro mt-8 mb-16 font-black tracking-[0.5em] italic">
        Join the rehab revolution today.
      </p>
      <div className="flex flex-col gap-6 md:flex-row">
        <button className="btn-pro btn-solid">Download Mobile App</button>
        <button className="btn-pro btn-outline">Install Extension</button>
      </div>
    </section>
  );
}
