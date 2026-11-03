"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { login } from "../lib/auth";
import { ROLE_HOME } from "../lib/types";
import { useToast } from "./toast-provider";

export default function AuthScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<
    "idle" | "verifying" | "success"
  >("idle");
  const [loginError, setLoginError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("login-password"));

    if (!email || !password) {
      setLoginError("Enter your official email and password.");
      return;
    }

    setLoginError(null);
    setLoginState("verifying");

    try {
      const user = await login({ email, password });

      setLoginState("success");
      router.replace(ROLE_HOME[user.role]);
      router.refresh();
    } catch (error) {
      setLoginState("idle");
      setLoginError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    }
  }

  function simulateHardwareAuth(method: string) {
    toast(
      `Initiating ${method} verification handshake with Veritas Identity Daemon.`,
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <main className="w-full max-w-lg mx-auto px-margin py-space-xl flex flex-col items-center">
        <div className="w-full mb-space-sm">
          <Link
            className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            href="/"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            <span>Back to home</span>
          </Link>
        </div>
        <div className="flex flex-col w-full">
          {/* Top Academic Seal & Identity Header */}
          <div className="flex flex-col items-center justify-center text-center mb-space-lg w-full">
            {/* Veritas Crest Brand Mark */}
            <div className="relative flex items-center justify-center mb-space-sm">
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-md relative overflow-hidden">
                {/* Shield Background & Emblem */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-container opacity-95"></div>
                <div className="relative z-10 flex flex-col items-center justify-center text-secondary-fixed">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_stories
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed mt-0.5"></div>
                </div>
              </div>
            </div>
            {/* University Wordmark */}
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              VERITAS
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant font-semibold">
                University Portal System
              </span>
              <span className="w-1 h-1 rounded-full bg-secondary"></span>
              <span className="font-label-md text-label-md uppercase text-secondary font-semibold tracking-wider">
                Est. 1842
              </span>
            </div>
            {/* Security & Institutional Compliance Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-space-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-on-surface-variant">
                <span
                  className="material-symbols-outlined text-sm text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
                <span className="font-label-mono text-label-mono uppercase tracking-wider">
                  SSL 256-Bit TLS 1.3
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-on-surface-variant">
                <span
                  className="material-symbols-outlined text-sm text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  policy
                </span>
                <span className="font-label-mono text-label-mono uppercase tracking-wider">
                  FERPA Compliant
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-on-surface-variant">
                <span
                  className="material-symbols-outlined text-sm text-secondary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lock
                </span>
                <span className="font-label-mono text-label-mono uppercase tracking-wider">
                  Duo SSO Active
                </span>
              </div>
            </div>
          </div>

          {/* Primary Authentication Container */}
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-space-lg flex flex-col">
              <div className="mb-space-md">
                <span className="font-label-mono text-label-mono uppercase tracking-wider text-secondary font-semibold">
                  Institutional Single Sign-On
                </span>
                <h2 className="font-headline-sm text-headline-sm text-primary mt-0.5">
                  Sign In to Portal
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Students, faculty and administrators use the same
                  institutional credentials.
                </p>
              </div>

              {/* Sign In Form */}
              <form
                className="flex flex-col gap-space-md"
                onSubmit={handleLogin}
              >
                {loginError ? (
                  <div
                    className="flex items-start gap-2 p-3 rounded-lg bg-error-container text-on-error-container"
                    role="alert"
                  >
                    <span className="material-symbols-outlined text-lg shrink-0">
                      error
                    </span>
                    <span className="font-body-sm text-body-sm">
                      {loginError}
                    </span>
                  </div>
                ) : null}
                {/* University ID / Email Field */}
                <div>
                  <label
                    className="flex items-center justify-between font-label-lg text-label-lg text-primary mb-1.5"
                    htmlFor="email"
                  >
                    <span>Official Email</span>
                    <span className="font-label-mono text-label-mono text-on-surface-variant">
                      e.g. s.doe@veritas.edu
                    </span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">
                      badge
                    </span>
                    <input
                      autoComplete="email"
                      className="w-full pl-10 pr-3 py-2 bg-surface rounded text-on-surface placeholder:text-outline-variant font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-colors"
                      id="email"
                      name="email"
                      placeholder="s.doe@veritas.edu"
                      required
                      type="email"
                    />
                  </div>
                </div>

                {/* Password Field with Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className="font-label-lg text-label-lg text-primary"
                      htmlFor="login-password"
                    >
                      Master Passphrase
                    </label>
                    <a
                      className="font-label-md text-label-md text-secondary hover:underline"
                      href="javascript:void(0)"
                      onClick={() =>
                        toast(
                          "Password reset instructions will be dispatched to your registered recovery contact.",
                        )
                      }
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">
                      key
                    </span>
                    <input
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-2 bg-surface rounded text-on-surface placeholder:text-outline-variant font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-colors"
                      id="login-password"
                      name="login-password"
                      placeholder="••••••••••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      aria-label="Toggle password view"
                      className="absolute right-3 text-on-surface-variant hover:text-primary flex items-center"
                      onClick={() => setShowPassword((value) => !value)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember Device & Security Disclaimer */}
                <div className="p-2.5 rounded bg-surface-container-low flex items-start gap-2.5">
                  <input
                    className="mt-0.5 h-4 w-4 rounded bg-surface accent-primary cursor-pointer"
                    id="remember-device"
                    type="checkbox"
                  />
                  <div className="flex flex-col">
                    <label
                      className="font-label-lg text-label-lg text-primary cursor-pointer select-none"
                      htmlFor="remember-device"
                    >
                      Remember this workstation for 30 days
                    </label>
                    <span className="font-body-sm text-body-sm text-on-surface-variant leading-tight mt-0.5">
                      Strictly prohibited on public terminal labs, shared
                      library consoles, and unmanaged devices.
                    </span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  className="w-full mt-1 py-3 px-4 rounded bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.99] transition-all duration-150 shadow-md group relative overflow-hidden"
                  disabled={loginState !== "idle"}
                  type="submit"
                >
                  <span className="absolute inset-y-0 left-0 w-1 bg-secondary"></span>
                  {loginState === "idle" ? (
                    <>
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">
                        login
                      </span>
                      <span>Enter Portal</span>
                    </>
                  ) : loginState === "verifying" ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">
                        sync
                      </span>
                      <span>Verifying credentials...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">
                        check_circle
                      </span>
                      <span>Authenticated. Opening portal...</span>
                    </>
                  )}
                </button>
              </form>

              {/* Alternative Multi-Factor Authentication Options */}
              <div className="mt-space-md pt-space-md flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-0.5 flex-1 bg-surface-container"></div>
                  <span className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider">
                    Alternative Authentication
                  </span>
                  <div className="h-0.5 flex-1 bg-surface-container"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="py-2.5 px-3 rounded bg-surface-container-low hover:bg-surface-container text-primary flex items-center justify-center gap-2 transition-colors text-center"
                    onClick={() => simulateHardwareAuth("SmartCard")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg text-secondary">
                      contactless
                    </span>
                    <span className="font-label-md text-label-md">
                      VU SmartCard / NFC
                    </span>
                  </button>
                  <button
                    className="py-2.5 px-3 rounded bg-surface-container-low hover:bg-surface-container text-primary flex items-center justify-center gap-2 transition-colors text-center"
                    onClick={() => simulateHardwareAuth("Duo Mobile")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg text-primary">
                      phonelink_lock
                    </span>
                    <span className="font-label-md text-label-md">
                      Duo Push Key
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Notice / IT Helpdesk Footer */}
          <div className="mt-space-lg w-full bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm text-on-surface-variant shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">
                  support_agent
                </span>
                <span className="font-label-lg text-label-lg text-primary">
                  Office of Academic Technology &amp; IT Services
                </span>
              </div>
              <span className="font-label-mono text-label-mono text-on-surface-variant">
                Ext. 4400
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-on-surface-variant mt-0.5">
                  schedule
                </span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-semibold">
                    Service Hours
                  </span>
                  <span className="font-body-sm text-body-sm">
                    Mon–Fri: 07:30 – 21:00 EST
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-on-surface-variant mt-0.5">
                  help
                </span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-semibold">
                    Identity Support
                  </span>
                  <a
                    className="font-body-sm text-body-sm text-secondary hover:underline"
                    href="mailto:registrar@veritas.edu"
                  >
                    registrar@veritas.edu
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-2 text-center text-on-surface-variant font-label-mono text-label-mono border-t border-surface-container">
              Unauthorized access attempts are monitored and logged pursuant to
              Federal Statute 18 U.S.C. § 1030.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
