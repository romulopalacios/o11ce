'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import EmptyState from '@/components/ui/EmptyState'

interface GroupEntry {
  position: number
  team: { id: number; name: string | null; crest: string | null }
  playedGames: number
  points: number
}

interface Group {
  group: string
  standings: GroupEntry[]
}

interface Props {
  groups: Group[]
}

export function GroupsCarousel({ groups }: Props) {
  const validGroups = groups.filter((g) => g.standings?.some((s) => s.team?.name !== null))
  const [current, setCurrent] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(3)
  const trackRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const totalSlides = Math.max(1, Math.ceil(validGroups.length / cardsPerView))

  function goTo(index: number) {
    const i = Math.max(0, Math.min(index, totalSlides - 1))
    setCurrent(i)
  }

  useEffect(() => {
    if (current > totalSlides - 1) {
      setCurrent(0)
    }
  }, [current, totalSlides])

  useEffect(() => {
    if (!outerRef.current) return

    const target = outerRef.current
    const updateCardsPerView = (width: number) => {
      if (width < 640) {
        setCardsPerView(1)
        return
      }

      if (width < 1024) {
        setCardsPerView(2)
        return
      }

      setCardsPerView(3)
    }

    updateCardsPerView(target.offsetWidth)

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      updateCardsPerView(entry.contentRect.width)
    })

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!trackRef.current || !outerRef.current) return
    const outerW = outerRef.current.offsetWidth
    const gap = outerW < 640 ? 12 : 24
    const cardW = (outerW - gap * (cardsPerView - 1)) / cardsPerView
    const offset = current * cardsPerView * (cardW + gap)
    trackRef.current.style.transform = `translateX(-${offset}px)`
  }, [cardsPerView, current])

  if (validGroups.length === 0) {
    return (
      <section className="border-y border-white/10 bg-gradient-to-br from-[#121d2f] via-[#14243a] to-[#1a2a41] p-6 sm:p-9">
        <div className="mb-6 flex items-baseline justify-between">
          <span className="font-mono text-label font-medium tracking-[.18em] uppercase text-[var(--text2)]">
            tabla de grupos
          </span>
          <Link
            href="/groups"
            className="bg-black/30 px-3 py-1 font-mono text-label text-[var(--text2)] transition-colors hover:text-[var(--text)]"
          >
            ver todos →
          </Link>
        </div>

        <EmptyState
          message="equipos en proceso de clasificación"
          description="los grupos se confirman en dic 2025"
        />
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-gradient-to-br from-[#121d2f] via-[#14243a] to-[#1a2a41] p-6 sm:p-9">
      <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-[#74f3c4]/12 blur-3xl" />

      <div className="flex items-baseline justify-between mb-6">
        <span className="font-mono text-label font-medium tracking-[.18em] uppercase text-[var(--text2)]">
          tabla de grupos
        </span>
        <Link
          href="/groups"
          className="bg-black/30 px-3 py-1 font-mono text-label text-[var(--text2)] transition-colors hover:text-[var(--text)]"
        >
          ver todos →
        </Link>
      </div>

      <div ref={outerRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 transition-transform duration-350 ease-[cubic-bezier(.4,0,.2,1)]"
        >
          {validGroups.map((group) => (
            <div
              key={group.group}
              className="flex-shrink-0 bg-black/20 p-2.5 backdrop-blur-sm transition-colors hover:bg-black/28"
              style={{ width: `calc((100% - ${(cardsPerView - 1) * (cardsPerView === 1 ? 12 : 24)}px) / ${cardsPerView})` }}
            >
              <div className="flex items-center justify-between bg-black/30 px-3 py-2.5">
                <span className="font-display text-[20px] leading-none text-[var(--accent)]">{group.group}</span>
                <span className="font-mono text-label text-[var(--text3)]">{group.standings.length} equipos</span>
              </div>

              <div className="px-1.5 pb-1.5 pt-2.5">
                <div className="mb-2 grid grid-cols-[16px_1fr_24px_28px] items-center gap-2 px-3 font-mono text-label tracking-[.1em] text-[var(--text3)]">
                  <span>#</span>
                  <span>equipo</span>
                  <span className="text-center">PJ</span>
                  <span className="text-center">PTS</span>
                </div>

                <div className="space-y-2">
                {group.standings.map((entry, i) => {
                const qualifies = i < 2
                return (
                  <Link
                    key={entry.team.id}
                    href={`/teams/${entry.team.id}`}
                    className="relative grid grid-cols-[16px_1fr_24px_28px] items-center gap-2 bg-black/24 px-3 py-2.5 transition-colors hover:bg-black/38"
                  >
                    {qualifies && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[18px] bg-win rounded-r-[2px]" />
                    )}
                    <span
                      className={cn(
                        'text-center font-display text-[14px] leading-none',
                        'text-[var(--text3)]',
                      )}
                    >
                      {entry.position}
                    </span>

                    <div className="flex min-w-0 items-center gap-2">
                      {entry.team.crest ? (
                        <img
                          src={entry.team.crest}
                          alt=""
                          className="h-6 w-6 bg-black/40 p-[2px] object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-6 w-6 bg-black/40" />
                      )}
                      <span
                        className={cn(
                          'truncate pr-1 text-[12px]',
                          'font-medium text-[var(--text)]',
                        )}
                      >
                        {entry.team.name ?? '—'}
                      </span>
                    </div>

                    <span className="text-center font-mono text-[10px] text-[var(--text3)]">{entry.playedGames}</span>
                    <span
                      className={cn(
                        'text-center leading-none',
                        qualifies ? 'font-display text-[16px] text-ac' : 'font-mono text-[10px] text-[var(--text3)]',
                      )}
                    >
                      {entry.points}
                    </span>
                  </Link>
                )
                })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="flex h-8 w-8 items-center justify-center bg-black/35 text-[var(--text2)] transition-all hover:bg-black/50 hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>

        <div className="flex gap-[5px]">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                'h-[5px] transition-all duration-200',
                i === current ? 'w-[16px] bg-ac' : 'w-[6px] bg-white/20',
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === totalSlides - 1}
          className="flex h-8 w-8 items-center justify-center bg-black/35 text-[var(--text2)] transition-all hover:bg-black/50 hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          ›
        </button>
      </div>
    </section>
  )
}
