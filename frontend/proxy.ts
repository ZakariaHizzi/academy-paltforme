import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_COOKIE,
  EXPIRED_COOKIE_OPTIONS,
  LEGACY_SESSION_COOKIE,
  verifyAuthToken,
} from "@/lib/auth-token";
import type { UserRole } from "@/lib/types";

const PROTECTED_ROUTES: ReadonlyArray<{
  prefix: string;
  role: UserRole;
}> = [
  { prefix: "/student", role: "student" },
  { prefix: "/faculty", role: "faculty" },
  { prefix: "/director", role: "director" },
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const route = PROTECTED_ROUTES.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!route) {
    return NextResponse.next();
  }

  const auth = verifyAuthToken(request.cookies.get(AUTH_COOKIE)?.value);

  if (!auth || auth.role !== route.role) {
    const redirectUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Wipe invalid, expired, or tampered credentials upon redirection
    response.cookies.set(AUTH_COOKIE, "", EXPIRED_COOKIE_OPTIONS);
    response.cookies.set(LEGACY_SESSION_COOKIE, "", EXPIRED_COOKIE_OPTIONS);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/faculty/:path*",
    "/director/:path*",
  ],
};
