'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/resources-data';

export default function ResourcesFAQ() {
  const [openIndex, setOpenIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-32 bg-white border-t border-[#f0f0f0]">
      <div className="container-pro max-w-[800px] text-[#1C1C1C]">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-[#1C1C1C]">
            Frequently Asked
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-0">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`border-b border-[#e0e0e0] transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between py-6 border-none bg-transparent cursor-pointer text-left gap-5 group"
                >
                  <span className={`text-base font-bold tracking-tight text-[#1C1C1C] transition-colors duration-300 ${isOpen ? 'text-[#1C1C1C]' : 'text-[#1C1C1C]/70 group-hover:text-[#1C1C1C]'}`}>
                    {item.q}
                  </span>
                  <div className={`w-8 h-8 rounded-lg shrink-0 border border-[#e0e0e0] flex items-center justify-center transition-all duration-300 ease-out ${isOpen ? 'bg-[#1C1C1C] text-[#FAFAFA] border-[#1C1C1C]' : 'bg-transparent text-[#1C1C1C] border-[#e0e0e0] group-hover:border-[#1C1C1C]'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                {/* Answer */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'max-h-[300px] pb-6' : 'max-h-0'}`}
                >
                  <p className="text-sm font-medium leading-relaxed text-[#6B6B6B] m-0">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
