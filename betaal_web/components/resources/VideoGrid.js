'use client';
import { useState } from 'react';
import { useInView } from '@/lib/hooks/useInView';
import { YOUTUBE_VIDEOS } from '@/lib/resources-data';
import { getYoutubeRecommendations } from '@/lib/api';

const CATEGORIES = ['All', 'Focus', 'Science', 'Motivation', 'AI Picks'];

export default function VideoGrid() {
  const [active, setActive] = useState('All');
  const [ref, visible] = useInView({ threshold: 0.15, once: true });
  const [aiVideos, setAiVideos] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFetched, setAiFetched] = useState(false);

  const handleCategoryClick = async (cat) => {
    setActive(cat);
    if (cat === 'AI Picks') {
      setAiLoading(true);
      try {
        const data = await getYoutubeRecommendations('digital wellness', ['focus', 'productivity'], ['screen time', 'addiction']);
        const videos = (data.videos || []).map((v) => {
          // Extract video ID from URL if present
          let videoId = v.id || '';
          if (!videoId && v.url) {
            const match = v.url.match(/[?&]v=([^&]+)/);
            if (match) videoId = match[1];
          }
          return {
            id: videoId,
            title: v.title || 'Recommended Video',
            channel: v.channel || 'AI Recommended',
            duration: v.duration || '',
            category: 'AI Picks',
            thumbnail: v.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : ''),
            url: v.url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#'),
          };
        });
        setAiVideos(videos);
      } catch (err) {
        console.warn('Failed to fetch AI recommendations', err);
      } finally {
        setAiLoading(false);
      }
    }
  };

  const getFiltered = () => {
    if (active === 'AI Picks') return aiVideos;
    if (active === 'All') return YOUTUBE_VIDEOS;
    return YOUTUBE_VIDEOS.filter((v) => v.category === active);
  };

  const filtered = getFiltered();

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
                onClick={() => handleCategoryClick(c)}
                className={`cursor-pointer rounded-full border px-[18px] py-2 text-[11px] font-black tracking-[0.08em] uppercase transition-all duration-300 ${active === c ? 'border-[#1C1C1C] bg-[#1C1C1C] text-[#FAFAFA]' : 'border-[#e5e5e5] bg-transparent text-[#1C1C1C]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {aiLoading && active === 'AI Picks' ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-[6px] border-[#f0f0f0] border-t-[#1C1C1C]" />
            <span className="text-[10px] font-black tracking-[0.3em] text-[#1C1C1C]/30 uppercase">
              Getting AI Recommendations...
            </span>
          </div>
        ) : filtered.length === 0 && active === 'AI Picks' ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-sm font-bold text-[#1C1C1C]/40">
              No AI recommendations available right now. Try again later or check other categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((v, i) => {
              const videoId = v.id;
              const href = v.url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#');
              const thumb = v.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '');

              return (
                <a
                  key={videoId || i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block cursor-pointer overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white text-inherit no-underline transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#1C1C1C] hover:shadow-lg ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                  style={{ transitionDelay: `${i * 0.04}s` }}
                >
                  <div className="relative overflow-hidden bg-[#f5f5f5] pt-[56.25%]">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={v.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#f0f0f0]">
                        <span className="text-xs font-bold text-[#1C1C1C]/20">No Preview</span>
                      </div>
                    )}
                    {v.duration && (
                      <div className="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                        {v.duration}
                      </div>
                    )}
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

