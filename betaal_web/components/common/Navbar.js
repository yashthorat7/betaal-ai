import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-pro h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter">BETAAL AI</Link>
        <div className="hidden md:flex items-center gap-10">
          {['Home', 'Dashboard', 'Resources', 'About'].map(link => (
            <Link key={link} href={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="label-pro hover:text-foreground transition-colors">{link}</Link>
          ))}
          <Link href="/signin" className="btn-pro btn-outline py-2 px-6">Sign In</Link>
        </div>
      </div>
    </nav>
  );
}
