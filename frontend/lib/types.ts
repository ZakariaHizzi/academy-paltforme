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

export type StudentProfile = {
  _id: string;
  user: UserRef;
  name: string;
  studentId: string;
  major: string;
  gpa: number;
  creditsCompleted: number;
  campusCardBalance: number;
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
  createdAt?: string;
  updatedAt?: string;
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

export function getPopulatedEmail(user: UserRef | undefined): string {
  return user && typeof user !== "string" ? user.email : "—";
}

export function getPopulatedUserId(user: UserRef | undefined): string {
  return user && typeof user !== "string" ? user._id : "";
}
