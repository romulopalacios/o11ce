import { PageWrapper } from "@/components/ui/PageWrapper";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <Skeleton height="h-[38px]" className="mb-block" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-[68px] animate-pulse bg-surface rounded-md border border-border" />
        ))}
      </div>
    </PageWrapper>
  );
}
