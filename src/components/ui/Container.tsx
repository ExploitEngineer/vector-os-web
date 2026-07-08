import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The inner content column shared by every full-width section. Centralises the
 * max-width so it stops being retyped as `max-w-[1200px]` in a dozen places.
 *
 * - `default` → 1200px (site standard)
 * - `prose`   → 760px  (long-form reading measure, e.g. the blog article)
 */
const WIDTHS = {
  default: "max-w-[1200px]",
  prose: "max-w-[760px]",
} as const;

export function Container({
  as: As = "div",
  size = "default",
  className,
  children,
}: {
  as?: ElementType;
  size?: keyof typeof WIDTHS;
  className?: string;
  children: ReactNode;
}) {
  return (
    <As className={cn("mx-auto w-full", WIDTHS[size], className)}>
      {children}
    </As>
  );
}
