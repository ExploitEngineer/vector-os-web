"use client";

import { useEffect, useState } from "react";

/**
 * Eases a number from 0 → `target` over `duration` ms once `started`, after an
 * optional `delay`. Used by the About stat counters.
 */
export function useCountUp(
  target: number,
  duration: number,
  started: boolean,
  delay = 0,
) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - (1 - p) ** 3;
        setVal(Math.floor(ease * target));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(target);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [started, target, duration, delay]);

  return val;
}
