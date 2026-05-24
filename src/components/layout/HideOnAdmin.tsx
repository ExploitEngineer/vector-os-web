"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides the marketing chrome (loader/navbar/footer) on /admin routes. */
export default function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
