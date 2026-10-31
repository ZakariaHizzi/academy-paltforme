import { requireRole } from "@/lib/auth-server";

export default async function DirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("director");

  return children;
}
