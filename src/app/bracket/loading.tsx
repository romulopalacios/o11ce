import { PageWrapper } from "@/components/ui/PageWrapper";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <div className="overflow-x-auto">
        <div className="flex gap-8 min-w-max animate-pulse">
          {[4, 2, 1, 1].map((count, col) => (
            <div key={col} className="flex flex-col gap-3">
              <div className="h-3 w-14 bg-surface rounded" />
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="w-[180px] h-[88px] bg-surface rounded-md border border-border" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="hidden" />
    </PageWrapper>
  );
}
