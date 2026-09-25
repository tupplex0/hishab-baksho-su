"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Building2,
  Package,
  Users,
  ArrowRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InstitutionForm } from "@/components/features/institutions/institution-form";
import { InstitutionList } from "@/components/features/institutions/institution-list";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["saas-stats"],
    queryFn: () => fetcher("/saas/stats"),
  });

  const {
    data: institutions,
    isLoading: isLoadingInstitutions,
    refetch,
  } = useQuery({
    queryKey: ["institutions"],
    queryFn: () => fetcher("/saas/institutions"),
  });

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            SaaS Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Overview and tenant management for the Hishab-Baksho multi-tenant ERP platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsOpen(true)}
            className="gap-2 shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4" /> Add Institution
          </Button>
        </div>
      </div>

      {/* ── Metric Cards ───────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Institutions */}
        <Card className="hover:shadow-md transition-all duration-200 border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Institutions
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Building2 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                stats?.totalInstitutions ?? 0
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {stats?.activeInstitutions ?? 0} active tenants
              </span>
              <Link
                href="/institutions"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Packages */}
        <Card className="hover:shadow-md transition-all duration-200 border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Subscription Tiers
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Package className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                stats?.totalPackages ?? 0
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Active pricing plans
              </span>
              <Link
                href="/packages"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Users */}
        <Card className="hover:shadow-md transition-all duration-200 border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total ERP Users
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                stats?.totalUsers ?? 0
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Across all registered tenants
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Healthy
              </span>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="hover:shadow-md transition-all duration-200 border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Platform Status
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-5 w-5" />
              Operational
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                API & Database connected
              </span>
              <Link
                href="/settings"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Settings <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Institutions ────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Tenant Institutions
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recent businesses and institutions onboarded to the ERP
            </p>
          </div>
          <Link
            href="/institutions"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoadingInstitutions ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 rounded-xl bg-muted/60 animate-pulse border"
              />
            ))}
          </div>
        ) : (
          <InstitutionList institutions={institutions?.slice(0, 6) || []} />
        )}
      </div>

      {/* ── Modal Dialog: Add Institution ───────────────── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Onboard New Institution</DialogTitle>
            <CardDescription>
              Create a new tenant institution and provision its initial ERP administrator account.
            </CardDescription>
          </DialogHeader>
          <InstitutionForm
            onSuccess={() => {
              setIsOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
