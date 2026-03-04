'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '@/lib/resources-data';
import { sendChatMessage } from '@/lib/api';

const SQUARES = [
  { size: 70, top: '8%', left: '4%', rotate: -20, depth: 0.04 },
  { size: 60, top: '12%', right: '6%', rotate: 55, depth: 0.06 },
  { size: 85, bottom: '15%', left: '6%', rotate: 130, depth: 0.035 },
  { size: 50, bottom: '20%', right: '5%', rotate: -50, depth: 0.05 },
];

export default function ResourcesHero() {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [chars, setChars] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [activePill, setActivePill] = useState(-1);
  const [sessionId, setSessionId] = useState(null);

  const [recommendedVideos, setRecommendedVideos] = useState([]);

  useEffect(() => {
    const fn = (e) =>
      setParallax({ x: e.clientX - innerWidth / 2, y: e.clientY - innerHeight / 2 });
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  useEffect(() => {
    if (!isTyping || !displayedResponse) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setChars(i);
      if (i >= displayedResponse.length) {
        clearInterval(iv);
        setIsTyping(false);
      }
    }, 18);
    return () => clearInterval(iv);
  }, [isTyping, displayedResponse]);

  const submit = async (text) => {
    if (isTyping || isLoading) return;
    setQuery(text);
    setResponse('');
    setDisplayedResponse('');
    setRecommendedVideos([]);
    setChars(0);
    setIsLoading(true);

    try {
      const data = await sendChatMessage(text, sessionId);
      if (data.session_id) setSessionId(data.session_id);
      setRecommendedVideos(data.videos || []);
    } catch (err) {
      console.warn('API /chat failed', err);
      setRecommendedVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-36 pb-24">
      {SQUARES.map((s, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-[10px] border-[1.5px] border-purple-500/15 bg-purple-500/[0.02] transition-transform duration-[400ms] ease-out"
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            transform: `rotate(${s.rotate}deg) translate(${parallax.x * s.depth}px, ${parallax.y * s.depth}px)`,
          }}
        />
      ))}

      <div className="container-pro relative z-10 text-center">
        <h1 className="animate-fade-in mb-8 text-4xl leading-tight font-black tracking-tighter text-[#1C1C1C] uppercase md:text-5xl">
          Digital Wellness Resources
        </h1>
        <p
          className="animate-fade-in mx-auto mb-16 max-w-xl text-sm leading-relaxed font-medium text-[#6B6B6B]/60 md:text-base"
          style={{ animationDelay: '0.1s' }}
        >
          Search for focus techniques, research, and screen time management strategies.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) submit(query);
          }}
          className="animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="mx-auto flex max-w-[1000px] items-center gap-4 rounded-full border border-[#e0e0e0] bg-white p-2 pl-8 shadow-sm transition-all duration-300 focus-within:border-[#1C1C1C] focus-within:shadow-xl hover:border-[#1C1C1C] hover:shadow-xl">
            <Search size={24} className="shrink-0 text-[#a0a0a0]" />
            <input
              type="text"
              placeholder="Ask anything about digital wellness..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-none bg-transparent text-xl font-bold tracking-tight text-[#1C1C1C] outline-none placeholder:text-[#1C1C1C]/30"
            />
            <button
              type="submit"
              disabled={!query.trim() || isTyping || isLoading}
              className={`flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1C1C] text-[#FAFAFA] transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed ${query.trim() ? 'opacity-100' : 'opacity-40'}`}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <ArrowRight size={24} />
              )}
            </button>
          </div>
        </form>

        <div
          className="animate-fade-in mt-12 flex flex-wrap justify-center gap-3"
          style={{ animationDelay: '0.25s' }}
        >
          {PROMPT_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => submit(s)}
              onMouseEnter={() => setActivePill(i)}
              onMouseLeave={() => setActivePill(-1)}
              className={`cursor-pointer rounded-full border border-[#e0e0e0] px-6 py-3 text-[13px] font-extrabold transition-all duration-300 ${activePill === i ? 'bg-[#1C1C1C] text-[#FAFAFA]' : 'bg-white text-[#6B6B6B]'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {(recommendedVideos.length > 0 || isLoading) && (
          <div className="animate-fade-in mx-auto mt-12 max-w-[1000px] rounded-[32px] border border-[#e0e0e0] bg-white p-10 text-left shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
            <div className="mb-6 flex items-center gap-2 text-[#af52de]">
              <Sparkles size={18} />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                AI ASSISTANT {isLoading ? '· FINDING RESOURCES...' : '· RECOMMENDED FOR YOU'}
              </span>
            </div>
            
            <div className="space-y-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f0f0f0] border-t-[#af52de]" />
                </div>
              ) : (
                <div className="animate-slide-up">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {recommendedVideos.map((v, i) => (
                      <a
                        key={v.id || i}
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col gap-4 rounded-3xl transition-all duration-300 hover:opacity-80"
                      >
                        <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#f5f5f5] shadow-sm">
                          <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 flex items-center justify-center">
                            <Sparkles className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" size={32} />
                          </div>
                        </div>
                        <h4 className="line-clamp-2 px-1 text-base font-black tracking-tight text-[#1C1C1C]">
                          {v.title}
                        </h4>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

