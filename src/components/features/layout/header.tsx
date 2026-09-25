"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { LogOut, User, Moon, Sun, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  const user = session?.user;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Shield className="h-3.5 w-3.5" />
          <span>SaaS Admin Portal</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3 border-l pl-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold leading-none text-foreground">
              {user?.name || "SaaS Administrator"}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[150px]">
              {user?.email || "admin@hishab-baksho.com"}
            </span>
          </div>

          <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs">
            <User className="h-4 w-4" />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive gap-1.5 h-8 px-2.5"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
