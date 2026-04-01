import type { Metadata } from 'next'
import Link from 'next/link'

import GroupsCarousel from '@/components/groups/GroupsCarousel';
import MatchCard from '@/components/match/MatchCard'
import StartCountdownKpi from '@/components/tournament/StartCountdownKpi'
import type { DashboardGroup } from '@/lib/mock/tournamentDashboard'
import * as groupService from '@/server/services/football/groupService'
import * as matchService from '@/server/services/football/matchService'
import * as tournamentService from '@/server/services/football/tournamentService'
import { CalendarDays, Trophy, Activity, Target } from 'lucide-react'

export const revalidate = 120

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dashboard',
    description: 'Panel principal O11CE para gestion de torneos deportivos',
  }
}

interface HomeApiDashboardData {
  tournamentName: string
  subtitle: string
  heroDescription: string
  phase: string
  matchesPlayed: number
  totalGoals: number
  goalsPerMatch: string
  worldCupStartIso: string
  daysToStart: number
  daysToFinal: number
  matches: Awaited<ReturnType<typeof matchService.getAll>>
  groups: DashboardGroup[]
}

const WORLD_CUP_GROUPS = Array.from({ length: 12 }, (_, index) => `Group ${String.fromCharCode(65 + index)}`)

function parseGroupLetter(rawGroup?: string | null): string | null {
  const normalized = (rawGroup ?? '').trim().toUpperCase()
  if (!normalized) return null
  const match = normalized.match(/([A-L])$/)
  if (!match?.[1]) return null
  return match[1]
}

function toWorldCupGroupName(rawGroup?: string | null): string {
  const letter = parseGroupLetter(rawGroup)
  return letter ? `Group ${letter}` : 'Group A'
}

interface KpiCardProps {
  label: string
  value: string
  icon?: React.ReactNode
  accentClass?: string
  className?: string
}

function KpiCard({ label, value, icon, accentClass = "bg-zinc-800", className }: KpiCardProps) {
  return (
    <article className={`relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-sm transition-all hover:bg-zinc-900/80 hover:border-zinc-700/80 ${className ?? ''}`}>
      <div className={`absolute left-0 top-0 w-1 h-full opacity-60 ${accentClass}`}></div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">{value}</p>
        </div>
        {icon && (
          <div className="rounded-lg bg-zinc-800/50 p-2 text-zinc-400">
            {icon}
          </div>
        )}
      </div>
    </article>
  )
}

async function getHomeDashboardDataFromApi(): Promise<HomeApiDashboardData> {
  try {
    const [context, matches, standings] = await Promise.all([
      tournamentService.getTournamentContext(),
      matchService.getAll(),
      groupService.getStandings(),
    ])

    const selectedMatches = matches
      .filter((match) => match.status === 'IN_PLAY' || match.status === 'SCHEDULED' || match.status === 'FINISHED')
      .sort((a, b) => {
        const weight = (status: string): number => {
          if (status === 'IN_PLAY') return 0
          if (status === 'SCHEDULED') return 1
          return 2
        }
        const byStatus = weight(a.status) - weight(b.status)
        if (byStatus !== 0) return byStatus
        return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
      })
      .slice(0, 6)

    const groupsMap = new Map<string, DashboardGroup>()
    standings.forEach((group) => {
      const groupName = toWorldCupGroupName(group.group)
      groupsMap.set(groupName, {
        name: groupName,
        standings: group.table.map((entry) => ({
          position: entry.position,
          teamId: entry.team.id,
          teamName: entry.team.name,
          played: entry.playedGames,
          won: entry.won,
          draw: entry.draw,
          lost: entry.lost,
          points: entry.points,
          goalDifference: entry.goalDifference,
        })),
      })
    })

    const groups: DashboardGroup[] = WORLD_CUP_GROUPS.map((groupName) => {
      return groupsMap.get(groupName) || { name: groupName, standings: [] }
    })

    return {
      tournamentName: 'WORLD CUP 2026',
      subtitle: 'Panel Operativo',
      heroDescription: 'Vista consolidada de partidos y grupos para un seguimiento preciso y en tiempo real del campeonato.',
      phase: context.phase,
      matchesPlayed: context.matchesPlayed,
      totalGoals: context.totalGoals,
      goalsPerMatch: context.goalsPerMatch,
      worldCupStartIso: context.worldCupStartIso,
      daysToStart: context.daysToStart,
      daysToFinal: context.daysToFinal,
      matches: selectedMatches,
      groups,
    }
  } catch (error) {
    console.error('[HomePage] failed to load API dashboard data:', error)
    return {
      tournamentName: 'WORLD CUP 2026',
      subtitle: 'Sistema Offline',
      heroDescription: 'No se procesaron los datos. Reintenta mas tarde.',
      phase: 'Sin datos',
      matchesPlayed: 0,
      totalGoals: 0,
      goalsPerMatch: '0.00',
      worldCupStartIso: new Date('2026-06-11T00:00:00.000Z').toISOString(),
      daysToStart: 0,
      daysToFinal: 0,
      matches: [],
      groups: [],
    }
  }
}

export default async function HomePage() {
  const dashboardData = await getHomeDashboardDataFromApi()
  const hasMatches = dashboardData.matches.length > 0
  const hasGroups = dashboardData.groups.some((group) => group.standings.length > 0)
  const showStartCountdown = dashboardData.daysToStart > 0
  const showPhase = dashboardData.phase !== 'Sin datos'
  const showFinalDays = dashboardData.daysToFinal > 0
  const showMatchesPlayed = dashboardData.matchesPlayed > 0
  const showGoals = dashboardData.totalGoals > 0

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      
      {/* Hero Header Estructurado */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/80">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <p className="text-xs font-semibold tracking-[0.15em] text-blue-500 uppercase">{dashboardData.subtitle}</p>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            {dashboardData.tournamentName}
          </h1>
          <p className="text-base text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            {dashboardData.heroDescription}
          </p>
        </div>
        <div className="flex gap-3">
            {hasMatches && (
              <Link
                href="/matches"
                className="inline-flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors"
                data-testid="home-hero-cta-matches"
              >
                Ver Partidos
              </Link>
            )}
            {hasGroups && (
              <Link
                href="/groups"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition-colors"
                data-testid="home-hero-cta-groups"
              >
                Tribuna de Grupos
              </Link>
            )}
          </div>
      </header>

      {/* Grid de KPIs Metrics - Linea minimalista */}
      {(showStartCountdown || showPhase || showFinalDays || showMatchesPlayed || showGoals) && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" data-testid="home-hero-metrics">
          {showPhase && <KpiCard label="Fase Actual" value={dashboardData.phase} icon={<Trophy className="h-5 w-5" />} accentClass="bg-red-500" />}
          {showMatchesPlayed && <KpiCard label="Partidos Jugados" value={String(dashboardData.matchesPlayed)} icon={<Activity className="h-5 w-5" />} accentClass="bg-blue-500" />}
          {showGoals && <KpiCard label="Goles Totales" value={String(dashboardData.totalGoals)} icon={<Target className="h-5 w-5" />} accentClass="bg-green-500" />}
          {showFinalDays && <KpiCard label="Dias a la Final" value={String(dashboardData.daysToFinal)} icon={<CalendarDays className="h-5 w-5" />} accentClass="bg-zinc-400" />}
        </section>
      )}

      {/* Main Dashboard Blocks */}
      {(hasMatches || hasGroups) && (
        <section
          className={`grid grid-cols-1 gap-8 ${hasMatches && hasGroups ? 'lg:grid-cols-12' : ''}`}
          data-testid="home-dashboard-grid"
        >
          {hasMatches && (
            <div className="lg:col-span-7 flex flex-col gap-5 rounded-2xl border border-zinc-800/60 bg-zinc-950 p-5 shadow-sm md:p-7">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-50 flex items-center gap-2">
                    Agenda de Competencia
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">Últimos y próximos encuentros oficiales.</p>
                </div>
                {dashboardData.matchesPlayed > 0 && (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">Goles / Partido</span>
                    <span className="text-lg font-bold text-zinc-100">{dashboardData.goalsPerMatch}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {dashboardData.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {hasGroups && (
            <div className="lg:col-span-5 flex flex-col gap-5 rounded-2xl border border-zinc-800/60 bg-zinc-950 p-5 shadow-sm md:p-7">
              <div className="border-b border-zinc-800/80 pb-4">
                <h2 className="text-xl font-bold text-zinc-50">Clasificación</h2>      
                <p className="mt-1 text-sm text-zinc-500">Tabla de posiciones en tiempo real.</p>  
              </div>
              <GroupsCarousel groups={dashboardData.groups} />
            </div>
          )}
        </section>
      )}
    </div>
  )
}
