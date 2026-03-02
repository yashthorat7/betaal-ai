"use client"
import { useState } from "react";

const steps = [
    { t: "Awareness", c: "Learn how dopamine loops and variable rewards keep you stuck in scrolling cycles." },
    { t: "Mindfulness", c: "Identify the exact physical triggers that make you reach for your phone reflexively." },
    { t: "Boundaries", c: "Set rigid digital barriers that Betaal AI enforces during high-risk hours." },
    { t: "Recovery", c: "Build a persistent digital hygiene routine that protects your time and focus." }
];

export default function GuidedSteps() {
  const [open, setOpen] = useState(null);
  return (
    <div className="section-pad container-pro">
      <h2 className="heading-lg mb-16 italic tracking-tighter">Guided Progress</h2>
      <div className="space-y-4 max-w-4xl">
        {steps.map((s, i) => (
          <div key={i} className="card-pro group cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
            <div className="flex justify-between items-center">
              <h3 className="heading-md italic">{i + 1}. {s.t}</h3>
              <span className="text-4xl font-light scale-y-75">{open === i ? '−' : '+'}</span>
            </div>
            {open === i && <p className="mt-8 pt-8 border-t border-border text-pro italic uppercase text-xs font-black tracking-widest leading-loose animate-in fade-in slide-in-from-top-2 duration-500">{s.c}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
