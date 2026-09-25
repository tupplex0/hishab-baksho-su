import { LoginForm } from "@/components/features/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS Admin Login",
  description: "Sign in to Hishab-Baksho SaaS Admin Control Center",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-md">
        <LoginForm />
        <p className="text-center text-xs text-muted-foreground/70 mt-6">
          &copy; {new Date().getFullYear()} Hishab-Baksho. SaaS Platform Management.
        </p>
      </div>
    </div>
  );
}
