import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn('max-w-[1120px] mx-auto px-4 sm:px-6 py-5 sm:py-7', className)}>
      {children}
    </div>
  )
}
