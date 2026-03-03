'use client';
import { useRef, useState } from 'react';
import { Download, Puzzle } from 'lucide-react';

function CtaButton({ icon: Icon, label, delay }) {
  return (
    <div className="animate-fade-in z-[2] mt-[400px]" style={{ animationDelay: delay }}>
      <button className="inline-flex cursor-pointer items-center gap-3 rounded-full border-[1.5px] border-[#1C1C1C] bg-[#FAFAFA] px-9 py-[18px] text-[13px] font-[800] tracking-[0.12em] text-[#1C1C1C] uppercase transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(28,28,28,0.13)]">
        <Icon size={18} />
        {label}
      </button>
    </div>
  );
}

export default function HeroSection() {
  const headingRef = useRef(null);
  const [mask, setMask] = useState({ x: -999, y: -999 });

  return (
    <section className="relative bg-transparent pt-[100px]">
      <div className="relative z-[1] px-[60px] text-center">
        <div
          ref={headingRef}
          onMouseMove={(e) => {
            const r = headingRef.current.getBoundingClientRect();
            setMask({ x: e.clientX - r.left, y: e.clientY - r.top });
          }}
          onMouseLeave={() => setMask({ x: -999, y: -999 })}
          className="relative -m-20 inline-block cursor-default p-20"
        >
          <h1 className="m-0 text-[clamp(48px,5.5vw,88px)] leading-[0.95] font-[900] tracking-[-0.04em] text-[#1C1C1C] uppercase">
            Reclaim Your Life From
            <br />
            Digital Addiction
          </h1>
          <h1
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-0 bg-gradient-to-r from-[#ff2d55] via-[#5ac8fa] via-[#af52de] to-[#007aff] bg-clip-text p-20 text-[clamp(48px,5.5vw,88px)] leading-[0.95] font-[900] tracking-[-0.04em] text-transparent uppercase"
            style={{
              maskImage: `radial-gradient(circle 480px at ${mask.x}px ${mask.y}px, black 0%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle 480px at ${mask.x}px ${mask.y}px, black 0%, transparent 100%)`,
            }}
          >
            Reclaim Your Life From
            <br />
            Digital Addiction
          </h1>
        </div>
      </div>

      <div className="relative z-[2] mt-10 flex items-start justify-center gap-10">
        <CtaButton icon={Download} label="Download the App" delay="0.3s" />
        <div className="animate-slide-up relative z-[3] h-[1020px] w-[570px] shrink-0 overflow-hidden rounded-[60px] border border-[#d0d0d0] bg-gradient-to-b from-[#F0F0F0] to-[#E8E8E8] shadow-[0_-40px_80px_20px_rgba(250,250,250,0.9),0_12px_40px_rgba(0,0,0,0.04)]">
          <div className="mx-auto h-9 w-[160px] rounded-b-[20px] bg-[#d0d0d0]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-[56px] font-[900] tracking-[-0.03em] text-[#c0c0c0]">BETAAL</div>
            <div className="mt-1.5 text-sm font-bold tracking-[0.2em] text-[#b0b0b0] uppercase">
              App Preview
            </div>
          </div>
        </div>
        <CtaButton icon={Puzzle} label="Get Extension" delay="0.3s" />
      </div>
    </section>
  );
}
