interface LiveBadgeProps { minute?: number | null }

export function LiveBadge({ minute }: LiveBadgeProps) {
  return (
    <span className="inline-flex items-center gap-[5px]
                     bg-live/10 border border-live/30
                     rounded-[4px] px-2 py-[3px]
                     font-mono text-label tracking-[.1em]
                     text-live uppercase">
      <span className="w-[5px] h-[5px] rounded-full bg-live flex-shrink-0"
            style={{ animation: 'pulse-dot 1.2s ease-in-out infinite' }} />
      {minute != null ? `Live · ${minute}'` : 'Live'}
    </span>
  )
}
