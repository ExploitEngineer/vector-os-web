import type { ElementType, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

/**
 * The section shell every home/marketing block shares: full-bleed dark surface
 * with the responsive gutter + vertical rhythm that used to be copy-pasted as
 *   `px-12 py-[100px] max-[900px]:px-8 max-[900px]:py-20 max-[480px]:px-5 …`
 * into each component. One definition, one place to tune the rhythm.
 *
 * `pad`:
 *   - `default` → full vertical rhythm (100/80/60px)
 *   - `flush`   → gutter only, section owns its own vertical padding (Hero,
 *                 PageHeader, which split top/bottom differently)
 */
const GUTTER = "px-12 max-[900px]:px-8 max-[480px]:px-5";
const RHYTHM = "py-[100px] max-[900px]:py-20 max-[480px]:py-[60px]";

export function Section({
  as: As = "section",
  ref,
  pad = "default",
  className,
  children,
}: {
  as?: ElementType;
  ref?: Ref<HTMLElement>;
  pad?: "default" | "flush";
  className?: string;
  children: ReactNode;
}) {
  return (
    <As
      ref={ref}
      className={cn(
        "relative w-full bg-vos-black",
        GUTTER,
        pad === "default" && RHYTHM,
        className,
      )}
    >
      {children}
    </As>
  );
}
