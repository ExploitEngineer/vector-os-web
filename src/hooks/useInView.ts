"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll helper. Attach `ref` to the element to watch; `inView`
 * flips true once it intersects the viewport. Defaults to firing once.
 * Replaces the per-component IntersectionObserver boilerplate.
 *
 * `rootMargin` defaults to a small negative bottom inset so reveals trigger a
 * touch before the element is fully on-screen, which reads more deliberate than
 * firing exactly at the edge. If IntersectionObserver is unavailable, `inView`
 * falls back to true so content is never left hidden.
 */
export function useInView<T extends Element = HTMLDivElement>(
  threshold = 0.1,
  once = true,
  rootMargin = "0px 0px -8% 0px",
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, inView } as const;
}
