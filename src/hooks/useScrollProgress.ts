"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks how far an element has travelled through the viewport: 0 as its top
 * reaches the bottom of the screen, 1 as its bottom leaves the top. The scroll
 * listener is passive and rAF-batched (one layout read per frame, max), and the
 * raw progress is mirrored to a `--p` CSS custom property on the element so
 * scroll-scrubbed visuals can run on the compositor without re-rendering React.
 *
 * The returned `progress` is quantised to 2 decimals so components that need the
 * number for logic only re-render on meaningful change.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);
  const last = useRef(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      raf.current = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      el.style.setProperty("--p", p.toFixed(4));
      const q = Math.round(p * 100) / 100;
      if (q !== last.current) {
        last.current = q;
        setProgress(q);
      }
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress } as const;
}
