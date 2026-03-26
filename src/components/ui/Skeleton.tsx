import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  height?: string;
  count?: number;
}

export function Skeleton({ className, height = "h-[72px]", count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-xl border border-[var(--b2)]/45",
            "bg-[linear-gradient(120deg,rgba(58,168,255,.12),rgba(255,77,66,.06)_44%,rgba(10,18,34,.78))]",
            height,
            "mb-[5px]",
            className,
          )}
        />
      ))}
    </>
  );
}

export function SkeletonText({ lines = 2, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 animate-pulse rounded bg-[linear-gradient(120deg,rgba(58,168,255,.22),rgba(255,255,255,.06))]",
            i === lines - 1 && "w-3/4",
          )}
        />
      ))}
    </div>
  );
}
