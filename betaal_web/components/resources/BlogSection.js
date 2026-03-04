'use client';
import { useState } from 'react';
import { useInView } from '@/lib/hooks/useInView';
import { Clock, ArrowUpRight } from 'lucide-react';
import { BLOGS } from '@/lib/resources-data';

export default function BlogSection() {
  const [ref, visible] = useInView({ threshold: 0.2, once: true });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-[#f0f0f0] bg-white py-32"
    >
      <div className="container-pro relative z-10 text-[#1C1C1C]">
        <div className="mb-24 text-center">
          <h2 className="heading-xl">Read & Reflect</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BLOGS.map((b, i) => (
            <a
              key={i}
              href={b.url}
              className={`flex min-h-[280px] cursor-pointer flex-col justify-between rounded-3xl border border-[#e0e0e0] bg-[#FAFAFA] p-10 text-inherit no-underline transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#1C1C1C] hover:shadow-xl ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="rounded-md bg-black/5 px-3 py-1 text-[10px] font-black text-[#1C1C1C] uppercase">
                    {b.tag}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#1C1C1C]/40 uppercase">
                    <Clock size={11} /> {b.readTime}
                  </span>
                </div>
                <h3 className="mb-3.5 text-xl leading-tight font-black tracking-tight text-[#1C1C1C]">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium text-[#6B6B6B]">{b.excerpt}</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1C1C] text-white">
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
