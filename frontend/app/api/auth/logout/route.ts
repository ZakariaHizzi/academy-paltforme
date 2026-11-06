import { NextResponse } from "next/server";

import {
  AUTH_COOKIE,
  EXPIRED_COOKIE_OPTIONS,
  LEGACY_SESSION_COOKIE,
} from "@/lib/auth-token";

export const runtime = "nodejs";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST() {
  try {
    await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    // Upstream notification is best-effort; cookie deletion is the authoritative logout
  }

  const response = NextResponse.json({ message: "Logged out successfully." });

  response.cookies.set(AUTH_COOKIE, "", EXPIRED_COOKIE_OPTIONS);
  response.cookies.set(LEGACY_SESSION_COOKIE, "", EXPIRED_COOKIE_OPTIONS);
  response.headers.set("Cache-Control", "no-store");

  return response;
}
