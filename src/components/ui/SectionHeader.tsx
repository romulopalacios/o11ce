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
      'flex items-center justify-between gap-3 mb-4 sm:mb-5',
      className
    )}>
      <span className="font-mono text-[10px] sm:text-[11px] font-medium tracking-[.14em] uppercase text-t3">
        {title}
      </span>
      {action && (
        <Link href={action.href}
              className="font-mono text-[10px] sm:text-[11px] tracking-[.11em] uppercase text-t3 hover:text-ac transition-colors duration-150">
          {action.label} →
        </Link>
      )}
    </div>
  )
}
