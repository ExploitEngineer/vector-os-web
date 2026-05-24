import type { ZodError } from "zod";
import type { BootLine } from "@/types";

/** Return value shape shared by all form-backed Server Actions. */
export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/** Group a ZodError's issues by field name (works across zod 3/4). */
export function zodFieldErrors(error: ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = [];
    out[key].push(issue.message);
  }
  return out;
}

export function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function bool(form: FormData, key: string): boolean {
  const v = form.get(key);
  return v === "on" || v === "true" || v === "1";
}

/** Split a comma-separated tags input into a clean string array. */
export function tags(form: FormData, key: string): string[] {
  const v = form.get(key);
  if (typeof v !== "string") return [];
  return v
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Parse the bootlog JSON textarea. Returns `null` when the text is present but
 * not valid `BootLine[]`, so the action can surface a field error.
 */
export function bootlog(form: FormData, key: string): BootLine[] | null {
  const v = form.get(key);
  if (typeof v !== "string" || !v.trim()) return [];
  try {
    const parsed = JSON.parse(v);
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (l) => l && typeof l.text === "string" && typeof l.color === "string",
      )
    ) {
      return parsed as BootLine[];
    }
    return null;
  } catch {
    return null;
  }
}
