import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn('relative mx-auto max-w-[1360px] px-4 py-8 sm:px-6 sm:py-10', className)}>
      {children}
    </div>
  )
}
