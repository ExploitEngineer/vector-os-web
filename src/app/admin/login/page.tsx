import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/admin";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user?.isAdmin) redirect("/admin");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5">
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      <div className="relative w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
