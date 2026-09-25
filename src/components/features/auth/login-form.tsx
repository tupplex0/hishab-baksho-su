"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { fetcher } from "@/services/api";
import { BrandWordmark } from "@/components/ui/brand-wordmark";

export function LoginForm() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && session) {
      const user = session?.user as any;
      const userType = user?.userType;
      const role = user?.role;
      if (userType === "saas_admin" || role === "saas_admin") {
        router.replace("/");
      } else {
        // Non-SaaS Admin user logged in — sign out immediately
        signOut();
      }
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Verify with SaaS Admin authentication endpoint
      await fetcher("/saas/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // 2. Perform Better Auth sign in to establish session cookie
      const { data, error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in");
        return;
      }

      const user = data?.user as any;
      const userType = user?.userType;
      const role = user?.role;

      if (userType !== "saas_admin" && role !== "saas_admin") {
        await signOut();
        toast.error(
          "Access denied: This account does not have SaaS Admin permissions.",
        );
        return;
      }

      toast.success("Welcome to SaaS Admin Portal!");
      window.location.href = "/";
    } catch (err: any) {
      toast.error(err?.message || "Invalid credentials or unauthorized account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-border/70 backdrop-blur-md bg-card/90">
      <CardHeader className="space-y-2 text-center pb-6">
        <BrandWordmark className="mx-auto" />
        <CardTitle className="text-sm tracking-tight bg-orange-200 w-fit mx-auto py-1 px-3 rounded-full border border-orange-500 text-orange-500">
          SaaS Admin Portal
        </CardTitle>
        <CardDescription className="text-sm">
          Enter your SaaS administrative credentials to access the management platform
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Admin Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="admin@hishab-baksho.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-11"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button
            type="submit"
            className="w-full text-white h-11 text-base font-semibold gap-2 shadow-md shadow-primary/20"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign in to SaaS Portal
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
