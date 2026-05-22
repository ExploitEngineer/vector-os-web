"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const animRef = useRef(0);
  const rafRef = useRef(0);
  const currentTilt = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const targetTilt = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0, tx: 0, ty: 0 });

  // Smoothly ease the headline tilt toward the pointer target.
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      const s = 0.2;
      const c = currentTilt.current;
      const t = targetTilt.current;
      c.x = lerp(c.x, t.x, s);
      c.y = lerp(c.y, t.y, s);
      c.tx = lerp(c.tx, t.tx, s);
      c.ty = lerp(c.ty, t.ty, s);
      setTilt({ ...c });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetTilt.current = {
      x: ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -10,
      y: ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 10,
      tx: ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 12,
      ty: ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 5,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetTilt.current = { x: 0, y: 0, tx: 0, ty: 0 };
  }, []);

  // Animated film-grain + twinkling starfield behind the headline.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() < 0.15 ? 2 : 1,
      phase: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const n = Math.random() * 10;
        d[i] = n;
        d[i + 1] = n;
        d[i + 2] = n;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      for (const s of stars) {
        const pulse = 0.1 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.4 + s.phase));
        ctx.globalAlpha = pulse * 0.6;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(Math.floor(s.x * w), Math.floor(s.y * h), s.size, s.size);
      }
      ctx.globalAlpha = 1;
      t += 0.02;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Once revealed, fire an occasional RGB glitch.
  useEffect(() => {
    if (!done) return;
    let timer: ReturnType<typeof setTimeout>;
    const fire = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 280);
      timer = setTimeout(fire, 3500 + Math.random() * 4000);
    };
    timer = setTimeout(fire, 1200);
    return () => clearTimeout(timer);
  }, [done]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: decorative parallax tilt; no essential interaction
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-[calc(100vh-56px)] w-full flex-col items-center justify-center overflow-hidden bg-vos-black px-12 py-[60px] text-center max-[900px]:px-8 max-[900px]:py-10 max-[480px]:h-[85svh] max-[480px]:px-5 max-[480px]:py-0"
    >
      {/* background layers */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.85]"
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-1/2 w-3/5 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_65%)]" />
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

        <div
          className="[will-change:transform]"
          style={{
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translate3d(${tilt.tx}px,${tilt.ty}px,0)`,
          }}
        >
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
          href="/projects"
          className="group relative mt-[34px] inline-flex h-[54px] items-center overflow-hidden rounded-[1px] border border-white bg-white px-9 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-white/40 max-[900px]:mt-7 max-[900px]:h-[50px] max-[900px]:px-[30px] max-[480px]:mt-7 max-[480px]:h-12 max-[480px]:px-7 max-[480px]:text-[10px] max-[480px]:tracking-[0.16em]"
        >
          <span className="absolute inset-0 z-0 -translate-x-[101%] bg-black transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0" />
          <span className="relative z-[1] flex items-center gap-[11px] transition-colors duration-[250ms] group-hover:text-white">
            <span className="h-1.5 w-1.5 flex-shrink-0 bg-current max-[480px]:hidden" />
            EXPLORE PROJECTS ↓
          </span>
        </Link>
      </div>
    </section>
  );
}
