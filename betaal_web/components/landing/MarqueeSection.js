'use client';

import Image from 'next/image';

const TEXT = 'Are you ready to leave smartphone addiction?';

const ICONS = [
  '/icons/icon_alarm_clock.png',
  '/icons/icon_brain_yoga.png',
  '/icons/icon_hourglass_nature.png',
  '/icons/icon_meditation_person.png',
  '/icons/icon_open_book.png',
  '/icons/icon_plant_phone.png',
  '/icons/icon_sunrise_walk.png',
];

// Pre-pick a random icon for each of the 8 repeated items so it's
// stable per render (avoids hydration mismatch).
const ITEM_ICONS = Array.from(
  { length: 8 },
  (_, i) => ICONS[i % ICONS.length]
);

export default function MarqueeSection() {
  return (
    <section className="overflow-hidden border-t border-b border-[#e0e0e0] bg-transparent py-[80px] md:py-11 mt-[100px] md:mt-0">
      <div className="animate-marquee flex whitespace-nowrap will-change-transform">
        {ITEM_ICONS.map((icon, i) => (
          <span key={i} className="inline-flex shrink-0 items-center gap-9 pr-9">
            <span className="text-[clamp(40px,5vw,72px)] font-black tracking-tight text-[#1C1C1C]">
              {TEXT}
            </span>
            <span className="inline-block h-[60px] w-[60px] shrink-0 rounded-[14px] border-[1.5px] border-[#d0d0d0] overflow-hidden bg-white">
              <Image
                src={icon}
                alt=""
                width={60}
                height={60}
                className="h-full w-full object-cover"
              />
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
