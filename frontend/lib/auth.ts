import { ApiError } from "./api";
import type { AuthUser } from "./types";
import { isUserRole } from "./types";

export type LoginCredentials = {
  email: string;
  password: string;
};

const LOGIN_TIMEOUT_MS = 15_000;

export async function login(
  credentials: LoginCredentials,
): Promise<AuthUser> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch("/api/auth/login", {
      method: "POST",
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(
      "Unable to reach the authentication service. Please try again.",
      0,
    );
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await response.json().catch(() => null)) as
    | {
        user?: Partial<AuthUser>;
        message?: string;
      }
    | null;

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? "Invalid email or password.",
      response.status,
      payload,
    );
  }

  if (
    !payload?.user?.id ||
    typeof payload.user.email !== "string" ||
    !isUserRole(payload.user.role)
  ) {
    throw new ApiError(
      "The authentication service returned an invalid session.",
      502,
      payload,
    );
  }

  return {
    id: String(payload.user.id),
    email: payload.user.email,
    role: payload.user.role,
  };
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new ApiError(
      "Unable to sign out. Please try again.",
      response.status,
    );
  }
}
