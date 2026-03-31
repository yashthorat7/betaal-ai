'use client';
import Image from 'next/image';

import aiAlertsImg from '@/public/bento/bento_ai_alerts.png';
import trackingImg from '@/public/bento/bento_tracking.png';
import focusImg from '@/public/bento/bento_focus.png';
import analyticsImg from '@/public/bento/bento_analytics.png';
import communityImg from '@/public/bento/bento_community.png';
import extensionImg from '@/public/bento/bento_extension.png';

const FEATURES = [
  {
    title: 'Adaptive AI Alerts',
    desc: 'Smart notifications that learn your patterns and intervene at the right moment to guide you back to focus.',
    span: 'col-span-2',
    gradient: 'radial-gradient(ellipse at 30% 30%, rgba(175,82,222,0.18), transparent 70%)',
    image: aiAlertsImg,
  },
  {
    title: 'Real-Time Tracking',
    desc: 'Live dashboard showing your screen time, app usage, focus zones, and daily behavioral patterns.',
    span: 'col-span-1 row-span-2',
    gradient: 'radial-gradient(ellipse at 70% 20%, rgba(0,212,255,0.15), transparent 70%)',
    image: trackingImg,
  },
  {
    title: 'Focus Sessions',
    desc: 'Guided deep-work blocks with distraction blocking and ambient sounds for sustained concentration.',
    span: 'col-span-1',
    gradient: 'radial-gradient(ellipse at 50% 80%, rgba(255,45,85,0.14), transparent 70%)',
    image: focusImg,
  },
  {
    title: 'Progress Analytics',
    desc: 'Weekly reports with trend analysis, streaks, and improvement scores to keep you motivated.',
    span: 'col-span-1',
    gradient: 'radial-gradient(ellipse at 20% 60%, rgba(90,200,250,0.15), transparent 70%)',
    image: analyticsImg,
  },
  {
    title: 'Community Support',
    desc: 'Connect with accountability partners and support groups on similar rehabilitation journeys.',
    span: 'col-span-1',
    gradient: 'radial-gradient(ellipse at 80% 40%, rgba(175,82,222,0.14), transparent 70%)',
    image: communityImg,
  },
  {
    title: 'Browser Extension',
    desc: 'Extends protection to desktop browsing with intelligent site blockers and customizable time limits.',
    span: 'col-span-2',
    gradient: 'radial-gradient(ellipse at 60% 30%, rgba(0,122,255,0.14), transparent 70%)',
    image: extensionImg,
  },
];

export default function BentoGrid() {
  return (
    <section className="bg-transparent py-[140px] md:py-[100px]">
      <div className="mx-auto max-w-[1200px] px-[60px]">
        <h2 className="animate-fade-in mb-[80px] md:mb-[60px] text-[clamp(32px,3.5vw,52px)] leading-none font-black tracking-tight text-[#1C1C1C]">
          Everything You Need
        </h2>
        <div className="grid auto-rows-[minmax(280px,auto)] grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`${f.span} animate-fade-in group relative flex cursor-default flex-col justify-end overflow-hidden rounded-[20px] transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_10px_36px_rgba(0,0,0,0.12)]`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Full-bleed background illustration */}
              <div className="absolute inset-0">
                <Image
                  src={f.image}
                  alt={f.title}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Hover colour tint overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: f.gradient }}
              />

              {/* Bottom text fade */}
              <div className="relative z-1 rounded-b-[20px] bg-linear-to-t from-[rgba(10,10,20,0.82)] from-40% via-[rgba(10,10,20,0.45)] to-transparent p-10">
                <h3 className="mb-2.5 text-[22px] font-extrabold tracking-tight text-white">
                  {f.title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.55] font-medium text-white/75">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
