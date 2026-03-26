'use client'

import { useEffect, useState } from 'react'

const KICKOFF = new Date('2026-06-11T19:00:00Z')

export function CountdownBanner() {
  const [diff, setDiff] = useState(0)

  useEffect(() => {
    const tick = () => setDiff(KICKOFF.getTime() - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const started = diff <= 0
  if (started) return null

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="relative overflow-hidden px-6 py-7 sm:px-9 sm:py-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[var(--brand-cyan)]/18 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-[var(--brand-red)]/15 blur-3xl" />

      <p className="relative z-10 mb-2 font-mono text-label tracking-[.16em] uppercase text-[var(--text2)]">
        partido inaugural · Mexico vs Sudáfrica
      </p>
      <p className="relative z-10 mb-6 max-w-[48ch] text-[13px] text-[var(--text3)]">
        Cuenta regresiva en tiempo real para el inicio del Mundial en Dallas.
      </p>

      <div className="relative z-10 mb-7 grid grid-cols-2 gap-0 border-y border-[var(--b2)]/45 sm:grid-cols-4">
        {[
          { n: days, l: 'días' },
          { n: hours, l: 'horas' },
          { n: minutes, l: 'minutos' },
          { n: seconds, l: 'segundos' },
        ].map(({ n, l }) => (
          <div
            key={l}
            className="flex flex-col items-center gap-1 bg-[var(--brand-navy)]/35 py-4 backdrop-blur-sm sm:border-l sm:border-[var(--b2)]/45 first:sm:border-l-0"
          >
            <span className="font-display text-[38px] leading-none text-[var(--brand-cyan)] sm:text-[52px]">
              {l === 'días' ? n : pad(n)}
            </span>
            <span className="font-mono text-label tracking-[.1em] uppercase text-[var(--text2)]">{l}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-label text-[var(--text2)]">
          11 jun 2026 · 19:00 UTC · AT&T Stadium · Dallas
        </span>
        <span className="bg-black/30 px-2.5 py-1 font-mono text-label tracking-[.08em] text-[var(--accent)]">Grupo A</span>
      </div>
    </div>
  )
}
