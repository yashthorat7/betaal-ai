import GuidedSteps from '@/components/resources/GuidedSteps';
import ArticleGrid from '@/components/resources/ArticleGrid';
import FAQ from '@/components/resources/FAQ';

export const metadata = {
  title: 'Resources — Betaal AI',
  description: 'Guides, articles, and tools for behavior management.',
};

const dl = [
  { n: 'Screen Time Tracker', f: 'PDF', s: '2.4MB' },
  { n: 'Weekly Rehab Journal', f: 'PDF', s: '1.8MB' },
  { n: 'Digital Agreement', f: 'DOCX', s: '48KB' },
];

export default function ResourcesPage() {
  return (
    <div className="container-pro mb-24 py-24">
      <header className="mb-24 text-center">
        <h1 className="heading-xl italic">Resources</h1>
        <p className="label-pro mt-8 tracking-[1em] italic">The Toolkit</p>
      </header>

      <div className="space-y-32">
        <GuidedSteps />
        <ArticleGrid />

        <div className="section-pad border-border border-t">
          <h2 className="heading-lg mb-16 italic underline decoration-4 underline-offset-8">
            Downloads
          </h2>
          <div className="max-w-4xl space-y-6">
            {dl.map((d, i) => (
              <div
                key={i}
                className="border-border hover:border-foreground group flex items-center justify-between border-b py-6 transition-colors"
              >
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
