"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/form";
import type { Blog } from "@/types";
import { FormBanner, FormField, inputClass, SubmitButton } from "./FormField";
import ImageField from "./ImageField";

const CATEGORIES = ["LINUX", "SECURITY", "TOOLS"];

const initial: ActionState = { ok: false };

export default function BlogForm({
  action,
  blog,
  submitLabel = "Save post",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  blog?: Blog | null;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl">
      {state.error ? <FormBanner>{state.error}</FormBanner> : null}

      <FormField label="Title" htmlFor="title" error={fe.title}>
        <input
          id="title"
          name="title"
          defaultValue={blog?.title ?? ""}
          className={inputClass}
          required
        />
      </FormField>

      <FormField
        label="Slug"
        hint="Leave blank to auto-generate from the title."
        error={fe.slug}
      >
        <input
          name="slug"
          defaultValue={blog?.slug ?? ""}
          className={inputClass}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Category" error={fe.category}>
          <select
            name="category"
            defaultValue={blog?.category ?? "TOOLS"}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0d0d0d]">
                {c}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Display order" error={fe.displayOrder}>
          <input
            type="number"
            name="displayOrder"
            defaultValue={blog?.displayOrder ?? 0}
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="Excerpt" error={fe.excerpt}>
        <textarea
          name="excerpt"
          defaultValue={blog?.excerpt ?? ""}
          rows={2}
          className={inputClass}
        />
      </FormField>

      <ImageField
        name="featuredImage"
        label="Featured image (optional)"
        defaultValue={blog?.featuredImage ?? ""}
      />

      <FormField
        label="Content (Markdown)"
        hint="Supports GitHub-flavored Markdown."
        error={fe.content}
      >
        <textarea
          name="content"
          defaultValue={blog?.content ?? ""}
          rows={16}
          className={`${inputClass} font-mono`}
        />
      </FormField>

      <label className="mb-6 flex items-center gap-2.5 font-mono text-[11px] text-white/55">
        <input
          type="checkbox"
          name="published"
          defaultChecked={blog?.published ?? false}
          className="h-4 w-4 accent-vos-cyan"
        />
        Published (visible on the public site)
      </label>

      <div>
        <SubmitButton pending={pending} label={submitLabel} />
      </div>
    </form>
  );
}
