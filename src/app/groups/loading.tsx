import { PageWrapper } from "@/components/ui/PageWrapper";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <Skeleton count={3} height="h-[180px]" />
    </PageWrapper>
  );
}
