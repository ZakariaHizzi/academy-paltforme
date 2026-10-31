import { createHmac, timingSafeEqual } from "node:crypto";

import type { UserRole } from "./types";
import { isUserRole } from "./types";

export const SESSION_COOKIE = "veritas_session";
export const TOKEN_COOKIE = "veritas_token";

// 7 days in seconds aligned with JWT expiration
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

export const EXPIRED_COOKIE_OPTIONS = {
  ...SESSION_COOKIE_OPTIONS,
  maxAge: 0,
  expires: new Date(0),
};

export type Session = {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export function createSessionToken(user: {
  id: string;
  email: string;
  role: UserRole;
}): string {
  const secret = getSessionSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload: Session = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(body, secret).toString("base64url");

  return `${body}.${signature}`;
}

/**
 * Performs cryptographic signature verification using HMAC-SHA256 and
 * timingSafeEqual before parsing payload data to prevent client tampering.
 */
export function verifySessionToken(
  token: string | undefined | null,
): Session | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 2) {
    return null;
  }

  const [body, encodedSignature] = parts;

  if (!body || !encodedSignature) {
    return null;
  }

  const expected = sign(body, secret);
  let actual: Buffer;

  try {
    actual = Buffer.from(encodedSignature, "base64url");
  } catch {
    return null;
  }

  if (
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as Partial<Session>;

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      !isUserRole(payload.role) ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number" ||
      payload.exp * 1000 <= Date.now()
    ) {
      return null;
    }

    return payload as Session;
  } catch {
    return null;
  }
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be configured with at least 32 characters.",
    );
  }

  return secret;
}

function sign(body: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(body).digest();
}
