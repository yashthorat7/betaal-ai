'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Clock, ExternalLink } from 'lucide-react';
import { YOUTUBE_VIDEOS } from '@/lib/resources-data';

const CATEGORIES = ['All', 'Focus', 'Science', 'Motivation'];

export default function VideoGrid() {
  const [active, setActive] = useState('All');
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardsRef = useRef([]);

  const filtered = active === 'All' ? YOUTUBE_VIDEOS : YOUTUBE_VIDEOS.filter(v => v.category === active);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setVisibleCards(prev => new Set([...prev, e.target.dataset.idx]));
        }
      });
    }, { threshold: 0.15 });

    cardsRef.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [active]);

  return (
    <section className="py-32 bg-white">
      <div className="container-pro text-[#1C1C1C]">
        {/* Header */}
        <div className="flex items-end justify-between mb-24 flex-wrap gap-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[#1C1C1C]">
              Featured Content
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex gap-4">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-[18px] py-2 rounded-full border transition-all duration-300 ease-out text-[11px] font-black uppercase tracking-[0.08em] cursor-pointer ${active === c ? 'bg-[#1C1C1C] border-[#1C1C1C] text-[#FAFAFA]' : 'bg-transparent border-[#e5e5e5] text-[#1C1C1C]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid - Tighter layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((v, i) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              ref={el => (cardsRef.current[i] = el)}
              data-idx={i}
              className={`block rounded-2xl overflow-hidden border border-[#f0f0f0] bg-white cursor-pointer no-underline text-inherit transition-all duration-500 ease-out hover:border-[#1C1C1C] hover:shadow-lg hover:-translate-y-1.5 ${visibleCards.has(String(i)) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              {/* Thumbnail */}
              <div className="relative pt-[56.25%] bg-[#f5f5f5] overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-extrabold text-white">
                  {v.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5 pb-4">
                <h3 className="text-[13px] font-black tracking-tight text-[#1C1C1C] leading-[1.3] mb-1.5 line-clamp-2">
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
