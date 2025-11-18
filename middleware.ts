import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
                     req.nextUrl.pathname.startsWith("/signup");
  const isProtectedPage = req.nextUrl.pathname.startsWith("/dashboard") ||
                          req.nextUrl.pathname.startsWith("/markets") ||
                          req.nextUrl.pathname.startsWith("/properties") ||
                          req.nextUrl.pathname.startsWith("/alerts") ||
                          req.nextUrl.pathname.startsWith("/settings");

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
