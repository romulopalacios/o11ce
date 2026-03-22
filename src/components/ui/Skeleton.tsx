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
            "animate-pulse bg-s1 rounded-lg border border-b1",
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
            "animate-pulse bg-s2 rounded h-3",
            i === lines - 1 && "w-3/4",
          )}
        />
      ))}
    </div>
  );
}
