import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  action?: { label: string; href: string }
  className?: string
}

export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn(
      'flex items-center justify-between gap-3 mb-6 sm:mb-7',
      className
    )}>
      <div className="flex items-center gap-2.5">
        <span className="broadcast-dot h-2 w-2 rounded-full bg-[var(--brand-red)]" />
        <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-[.2em] uppercase text-[var(--text2)]">
          {title}
        </span>
      </div>
      {action && (
        <Link href={action.href}
              className="rounded-full border border-[var(--b2)]/75 bg-[var(--brand-navy)]/85 px-3.5 py-1.5 font-mono text-[10px] sm:text-[11px] tracking-[.1em] uppercase text-[var(--text2)] transition-all duration-150 hover:border-[var(--brand-cyan)] hover:text-[var(--brand-cyan)]">
          {action.label} →
        </Link>
      )}
    </div>
  )
}
