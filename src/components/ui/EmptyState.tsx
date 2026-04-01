import { cn } from '@/lib/utils'

interface EmptyStateProps {
  message: string
  description?: string
  className?: string
}

export function EmptyState({ message, description, className }: EmptyStateProps) {
  return (
    <div className={cn(
      'rounded-2xl border border-[var(--b2)]/24 bg-[linear-gradient(130deg,rgba(58,168,255,.08),rgba(255,77,66,.06)_42%,rgba(8,16,31,.44))]',
      'shadow-[0_12px_30px_rgb(3,10,24,0.28)]',
      'px-6 py-9 text-center',
      className
    )}>
      <p className="text-xs font-bold tracking-widest uppercase text-[var(--text2)]">
        {message}
      </p>
      {description && (
        <p className="mx-auto mt-2.5 max-w-[52ch] text-sm text-[var(--text3)]">
          {description}
        </p>
      )}
    </div>
  )
}

export default EmptyState
