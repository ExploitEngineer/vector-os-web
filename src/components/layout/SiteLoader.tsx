"use client";

import { useEffect, useState } from "react";

type SiteLoaderProps = {
  duration?: number;
  holdAtFull?: number;
  slideDuration?: number;
  cornerRadius?: number;
  showOncePerSession?: boolean;
};

type LoaderWindow = Window & { __vosLoaderComplete?: boolean };

/**
 * Full-screen black intro curtain. Counts 0% → 100%, holds, then slides up
 * while rounding its bottom corners. Fires a `vos:loader-complete` window event
 * (and sets `window.__vosLoaderComplete`) so the hero can start its own
 * animation once the curtain has lifted. Shows once per browser session.
 */
export default function SiteLoader({
  duration = 4000,
  holdAtFull = 350,
  slideDuration = 1100,
  cornerRadius = 80,
  showOncePerSession = true,
}: SiteLoaderProps) {
  const [percent, setPercent] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const complete = () => {
      (window as LoaderWindow).__vosLoaderComplete = true;
      window.dispatchEvent(new CustomEvent("vos:loader-complete"));
    };

    // Skip the curtain if it already ran this session.
    if (showOncePerSession) {
      try {
        if (sessionStorage.getItem("vos:loader-shown") === "1") {
          setHidden(true);
          setTimeout(complete, 0);
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
  }, [duration, holdAtFull, slideDuration, showOncePerSession]);

  if (hidden) return null;

  return (
    <div
      aria-hidden={exiting}
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-vos-black transition-[transform,border-radius] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        exiting ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{
        transitionDuration: `${slideDuration}ms`,
        borderBottomLeftRadius: exiting ? cornerRadius : 0,
        borderBottomRightRadius: exiting ? cornerRadius : 0,
      }}
    >
      <span className="select-none font-sans text-[clamp(120px,22vw,320px)] font-extrabold leading-none tracking-[-0.02em] text-white [font-variant-numeric:tabular-nums] [text-shadow:0_0_60px_rgba(255,255,255,0.12)] max-[600px]:text-[clamp(96px,30vw,200px)]">
        {percent}%
      </span>
    </div>
  );
}
