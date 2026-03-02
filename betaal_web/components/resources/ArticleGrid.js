const articles = [
  { t: "The Dopamine Loop", r: "5m", c: "Research" },
  { t: "Focus in Distraction", r: "7m", c: "Mindfulness" },
  { t: "Why Blockers Fail", r: "4m", c: "Behavior" }
];

export default function ArticleGrid() {
  return (
    <div className="section-pad container-pro">
      <h2 className="heading-lg mb-16 italic tracking-tighter text-center">Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((a, i) => (
          <div key={i} className="card-pro flex flex-col gap-12 group cursor-pointer hover:bg-muted/50 transition-colors">
             <span className="label-pro italic decoration-black/20">{a.c}</span>
             <h3 className="heading-md italic">{a.t}</h3>
             <div className="mt-auto flex justify-between items-center label-pro pt-8 border-t border-border group-hover:border-foreground transition-colors">
               <span>{a.r} Read</span>
               <span className="underline decoration-2 underline-offset-8">Read →</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
