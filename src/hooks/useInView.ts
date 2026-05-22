"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll helper. Attach `ref` to the element to watch; `inView`
 * flips true once it intersects the viewport. Defaults to firing once.
 * Replaces the per-component IntersectionObserver boilerplate.
 */
export function useInView<T extends Element = HTMLDivElement>(
  threshold = 0.1,
  once = true,
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  return { ref, inView } as const;
}
