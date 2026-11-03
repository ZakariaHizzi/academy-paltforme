export const USER_ROLES = ["student", "faculty", "director"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_HOME: Record<UserRole, string> = {
  student: "/student",
  faculty: "/faculty",
  director: "/director",
};

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type PopulatedUser = {
  _id: string;
  email: string;
  role: UserRole;
};

export type UserRef = PopulatedUser | string;

export type ClassBlockProp = {
  _id?: string;
  code: string;
  title: string;
  room?: string;
  instructor?: string;
  badge?: string;
  blockClass?: string;
  codeClass?: string;
  badgeClass?: string;
  detailClass?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
};

export type RosterMeta = {
  year?: number;
  track?: string;
  midtermScore?: number;
  labsScore?: number;
  letterGrade?: string;
  attendanceSummary?: string;
  attendanceStatus?: "present" | "absent" | "late" | "excused" | "idle";
  dossierStatus?:
    | "verified"
    | "submitted"
    | "in-review"
    | "incomplete"
    | "honors"
    | "none";
  dossierLabel?: string;
  academicAlert?: boolean;
  examBonus?: number;
};

export type StudentProfile = {
  _id: string;
  user: UserRef;
  name: string;
  studentId: string;
  major: string;
  gpa: number;
  creditsCompleted: number;
  campusCardBalance: number;
  classBlockProps?: ClassBlockProp[];
  roster?: RosterMeta;
  createdAt?: string;
  updatedAt?: string;
};

export type TeacherProfile = {
  _id: string;
  user: UserRef;
  name: string;
  department: string;
  rank: string;
  office?: string;
  teachingLoad: number;
  students?: (StudentProfile | string)[];
  createdAt?: string;
  updatedAt?: string;
};

export type TeacherRoster = {
  teacherId: string;
  name: string;
  department: string;
  students: StudentProfile[];
};

export type ApiErrorPayload =
  | {
      message?: string;
      error?: string;
    }
  | string
  | null;

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (USER_ROLES as readonly string[]).includes(value)
  );
}

const NAME_TITLES = new Set([
  "dr",
  "prof",
  "professor",
  "mr",
  "mrs",
  "ms",
  "miss",
  "mx",
  "sir",
  "madam",
]);

/**
 * Returns two letters for an avatar, taken from the first and last part of a
 * name. Honorifics such as "Dr." are ignored so "Dr. Eleanor Vance" becomes
 * "EV" rather than "DV".
 */
export function initialsFromName(
  name: string | null | undefined,
  fallback = "NA",
): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const meaningful = words.filter(
    (word) => !NAME_TITLES.has(word.replace(/[^a-zA-Z]/g, "").toLowerCase()),
  );
  const parts = meaningful.length > 0 ? meaningful : words;

  if (parts.length === 0) {
    return fallback;
  }

  if (parts.length === 1) {
    const letters = parts[0]
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 2)
      .toUpperCase();

    return letters || fallback;
  }

  const first = parts[0].replace(/[^a-zA-Z]/g, "").charAt(0);
  const last = parts[parts.length - 1].replace(/[^a-zA-Z]/g, "").charAt(0);

  return `${first}${last}`.toUpperCase() || fallback;
}

export function getPopulatedEmail(user: UserRef | undefined): string {
  return user && typeof user !== "string" ? user.email : "—";
}

export function getPopulatedUserId(user: UserRef | undefined): string {
  return user && typeof user !== "string" ? user._id : "";
}
