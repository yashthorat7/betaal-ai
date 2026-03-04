'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [customUser, setCustomUser] = useState(null);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const uid = localStorage.getItem('betaal_uid');
      const name = localStorage.getItem('betaal_user_name');
      if (uid) setCustomUser({ name: name || 'Yash', image: null });
      else setCustomUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('betaal-session-update', checkAuth);
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 10) setIsVisible(true);
      else if (y > lastScrollY && y > 100) setIsVisible(false);
      else if (y < lastScrollY) setIsVisible(true);
      setLastScrollY(y);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('betaal-session-update', checkAuth);
    };
  }, [lastScrollY]);

  const handleSignOut = async () => {
    if (session) {
      await signOut({ redirect: false });
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('betaal_uid');
      localStorage.removeItem('betaal_session');
      localStorage.removeItem('betaal_user_name');
      checkAuth();
      window.location.href = '/';
    }
  };

  const links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Resources', href: '/resources' },
    { name: 'About', href: '/about' },
  ];

  const user = session?.user || customUser;

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
          {user ? (
            <span 
              onClick={handleSignOut}
              className="cursor-pointer text-[13px] font-black tracking-wider text-[#1C1C1C] uppercase transition-opacity hover:opacity-70"
            >
              {user.name}
            </span>
          ) : (
            <Link
              href="/auth/signin"
              className="text-[13px] font-black tracking-wider text-[#1C1C1C] uppercase transition-opacity hover:opacity-70"
            >
              Yash
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
