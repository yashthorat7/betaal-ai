import Link from 'next/link';

export default function Footer() {
  const links = ['Home', 'Dashboard', 'Resources', 'About'];
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container-pro py-20 flex flex-col md:flex-row justify-between gap-16">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter">BETAAL AI</h2>
          <p className="label-pro mt-4 leading-loose">Digital Rehabilitation<br/>for the distracted world.</p>
        </div>
        <div className="flex gap-20">
          <div className="flex flex-col gap-4">
            {links.map(l => <Link key={l} href={l === 'Home' ? '/' : `/${l.toLowerCase()}`} className="label-pro hover:text-foreground">{l}</Link>)}
          </div>
          <div className="flex flex-col gap-4">
            {['Twitter', 'GitHub', 'LinkedIn'].map(s => <span key={s} className="label-pro hover:text-foreground cursor-pointer">{s}</span>)}
          </div>
        </div>
      </div>
      <div className="border-t border-border py-8">
        <div className="container-pro flex justify-between label-pro !text-[8px]">
           <span>© 2026 BETAAL AI</span>
           <span>REHAB REVOLUTION 🕊️</span>
        </div>
      </div>
    </footer>
  );
}
