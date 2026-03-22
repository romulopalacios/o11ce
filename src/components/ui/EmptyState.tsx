import { cn } from '@/lib/utils'

interface EmptyStateProps {
  message: string
  description?: string
  className?: string
}

export function EmptyState({ message, description, className }: EmptyStateProps) {
  return (
    <div className={cn(
      'panel-compact border-dashed',
      'px-5 py-7 text-center',
      className
    )}>
      <p className="font-mono text-[10px] text-t2 tracking-[.14em] uppercase">
        {message}
      </p>
      {description && (
        <p className="font-sans text-[12px] text-t3 mt-2">
          {description}
        </p>
      )}
    </div>
  )
}

export default EmptyState
