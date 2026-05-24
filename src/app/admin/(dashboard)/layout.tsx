import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import AppSidebar from "@/components/admin/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireAdminPage } from "@/lib/services/admin";

export const metadata: Metadata = { title: "Admin" };

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // UI gate. Every mutation also re-checks via requireAdmin().
  const user = await requireAdminPage();

  // Restore the sidebar open/closed state from the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar email={user.email} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-border border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
          <SidebarTrigger className="text-muted-foreground" />
          <span className="h-5 w-px bg-border" />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Admin Console
          </span>
        </header>
        <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-10 md:py-10">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
