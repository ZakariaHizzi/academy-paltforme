import type {
  ApiErrorPayload,
  StudentProfile,
  TeacherProfile,
  TeacherRoster,
} from "./types";

const API_BASE_URL = "/api/backend";

const REQUEST_TIMEOUT_MS = 15_000;

let redirectingToLogin = false;

export class ApiError extends Error {
  readonly status: number;
  readonly payload: ApiErrorPayload;

  constructor(
    message: string,
    status: number,
    payload: ApiErrorPayload = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body" | "signal"> & {
  body?: unknown;
};

export async function apiFetch<T>(
  path: string,
  { body, headers, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
      {
        ...init,
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
        credentials: "same-origin",
        headers: requestHeaders,
        signal: controller.signal,
      },
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("The request timed out. Please try again.", 408);
    }

    throw new ApiError(
      "Unable to reach the API server. Check that the backend is running.",
      0,
    );
  } finally {
    clearTimeout(timeout);
  }

  const payload = await readPayload(response);

  if (!response.ok) {
    if (response.status === 401) {
      await clearAuthAndRedirect();
    }

    throw new ApiError(
      getErrorMessage(payload, response.status),
      response.status,
      payload,
    );
  }

  return payload as T;
}

/**
 * Handles expired cookie cleanup and redirection to /login safely without infinite loops.
 */
async function clearAuthAndRedirect(): Promise<void> {
  if (typeof window === "undefined" || redirectingToLogin) {
    return;
  }

  redirectingToLogin = true;

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
      credentials: "same-origin",
    });
  } catch {
    // The redirect is still the safest response when the API is unreachable.
  }

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  } else {
    redirectingToLogin = false;
  }
}

async function readPayload(response: Response): Promise<ApiErrorPayload> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as ApiErrorPayload;
  } catch {
    return text;
  }
}

function getErrorMessage(payload: ApiErrorPayload, status: number): string {
  if (payload && typeof payload === "object") {
    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  return `Request failed with status ${status}.`;
}

export const api = {
  student: {
    getProfile: () => apiFetch<StudentProfile>("/student/profile"),
    getById: (id: string) =>
      apiFetch<StudentProfile>(`/student/${encodeURIComponent(id)}`),
  },
  faculty: {
    getProfile: () => apiFetch<TeacherProfile>("/faculty/profile"),
    getStudentById: (id: string) =>
      apiFetch<StudentProfile>(`/student/${encodeURIComponent(id)}`),
  },
  director: {
    listStudents: () => apiFetch<StudentProfile[]>("/student"),
    listFaculty: () => apiFetch<TeacherProfile[]>("/faculty"),
    createStudent: (data: unknown) =>
      apiFetch<{ user: unknown; student: StudentProfile }>("/student", {
        method: "POST",
        body: data,
      }),
    createFaculty: (data: unknown) =>
      apiFetch<{ user: unknown; teacher: TeacherProfile }>("/faculty", {
        method: "POST",
        body: data,
      }),
    updateStudent: (studentId: string, data: unknown) =>
      apiFetch<StudentProfile>(`/student/${encodeURIComponent(studentId)}`, {
        method: "PATCH",
        body: data,
      }),
    getTeacherRoster: (teacherId: string) =>
      apiFetch<TeacherRoster>(
        `/faculty/${encodeURIComponent(teacherId)}/students`,
      ),
    updateTeacherStudents: (teacherId: string, students: string[]) =>
      apiFetch<TeacherProfile>(
        `/faculty/${encodeURIComponent(teacherId)}/students`,
        {
          method: "PUT",
          body: { students },
        },
      ),
  },
};
