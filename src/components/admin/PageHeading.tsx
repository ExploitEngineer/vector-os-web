import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-border border-b pb-5">
      <div>
        <h1 className="font-display text-[34px] uppercase leading-none tracking-[0.01em] text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function NewLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
      <Link href={href}>
        <ArrowLeft className="size-3.5" />
        {label}
      </Link>
    </Button>
  );
}
