'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faq = [
  {
    q: 'Is data private?',
    a: 'Usage data is encrypted and used only for your plan. No third-party sales.',
  },
  {
    q: 'How does it work?',
    a: 'Uses accessibility and usage APIs for non-intrusive monitoring based on your phase.',
  },
  {
    q: 'Emergencies?',
    a: 'A 10-15 minute grace period ensures no interruptions during critical situations.',
  },
  {
    q: 'For children?',
    a: 'Includes stealth mode and a parental dashboard for guided behavioral management.',
  },
];

export default function FAQ() {
  return (
    <div className="section-pad container-pro">
      <h2 className="heading-lg mb-16 text-center tracking-tighter italic">FAQ</h2>
      <div className="border-border mx-auto max-w-4xl border-x border-t">
        <Accordion type="single" collapsible className="w-full">
          {faq.map((f, i) => (
            <AccordionItem
              key={i}
              value={`i-${i}`}
              className="hover:bg-muted border-b px-8 transition-colors"
            >
              <AccordionTrigger className="heading-md py-8 italic hover:no-underline">
                Q: {f.q}
              </AccordionTrigger>
              <AccordionContent className="label-pro flex flex-col gap-4 pb-8 leading-loose italic">
                <span className="text-foreground font-black">Answer:</span>
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
