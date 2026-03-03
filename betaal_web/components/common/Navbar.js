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
      const currentScrollY = window.scrollY;
      
      // Show if scrolling up OR at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and passed threshold
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Resources', href: '/resources' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="fixed top-0 left-0 right-0 z-[100] border-b border-[#1C1C1C]/10 bg-[#FAFAFA]/80 backdrop-blur-xl"
    >
      <div className="container-pro h-20 flex items-center justify-between relative">
        {/* Left: Branding */}
        <Link 
          href="/" 
          className="text-xl font-[900] tracking-tighter text-[#1C1C1C] hover:opacity-70 transition-opacity"
        >
          BETAAL AI
        </Link>

        {/* Middle: Links - Centered absolutely */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-[900] uppercase tracking-[0.12em] text-[#1C1C1C]/50 hover:text-[#1C1C1C] transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Profile/Auth */}
        <div className="flex items-center gap-6">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1C1C1C] leading-none">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1C]/40 hover:text-red-500 transition-colors mt-1"
                >
                  Sign Out
                </button>
              </div>
              <div className="h-10 w-10 rounded-full border border-[#1C1C1C]/10 overflow-hidden bg-white flex items-center justify-center ring-2 ring-transparent hover:ring-[#1C1C1C]/10 transition-all cursor-pointer">
                 {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
                 ) : (
                    <span className="text-xs font-black">{session.user.name?.[0] || 'U'}</span>
                 )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="bg-[#1C1C1C] text-[#FAFAFA] px-7 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-[#1C1C1C]/90 hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#1C1C1C]/10"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
