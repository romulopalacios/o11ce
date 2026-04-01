'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  subscribeToMockMatchUpdates,
  type DashboardMatch,
  type MatchLiveUpdate,
} from '@/lib/mock/tournamentDashboard'

interface UseMockLiveMatchesReturn {
  matches: DashboardMatch[]
  isRealtimeConnected: boolean
}

function applyLiveUpdate(match: DashboardMatch, update: MatchLiveUpdate): DashboardMatch {
  if (match.id !== update.matchId) {
    return match
  }

  return {
    ...match,
    minute: update.minute,
    score: update.score ? { ...update.score } : match.score,
  }
}

export function useMockLiveMatches(initialMatches: DashboardMatch[]): UseMockLiveMatchesReturn {
  const [matches, setMatches] = useState<DashboardMatch[]>(initialMatches)
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false)

  const hasLiveMatches = useMemo(
    () => matches.some((match) => match.status === 'live'),
    [matches],
  )

  useEffect(() => {
    if (!hasLiveMatches) {
      setIsRealtimeConnected(false)
      return
    }

    setIsRealtimeConnected(true)

    // Replace with Supabase: supabase.channel('matches').on(...).subscribe()
    const subscription = subscribeToMockMatchUpdates(initialMatches, (update) => {
      setMatches((currentMatches) => currentMatches.map((item) => applyLiveUpdate(item, update)))
    })

    return () => {
      subscription.unsubscribe()
      setIsRealtimeConnected(false)
    }
  }, [hasLiveMatches, initialMatches])

  return {
    matches,
    isRealtimeConnected,
  }
}
