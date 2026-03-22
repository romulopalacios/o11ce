import { PageWrapper } from "@/components/ui/PageWrapper";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <Skeleton height="h-[48px]" className="mb-section" />
      <Skeleton count={3} height="h-[72px]" />
      <Skeleton count={2} height="h-[72px]" />
    </PageWrapper>
  );
}
