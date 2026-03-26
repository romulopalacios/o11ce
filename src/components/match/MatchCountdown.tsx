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
    <div className="flex items-baseline justify-center gap-3">
      {d > 0 && (
        <div className="flex flex-col items-center">
          <span className="font-display text-[32px] text-t1 leading-none">{d}</span>
          <span className="font-mono text-label text-t3">días</span>
        </div>
      )}
      <div className="flex flex-col items-center">
        <span className="font-display text-[32px] text-t1 leading-none">{p(h)}</span>
        <span className="font-mono text-label text-t3">h</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-display text-[32px] text-t1 leading-none">{p(m)}</span>
        <span className="font-mono text-label text-t3">min</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-display text-[32px] text-ac leading-none">{p(s)}</span>
        <span className="font-mono text-label text-t3">seg</span>
      </div>
    </div>
  )
}
