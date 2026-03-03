'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 10) setIsVisible(true);
      else if (y > lastScrollY && y > 100) setIsVisible(false);
      else if (y < lastScrollY) setIsVisible(true);
      setLastScrollY(y);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Resources', href: '/resources' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-[100] border-b border-[#1C1C1C]/10 bg-[#FAFAFA]/80 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="container-pro relative flex h-20 items-center justify-between">
        <Link
          href="/"
          className="text-xl font-[900] tracking-tighter text-[#1C1C1C] transition-opacity hover:opacity-70"
        >
          BETAAL AI
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="text-[13px] font-[900] tracking-[0.12em] text-[#1C1C1C]/50 uppercase transition-all hover:text-[#1C1C1C]"
            >
              {l.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="hidden flex-col items-end lg:flex">
                <span className="text-[11px] leading-none font-black tracking-wider text-[#1C1C1C] uppercase">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="mt-1 text-[9px] font-bold tracking-widest text-[#1C1C1C]/40 uppercase transition-colors hover:text-red-500"
                >
                  Sign Out
                </button>
              </div>
              <div className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#1C1C1C]/10 bg-white ring-2 ring-transparent transition-all hover:ring-[#1C1C1C]/10">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-black">{session.user.name?.[0] || 'U'}</span>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="rounded-full bg-[#1C1C1C] px-7 py-2.5 text-xs font-black tracking-widest text-[#FAFAFA] uppercase shadow-md shadow-[#1C1C1C]/10 transition-all hover:scale-105 hover:bg-[#1C1C1C]/90 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
