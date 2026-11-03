import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AUTH_COOKIE,
  verifyAuthToken,
  type AuthToken,
} from "./auth-token";
import type { UserRole } from "./types";

export async function getAuthToken(): Promise<AuthToken | null> {
  const cookieStore = await cookies();

  return verifyAuthToken(cookieStore.get(AUTH_COOKIE)?.value);
}

export async function requireRole(role: UserRole): Promise<AuthToken> {
  const token = await getAuthToken();

  if (!token || token.role !== role) {
    redirect("/login");
  }

  return token;
}
