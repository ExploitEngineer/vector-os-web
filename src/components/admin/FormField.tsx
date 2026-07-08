import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const inputClass =
  "block min-h-10 w-full min-w-0 rounded-md border border-input bg-vos-panel-2 px-3 py-2 font-mono text-[13px] text-foreground caret-primary outline-none transition-[color,box-shadow,border-color] placeholder:text-muted-foreground/60 hover:border-primary/30 focus-visible:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50";

export const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground";

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string[];
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint ? (
        <p className="mt-1 font-mono text-[10px] leading-relaxed text-white/25">
          {hint}
        </p>
      ) : null}
      {error?.length ? (
        <p className="mt-1 font-mono text-[10px] text-vos-red">{error[0]}</p>
      ) : null}
    </div>
  );
}

export function FormBanner({
  kind = "error",
  children,
}: {
  kind?: "error" | "success";
  children: ReactNode;
}) {
  const tone =
    kind === "error"
      ? "border-vos-red/30 bg-vos-red/[0.06] text-vos-red"
      : "border-vos-green/30 bg-vos-green/[0.06] text-vos-green";
  return (
    <div
      className={`mb-5 rounded-md border px-4 py-2.5 font-mono text-[11px] tracking-[0.04em] ${tone}`}
    >
      {children}
    </div>
  );
}

export function SubmitButton({
  pending,
  label,
}: {
  pending: boolean;
  label: string;
}) {
  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="active:translate-y-px active:scale-[0.99]"
    >
      {pending ? "Saving…" : label}
    </Button>
  );
}
