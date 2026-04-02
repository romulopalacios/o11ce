import { TTL } from "@/lib/constants";
import { getOrSet } from "@/server/services/cache/helpers";
import { footballAPIClient } from "@/server/services/football/client";
import type { CompetitionMatchesResponse, FootballMatch, TeamRef } from "@/server/services/football/types";

import {
  predictMatch,
  type PredictionProbabilities,
  type RecentResult,
  type TeamStatsInput,
  type TournamentAverages,
} from "./algorithm";
import { getEloRating } from "./eloBase";

export interface ScheduledMatchPrediction {
  matchId: number;
  utcDate: string;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  probabilities: PredictionProbabilities;
}

interface TeamAggregate {
  played: number;
  goalsFor: number;
  goalsAgainst: number;
  groupPoints: number;
  recentResults: Array<{ utcDate: string; result: RecentResult }>;
}

function getScore(value: number | null | undefined): number {
  return value ?? 0;
}

function toRecentResult(goalsFor: number, goalsAgainst: number): RecentResult {
  if (goalsFor > goalsAgainst) {
    return "W";
  }

  if (goalsFor < goalsAgainst) {
    return "L";
  }

  return "D";
}

function getPointsForResult(result: RecentResult): number {
  if (result === "W") {
    return 3;
  }

  if (result === "D") {
    return 1;
  }

  return 0;
}

function upsertTeamAggregate(map: Map<number, TeamAggregate>, teamId: number): TeamAggregate {
  const existing = map.get(teamId);
  if (existing) {
    return existing;
  }

  const created: TeamAggregate = {
    played: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    groupPoints: 0,
    recentResults: [],
  };

  map.set(teamId, created);
  return created;
}

function processMatchIntoTeamAggregates(map: Map<number, TeamAggregate>, match: FootballMatch): void {
  const homeGoals = getScore(match.score.fullTime.home);
  const awayGoals = getScore(match.score.fullTime.away);

  const home = upsertTeamAggregate(map, match.homeTeam.id);
  const away = upsertTeamAggregate(map, match.awayTeam.id);

  home.played += 1;
  away.played += 1;

  home.goalsFor += homeGoals;
  home.goalsAgainst += awayGoals;
  away.goalsFor += awayGoals;
  away.goalsAgainst += homeGoals;

  const homeResult = toRecentResult(homeGoals, awayGoals);
  const awayResult = toRecentResult(awayGoals, homeGoals);

  home.groupPoints += getPointsForResult(homeResult);
  away.groupPoints += getPointsForResult(awayResult);

  home.recentResults.push({ utcDate: match.utcDate, result: homeResult });
  away.recentResults.push({ utcDate: match.utcDate, result: awayResult });
}

function buildTournamentAverages(teamAggregates: Map<number, TeamAggregate>): TournamentAverages {
  const entries = Array.from(teamAggregates.values());
  if (entries.length === 0) {
    return {
      goalsForPerMatch: 1.4,
      goalsAgainstPerMatch: 1.4,
      groupPoints: 4,
    };
  }

  let totalGoalsForPerMatch = 0;
  let totalGoalsAgainstPerMatch = 0;
  let totalGroupPoints = 0;

  for (const aggregate of entries) {
    const safePlayed = Math.max(1, aggregate.played);
    totalGoalsForPerMatch += aggregate.goalsFor / safePlayed;
    totalGoalsAgainstPerMatch += aggregate.goalsAgainst / safePlayed;
    totalGroupPoints += aggregate.groupPoints;
  }

  return {
    goalsForPerMatch: totalGoalsForPerMatch / entries.length,
    goalsAgainstPerMatch: totalGoalsAgainstPerMatch / entries.length,
    groupPoints: totalGroupPoints / entries.length,
  };
}

function teamAggregateToStats(
  teamAggregate: TeamAggregate | undefined,
  eloRating: number,
): TeamStatsInput {
  if (!teamAggregate || teamAggregate.played <= 0) {
    return {
      eloRating,
      matchesPlayed: 0,
      goalsForPerMatch: null,
      goalsAgainstPerMatch: null,
      groupPoints: null,
      last3Results: null,
    };
  }

  const safePlayed = Math.max(1, teamAggregate.played);

  const sortedRecent = [...teamAggregate.recentResults]
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .slice(0, 3)
    .map((entry) => entry.result);

  return {
    eloRating,
    matchesPlayed: teamAggregate.played,
    goalsForPerMatch: teamAggregate.goalsFor / safePlayed,
    goalsAgainstPerMatch: teamAggregate.goalsAgainst / safePlayed,
    groupPoints: teamAggregate.groupPoints,
    last3Results: sortedRecent,
  };
}

export async function getScheduledPredictions(): Promise<ScheduledMatchPrediction[]> {
  return getOrSet<ScheduledMatchPrediction[]>(
    "o11ce:predictions:scheduled",
    async () => {
      const [scheduledResponse, finishedResponse] = await Promise.all([
        footballAPIClient.getMatches("SCHEDULED", undefined, "predictions"),
        footballAPIClient.getMatches("FINISHED", undefined, "predictions"),
      ]);

      const rawScheduledMatches = scheduledResponse?.matches ?? scheduledResponse;
      const scheduledMatches = Array.isArray(rawScheduledMatches) ? rawScheduledMatches : [];
      const rawFinishedMatches = finishedResponse?.matches ?? finishedResponse;
      const finishedMatches = Array.isArray(rawFinishedMatches) ? rawFinishedMatches : [];

      const teamAggregates = new Map<number, TeamAggregate>();
      for (const finishedMatch of finishedMatches) {
        processMatchIntoTeamAggregates(teamAggregates, finishedMatch);
      }

      const tournamentAverages = buildTournamentAverages(teamAggregates);

      return [...scheduledMatches]
        .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
        .map((match) => {
          const homeElo = getEloRating(match.homeTeam.tla);
          const awayElo = getEloRating(match.awayTeam.tla);

          const homeStats = teamAggregateToStats(teamAggregates.get(match.homeTeam.id), homeElo);
          const awayStats = teamAggregateToStats(teamAggregates.get(match.awayTeam.id), awayElo);

          return {
            matchId: match.id,
            utcDate: match.utcDate,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            probabilities: predictMatch(homeStats, awayStats, tournamentAverages),
          };
        })
        .filter((prediction) => (
          prediction.homeTeam.name !== null
          && prediction.awayTeam.name !== null
          && prediction.homeTeam.name !== "Por confirmar"
          && prediction.awayTeam.name !== "Por confirmar"
        ));
    },
    TTL.UPCOMING_MATCHES,
  );
}
