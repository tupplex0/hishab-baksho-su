"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InstitutionList } from "@/components/features/institutions/institution-list";
import { InstitutionForm } from "@/components/features/institutions/institution-form";

export default function InstitutionsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data: institutions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["institutions"],
    queryFn: () => fetcher("/saas/institutions"),
  });

  const filteredInstitutions = (institutions || []).filter((inst: any) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      inst.name?.toLowerCase().includes(query) ||
      inst.slug?.toLowerCase().includes(query) ||
      inst.adminEmail?.toLowerCase().includes(query) ||
      inst.adminName?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Institution Management
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Manage tenant institutions, subscriptions, and administrative access.
          </p>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          className="gap-2 shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Institution
        </Button>
      </div>

      {/* ── Search & Filter ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, slug, or admin email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredInstitutions.length}</span>{" "}
          of <span className="font-semibold text-foreground">{institutions?.length || 0}</span> institutions
        </div>
      </div>

      {/* ── List ─────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-muted/60 animate-pulse border"
            />
          ))}
        </div>
      ) : (
        <InstitutionList institutions={filteredInstitutions} />
      )}

      {/* ── Add Modal ────────────────────────────────────── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Institution</DialogTitle>
            <DialogDescription>
              Register a tenant institution and configure its subscription and owner credentials.
            </DialogDescription>
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
