import { PageWrapper } from "@/components/ui/PageWrapper";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <div className="mb-block">
        <Skeleton height="h-[22px]" className="mb-2" />
        <Skeleton height="h-[14px]" className="w-[65%]" />
      </div>
      <Skeleton height="h-[260px]" className="mb-item" />
      <Skeleton count={6} height="h-[18px]" />
    </PageWrapper>
  );
}
