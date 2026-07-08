"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SCRAMBLE_CHARS } from "@/lib/constants";

// Deterministic placeholder for the initial (SSR) render. Using Math.random in
// a useState initializer makes the server and client disagree, which trips a
// hydration mismatch. Index-based picks look scrambled but are identical on
// both sides; the real randomized scramble runs later in useEffect (client only).
function seedScramble(target: string, chars: string) {
  return target
    .split("")
    .map((c, i) => (c === "\n" ? "\n" : chars[(i * 7) % chars.length]))
    .join("");
}

/**
 * Reveals `target` one character at a time (newline-aware). Used for the hero
 * headline. Returns the live string and a `done` flag once fully revealed.
 */
export function useScramble(
  target: string,
  start: boolean,
  intervalMs = 14,
  chars = SCRAMBLE_CHARS,
) {
  const [display, setDisplay] = useState(() => seedScramble(target, chars));
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setDisplay(target);
      setDone(true);
      return;
    }
    const charsArr = target.split("");
    let revealed = 0;
    const id = setInterval(() => {
      let result = "";
      for (let i = 0; i < charsArr.length; i++) {
        if (charsArr[i] === "\n") {
          result += "\n";
          continue;
        }
        result +=
          i < revealed
            ? charsArr[i]
            : chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(result);
      while (revealed < charsArr.length && charsArr[revealed] === "\n")
        revealed++;
      revealed++;
      if (revealed >= charsArr.length) {
        setDisplay(target);
        setDone(true);
        clearInterval(id);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [start, target, intervalMs, chars, reduced]);

  return { display, done };
}

type ScrambleTextOptions = {
  delay?: number;
  frames?: number;
  interval?: number;
  chars?: string;
};

/**
 * Reveals `target` over a fixed number of frames (newline-aware). Used for
 * section eyebrows and stat labels. Returns the live string.
 */
export function useScrambleText(
  target: string,
  started: boolean,
  {
    delay = 0,
    frames = 22,
    interval = 32,
    chars = SCRAMBLE_CHARS,
  }: ScrambleTextOptions = {},
) {
  const [val, setVal] = useState(() => seedScramble(target, chars));
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!started) return;
    if (reduced) {
      setVal(target);
      return;
    }
    const t = setTimeout(() => {
      let frame = 0;
      const id = setInterval(() => {
        frame++;
        const revealed = Math.floor((frame / frames) * target.length);
        let result = "";
        for (let i = 0; i < target.length; i++) {
          if (target[i] === "\n") {
            result += "\n";
            continue;
          }
          result +=
            i < revealed
              ? target[i]
              : chars[Math.floor(Math.random() * chars.length)];
        }
        setVal(result);
        if (frame >= frames) {
          setVal(target);
          clearInterval(id);
        }
      }, interval);
    }, delay);
    return () => clearTimeout(t);
  }, [started, target, delay, frames, interval, chars, reduced]);

  return val;
}
