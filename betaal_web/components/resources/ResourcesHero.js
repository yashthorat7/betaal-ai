'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '@/lib/resources-data';

const SQUARES = [
  { size: 70, top: '8%', left: '4%', rotate: -20, depth: 0.04 },
  { size: 60, top: '12%', right: '6%', rotate: 55, depth: 0.06 },
  { size: 85, bottom: '15%', left: '6%', rotate: 130, depth: 0.035 },
  { size: 50, bottom: '20%', right: '5%', rotate: -50, depth: 0.05 },
];

const SIMULATED_RESPONSE = "Based on current research, the most effective approach is gradual reduction rather than cold turkey. Start by identifying your top 3 trigger apps, set daily time limits, and replace scrolling habits with intentional activities. I'd recommend watching the videos below for deeper strategies.";

export default function ResourcesHero() {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [response, setResponse] = useState('');
  const [responseChars, setResponseChars] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    const fn = (e) => setParallax({ x: e.clientX - innerWidth / 2, y: e.clientY - innerHeight / 2 });
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  useEffect(() => {
    if (!isTyping) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setResponseChars(i);
      if (i >= SIMULATED_RESPONSE.length) {
        clearInterval(iv);
        setIsTyping(false);
      }
    }, 18);
    return () => clearInterval(iv);
  }, [isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;
    setResponse(SIMULATED_RESPONSE);
    setResponseChars(0);
    setIsTyping(true);
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    setResponse(SIMULATED_RESPONSE);
    setResponseChars(0);
    setIsTyping(true);
  };

  return (
    <section className="relative overflow-hidden pt-36 pb-24 bg-white">
      {/* Parallax shapes */}
      {SQUARES.map((s, i) => (
        <div 
          key={i} 
          className="absolute border-[1.5px] border-purple-500/15 rounded-[10px] bg-purple-500/[0.02] pointer-events-none transition-transform duration-400 ease-out"
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
        {/* Simplified Heading */}
        <h1 className="animate-fade-in text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-[#1C1C1C] mb-8">
          Digital Wellness Resources
        </h1>

        <p className="animate-fade-in text-sm md:text-base font-medium leading-relaxed text-[#6B6B6B]/60 max-w-xl mx-auto mb-16" style={{ animationDelay: '0.1s' }}>
          Search for focus techniques, research, and screen time management strategies.
        </p>

        {/* Prompt Box - The Hero */}
        <form onSubmit={handleSubmit} className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-4 bg-white border border-[#e0e0e0] rounded-full p-2 pl-8 max-w-[1000px] mx-auto shadow-sm hover:border-[#1C1C1C] hover:shadow-xl focus-within:border-[#1C1C1C] focus-within:shadow-xl transition-all duration-300 ease-out">
            <Search size={24} className="text-[#a0a0a0] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask anything about digital wellness..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-none outline-none bg-transparent text-xl font-bold text-[#1C1C1C] tracking-tight placeholder:text-[#1C1C1C]/30"
            />
            <button 
              type="submit" 
              className={`flex items-center justify-center w-14 h-14 rounded-full border-none bg-[#1C1C1C] text-[#FAFAFA] cursor-pointer transition-all duration-300 ${query.trim() ? 'opacity-100' : 'opacity-40'} hover:scale-105 active:scale-95 disabled:cursor-not-allowed`}
              disabled={!query.trim() || isTyping}
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </form>

        {/* Suggestion pills */}
        <div className="animate-fade-in flex flex-wrap gap-3 justify-center mt-12" style={{ animationDelay: '0.25s' }}>
          {PROMPT_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(s)}
              onMouseEnter={() => setActiveSuggestion(i)}
              onMouseLeave={() => setActiveSuggestion(-1)}
              className={`px-6 py-3 rounded-full border border-[#e0e0e0] text-[13px] font-extrabold cursor-pointer transition-all duration-300 ease-out ${activeSuggestion === i ? 'bg-[#1C1C1C] text-[#FAFAFA]' : 'bg-white text-[#6B6B6B]'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* AI Response */}
        {response && (
          <div className="mt-12 p-10 rounded-[32px] border border-[#e0e0e0] bg-white text-left shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] max-w-[1000px] mx-auto animate-fade-in">
            <div className="flex items-center gap-2 mb-6 text-[#af52de]">
              <Sparkles size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI ASSISTANT</span>
            </div>
            <p className="text-xl font-semibold leading-relaxed text-[#1C1C1C] m-0">
              {response.slice(0, responseChars)}
              {isTyping && <span className="inline-block w-0.5 h-6 bg-[#af52de] ml-1 animate-pulse align-text-bottom" />}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </section>
  );
}
