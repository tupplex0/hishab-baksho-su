"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Package,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandWordmark } from "@/components/ui/brand-wordmark";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/institutions", label: "Institutions", icon: Building2 },
  { href: "/packages", label: "Packages", icon: Package },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-col shadow bg-card/70 backdrop-blur-md hidden md:flex h-full select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <BrandWordmark className="text-base" />
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
            SaaS Admin
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 text-xs text-muted-foreground">
        <p className="font-medium"><BrandWordmark /></p>
        <p className="text-[11px] text-muted-foreground/80 mt-0.5">SaaS Admin Control Center</p>
      </div>
    </aside>
  );
}
