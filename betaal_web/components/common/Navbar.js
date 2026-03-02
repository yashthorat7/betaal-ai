import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-background/80 border-border sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container-pro flex h-20 items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter">
          BETAAL AI
        </Link>
        <div className="hidden items-center gap-10 md:flex">
          {['Home', 'Dashboard', 'Resources', 'About'].map((link) => (
            <Link
              key={link}
              href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
              className="label-pro hover:text-foreground transition-colors"
            >
              {link}
            </Link>
          ))}
          <Link href="/signin" className="btn-pro btn-outline px-6 py-2">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
