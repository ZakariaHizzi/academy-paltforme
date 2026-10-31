import { NextResponse } from "next/server";

import {
  EXPIRED_COOKIE_OPTIONS,
  SESSION_COOKIE,
  TOKEN_COOKIE,
} from "@/lib/session";

export const runtime = "nodejs";

const BACKEND_URL = (
  process.env.BACKEND_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

export async function POST() {
  const internalSecret = process.env.INTERNAL_API_SECRET;

  if (internalSecret) {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "X-Internal-Secret": internalSecret,
        },
      });
    } catch {
      // Upstream notification is best-effort; cookie deletion is the authoritative logout
    }
  }

  const response = NextResponse.json({ message: "Logged out successfully." });

  response.cookies.set(SESSION_COOKIE, "", EXPIRED_COOKIE_OPTIONS);
  response.cookies.set(TOKEN_COOKIE, "", EXPIRED_COOKIE_OPTIONS);
  response.headers.set("Cache-Control", "no-store");

  return response;
}
