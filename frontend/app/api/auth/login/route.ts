import { NextResponse } from "next/server";

import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  TOKEN_COOKIE,
} from "@/lib/session";
import type { AuthUser } from "@/lib/types";
import { isUserRole } from "@/lib/types";

export const runtime = "nodejs";

const BACKEND_URL = (
  process.env.BACKEND_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

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
  let body: { email?: unknown; password?: unknown };

  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
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

  const payload = (await upstream.json().catch(() => null)) as
    | BackendLoginResponse
    | null;

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

  let sessionToken: string;

  try {
    sessionToken = createSessionToken(user);
  } catch (error) {
    console.error("Unable to create session token", error);

    return NextResponse.json(
      { message: "Session service is not configured." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ user });

  response.cookies.set(
    TOKEN_COOKIE,
    payload.token,
    SESSION_COOKIE_OPTIONS,
  );
  response.cookies.set(
    SESSION_COOKIE,
    sessionToken,
    SESSION_COOKIE_OPTIONS,
  );
  response.headers.set("Cache-Control", "no-store");

  return response;
}
