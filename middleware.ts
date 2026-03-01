import { NextResponse } from "next/server";
import { auth } from "@/auth";

const protectedRoutes = ["/profile", "/my-list", "/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!req.auth && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/profile/:path*", "/my-list/:path*", "/admin/:path*"]
};
