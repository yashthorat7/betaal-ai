import TeamGrid from "@/components/about/TeamGrid";
import ContactForm from "@/components/about/ContactForm";

export const metadata = {
  title: "About Us — Betaal AI",
  description: "Meet the team and our mission.",
};

export default function AboutPage() {
  return (
    <div className="container-pro py-24">
      <header className="text-center mb-24">
         <h1 className="heading-xl italic">About</h1>
         <p className="label-pro mt-8 tracking-[1em] italic">The Founders</p>
      </header>

      <section className="section-pad border-y border-border text-center bg-muted/30 italic">
         <h2 className="heading-xl leading-tight">"A healthier relationship between humanity and technology."</h2>
      </section>

      <div className="grid md:grid-cols-2 gap-24 py-24 items-center">
         <div className="space-y-12">
            <h2 className="heading-lg italic">Our Approach</h2>
            <div className="space-y-8 text-pro italic">
              <p>We move away from 'block or allow' binary models, creating nuanced psychological interventions for digital health.</p>
              <p className="border-l-4 border-foreground pl-10 leading-loose">By using real-time behavioral data, we empower users without the anxiety of total disconnect.</p>
            </div>
         </div>
         <div className="h-96 border border-dashed border-border flex items-center justify-center label-pro italic">
            [VISUAL: HUMAN CONNECTION]
         </div>
      </div>

      <TeamGrid />
      <ContactForm />
    </div>
  );
}
