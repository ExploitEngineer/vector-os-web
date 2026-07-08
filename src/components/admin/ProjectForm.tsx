"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/form";
import type { Project } from "@/types";
import { FormBanner, FormField, inputClass, SubmitButton } from "./FormField";
import ImageField from "./ImageField";

const STATUS = [
  { value: "active", label: "Active" },
  { value: "coming-soon", label: "In Development" },
  { value: "classified", label: "Classified" },
];

const initial: ActionState = { ok: false };

export default function ProjectForm({
  action,
  project,
  submitLabel = "Save project",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  project?: Project | null;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const fe = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      className="max-w-2xl animate-[fade-up_0.5s_var(--ease-settle)_both]"
    >
      {state.error ? <FormBanner>{state.error}</FormBanner> : null}

      <FormField label="Name" htmlFor="name" error={fe.name}>
        <input
          id="name"
          name="name"
          defaultValue={project?.name ?? ""}
          className={inputClass}
          required
        />
      </FormField>

      <FormField
        label="Slug"
        hint="Leave blank to auto-generate from the name."
        error={fe.slug}
      >
        <input
          name="slug"
          defaultValue={project?.slug ?? ""}
          className={inputClass}
        />
      </FormField>

      <FormField label="Short description" error={fe.short}>
        <textarea
          name="short"
          defaultValue={project?.short ?? ""}
          rows={2}
          className={inputClass}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Language" error={fe.lang}>
          <input
            name="lang"
            defaultValue={project?.lang ?? ""}
            className={inputClass}
          />
        </FormField>
        <FormField label="Stars" error={fe.stars}>
          <input
            type="number"
            name="stars"
            min={0}
            defaultValue={project?.stars ?? 0}
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Status" error={fe.status}>
          <select
            name="status"
            defaultValue={project?.status ?? "active"}
            className={inputClass}
          >
            {STATUS.map((s) => (
              <option key={s.value} value={s.value} className="bg-vos-panel-2">
                {s.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Display order" error={fe.displayOrder}>
          <input
            type="number"
            name="displayOrder"
            defaultValue={project?.displayOrder ?? 0}
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField
        label="Tags"
        hint="Comma-separated, e.g. LINUX, KERNEL, C"
        error={fe.tags}
      >
        <input
          name="tags"
          defaultValue={project?.tags?.join(", ") ?? ""}
          className={inputClass}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Project URL" error={fe.url}>
          <input
            name="url"
            defaultValue={project?.url ?? ""}
            className={inputClass}
          />
        </FormField>
        <FormField label="GitHub URL" error={fe.githubUrl}>
          <input
            name="githubUrl"
            defaultValue={project?.githubUrl ?? ""}
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField
        label="Bootlog scroll speed"
        hint="CSS duration for the card's scrolling terminal, e.g. 8s"
        error={fe.scrollSpeed}
      >
        <input
          name="scrollSpeed"
          defaultValue={project?.scrollSpeed ?? "8s"}
          className={inputClass}
        />
      </FormField>

      <ImageField
        name="imageUrl"
        label="Image (optional)"
        defaultValue={project?.imageUrl ?? ""}
      />

      <FormField
        label="Bootlog (JSON)"
        hint='Array of { "text": "...", "color": "#00e5ff" }. Leave [] for none.'
        error={fe.bootlog}
      >
        <textarea
          name="bootlog"
          defaultValue={JSON.stringify(project?.bootlog ?? [], null, 2)}
          rows={6}
          className={`${inputClass} whitespace-pre`}
        />
      </FormField>

      <label className="mb-6 flex items-center gap-2.5 font-mono text-[11px] text-white/55">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured ?? false}
          className="h-4 w-4 accent-vos-cyan"
        />
        Featured
      </label>

      <div className="mt-2">
        <SubmitButton pending={pending} label={submitLabel} />
      </div>
    </form>
  );
}
