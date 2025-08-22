import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Block direct access to login pages from the public
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/club-manager/login"
  ) {
    // Check if coming from an admin referrer or has authorization
    const referer = request.headers.get("referer");
    const adminToken = request.cookies.get("auth-token")?.value;
    const clubManagerToken = request.cookies.get("club-manager-token")?.value;

    // Allow if already authenticated or coming from internal navigation
    if (
      adminToken ||
      clubManagerToken ||
      (referer && referer.includes(request.nextUrl.origin))
    ) {
      return NextResponse.next();
    }

    // For direct access without authentication, redirect to homepage
    if (!referer || !referer.includes(request.nextUrl.origin)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/club-manager/login"],
};
