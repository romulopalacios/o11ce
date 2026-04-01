export type MatchCardStatus = 'live' | 'scheduled' | 'finished'

export interface MatchCardScore {
  home: number
  away: number
}

export interface DashboardMatch {
  id: number
  homeTeam: string
  awayTeam: string
  status: MatchCardStatus
  score: MatchCardScore | null
  kickoffAt: string
  minute?: number
  group: string
}

export interface DashboardStandingRow {
  position: number
  teamId: number
  teamName: string
  played: number
  won: number
  draw: number
  lost: number
  points: number
  goalDifference: number
}

export interface DashboardGroup {
  name: string
  standings: DashboardStandingRow[]
}

export interface HomeDashboardData {
  tournamentName: string
  subtitle: string
  heroDescription: string
  matches: DashboardMatch[]
  groups: DashboardGroup[]
}

export interface MatchLiveUpdate {
  matchId: number
  minute: number
  score?: MatchCardScore
}

export interface RealtimeSubscription {
  unsubscribe: () => void
}

const initialDashboardData: HomeDashboardData = {
  tournamentName: 'WORLD CUP 2026',
  subtitle: 'Neon Pitch Control Center',
  heroDescription:
    'Gestiona partidos, grupos y cruces desde una interfaz oscura, limpia y lista para datos en tiempo real.',
  matches: [
    {
      id: 1001,
      homeTeam: 'Argentina',
      awayTeam: 'Netherlands',
      status: 'live',
      score: { home: 2, away: 1 },
      kickoffAt: '2026-06-18T19:00:00.000Z',
      minute: 67,
      group: 'Quarterfinal',
    },
    {
      id: 1002,
      homeTeam: 'Spain',
      awayTeam: 'Germany',
      status: 'scheduled',
      score: null,
      kickoffAt: '2026-06-19T20:00:00.000Z',
      group: 'Quarterfinal',
    },
    {
      id: 1003,
      homeTeam: 'Brazil',
      awayTeam: 'France',
      status: 'finished',
      score: { home: 1, away: 1 },
      kickoffAt: '2026-06-17T20:00:00.000Z',
      group: 'Round of 16',
    },
  ],
  groups: [
    {
      name: 'Group A',
      standings: [
        { position: 1, teamId: 1, teamName: 'Mexico', played: 3, won: 2, draw: 1, lost: 0, points: 7, goalDifference: 4 },
        { position: 2, teamId: 2, teamName: 'Croatia', played: 3, won: 1, draw: 2, lost: 0, points: 5, goalDifference: 2 },
        { position: 3, teamId: 3, teamName: 'Japan', played: 3, won: 1, draw: 0, lost: 2, points: 3, goalDifference: -1 },
        { position: 4, teamId: 4, teamName: 'Ghana', played: 3, won: 0, draw: 1, lost: 2, points: 1, goalDifference: -5 },
      ],
    },
    {
      name: 'Group B',
      standings: [
        { position: 1, teamId: 5, teamName: 'England', played: 3, won: 2, draw: 1, lost: 0, points: 7, goalDifference: 5 },
        { position: 2, teamId: 6, teamName: 'USA', played: 3, won: 1, draw: 1, lost: 1, points: 4, goalDifference: 1 },
        { position: 3, teamId: 7, teamName: 'Serbia', played: 3, won: 1, draw: 0, lost: 2, points: 3, goalDifference: -2 },
        { position: 4, teamId: 8, teamName: 'Senegal', played: 3, won: 0, draw: 2, lost: 1, points: 2, goalDifference: -4 },
      ],
    },
    {
      name: 'Group C',
      standings: [
        { position: 1, teamId: 9, teamName: 'Portugal', played: 3, won: 2, draw: 0, lost: 1, points: 6, goalDifference: 3 },
        { position: 2, teamId: 10, teamName: 'Uruguay', played: 3, won: 1, draw: 1, lost: 1, points: 4, goalDifference: 1 },
        { position: 3, teamId: 11, teamName: 'Korea Republic', played: 3, won: 1, draw: 1, lost: 1, points: 4, goalDifference: -1 },
        { position: 4, teamId: 12, teamName: 'Morocco', played: 3, won: 0, draw: 2, lost: 1, points: 2, goalDifference: -3 },
      ],
    },
  ],
}

function deepCloneDashboardData(source: HomeDashboardData): HomeDashboardData {
  return {
    ...source,
    matches: source.matches.map((match) => ({
      ...match,
      score: match.score ? { ...match.score } : null,
    })),
    groups: source.groups.map((group) => ({
      ...group,
      standings: group.standings.map((row) => ({ ...row })),
    })),
  }
}

export async function getHomeDashboardDataMock(): Promise<HomeDashboardData> {
  await new Promise((resolve) => {
    setTimeout(resolve, 80)
  })

  return deepCloneDashboardData(initialDashboardData)
}

export function subscribeToMockMatchUpdates(
  initialMatches: DashboardMatch[],
  onUpdate: (update: MatchLiveUpdate) => void,
): RealtimeSubscription {
  const liveMatches = initialMatches.filter((match) => match.status === 'live')

  if (liveMatches.length === 0) {
    return { unsubscribe: () => undefined }
  }

  const intervalId = setInterval(() => {
    const match = liveMatches[Math.floor(Math.random() * liveMatches.length)]

    if (!match) {
      return
    }

    const nextMinute = Math.min(95, (match.minute ?? 0) + 1)
    match.minute = nextMinute

    onUpdate({
      matchId: match.id,
      minute: nextMinute,
    })
  }, 10_000)

  return {
    unsubscribe: () => {
      clearInterval(intervalId)
    },
  }
}
