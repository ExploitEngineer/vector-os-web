"use client";

import { type RefObject, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type MagneticOptions = {
  /** Fraction of the cursor-to-centre distance the element travels (0–1). */
  strength?: number;
  /** Max travel in px, so large buttons don't drift too far. */
  max?: number;
};

/**
 * Magnetic hover: while the pointer is over the element, it eases toward the
 * cursor. The offset is written to `--mx` / `--my` CSS custom properties (via a
 * rAF-batched write) rather than React state, so nothing re-renders per frame.
 *
 * Consumers apply `translate: var(--mx, 0) var(--my, 0)` and a transition for
 * the spring-back. No-ops entirely under reduced-motion.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>({
  strength = 0.35,
  max = 14,
}: MagneticOptions = {}): RefObject<T | null> {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const frame = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const write = (x: number, y: number) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${x.toFixed(2)}px`);
        el.style.setProperty("--my", `${y.toFixed(2)}px`);
      });
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      write(
        Math.max(-max, Math.min(max, dx * strength)),
        Math.max(-max, Math.min(max, dy * strength)),
      );
    };
    const reset = () => write(0, 0);

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame.current);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [strength, max, reduced]);

  return ref;
}
