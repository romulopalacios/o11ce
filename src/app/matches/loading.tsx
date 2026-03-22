import { PageWrapper } from "@/components/ui/PageWrapper";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <Skeleton height="h-[38px]" className="mb-4" />
      <Skeleton count={6} height="h-[72px]" />
    </PageWrapper>
  );
}
