'use client';
import { useState, useCallback } from 'react';

export default function GridReveal({ children, className = '' }) {
  const [mouse, setMouse] = useState({ x: -999, y: -999 });

  const onMove = useCallback((e) => {
    setMouse({ x: e.clientX, y: e.clientY + window.scrollY });
  }, []);

  return (
    <div
      onMouseMove={onMove}
      className={`text-foreground relative min-h-screen overflow-x-hidden bg-white ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-white"
        style={{
          backgroundImage:
            'linear-gradient(to right,rgba(0,0,0,0.1) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.1) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: `radial-gradient(circle 350px at ${mouse.x}px ${mouse.y}px,black 0%,transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 350px at ${mouse.x}px ${mouse.y}px,black 0%,transparent 100%)`,
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
