import { PageWrapper } from "@/components/ui/PageWrapper";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <div className="grid grid-cols-3 gap-4 mb-section">
        <Skeleton height="h-[88px]" />
        <Skeleton height="h-[24px]" className="self-center" />
        <Skeleton height="h-[88px]" />
      </div>
      <Skeleton count={5} height="h-[32px]" />
    </PageWrapper>
  );
}
