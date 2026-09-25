"use client";

import { useSession } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Server, Database, Lock } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          SaaS Admin Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Platform configuration and SaaS Administrator account details.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Info */}
        <Card className="border-border/70">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-bold">
                  SaaS Administrator Profile
                </CardTitle>
              </div>
              <Badge variant="success">SaaS Super Admin</Badge>
            </div>
            <CardDescription className="text-xs">
              Primary administrative identity managing the entire ERP SaaS platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Admin Name</Label>
                <Input value={user?.name || "SaaS Admin"} readOnly disabled />
              </div>
              <div className="space-y-1.5">
                <Label>Admin Email</Label>
                <Input
                  value={user?.email || "admin@hishab-baksho.com"}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System & Architecture */}
        <Card className="border-border/70">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-lg font-bold">
                Platform Architecture
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Tenant isolation and shared backend configuration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border/50 text-xs">
              <span className="text-muted-foreground flex items-center gap-2">
                <Database className="h-4 w-4" /> Multi-Tenant Database
              </span>
              <span className="font-semibold text-foreground">MongoDB</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50 text-xs">
              <span className="text-muted-foreground flex items-center gap-2">
                <Lock className="h-4 w-4" /> Authentication Engine
              </span>
              <span className="font-semibold text-foreground">
                Better Auth (Dual Isolation Guard)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
