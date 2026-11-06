import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AUTH_COOKIE,
  EXPIRED_COOKIE_OPTIONS,
  LEGACY_SESSION_COOKIE,
  verifyAuthToken,
} from "@/lib/auth-token";

export const runtime = "nodejs";

const BACKEND_URL = "https://academy-paltforme-backend.vercel.app";

const BACKEND_TIMEOUT_MS = 15_000;

const ALLOWED_RESOURCES = new Set(["student", "faculty"]);

type ProxyContext = {
  params: Promise<{ path?: string[] }>;
};

async function proxyRequest(
  request: Request,
  context: ProxyContext,
): Promise<NextResponse> {
  const { path = [] } = await context.params;
  const [resource] = path;

  if (
    !resource ||
    !ALLOWED_RESOURCES.has(resource) ||
    path.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        segment.includes("/") ||
        segment.includes("\\"),
    )
  ) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const auth = verifyAuthToken(token);

  if (!auth || !token) {
    const unauthResponse = NextResponse.json(
      { message: "Not authenticated or token has expired." },
      { status: 401 },
    );
    unauthResponse.cookies.set(AUTH_COOKIE, "", EXPIRED_COOKIE_OPTIONS);
    unauthResponse.cookies.set(
      LEGACY_SESSION_COOKIE,
      "",
      EXPIRED_COOKIE_OPTIONS,
    );
    return unauthResponse;
  }

  // Enforce BFF role-based access control
  const isProfile = path.length > 1 && path[1] === "profile";

  if (resource === "student") {
    if (isProfile) {
      if (auth.role !== "student" && auth.role !== "director") {
        return NextResponse.json(
          { message: "Forbidden: Insufficient permissions." },
          { status: 403 },
        );
      }
    } else if (
      path.length === 2 &&
      (request.method === "GET" || request.method === "PATCH")
    ) {
      if (auth.role !== "faculty" && auth.role !== "director") {
        return NextResponse.json(
          { message: "Forbidden: Insufficient permissions." },
          { status: 403 },
        );
      }
    } else {
      if (auth.role !== "director") {
        return NextResponse.json(
          { message: "Forbidden: Director role required." },
          { status: 403 },
        );
      }
    }
  } else if (resource === "faculty") {
    if (isProfile) {
      if (auth.role !== "faculty" && auth.role !== "director") {
        return NextResponse.json(
          { message: "Forbidden: Insufficient permissions." },
          { status: 403 },
        );
      }
    } else if (
      request.method === "GET" &&
      path.length === 3 &&
      path[2] === "students"
    ) {
      if (auth.role !== "faculty" && auth.role !== "director") {
        return NextResponse.json(
          { message: "Forbidden: Insufficient permissions." },
          { status: 403 },
        );
      }
    } else {
      if (auth.role !== "director") {
        return NextResponse.json(
          { message: "Forbidden: Director role required." },
          { status: 403 },
        );
      }
    }
  }

  const headers = new Headers();
  const contentType = request.headers.get("content-type");

  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const targetUrl = `${BACKEND_URL}/api/${path
    .map((segment) => encodeURIComponent(segment))
    .join("/")}${new URL(request.url).search}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

  let upstream: Response;

  try {
    upstream = await fetch(targetUrl, {
      method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      redirect: "manual",
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { message: "The API request timed out." },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { message: "Unable to reach the API server." },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }

  const body =
    upstream.status === 204 || upstream.status === 304
      ? null
      : await upstream.arrayBuffer();
  const response = new NextResponse(body, { status: upstream.status });
  const upstreamContentType = upstream.headers.get("content-type");

  if (upstreamContentType) {
    response.headers.set("Content-Type", upstreamContentType);
  }

  // If Express signals 401 Unauthorized (e.g., token expired or revoked), immediately clear cookies
  if (upstream.status === 401) {
    response.cookies.set(AUTH_COOKIE, "", EXPIRED_COOKIE_OPTIONS);
    response.cookies.set(LEGACY_SESSION_COOKIE, "", EXPIRED_COOKIE_OPTIONS);
  }

  response.headers.set("Cache-Control", "no-store");

  return response;
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
