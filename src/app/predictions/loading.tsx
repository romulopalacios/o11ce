import { PageWrapper } from "@/components/ui/PageWrapper";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <Skeleton height="h-[56px]" className="mb-block" />
      <Skeleton count={4} height="h-[110px]" />
    </PageWrapper>
  );
}
