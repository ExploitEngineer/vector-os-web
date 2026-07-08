"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/form";
import type { TeamMember } from "@/types";
import { FormBanner, FormField, inputClass, SubmitButton } from "./FormField";
import ImageField from "./ImageField";

const initial: ActionState = { ok: false };

export default function TeamForm({
  action,
  member,
  submitLabel = "Save member",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  member?: TeamMember | null;
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" error={fe.name}>
          <input
            id="name"
            name="name"
            defaultValue={member?.name ?? ""}
            className={inputClass}
            required
          />
        </FormField>
        <FormField label="Handle" hint="GitHub username" error={fe.handle}>
          <input
            name="handle"
            defaultValue={member?.handle ?? ""}
            className={inputClass}
            required
          />
        </FormField>
      </div>

      <FormField label="Role" error={fe.role}>
        <input
          name="role"
          defaultValue={member?.role ?? ""}
          className={inputClass}
        />
      </FormField>

      <FormField label="Focus / bio" error={fe.focus}>
        <textarea
          name="focus"
          defaultValue={member?.focus ?? ""}
          rows={3}
          className={inputClass}
        />
      </FormField>

      <FormField
        label="Tags"
        hint="Comma-separated, e.g. C, KERNEL, LINUX"
        error={fe.tags}
      >
        <input
          name="tags"
          defaultValue={member?.tags?.join(", ") ?? ""}
          className={inputClass}
        />
      </FormField>

      <ImageField
        name="avatar"
        label="Avatar"
        hint="Defaults to https://github.com/<handle>.png if left blank."
        defaultValue={member?.avatar ?? ""}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="GitHub URL" error={fe.github}>
          <input
            name="github"
            defaultValue={member?.github ?? ""}
            className={inputClass}
          />
        </FormField>
        <FormField label="Display order" error={fe.displayOrder}>
          <input
            type="number"
            name="displayOrder"
            defaultValue={member?.displayOrder ?? 0}
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="LinkedIn URL" error={fe.linkedin}>
          <input
            name="linkedin"
            defaultValue={member?.linkedin ?? ""}
            className={inputClass}
          />
        </FormField>
        <FormField label="Twitter URL" error={fe.twitter}>
          <input
            name="twitter"
            defaultValue={member?.twitter ?? ""}
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="mt-2">
        <SubmitButton pending={pending} label={submitLabel} />
      </div>
    </form>
  );
}
