import { cn } from '@/lib/utils'

interface EmptyStateProps {
  message: string
  description?: string
  className?: string
}

export function EmptyState({ message, description, className }: EmptyStateProps) {
  return (
    <div className={cn(
      'rounded-3xl border border-[var(--b2)]/50',
      'bg-[linear-gradient(130deg,rgba(58,168,255,.1),rgba(255,77,66,.08)_42%,rgba(8,16,31,.75))]',
      'shadow-[0_22px_52px_rgba(0,0,0,0.34)]',
      'px-6 py-9 text-center',
      className
    )}>
      <p className="font-mono text-[10px] tracking-[.18em] uppercase text-[var(--text2)]">
        {message}
      </p>
      {description && (
        <p className="mx-auto mt-2.5 max-w-[52ch] font-sans text-[12px] text-[var(--text3)]">
          {description}
        </p>
      )}
    </div>
  )
}

export default EmptyState
