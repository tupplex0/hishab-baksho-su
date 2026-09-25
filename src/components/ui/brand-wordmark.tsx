import { cn } from "@/lib/utils";

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span
      aria-label="HishabBaksho"
      className={cn("inline-flex text-3xl items-baseline whitespace-nowrap font-bold tracking-tight", className)}
    >
      <span className="text-black">Hishab</span>
      <span className="text-primary">Baksho</span>
    </span>
  );
}