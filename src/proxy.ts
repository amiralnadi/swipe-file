import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// If no OAuth credentials are configured, skip auth gate (local dev mode)
const oauthConfigured = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

export default auth((req) => {
  // Allow auth API routes always
  if (req.nextUrl.pathname.startsWith("/api/auth")) return NextResponse.next();

  // No OAuth creds = local dev, skip auth entirely
  if (!oauthConfigured) return NextResponse.next();

  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";

  // Redirect to login if not authenticated
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect to home if already logged in and on login page
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
