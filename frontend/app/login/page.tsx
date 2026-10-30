import type { Metadata } from "next";
import AuthScreen from "../../components/auth-screen";

export const metadata: Metadata = {
  title: "Sign In — Veritas University",
  description: "Sign in to the Veritas University academic portal.",
};

export default function LoginPage() {
  return <AuthScreen />;
}
