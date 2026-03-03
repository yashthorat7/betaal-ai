'use client';
import { useState } from 'react';
import { useInView } from '@/lib/hooks/useInView';
import { YOUTUBE_VIDEOS } from '@/lib/resources-data';

const CATEGORIES = ['All', 'Focus', 'Science', 'Motivation'];

export default function VideoGrid() {
  const [active, setActive] = useState('All');
  const [ref, visible] = useInView({ threshold: 0.15, once: true });
  const filtered =
    active === 'All' ? YOUTUBE_VIDEOS : YOUTUBE_VIDEOS.filter((v) => v.category === active);

  return (
    <section ref={ref} className="bg-white py-32">
      <div className="container-pro text-[#1C1C1C]">
        <div className="mb-24 flex flex-wrap items-end justify-between gap-12">
          <h2 className="text-4xl font-black tracking-tighter text-[#1C1C1C] uppercase md:text-5xl">
            Featured Content
          </h2>
          <div className="flex gap-4">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`cursor-pointer rounded-full border px-[18px] py-2 text-[11px] font-black tracking-[0.08em] uppercase transition-all duration-300 ${active === c ? 'border-[#1C1C1C] bg-[#1C1C1C] text-[#FAFAFA]' : 'border-[#e5e5e5] bg-transparent text-[#1C1C1C]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((v, i) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`block cursor-pointer overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white text-inherit no-underline transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#1C1C1C] hover:shadow-lg ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              <div className="relative overflow-hidden bg-[#f5f5f5] pt-[56.25%]">
                <img
                  src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                  {v.duration}
                </div>
              </div>
              <div className="p-3.5 pb-4">
                <h3 className="mb-1.5 line-clamp-2 text-[13px] leading-[1.3] font-black tracking-tight text-[#1C1C1C]">
                  {v.title}
                </h3>
                <span className="text-[11px] font-bold text-[#1C1C1C]/40 uppercase">
                  {v.channel}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
