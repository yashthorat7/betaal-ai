import Link from 'next/link';

export default function Footer() {
  const links = ['Home', 'Dashboard', 'Resources', 'About'];
  return (
    <footer className="border-border mt-auto border-t">
      <div className="container-pro flex flex-col justify-between gap-16 py-20 md:flex-row">
        <div>
          <h2 className="text-2xl font-black tracking-tighter italic">BETAAL AI</h2>
          <p className="label-pro mt-4 leading-loose">
            Digital Rehabilitation
            <br />
            for the distracted world.
          </p>
        </div>
        <div className="flex gap-20">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l}
                href={l === 'Home' ? '/' : `/${l.toLowerCase()}`}
                className="label-pro hover:text-foreground"
              >
                {l}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {['Twitter', 'GitHub', 'LinkedIn'].map((s) => (
              <span key={s} className="label-pro hover:text-foreground cursor-pointer">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-border border-t py-8">
        <div className="container-pro label-pro flex justify-between !text-[8px]">
          <span>© 2026 BETAAL AI</span>
          <span>REHAB REVOLUTION 🕊️</span>
        </div>
      </div>
    </footer>
  );
}
