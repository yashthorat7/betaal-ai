'use client';

import { useEffect, useRef, useState } from 'react';
import { Linkedin, UserCircle } from 'lucide-react';

const TEAM_MEMBERS = [
  { name: 'Yash Thorat', linkedin: 'https://linkedin.com/in/yashthorat' },
  { name: 'Divesh Patil', linkedin: 'https://linkedin.com/in/diveshpatil' },
  { name: 'Bhumika Desale', linkedin: 'https://linkedin.com/in/bhumikadesale' },
  { name: 'Diya Mali', linkedin: 'https://linkedin.com/in/diyamali' }
];

export default function TeamSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-32 bg-white border-t border-[#f0f0f0]">
      <div className="container-pro text-[#1C1C1C]">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="heading-xl">The Team</h2>
        </div>

        {/* Team Photo Placeholder */}
        <div 
          className={`relative max-w-5xl mx-auto rounded-[40px] aspect-[21/9] bg-[#FAFAFA] border-2 border-dashed border-[#e0e0e0] flex flex-col items-center justify-center transition-all duration-1000 ease-out overflow-hidden ${
            visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
          }`}
        >
          {/* Subtle Background Pattern or Text */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#1C1C1C 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <UserCircle size={64} className="text-[#1C1C1C]/10 mb-4" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#1C1C1C]/20">Team Photo Coming Soon</span>
          
          {/* Decorative Corners */}
          <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-[#1C1C1C]/10 rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-[#1C1C1C]/10 rounded-tr-lg" />
          <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-[#1C1C1C]/10 rounded-bl-lg" />
          <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-[#1C1C1C]/10 rounded-br-lg" />
        </div>

        {/* Team Link List */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM_MEMBERS.map((member, i) => (
              <a
                key={i}
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-between p-6 rounded-2xl bg-[#FAFAFA] border border-[#f0f0f0] transition-all duration-300 hover:border-[#1C1C1C] hover:shadow-xl hover:-translate-y-1 ${
                  visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="text-sm font-black uppercase tracking-wider text-[#1C1C1C]">
                  {member.name}
                </span>
                <Linkedin size={16} className="text-[#1C1C1C]/20 transition-all duration-300 group-hover:text-[#0077B5] group-hover:scale-110" />
                
                {/* Subtle indicator bar */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1C1C1C] transition-all duration-300 group-hover:w-full group-hover:rounded-full" />
              </a>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mt-24 text-center max-w-2xl mx-auto">
          <p className="text-lg font-medium leading-relaxed text-[#6B6B6B]">
            A dedicated team passionate about using technology to improve human well-being.
          </p>
        </div>
      </div>
    </section>
  );
}
