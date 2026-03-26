import type { Metadata } from 'next'
import { Suspense } from 'react'

import { GroupsCarousel } from '../components/groups/GroupsCarousel'
import { CountdownBanner } from '@/components/tournament/CountdownBanner'
import * as groupService from '@/server/services/football/groupService'
import * as tournamentService from '@/server/services/football/tournamentService'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Inicio | O11CE',
    description: 'Portada editorial del Mundial 2026 con hero, contador en vivo y carrusel de grupos.',
  }
}

async function HeroSection() {
  const context = await tournamentService.getTournamentContext()

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[var(--b2)]/50">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(5,9,16,0.94)] via-[rgba(7,14,24,0.85)] to-[rgba(7,14,24,0.45)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(58,168,255,0.28),transparent_42%),radial-gradient(circle_at_80%_18%,rgba(255,77,66,0.22),transparent_42%)]" />

      <div className="relative z-10 px-6 pb-10 pt-20 sm:px-10">
        <div className="mb-8 max-w-[78ch]">
          <p className="font-mono text-label tracking-[.18em] uppercase text-[var(--text2)]">
              mundial 2026 · cobertura central
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="max-w-[24ch] font-display text-[36px] leading-[0.94] tracking-[.02em] text-white sm:text-[56px]">
              EL CAMINO AL MUNDIAL
            </h1>
            <span className="inline-block rounded-full border border-[var(--brand-cyan)]/35 bg-[var(--brand-cyan)]/15 px-3 py-1 text-xs font-bold tracking-widest text-[var(--brand-cyan)] uppercase">
              pre-torneo
            </span>
          </div>

          <p className="mt-3 max-w-[54ch] text-[13px] text-[var(--text2)] sm:text-[14px]">
            Sigue la cuenta regresiva, el estado general del torneo y la evolución de cada grupo en una sola vista.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-[var(--b2)]/60 bg-[linear-gradient(125deg,rgba(58,168,255,.14),rgba(255,77,66,.12)_42%,rgba(10,18,34,.8))] p-8 text-center shadow-[0_24px_55px_rgba(0,0,0,.35)]">
          <p className="font-mono text-label tracking-[.18em] uppercase text-[var(--brand-cyan)]">partido inaugural</p>
          <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">MEXICO VS SUDAFRICA</p>
          <p className="mt-2 font-mono text-label tracking-[.12em] text-[var(--text2)]">11 junio 2026 · estadio azteca</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-0 border-y border-[var(--b2)]/45 sm:grid-cols-4">
          <div className="bg-[var(--brand-navy)]/35 px-4 py-4 backdrop-blur-sm sm:px-5 sm:py-5">
            <span className="font-display text-[40px] leading-none text-[var(--text)]">{context.matchesPlayed}</span>
            <p className="mt-2 font-mono text-label tracking-[.12em] uppercase text-[var(--text2)]">partidos</p>
            <p className="mt-1 font-mono text-label text-[var(--text3)]">{context.matchesPlayed === 0 ? 'arranca el 11 jun' : 'de 104 totales'}</p>
          </div>

          <div className="bg-[var(--brand-navy)]/35 px-4 py-4 backdrop-blur-sm sm:border-l sm:border-[var(--b2)]/45 sm:px-5 sm:py-5">
            <span className="font-display text-[40px] leading-none text-[var(--text)]">{context.totalGoals}</span>
            <p className="mt-2 font-mono text-label tracking-[.12em] uppercase text-[var(--text2)]">goles</p>
            <p className="mt-1 font-mono text-label text-[var(--text3)]">{context.totalGoals === 0 ? 'primer gol pendiente' : `${context.goalsPerMatch} por partido`}</p>
          </div>

          <div className="bg-gradient-to-b from-[var(--brand-cyan)]/18 to-[var(--brand-navy)]/32 px-4 py-4 backdrop-blur-sm sm:border-l sm:border-[var(--b2)]/45 sm:px-5 sm:py-5">
            <span className="font-display text-[40px] leading-none text-[var(--brand-cyan)]">{context.daysToStart}</span>
            <p className="mt-2 font-mono text-label tracking-[.12em] uppercase text-[var(--text2)]">dias al inicio</p>
            <p className="mt-1 font-mono text-label text-[var(--text3)]">11 jun 2026</p>
          </div>

          <div className="bg-gradient-to-b from-[var(--brand-red)]/18 to-[var(--brand-navy)]/32 px-4 py-4 backdrop-blur-sm sm:border-l sm:border-[var(--b2)]/45 sm:px-5 sm:py-5">
            <span className="font-display text-[40px] leading-none text-[var(--gold)]">{context.daysToFinal}</span>
            <p className="mt-2 font-mono text-label tracking-[.12em] uppercase text-[var(--text2)]">dias a la final</p>
            <p className="mt-1 font-mono text-label text-[var(--text3)]">19 jul 2026</p>
          </div>
        </div>

        <div className="mt-6 border-y border-white/10 bg-black/24 backdrop-blur-sm">
          <CountdownBanner />
        </div>
      </div>
    </section>
  )
}

async function GroupsSection() {
  const rawGroups = await groupService.getStandings()
  const groups = rawGroups.map((group, idx) => ({
    group: group.group ?? `Grupo ${idx + 1}`,
    standings: group.table.map((entry) => ({
      position: entry.position,
      team: {
        id: entry.team.id,
        name: entry.team.name,
        crest: entry.team.crest,
      },
      playedGames: entry.playedGames,
      points: entry.points,
    })),
  }))

  return <GroupsCarousel groups={groups} />
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full">
      <div className="mx-auto max-w-[1320px] space-y-10 px-4 py-8 sm:px-6 sm:py-10">
        <Suspense
          fallback={
            <div className="border-y border-white/10 bg-gradient-to-br from-[#0f1f31] via-[#102943] to-[#132033] p-6 sm:p-10">
              <div className="mb-3 h-4 w-56 animate-pulse rounded bg-neutral-800" />
              <div className="mb-7 h-10 w-[70%] animate-pulse rounded bg-neutral-800" />
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[140px] animate-pulse rounded-2xl bg-black/30" />
                ))}
              </div>
              <div className="mt-6 h-[190px] animate-pulse rounded-2xl bg-black/30" />
            </div>
          }
        >
          <HeroSection />
        </Suspense>

        <Suspense
          fallback={
            <div className="border-y border-white/10 bg-gradient-to-br from-[#121d2f] via-[#14243a] to-[#1a2a41] p-6 sm:p-9">
              <div className="mb-7 h-4 w-32 animate-pulse rounded bg-neutral-800" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-7">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[236px] rounded-2xl bg-black/30 animate-pulse"
                  />
                ))}
              </div>
            </div>
          }
        >
          <GroupsSection />
        </Suspense>
      </div>
    </main>
  )
}
