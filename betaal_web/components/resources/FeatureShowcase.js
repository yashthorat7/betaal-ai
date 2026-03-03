'use client';
import { useInView } from '@/lib/hooks/useInView';
import { MessageCircle, Play, BookOpen, Users } from 'lucide-react';
import { RESOURCE_FEATURES } from '@/lib/resources-data';

const ICONS = { MessageCircle, Play, BookOpen, Users };
const GRADIENTS = [
  'radial-gradient(ellipse at 30% 30%, rgba(175,82,222,0.08), transparent 70%)',
  'radial-gradient(ellipse at 70% 20%, rgba(0,212,255,0.08), transparent 70%)',
  'radial-gradient(ellipse at 50% 80%, rgba(255,45,85,0.07), transparent 70%)',
  'radial-gradient(ellipse at 20% 60%, rgba(90,200,250,0.08), transparent 70%)',
];
const ACCENTS = ['#af52de', '#00d4ff', '#ff2d55', '#5ac8fa'];

export default function FeatureShowcase() {
  const [ref, visible] = useInView({ threshold: 0.15, once: true });

  return (
    <section ref={ref} className="py-20">
      <div className="container-pro">
        <div className="mb-[60px] text-center">
          <h2 className="heading-xl">Resources Built for Recovery</h2>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {RESOURCE_FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon];
            return (
              <div
                key={i}
                className={`group relative min-h-[220px] cursor-default overflow-hidden rounded-[20px] p-12 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_10px_36px_rgba(0,0,0,0.08)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-[30px] opacity-0'}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="absolute inset-0 rounded-[20px] border border-[#e0e0e0] bg-gradient-to-br from-[#f2f2f2] via-[#eaeaea] to-[#f0f0f0]" />
                <div
                  className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: GRADIENTS[i] }}
                />
                <div className="relative z-[1]">
                  <div
                    className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-[14px]"
                    style={{ background: `${ACCENTS[i]}12`, border: `1px solid ${ACCENTS[i]}25` }}
                  >
                    {Icon && <Icon size={22} style={{ color: ACCENTS[i] }} />}
                  </div>
                  <h3 className="mb-3 text-[22px] font-[800] tracking-[-0.02em] text-[#1C1C1C] uppercase">
                    {f.title}
                  </h3>
                  <p className="m-0 max-w-[420px] text-[15px] leading-[1.6] font-medium text-[#6B6B6B]">
                    {f.desc}
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
