const articles = [
  { t: 'The Dopamine Loop', r: '5m', c: 'Research' },
  { t: 'Focus in Distraction', r: '7m', c: 'Mindfulness' },
  { t: 'Why Blockers Fail', r: '4m', c: 'Behavior' },
];

export default function ArticleGrid() {
  return (
    <div className="section-pad container-pro">
      <h2 className="heading-lg mb-16 text-center tracking-tighter italic">Insights</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {articles.map((a, i) => (
          <div
            key={i}
            className="card-pro group hover:bg-muted/50 flex cursor-pointer flex-col gap-12 transition-colors"
          >
            <span className="label-pro italic decoration-black/20">{a.c}</span>
            <h3 className="heading-md italic">{a.t}</h3>
            <div className="label-pro border-border group-hover:border-foreground mt-auto flex items-center justify-between border-t pt-8 transition-colors">
              <span>{a.r} Read</span>
              <span className="underline decoration-2 underline-offset-8">Read →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
