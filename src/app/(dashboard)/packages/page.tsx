"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PackageList } from "@/components/features/packages/package-list";
import { PackageForm } from "@/components/features/packages/package-form";

export default function PackagesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);

  const {
    data: packages,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: () => fetcher("/saas/packages"),
  });

  const handleOpenCreate = () => {
    setEditingPackage(null);
    setIsOpen(true);
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Subscription Packages
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Configure pricing tiers, user limits, and features available to tenant institutions.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="gap-2 shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Package Tier
        </Button>
      </div>

      {/* ── List ─────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-muted/60 animate-pulse border"
            />
          ))}
        </div>
      ) : (
        <PackageList
          packages={packages || []}
          onEdit={handleEdit}
          onDeleted={refetch}
        />
      )}

      {/* ── Create/Edit Modal ────────────────────────────── */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setEditingPackage(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package Tier" : "Create Subscription Package"}
            </DialogTitle>
            <DialogDescription>
              Define tier pricing, duration interval, user capacities, and feature list.
            </DialogDescription>
          </DialogHeader>
          <PackageForm
            packageData={editingPackage}
            onSuccess={() => {
              setIsOpen(false);
              setEditingPackage(null);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
