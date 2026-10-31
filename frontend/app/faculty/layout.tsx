import { requireRole } from "@/lib/auth-server";

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("faculty");

  return children;
}
