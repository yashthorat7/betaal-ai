'use client';
import Image from 'next/image';
import { useInView } from '@/lib/hooks/useInView';
import { Linkedin } from 'lucide-react';

const TEAM = [
  { name: 'Yash Thorat', linkedin: 'https://linkedin.com/in/yashthorat7' },
  { name: 'Divesh Patil', linkedin: 'https://linkedin.com/in/diveshpatil' },
  { name: 'Bhumika Desale', linkedin: 'https://linkedin.com/in/bhumikadesale' },
  { name: 'Diya Mali', linkedin: 'https://linkedin.com/in/diyamali' },
];

export default function TeamSection() {
  const [ref, visible] = useInView({ threshold: 0.1, once: true });

  return (
    <section ref={ref} className="border-t border-[#f0f0f0] bg-white py-32">
      <div className="container-pro text-[#1C1C1C]">
        <div className="mb-24 text-center">
          <h2 className="heading-xl">The Team</h2>
        </div>

        <div className="mx-auto mb-12 max-w-4xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <a
                key={i}
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-between rounded-2xl border border-[#f0f0f0] bg-[#FAFAFA] p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{
                  transitionDelay: `${i * 0.1}s`,
                  transitionProperty:
                    'transform, opacity, border-color, box-shadow, background-color',
                }}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black text-[#1C1C1C] uppercase">
                    {m.name}
                  </span>
                  <div className="mt-1 h-px w-0 bg-[#0077B5]/40 transition-all duration-300 group-hover:w-full" />
                </div>
                <Linkedin
                  size={14}
                  className="text-[#1C1C1C]/20 transition-all duration-300 group-hover:scale-110 group-hover:text-[#0077B5]"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-black/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>

        <div
          className={`relative mx-auto aspect-21/9 max-w-5xl overflow-hidden rounded-[40px] transition-all duration-1000 ease-out ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-[0.98] opacity-0'}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <Image
            src="/team.png"
            alt="Betaal AI Team"
            fill
            className="object-cover"
          />
        </div>

        <div className="mx-auto mt-20 max-w-2xl text-center">
          <p className="text-lg leading-relaxed font-medium text-[#6B6B6B]">
            A dedicated team passionate about using technology to improve human well-being.
          </p>
        </div>
      </div>
    </section>
  );
}
