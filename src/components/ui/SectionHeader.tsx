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
      'mb-6 flex items-center justify-between gap-3',
      className
    )}>
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        <h2 className="text-lg font-bold text-zinc-50">
          {title}
        </h2>
      </div>
      {action && (
        <Link href={action.href}
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50">
          {action.label} &rarr;
        </Link>
      )}
    </div>
  )
}
