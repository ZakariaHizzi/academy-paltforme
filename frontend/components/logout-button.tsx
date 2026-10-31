"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { logout } from "../lib/auth";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "pending" | "error">("idle");

  async function handleLogout() {
    setState("pending");

    try {
      await logout();
      router.replace("/login");
      router.refresh();
    } catch {
      setState("error");
    }
  }

  return (
    <button
      className={className}
      disabled={state === "pending"}
      onClick={handleLogout}
      title={
        state === "error"
          ? "Sign out failed. Click to retry."
          : "Sign out of your session"
      }
      type="button"
    >
      <span className="material-symbols-outlined text-base">logout</span>
      <span>
        {state === "pending"
          ? "Signing out..."
          : state === "error"
            ? "Retry Sign Out"
            : "Sign Out"}
      </span>
    </button>
  );
}
