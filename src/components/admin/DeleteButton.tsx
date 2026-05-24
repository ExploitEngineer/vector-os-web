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
        className="rounded-md border border-vos-red/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-vos-red/80 transition-colors hover:border-vos-red hover:bg-vos-red/10 hover:text-vos-red disabled:opacity-40"
      >
        {pending ? "…" : label}
      </button>
    </form>
  );
}
