"use client";

import { LogIn, TriangleAlert } from "lucide-react";
import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/form";

const initial: ActionState = { ok: false };

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  const fe = state.fieldErrors ?? {};

  return (
    <Card className="border-border/70 bg-card/80 shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl">
      <CardHeader className="items-center text-center">
        <span className="mb-3 inline-flex size-11 items-center justify-center self-center rounded-lg border border-primary/30 bg-primary/10 font-mono text-primary text-sm shadow-[0_0_24px_rgba(0,229,255,0.18)]">
          {">_"}
        </span>
        <CardTitle className="font-display text-2xl uppercase tracking-[0.04em]">
          Vector OS
        </CardTitle>
        <CardDescription className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary/60">
          {"// admin access"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error ? (
          <div className="mb-5 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-[11px] text-destructive">
            <TriangleAlert className="size-3.5" />
            {state.error}
          </div>
        ) : null}

        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
            {fe.email?.length ? (
              <p className="font-mono text-[10px] text-destructive">
                {fe.email[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
            {fe.password?.length ? (
              <p className="font-mono text-[10px] text-destructive">
                {fe.password[0]}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={pending} className="mt-2 w-full">
            <LogIn className="size-4" />
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
