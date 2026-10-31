import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE, verifySessionToken, type Session } from "./session";
import type { UserRole } from "./types";

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();

  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireRole(role: UserRole): Promise<Session> {
  const session = await getSession();

  if (!session || session.role !== role) {
    redirect("/login");
  }

  return session;
}
