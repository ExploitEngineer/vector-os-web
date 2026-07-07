"use client";

import { useEffect, useState } from "react";

/**
 * Single source of truth for `prefers-reduced-motion`. CSS already neutralises
 * declarative animations, but the JS-driven effects (canvas grain, pointer
 * tilt, scramble/typewriter intervals, count-up) can't see that media query —
 * they consult this hook and degrade to a static/instant result instead.
 *
 * Returns `false` on the very first (SSR/pre-hydration) paint so the default
 * server markup matches, then resolves to the real preference after mount.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
