import { type NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 middleware (renamed to "proxy"). This is an OPTIMISTIC check only:
 * it redirects unauthenticated visitors away from /admin based purely on cookie
 * presence — no DB calls, since this runs on every matched request. Real
 * enforcement lives in the admin layout (requireAdminPage) and inside each
 * Server Action (requireAdmin).
 */
export default function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // The login page must stay reachable while logged out.
  if (pathname === "/admin/login") return NextResponse.next();

  const hasSession = req.cookies.get("session")?.value;
  if (!hasSession) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
