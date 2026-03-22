import { cn } from "@/lib/utils";

interface BaseSkeletonProps {
  className?: string;
}

export default function BaseSkeleton({ className }: BaseSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md border border-border bg-surface",
        className,
      )}
      aria-hidden="true"
    />
  );
}
