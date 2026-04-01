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
  const countdownBlocks = [
    { n: days, l: 'dias' },
    { n: hours, l: 'horas' },
    { n: minutes, l: 'minutos' },
    { n: seconds, l: 'segundos' },
  ]

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-4 shadow-[0_8px_24px_rgb(15,23,42,0.06)] sm:p-5">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Partido inaugural · Mexico vs Sudafrica
      </p>
      <p className="mb-5 max-w-[48ch] text-sm leading-relaxed text-slate-500">
        Cuenta regresiva en tiempo real para el inicio del Mundial en Dallas.
      </p>

      <div aria-live="polite" className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {countdownBlocks.map(({ n, l }) => (
          <div key={l} className="rounded-xl border border-slate-200/80 bg-white px-2.5 py-3 text-center shadow-[0_6px_18px_rgb(15,23,42,0.05)]">
            <span className="animate-fade-in font-display text-[38px] leading-none tracking-tight text-slate-900 sm:text-[46px]">
              {l === 'dias' ? n : pad(n)}
            </span>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{l}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-3">
        <span className="text-xs font-semibold text-slate-500">
          11 jun 2026 · 19:00 UTC · AT&T Stadium · Dallas
        </span>
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700">
          Grupo A
        </span>
      </div>
    </div>
  )
}
