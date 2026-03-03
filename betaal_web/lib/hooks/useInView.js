'use client';
import { useEffect, useRef, useState } from 'react';

export function useInView(opts = { threshold: 0.15, once: true }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          if (opts.once) obs.unobserve(el);
        }
      },
      { threshold: opts.threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [opts.threshold, opts.once]);

  return [ref, visible];
}
