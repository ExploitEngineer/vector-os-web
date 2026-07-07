"use client";

import { CircleCheck, KeyRound, TriangleAlert } from "lucide-react";
import { useActionState } from "react";
import { changePassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/form";

const initial: ActionState = { ok: false };

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="font-mono text-[10px] text-destructive">{messages[0]}</p>
  );
}

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      {state.ok ? (
        <div className="flex items-center gap-2 rounded-md border border-vos-green/30 bg-vos-green/10 px-3 py-2 font-mono text-[11px] text-vos-green">
          <CircleCheck className="size-3.5" />
          Password updated. Other devices were signed out.
        </div>
      ) : null}
      {state.error ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-[11px] text-destructive">
          <TriangleAlert className="size-3.5" />
          {state.error}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
        <FieldError messages={fe.currentPassword} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
        />
        <p className="font-mono text-[10px] text-muted-foreground/70">
          At least 8 characters, with one letter and one number.
        </p>
        <FieldError messages={fe.newPassword} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
        <FieldError messages={fe.confirmPassword} />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="mt-1 active:translate-y-px active:scale-[0.99]"
      >
        <KeyRound className="size-4" />
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
