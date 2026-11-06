import { createHmac, timingSafeEqual } from "node:crypto";

import type { UserRole } from "./types";
import { isUserRole } from "./types";

// The Express backend issues this JWT. It is the single source of truth for auth.
export const AUTH_COOKIE = "veritas_token";

// Removed in the move to a cookie-only flow; cleared wherever auth cookies are reset.
export const LEGACY_SESSION_COOKIE = "veritas_session";

// 7 days in seconds, aligned with the backend JWT_EXPIRES_IN default.
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const isProduction = process.env.NODE_ENV === "production";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  // Secure cookies are only required over HTTPS. In local development the app
  // runs on http://localhost, where some browsers reject Secure cookies.
  secure: isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: AUTH_COOKIE_MAX_AGE,
} as const;

export const EXPIRED_COOKIE_OPTIONS = {
  ...AUTH_COOKIE_OPTIONS,
  maxAge: 0,
  expires: new Date(0),
};

export type AuthToken = {
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
};

/**
 * Verifies the backend JWT (HS256) and returns its payload.
 *
 * The signature is checked with timingSafeEqual before any claim is trusted,
 * so a forged or tampered cookie can never grant a role.
 */
export function verifyAuthToken(
  token: string | undefined | null,
): AuthToken | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, body, encodedSignature] = parts;

  if (!encodedHeader || !body || !encodedSignature) {
    return null;
  }

  let header: { alg?: unknown };

  try {
    header = JSON.parse(
      Buffer.from(encodedHeader, "base64url").toString("utf8"),
    ) as { alg?: unknown };
  } catch {
    return null;
  }

  if (header.alg !== "HS256") {
    return null;
  }

  const expected = createHmac("sha256", secret)
    .update(`${encodedHeader}.${body}`)
    .digest();

  let actual: Buffer;

  try {
    actual = Buffer.from(encodedSignature, "base64url");
  } catch {
    return null;
  }

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as Partial<AuthToken>;

    if (
      typeof payload.id !== "string" ||
      !isUserRole(payload.role) ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number" ||
      payload.exp * 1000 <= Date.now()
    ) {
      return null;
    }

    return {
      id: payload.id,
      role: payload.role,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}
