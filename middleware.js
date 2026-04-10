import { NextResponse } from "next/server";

export function middleware(req) {
  const password = process.env.SITE_PASSWORD;
  const cookie   = req.cookies.get("auth")?.value;

  // Already authenticated
  if (cookie === password) return NextResponse.next();

  // Allow login page and API through
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
