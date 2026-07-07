"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScramble } from "@/hooks/useScramble";

const TARGET = "VECTOR\nOPERATING\nSYSTEM";

type LoaderWindow = Window & { __vosLoaderComplete?: boolean };

const titleType =
  "font-display text-[160px] uppercase leading-[0.88] tracking-[0.01em] [white-space:pre-line] max-[900px]:text-[105px] max-[480px]:text-[76px]";

export default function Hero({
  waitForLoader = true,
}: {
  waitForLoader?: boolean;
}) {
  const reduced = useReducedMotion();

  // Hold the scramble until the loader curtain lifts (or 6s safety net).
  const [scrambleReady, setScrambleReady] = useState(() => {
    if (!waitForLoader) return true;
    if (typeof window === "undefined") return false;
    return (window as LoaderWindow).__vosLoaderComplete === true;
  });

  useEffect(() => {
    if (scrambleReady || typeof window === "undefined") return;
    const handler = () => {
      (window as LoaderWindow).__vosLoaderComplete = true;
      setScrambleReady(true);
    };
    window.addEventListener("vos:loader-complete", handler, { once: true });
    const safetyTimer = window.setTimeout(handler, 6000);
    return () => {
      window.removeEventListener("vos:loader-complete", handler);
      window.clearTimeout(safetyTimer);
    };
  }, [scrambleReady]);

  const { display, done } = useScramble(TARGET, scrambleReady);
  const [glitch, setGlitch] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>({ strength: 0.4, max: 10 });
  const animRef = useRef(0);
  const rafRef = useRef(0);
  const tiltRunning = useRef(false);
  const currentTilt = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const targetTilt = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // Ease the headline tilt toward the pointer target by writing the transform
  // straight to the DOM (no React state → no per-frame re-render). The loop
  // parks itself once everything has settled to zero and restarts on move.
  const applyTilt = useCallback(() => {
    const el = tiltRef.current;
    if (el) {
      const c = currentTilt.current;
      el.style.transform = `perspective(900px) rotateX(${c.x.toFixed(3)}deg) rotateY(${c.y.toFixed(3)}deg) translate3d(${c.tx.toFixed(2)}px,${c.ty.toFixed(2)}px,0)`;
    }
  }, []);

  const startTiltLoop = useCallback(() => {
    if (tiltRunning.current || reduced) return;
    tiltRunning.current = true;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      const c = currentTilt.current;
      const t = targetTilt.current;
      c.x = lerp(c.x, t.x, 0.12);
      c.y = lerp(c.y, t.y, 0.12);
      c.tx = lerp(c.tx, t.tx, 0.12);
      c.ty = lerp(c.ty, t.ty, 0.12);
      applyTilt();
      const settled =
        Math.abs(c.x - t.x) < 0.01 &&
        Math.abs(c.y - t.y) < 0.01 &&
        Math.abs(c.tx - t.tx) < 0.05 &&
        Math.abs(c.ty - t.ty) < 0.05;
      if (settled) {
        tiltRunning.current = false; // park until the next pointer move
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [applyTilt, reduced]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      targetTilt.current = {
        x: (py - 0.5) * -20,
        y: (px - 0.5) * 20,
        tx: (px - 0.5) * 24,
        ty: (py - 0.5) * 10,
      };
      // Cursor-tracked cyan spotlight, driven by CSS vars (no re-render).
      sectionRef.current?.style.setProperty(
        "--gx",
        `${(px * 100).toFixed(1)}%`,
      );
      sectionRef.current?.style.setProperty(
        "--gy",
        `${(py * 100).toFixed(1)}%`,
      );
      startTiltLoop();
    },
    [reduced, startTiltLoop],
  );

  const handleMouseLeave = useCallback(() => {
    targetTilt.current = { x: 0, y: 0, tx: 0, ty: 0 };
    startTiltLoop();
  }, [startTiltLoop]);

  // Animated film-grain + twinkling starfield. Cheap version: noise is rendered
  // into a small offscreen buffer and scaled up (chunky CRT grain) instead of
  // writing every viewport pixel per frame, capped to ~30fps, and paused when
  // the hero is off-screen or the tab is hidden. Skipped under reduced-motion.
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Low-res noise buffer — ~48k pixels regardless of viewport size.
    const buf = document.createElement("canvas");
    buf.width = 220;
    buf.height = 220;
    const bctx = buf.getContext("2d");
    if (!bctx) return;
    const noise = bctx.createImageData(buf.width, buf.height);

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    ctx.imageSmoothingEnabled = false;

    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() < 0.15 ? 2 : 1,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    let last = 0;
    let visible = true;
    const FRAME = 1000 / 30;

    const paint = () => {
      const w = canvas.width;
      const h = canvas.height;
      const d = noise.data;
      for (let i = 0; i < d.length; i += 4) {
        const n = Math.random() * 10;
        d[i] = n;
        d[i + 1] = n;
        d[i + 2] = n;
        d[i + 3] = 255;
      }
      bctx.putImageData(noise, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(buf, 0, 0, w, h);
      for (const s of stars) {
        const pulse = 0.1 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.4 + s.phase));
        ctx.globalAlpha = pulse * 0.6;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(Math.floor(s.x * w), Math.floor(s.y * h), s.size, s.size);
      }
      ctx.globalAlpha = 1;
      t += 0.02;
    };

    if (reduced) {
      paint(); // one static frame, no loop
      return () => window.removeEventListener("resize", resize);
    }

    const draw = (now: number) => {
      if (visible && now - last >= FRAME) {
        last = now;
        paint();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting && !document.hidden;
      },
      { threshold: 0 },
    );
    io.observe(section);
    const onVis = () => {
      visible = !document.hidden && section.getBoundingClientRect().bottom > 0;
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, [reduced]);

  // Once revealed, fire an occasional RGB glitch (skipped under reduced-motion).
  useEffect(() => {
    if (!done || reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    const fire = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 280);
      timer = setTimeout(fire, 3500 + Math.random() * 4000);
    };
    timer = setTimeout(fire, 1200);
    return () => clearTimeout(timer);
  }, [done, reduced]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: decorative parallax tilt; no essential interaction
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-[calc(100svh-56px)] w-full flex-col items-center justify-center overflow-hidden bg-vos-black px-12 py-[60px] text-center max-[900px]:px-8 max-[900px]:py-10 max-[480px]:h-[85svh] max-[480px]:px-5 max-[480px]:py-0"
    >
      {/* background layers */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.85]"
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-1/2 w-3/5 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_65%)]" />
      {/* cursor-tracked cyan spotlight */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(420px_circle_at_var(--gx,50%)_var(--gy,38%),rgb(0_229_255_/_0.06),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.07)_2px,rgba(0,0,0,0.07)_4px)]" />
      <div className="pointer-events-none absolute inset-x-0 z-[3] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-[hero-scan_7s_linear_infinite]" />

      {/* corner brackets */}
      <span className="pointer-events-none absolute left-[18px] top-4 z-[5] h-[18px] w-[18px] border-l border-t border-white opacity-20 max-[900px]:h-3.5 max-[900px]:w-3.5 max-[480px]:h-3 max-[480px]:w-3" />
      <span className="pointer-events-none absolute right-[18px] top-4 z-[5] h-[18px] w-[18px] border-r border-t border-white opacity-20 max-[900px]:h-3.5 max-[900px]:w-3.5 max-[480px]:h-3 max-[480px]:w-3" />
      <span className="pointer-events-none absolute bottom-4 left-[18px] z-[5] h-[18px] w-[18px] border-b border-l border-white opacity-20 max-[900px]:h-3.5 max-[900px]:w-3.5 max-[480px]:h-3 max-[480px]:w-3" />
      <span className="pointer-events-none absolute bottom-4 right-[18px] z-[5] h-[18px] w-[18px] border-b border-r border-white opacity-20 max-[900px]:h-3.5 max-[900px]:w-3.5 max-[480px]:h-3 max-[480px]:w-3" />

      {/* content */}
      <div className="relative z-[2] mx-auto flex w-full max-w-[1200px] flex-col items-center">
        <p className="mb-3.5 font-mono text-[18px] uppercase tracking-[0.3em] text-white/[0.28] max-[900px]:mb-2.5 max-[900px]:text-[14px] max-[480px]:mb-2.5 max-[480px]:text-[11px] max-[480px]:tracking-[0.22em]">
          THE
        </p>

        <div ref={tiltRef} className="[will-change:transform]">
          <div className="relative inline-block">
            <div
              className={`${titleType} pointer-events-none absolute inset-0 text-vos-red mix-blend-screen ${glitch ? "opacity-100 animate-[red-glitch_0.28s_steps(1)_forwards]" : "opacity-0"}`}
            >
              {TARGET}
            </div>
            <div
              className={`${titleType} pointer-events-none absolute inset-0 text-vos-cyan mix-blend-screen ${glitch ? "opacity-100 animate-[cyan-glitch_0.28s_steps(1)_forwards]" : "opacity-0"}`}
            >
              {TARGET}
            </div>
            <div
              className={`${titleType} relative text-white [text-shadow:0_0_60px_rgba(255,255,255,0.18),0_0_120px_rgba(255,255,255,0.06)] ${glitch ? "animate-[title-shake_0.28s_steps(1)_forwards]" : ""}`}
            >
              {display}
            </div>
          </div>
        </div>

        <p className="mt-[26px] flex flex-wrap items-center justify-center gap-2.5 font-mono text-[11.5px] uppercase tracking-[0.22em] text-white/30 max-[900px]:mt-5 max-[900px]:gap-2 max-[900px]:text-[10px] max-[900px]:tracking-[0.15em] max-[480px]:hidden">
          <span>—</span>
          <span>BUILD DIFFERENT.</span>
          <span className="inline-block h-[5px] w-[5px] flex-shrink-0 bg-white/45" />
          <span className="font-bold text-white/70">SHIP OPEN SOURCE.</span>
          <span className="inline-block h-[13px] w-[7px] align-middle bg-white/60 animate-[blink_0.9s_step-end_infinite]" />
          <span>—</span>
        </p>

        <Link
          ref={ctaRef}
          href="/projects"
          className="group relative mt-[34px] inline-flex h-[54px] translate-x-[var(--mx,0)] translate-y-[var(--my,0)] items-center overflow-hidden rounded-[1px] border border-white bg-white px-9 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-white/40 active:scale-[0.98] max-[900px]:mt-7 max-[900px]:h-[50px] max-[900px]:px-[30px] max-[480px]:mt-7 max-[480px]:h-12 max-[480px]:px-7 max-[480px]:text-[10px] max-[480px]:tracking-[0.16em]"
        >
          <span className="absolute inset-0 z-0 -translate-x-[101%] bg-black transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
          <span className="relative z-[1] flex items-center gap-[11px] transition-colors duration-[250ms] group-hover:text-white">
            <span className="h-1.5 w-1.5 flex-shrink-0 bg-current max-[480px]:hidden" />
            EXPLORE PROJECTS ↓
          </span>
        </Link>
      </div>
    </section>
  );
}
