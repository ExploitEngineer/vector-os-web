"use client";

import Image from "next/image";
import { type ChangeEvent, useState, useTransition } from "react";
import { uploadImageAction } from "@/actions/upload";
import { FormField, inputClass } from "./FormField";

export default function ImageField({
  name,
  label,
  defaultValue = "",
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    startTransition(async () => {
      const res = await uploadImageAction(fd);
      if (res.ok && res.url) {
        setUrl(res.url);
        setError(undefined);
      } else {
        setError(res.error ?? "Upload failed");
      }
    });
  }

  return (
    <FormField label={label} hint={hint} error={error ? [error] : undefined}>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-start gap-3">
        {url ? (
          <span className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-white/[0.12] bg-[#0d0d0d]">
            <Image
              src={url}
              alt="preview"
              fill
              unoptimized
              sizes="64px"
              className="object-cover"
            />
          </span>
        ) : null}
        <div className="flex-1 space-y-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… or upload below"
            className={inputClass}
          />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/[0.12] bg-[#0d0d0d] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50 transition-colors hover:border-vos-cyan/40 hover:text-white/80">
            {pending ? "Uploading…" : "↑ Upload image"}
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              disabled={pending}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </FormField>
  );
}
