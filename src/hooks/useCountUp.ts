"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Eases a number from 0 → `target` over `duration` ms once `started`, after an
 * optional `delay`. Used by the About stat counters. Under reduced-motion it
 * jumps straight to `target` (no rAF loop).
 */
export function useCountUp(
  target: number,
  duration: number,
  started: boolean,
  delay = 0,
) {
  const [val, setVal] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!started) return;
    if (reduced) {
      setVal(target);
      return;
    }
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
  }, [started, target, duration, delay, reduced]);

  return val;
}
