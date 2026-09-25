"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Edit2, Trash2, Users, MapPin } from "lucide-react";
import { fetcher } from "@/services/api";
import { toast } from "sonner";

export function PackageList({
  packages,
  onEdit,
  onDeleted,
}: {
  packages: any[];
  onEdit: (pkg: any) => void;
  onDeleted: () => void;
}) {
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete package "${name}"?`)) return;
    try {
      await fetcher(`/saas/packages/${id}`, { method: "DELETE" });
      toast.success("Package deleted successfully");
      onDeleted();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete package");
    }
  };

  if (!packages || packages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground bg-card/40">
        No subscription packages found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => {
        return (
          <Card
            key={pkg._id || pkg.id}
            className={`relative flex flex-col justify-between overflow-hidden border transition-all duration-200 hover:shadow-lg ${
              pkg.isPopular
                ? "border-primary/80 shadow-md ring-1 ring-primary/20"
                : "border-border/70"
            }`}
          >
            {pkg.isPopular && (
              <div className="absolute right-0 top-0 bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground rounded-bl-xl shadow-xs">
                Popular
              </div>
            )}

            <div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    {pkg.name}
                  </CardTitle>
                  <Badge variant={pkg.status === "active" ? "success" : "secondary"}>
                    {pkg.status}
                  </Badge>
                </div>
                {pkg.description && (
                  <CardDescription className="text-xs mt-1">
                    {pkg.description}
                  </CardDescription>
                )}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight">
                    ${pkg.price}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    /{pkg.interval || "month"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>Up to {pkg.maxUsers || 10} users</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{pkg.maxLocations || 1} location(s)</span>
                  </div>
                </div>

                {pkg.features && pkg.features.length > 0 && (
                  <ul className="space-y-2 text-xs">
                    {pkg.features.map((feat: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </div>

            <CardFooter className="flex items-center justify-end gap-2 border-t pt-4 bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(pkg)}
                className="gap-1.5 h-8 text-xs"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(pkg._id || pkg.id, pkg.name)}
                className="gap-1.5 h-8 text-xs text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
