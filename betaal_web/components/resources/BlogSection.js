'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import { BLOGS } from '@/lib/resources-data';

export default function BlogSection() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardsRef = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisibleCards(prev => new Set([...prev, e.target.dataset.idx]));
      });
    }, { threshold: 0.2 });
    cardsRef.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-32 relative overflow-hidden bg-white border-t border-[#f0f0f0]">
      <div className="container-pro relative z-10 text-[#1C1C1C]">
        {/* Header */}
        <div className="mb-24 text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-[#1C1C1C]">
            Read & Reflect
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BLOGS.map((b, i) => (
            <a
              key={i}
              href={b.url}
              ref={el => (cardsRef.current[i] = el)}
              data-idx={i}
              className={`flex flex-col justify-between rounded-3xl p-10 no-underline text-inherit border border-[#e0e0e0] bg-[#FAFAFA] transition-all duration-500 ease-out cursor-pointer min-h-[280px] hover:border-[#1C1C1C] hover:-translate-y-1.5 hover:shadow-xl ${visibleCards.has(String(i)) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-[10px] font-black tracking-widest uppercase text-[#1C1C1C] bg-black/5 px-3 py-1 rounded-md">
                    {b.tag}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#1C1C1C]/40 uppercase">
                    <Clock size={11} /> {b.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-black tracking-tight text-[#1C1C1C] leading-tight mb-3.5">
                  {b.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-[#6B6B6B]">
                  {b.excerpt}
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-6">
                <div className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
