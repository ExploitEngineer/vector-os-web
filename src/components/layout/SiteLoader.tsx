"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type SiteLoaderProps = {
  duration?: number;
  holdAtFull?: number;
  slideDuration?: number;
  cornerRadius?: number;
  showOncePerSession?: boolean;
};

type LoaderWindow = Window & { __vosLoaderComplete?: boolean };

/** Fake boot log — each line prints once the counter passes its `at` percent. */
const BOOT_LINES: { at: number; text: string }[] = [
  { at: 0, text: "vector-os kernel: cold boot" },
  { at: 14, text: "mounting /dev/core ................ ok" },
  { at: 32, text: "loading modules: net crypto fs .... ok" },
  { at: 52, text: "spawning display manager ......... ok" },
  { at: 72, text: "linking open-source runtime ...... ok" },
  { at: 90, text: "handshake // all systems nominal . ok" },
];

/**
 * Full-screen black intro curtain. A streaming kernel-style boot log fills as
 * the counter climbs 0% → 100%, resolves to a "SYSTEM READY" flash, then the
 * curtain slides up while rounding its bottom corners. Fires a
 * `vos:loader-complete` window event so the hero can begin. Shows once per
 * session, and is skipped entirely under reduced-motion.
 */
export default function SiteLoader({
  duration = 4000,
  holdAtFull = 480,
  slideDuration = 1100,
  cornerRadius = 80,
  showOncePerSession = true,
}: SiteLoaderProps) {
  const reduced = useReducedMotion();
  const [percent, setPercent] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const complete = () => {
      (window as LoaderWindow).__vosLoaderComplete = true;
      window.dispatchEvent(new CustomEvent("vos:loader-complete"));
    };

    // Skip the curtain if it already ran this session, or under reduced-motion.
    const skip = () => {
      setHidden(true);
      setTimeout(complete, 0);
    };

    if (reduced) {
      try {
        sessionStorage.setItem("vos:loader-shown", "1");
      } catch {}
      skip();
      return;
    }

    if (showOncePerSession) {
      try {
        if (sessionStorage.getItem("vos:loader-shown") === "1") {
          skip();
          return;
        }
        sessionStorage.setItem("vos:loader-shown", "1");
      } catch {
        // sessionStorage blocked (private mode) — just run the loader.
      }
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let rafId = 0;
    let exitTimer = 0;
    let hideTimer = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setPercent(Math.floor(t * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setPercent(100);
        exitTimer = window.setTimeout(() => setExiting(true), holdAtFull);
        hideTimer = window.setTimeout(() => {
          setHidden(true);
          document.body.style.overflow = prevOverflow;
          complete();
        }, holdAtFull + slideDuration);
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [duration, holdAtFull, slideDuration, showOncePerSession, reduced]);

  if (hidden) return null;

  const visibleLines = BOOT_LINES.filter((l) => percent >= l.at);
  const ready = percent >= 100;

  return (
    <div
      aria-hidden={exiting}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-vos-black transition-[transform,border-radius] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        exiting ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{
        transitionDuration: `${slideDuration}ms`,
        borderBottomLeftRadius: exiting ? cornerRadius : 0,
        borderBottomRightRadius: exiting ? cornerRadius : 0,
      }}
    >
      {/* faint scanline texture */}
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative flex flex-col items-center">
        {/* count / ready flash */}
        <span
          className={`select-none font-sans text-[clamp(120px,22vw,300px)] font-extrabold leading-none tracking-[-0.02em] [font-variant-numeric:tabular-nums] max-[600px]:text-[clamp(96px,30vw,200px)] ${
            ready
              ? "text-vos-cyan [text-shadow:0_0_60px_rgb(0_229_255_/_0.4)]"
              : "text-white [text-shadow:0_0_60px_rgba(255,255,255,0.12)]"
          }`}
        >
          {percent}%
        </span>

        {/* progress bar */}
        <div className="mt-4 h-px w-[min(60vw,360px)] overflow-hidden bg-white/10">
          <div
            className={`h-full ${ready ? "bg-vos-cyan" : "bg-white/70"}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* current status */}
        <p className="mt-4 h-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
          {ready ? (
            <span className="text-vos-cyan">{"// system ready"}</span>
          ) : (
            "// initializing"
          )}
        </p>
      </div>

      {/* streaming boot log, bottom-left terminal style */}
      <div className="pointer-events-none absolute bottom-8 left-8 hidden max-w-[70vw] flex-col gap-1 font-mono text-[11px] leading-relaxed text-white/25 min-[720px]:flex">
        {visibleLines.map((l) => (
          <span
            key={l.at}
            className="animate-[boot-line_0.3s_var(--ease-settle)_both] whitespace-nowrap"
          >
            <span className="text-vos-green/70">[ ok ]</span> {l.text}
          </span>
        ))}
        {!ready && (
          <span className="text-vos-cyan/60">
            ▍
            <span className="animate-[caret-blink_1s_step-end_infinite]">
              _
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
