const features = [
  { t: 'AI Rehab', d: 'Personalized plans that adjust as you progress.' },
  { t: 'Stealth Mode', d: 'Disguise app icons for control.' },
  { t: 'Smart Reports', d: 'Visualization across all connected devices.' },
  { t: 'Extension', d: 'Monitor your desktop browsing behavior.' },
  { t: 'Gradual Logic', d: 'Interruptions that escalate based on time.' },
  { t: 'AI Chat', d: 'Talk to your coach for instant insights.' },
];

export default function FeaturesGrid() {
  return (
    <section className="section-pad container-pro">
      <h2 className="heading-lg mb-16 text-center tracking-tighter italic">Key Features</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <div key={i} className="card-pro group hover:bg-muted cursor-pointer transition-colors">
            <h3 className="heading-md mb-4">{f.t}</h3>
            <p className="text-pro text-xs font-black tracking-widest uppercase">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
