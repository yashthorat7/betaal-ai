'use client';
import { useState } from 'react';
import { useInView } from '@/lib/hooks/useInView';
import { Plus, Minus } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/resources-data';

export default function ResourcesFAQ() {
  const [openIndex, setOpenIndex] = useState(-1);
  const [ref, visible] = useInView({ threshold: 0.1, once: true });

  return (
    <section ref={ref} className="border-t border-[#f0f0f0] bg-white py-32">
      <div className="container-pro max-w-[800px] text-[#1C1C1C]">
        <div className="mb-24 text-center">
          <h2 className="heading-xl">Frequently Asked</h2>
        </div>
        <div>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`border-b border-[#e0e0e0] transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="group flex w-full cursor-pointer items-center justify-between gap-5 bg-transparent py-6 text-left"
                >
                  <span
                    className={`text-base font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#1C1C1C]' : 'text-[#1C1C1C]/70 group-hover:text-[#1C1C1C]'}`}
                  >
                    {item.q}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${isOpen ? 'border-[#1C1C1C] bg-[#1C1C1C] text-[#FAFAFA]' : 'border-[#e0e0e0] bg-transparent text-[#1C1C1C] group-hover:border-[#1C1C1C]'}`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'max-h-[300px] pb-6' : 'max-h-0'}`}
                >
                  <p className="m-0 text-sm leading-relaxed font-medium text-[#6B6B6B]">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
