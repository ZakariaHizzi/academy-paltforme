import { NextResponse } from "next/server";

import {
  AUTH_COOKIE,
  AUTH_COOKIE_OPTIONS,
  EXPIRED_COOKIE_OPTIONS,
  LEGACY_SESSION_COOKIE,
  verifyAuthToken,
} from "@/lib/auth-token";
import type { AuthUser } from "@/lib/types";
import { isUserRole } from "@/lib/types";

export const runtime = "nodejs";

const BACKEND_URL = process.env.BACKEND_URL;

type BackendLoginResponse = {
  token?: string;
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  message?: string;
};

export async function POST(request: Request) {
  let body: { email?: string; password?: string };

  try {
    body = (await request.json()) as { email: string; password: string };
  } catch {
    return NextResponse.json(
      { message: "A JSON body with email and password is required." },
      { status: 400 },
    );
  }

  if (
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    !body.email.trim() ||
    !body.password
  ) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  const internalSecret = process.env.INTERNAL_API_SECRET;
  const upstreamHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (internalSecret) {
    upstreamHeaders["X-Internal-Secret"] = internalSecret;
  }

  let upstream: Response;

  try {
    upstream = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      cache: "no-store",
      headers: upstreamHeaders,
      body: JSON.stringify({
        email: body.email.trim().toLowerCase(),
        password: body.password,
      }),
    });
  } catch {
    return NextResponse.json(
      { message: "Authentication service is unavailable." },
      { status: 502 },
    );
  }

  const payload = (await upstream
    .json()
    .catch(() => null)) as BackendLoginResponse | null;

  if (!upstream.ok) {
    return NextResponse.json(
      { message: payload?.message ?? "Invalid email or password." },
      { status: upstream.status },
    );
  }

  if (
    !payload?.token ||
    !payload.user?.id ||
    typeof payload.user.email !== "string" ||
    !isUserRole(payload.user.role)
  ) {
    return NextResponse.json(
      { message: "Authentication service returned an invalid response." },
      { status: 502 },
    );
  }

  const user: AuthUser = {
    id: String(payload.user.id),
    email: payload.user.email,
    role: payload.user.role,
  };

  const auth = verifyAuthToken(payload.token);

  if (!auth || auth.role !== user.role) {
    console.error(
      "Unable to verify the token issued by the authentication service",
    );

    return NextResponse.json(
      { message: "Authentication service is not configured." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ user });

  response.cookies.set(AUTH_COOKIE, payload.token, AUTH_COOKIE_OPTIONS);
  // Remove the cookie from the previous two-cookie flow.
  response.cookies.set(LEGACY_SESSION_COOKIE, "", EXPIRED_COOKIE_OPTIONS);
  response.headers.set("Cache-Control", "no-store");

  return response;
}
