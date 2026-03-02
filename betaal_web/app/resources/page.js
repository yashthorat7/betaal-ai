import GuidedSteps from "@/components/resources/GuidedSteps";
import ArticleGrid from "@/components/resources/ArticleGrid";
import FAQ from "@/components/resources/FAQ";

export const metadata = {
  title: "Resources — Betaal AI",
  description: "Guides, articles, and tools for behavior management.",
};

const dl = [
  { n: "Screen Time Tracker", f: "PDF", s: "2.4MB" },
  { n: "Weekly Rehab Journal", f: "PDF", s: "1.8MB" },
  { n: "Digital Agreement", f: "DOCX", s: "48KB" }
];

export default function ResourcesPage() {
  return (
    <div className="container-pro py-24 mb-24">
      <header className="text-center mb-24">
         <h1 className="heading-xl italic">Resources</h1>
         <p className="label-pro mt-8 tracking-[1em] italic">The Toolkit</p>
      </header>

      <div className="space-y-32">
        <GuidedSteps />
        <ArticleGrid />
        
        <div className="section-pad border-t border-border">
           <h2 className="heading-lg mb-16 italic underline decoration-4 underline-offset-8">Downloads</h2>
           <div className="space-y-6 max-w-4xl">
              {dl.map((d, i) => (
                <div key={i} className="flex justify-between items-center py-6 border-b border-border hover:border-foreground transition-colors group">
                  <div className="flex flex-col gap-2">
                     <span className="label-pro italic">{d.f}</span>
                     <h4 className="heading-md italic">{d.n}</h4>
                  </div>
                  <button className="btn-pro btn-outline py-2">Get ({d.s})</button>
                </div>
              ))}
           </div>
        </div>

        <FAQ />
      </div>
    </div>
  );
}
