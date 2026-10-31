import { NextResponse, type NextRequest } from "next/server";

import {
  EXPIRED_COOKIE_OPTIONS,
  SESSION_COOKIE,
  TOKEN_COOKIE,
  verifySessionToken,
} from "@/lib/session";
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

  const session = verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (!session || session.role !== route.role) {
    const redirectUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Wipe any invalid, expired, or tampered credentials upon redirection
    response.cookies.set(SESSION_COOKIE, "", EXPIRED_COOKIE_OPTIONS);
    response.cookies.set(TOKEN_COOKIE, "", EXPIRED_COOKIE_OPTIONS);

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
