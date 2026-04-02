'use client'

import { useEffect, useState } from 'react'

interface MatchCountdownProps {
  utcDate: string
}

export function MatchCountdown({ utcDate }: MatchCountdownProps) {
  const [diff, setDiff] = useState(0)

  useEffect(() => {
    const target = new Date(utcDate).getTime()
    const tick = () => setDiff(target - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [utcDate])

  if (diff <= 0) {
    return <span className="font-mono text-label text-ac">en curso</span>
  }

  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  const p = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-baseline justify-center gap-4 sm:gap-6">
      {d > 0 && (
        <div className="flex flex-col items-center">
          <span className="font-display text-4xl sm:text-5xl font-bold bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-none">{d}</span>
          <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-500 mt-2">días</span>
        </div>
      )}
      <div className="flex flex-col items-center">
        <span className="font-display text-4xl sm:text-5xl font-bold bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-none">{p(h)}</span>
        <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-500 mt-2">h</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-display text-4xl sm:text-5xl font-bold bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-none">{p(m)}</span>
        <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-500 mt-2">min</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-display text-4xl sm:text-5xl font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] leading-none">{p(s)}</span>
        <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-500 mt-2">seg</span>
      </div>
    </div>
  )
}
