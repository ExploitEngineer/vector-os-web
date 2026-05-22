"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GITHUB_URL, NAV_LINKS } from "@/data/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass =
    "rounded-[5px] px-[13px] py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/45 transition-[color,letter-spacing] hover:tracking-[0.15em] hover:text-white/95";

  return (
    <>
      <nav
        className={`sticky top-0 z-[1000] flex h-14 items-center justify-between border-b border-white/[0.06] px-8 transition-[background,backdrop-filter] duration-500 max-md:px-6 max-[480px]:px-4 ${
          scrolled
            ? "bg-black/75 backdrop-blur-[24px] backdrop-saturate-[1.8]"
            : "bg-black/95"
        }`}
      >
        {/* Live (left) */}
        <div className="flex shrink-0 items-center gap-[7px] font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff3b30] shadow-[0_0_5px_rgba(255,59,48,0.9)] animate-[pulse-soft_1.4s_ease-in-out_infinite]" />
          <span>Live</span>
        </div>

        {/* Center links (≥768px) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className={linkClass}>
              {l.label}
            </Link>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            GitHub&nbsp;↗
          </a>
        </div>

        {/* Online (right, ≥768px) */}
        <div className="hidden shrink-0 items-center gap-[7px] font-mono text-[10px] uppercase tracking-[0.14em] text-vos-green md:flex">
          <span className="relative h-[7px] w-[7px] shrink-0">
            <span className="absolute inset-0 rounded-full border border-vos-green animate-[ping-ring_1.8s_ease-out_infinite]" />
            <span className="absolute inset-0 rounded-full bg-vos-green shadow-[0_0_5px_rgba(34,255,110,0.8)]" />
          </span>
          <span>Online</span>
        </div>

        {/* Hamburger (<768px) */}
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
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

      {/* Mobile dropdown (<768px) */}
      <div
        className={`fixed inset-x-0 top-14 z-[999] flex flex-col gap-0.5 border-b border-white/[0.08] bg-black/[0.97] px-6 pb-6 pt-4 backdrop-blur-[24px] transition-[transform,opacity] duration-[250ms] md:hidden ${
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {NAV_LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between border-b border-white/[0.05] py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-white/50 transition-colors last:border-none hover:text-white"
          >
            {l.label}
            <span className="text-[10px] text-white/20">→</span>
          </Link>
        ))}
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
    </>
  );
}
