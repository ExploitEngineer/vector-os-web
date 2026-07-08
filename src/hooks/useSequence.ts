"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Reveals a fixed number of items one after another once `start` is true, and
 * returns how many are currently revealed (0 → total). Unlike CSS
 * animation-delay staggering, the count lives in state, so a caret or progress
 * indicator can track the "current" line — used by the terminal surfaces
 * (loader boot log, git-clone block, About panel rows).
 *
 * Under reduced-motion it snaps straight to `total`.
 */
export function useSequence(
  total: number,
  start: boolean,
  stepMs = 220,
  startDelay = 0,
) {
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setCount(total);
      return;
    }
    let n = 0;
    let interval: ReturnType<typeof setInterval>;
    const kickoff = setTimeout(() => {
      interval = setInterval(() => {
        n += 1;
        setCount(n);
        if (n >= total) clearInterval(interval);
      }, stepMs);
    }, startDelay);
    return () => {
      clearTimeout(kickoff);
      clearInterval(interval);
    };
  }, [start, total, stepMs, startDelay, reduced]);

  return count;
}
