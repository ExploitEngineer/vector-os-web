"use client";

import { useTransition } from "react";

export default function DeleteButton({
  id,
  action,
  label = "Delete",
  confirmText = "Delete this item? This cannot be undone.",
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        if (!window.confirm(confirmText)) return;
        startTransition(() => action(formData));
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-10 items-center justify-center rounded-md border border-vos-red/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-vos-red/80 transition-all hover:border-vos-red hover:bg-vos-red/10 hover:text-vos-red active:translate-y-px active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-0"
      >
        {pending ? "…" : label}
      </button>
    </form>
  );
}
