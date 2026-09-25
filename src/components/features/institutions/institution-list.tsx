"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Phone, MapPin, Calendar, Package } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function InstitutionList({ institutions }: { institutions: any[] }) {
  if (!institutions || institutions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center bg-card/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
          <Building2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold">No institutions yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Get started by adding your first tenant institution to the SaaS platform.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {institutions.map((inst) => {
        const pkg = inst.packageId;
        const statusVariant =
          inst.status === "active"
            ? "success"
            : inst.status === "suspended"
              ? "destructive"
              : "secondary";

        return (
          <Card
            key={inst._id || inst.id}
            className="hover:shadow-lg transition-all duration-200 border-border/70 overflow-hidden group"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-primary/80 to-primary/20" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {inst.name}
                  </CardTitle>
                  <CardDescription className="text-xs font-mono text-muted-foreground mt-0.5">
                    ID: {inst.slug || inst._id}
                  </CardDescription>
                </div>
                <Badge variant={statusVariant} className="capitalize">
                  {inst.status || "Active"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0 text-sm">
              {/* Package Tier */}
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs font-medium">
                <Package className="h-3.5 w-3.5 text-primary" />
                <span className="text-muted-foreground">Package:</span>
                <span className="font-semibold text-foreground">
                  {pkg?.name || "Standard Plan"}
                </span>
                {pkg?.price !== undefined && (
                  <span className="ml-auto text-muted-foreground font-mono">
                    ${pkg.price}/{pkg.interval || "mo"}
                  </span>
                )}
              </div>

              {/* Admin Info */}
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium">
                    {inst.adminName}
                  </span>
                  <span className="truncate">({inst.adminEmail})</span>
                </div>

                {inst.contactInfo?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{inst.contactInfo.phone}</span>
                  </div>
                )}

                {inst.address?.addressLine1 && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">
                      {[inst.address.addressLine1, inst.address.city]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1 border-t border-border/40 text-[11px]">
                  <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span>Created {formatDate(inst.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
