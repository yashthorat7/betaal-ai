import TeamGrid from '@/components/about/TeamGrid';
import ContactForm from '@/components/about/ContactForm';

export const metadata = {
  title: 'About Us — Betaal AI',
  description: 'Meet the team and our mission.',
};

export default function AboutPage() {
  return (
    <div className="container-pro py-24">
      <header className="mb-24 text-center">
        <h1 className="heading-xl italic">About</h1>
        <p className="label-pro mt-8 tracking-[1em] italic">The Founders</p>
      </header>

      <section className="section-pad border-border bg-muted/30 border-y text-center italic">
        <h2 className="heading-xl leading-tight">
          "A healthier relationship between humanity and technology."
        </h2>
      </section>

      <div className="grid items-center gap-24 py-24 md:grid-cols-2">
        <div className="space-y-12">
          <h2 className="heading-lg italic">Our Approach</h2>
          <div className="text-pro space-y-8 italic">
            <p>
              We move away from 'block or allow' binary models, creating nuanced psychological
              interventions for digital health.
            </p>
            <p className="border-foreground border-l-4 pl-10 leading-loose">
              By using real-time behavioral data, we empower users without the anxiety of total
              disconnect.
            </p>
          </div>
        </div>
        <div className="border-border label-pro flex h-96 items-center justify-center border border-dashed italic">
          [VISUAL: HUMAN CONNECTION]
        </div>
      </div>

      <TeamGrid />
      <ContactForm />
    </div>
  );
}
