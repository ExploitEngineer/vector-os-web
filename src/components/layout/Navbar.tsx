"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GITHUB_URL, NAV_LINKS } from "@/data/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the intended trigger, not a body dependency
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close the menu (and release its scroll-lock) once the viewport grows past
  // the mobile breakpoint, since the dropdown is hidden by CSS above 900px.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // While the mobile menu is open: lock body scroll, close on Escape, and
  // close on a click/tap outside the nav shell.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (shellRef.current && !shellRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    // Defer so the opening tap doesn't immediately close it.
    const id = window.setTimeout(
      () => window.addEventListener("pointerdown", onPointer),
      0,
    );
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    // `display: contents` — the wrapper anchors the outside-click ref without
    // generating a box, so the child <nav> still sticks within <body>.
    <div ref={shellRef} className="contents">
      <nav
        className={`sticky top-0 z-[1000] flex h-14 items-center justify-between border-b border-white/[0.06] px-8 transition-[background,backdrop-filter] duration-500 max-[900px]:px-6 max-[480px]:px-4 ${
          scrolled
            ? "bg-black/75 backdrop-blur-[24px] backdrop-saturate-[1.8]"
            : "bg-black/95"
        }`}
      >
        {/* Live (left) */}
        <div className="flex shrink-0 items-center gap-[7px] font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-vos-red shadow-[0_0_5px_rgb(255_45_85_/_0.9)] animate-[pulse-soft_1.4s_ease-in-out_infinite]" />
          <span>Live</span>
        </div>

        {/* Center links (>=900px) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 min-[900px]:flex">
          {NAV_LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.label}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`group relative rounded-[5px] px-[13px] py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-[color,letter-spacing] hover:tracking-[0.15em] ${
                  active ? "text-white/95" : "text-white/45 hover:text-white/95"
                }`}
              >
                {l.label}
                {/* Active/hover indicator that draws in from the left. */}
                <span
                  className={`pointer-events-none absolute inset-x-[13px] -bottom-px h-px origin-left bg-vos-cyan transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[5px] px-[13px] py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/45 transition-[color,letter-spacing] hover:tracking-[0.15em] hover:text-white/95"
          >
            GitHub&nbsp;↗
          </a>
        </div>

        {/* Online (right, >=900px) */}
        <div className="hidden shrink-0 items-center gap-[7px] font-mono text-[10px] uppercase tracking-[0.14em] text-vos-green min-[900px]:flex">
          <span className="relative h-[7px] w-[7px] shrink-0">
            <span className="absolute inset-0 rounded-full border border-vos-green animate-[ping-ring_1.8s_ease-out_infinite]" />
            <span className="absolute inset-0 rounded-full bg-vos-green shadow-[0_0_5px_rgb(34_255_110_/_0.8)]" />
          </span>
          <span>Online</span>
        </div>

        {/* Hamburger (<900px) */}
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] min-[900px]:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span
            className={`h-[1.5px] w-5 origin-center rounded-sm bg-white/70 transition-transform duration-[250ms] ${mobileOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-[1.5px] w-5 origin-center rounded-sm bg-white/70 transition-[transform,opacity] duration-[250ms] ${mobileOpen ? "scale-x-0 opacity-0" : ""}`}
          />
          <span
            className={`h-[1.5px] w-5 origin-center rounded-sm bg-white/70 transition-transform duration-[250ms] ${mobileOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile dropdown (<900px) */}
      <div
        className={`fixed inset-x-0 top-14 z-[999] flex flex-col gap-0.5 border-b border-white/[0.08] bg-black/[0.97] px-6 pb-6 pt-4 backdrop-blur-[24px] transition-[transform,opacity] duration-[250ms] min-[900px]:hidden ${
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {NAV_LINKS.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.label}
              href={l.href}
              aria-current={active ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between border-b border-white/[0.05] py-3 font-mono text-[13px] uppercase tracking-[0.12em] transition-colors last:border-none ${
                active ? "text-vos-cyan" : "text-white/50 hover:text-white"
              }`}
            >
              {l.label}
              <span className="text-[10px] text-white/20">→</span>
            </Link>
          );
        })}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
          className="flex items-center justify-between border-b border-white/[0.05] py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-white/50 transition-colors last:border-none hover:text-white"
        >
          GitHub
          <span className="text-[10px] text-white/20">↗</span>
        </a>
      </div>
    </div>
  );
}
