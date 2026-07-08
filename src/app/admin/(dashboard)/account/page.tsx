import { Mail, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import { PageHeading } from "@/components/admin/PageHeading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/services/admin";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <>
      <PageHeading title="Account" subtitle="Manage your admin credentials." />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit animate-[fade-up_0.5s_var(--ease-settle)_both]">
          <CardHeader>
            <CardTitle className="font-mono text-sm uppercase tracking-[0.12em]">
              Identity
            </CardTitle>
            <CardDescription>Signed-in administrator.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md border border-border bg-accent text-primary">
                <Mail className="size-4" />
              </span>
              <span className="truncate font-mono text-[13px] text-foreground">
                {user?.email || user?.name}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Role
              </span>
              <Badge>
                <ShieldCheck className="size-3" />
                Administrator
              </Badge>
            </div>
            <p className="font-mono text-[10px] leading-relaxed text-muted-foreground/70">
              Admin status is set only in the database. Changing your password
              signs out all other sessions.
            </p>
          </CardContent>
        </Card>

        <Card
          className="animate-[fade-up_0.5s_var(--ease-settle)_both]"
          style={{ animationDelay: "80ms" }}
        >
          <CardHeader>
            <CardTitle className="font-mono text-sm uppercase tracking-[0.12em]">
              Change password
            </CardTitle>
            <CardDescription>
              Verify your current password to set a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <ChangePasswordForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
