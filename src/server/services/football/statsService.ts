import { TTL } from "@/lib/constants";
import { getOrSet } from "@/server/services/cache/helpers";

import { footballAPIClient } from "./client";
import * as matchService from "./matchService";
import type { CompetitionMatchesResponse, FootballMatch, Scorer, ScorersResponse } from "./types";

export interface GoalsByMatchday {
  matchday: number;
  goals: number;
}

function toGoalCount(match: FootballMatch): number {
  const homeGoals = match.score.fullTime.home ?? 0;
  const awayGoals = match.score.fullTime.away ?? 0;
  return homeGoals + awayGoals;
}

export async function getTopScorers(): Promise<Scorer[]> {
  const response = await getOrSet<ScorersResponse>(
    "o11ce:scorers:WC",
    () => footballAPIClient.getScorers(),
    TTL.UPCOMING_MATCHES,
  );

  const rawScorers = response?.scorers ?? response;
  return Array.isArray(rawScorers) ? rawScorers : [];
}

export async function getGoalsByMatchday(): Promise<GoalsByMatchday[]> {
  const matchesResponse = await getOrSet<CompetitionMatchesResponse>(
    "o11ce:matches:finished",
    () => footballAPIClient.getMatches("FINISHED"),
    TTL.FINISHED_MATCH,
  );

  const rawMatches = matchesResponse?.matches ?? matchesResponse;
  const finishedMatches = Array.isArray(rawMatches) ? rawMatches : [];

  const totals = finishedMatches.reduce<Record<number, number>>((accumulator, match) => {
    const matchday = match.matchday;
    if (!matchday) {
      return accumulator;
    }

    const currentTotal = accumulator[matchday] ?? 0;
    accumulator[matchday] = currentTotal + toGoalCount(match);
    return accumulator;
  }, {});

  return Object.entries(totals)
    .map(([matchday, goals]) => ({
      matchday: Number(matchday),
      goals,
    }))
    .sort((a, b) => a.matchday - b.matchday);
}

export async function getGoalsPerMatch(): Promise<number> {
  const matches = await matchService.getAll();
  const finished = matches.filter((match) => match.status === "FINISHED");

  if (!finished.length) {
    return 0;
  }

  const total = finished.reduce((sum, match) => {
    return sum + (match.score.fullTime.home ?? 0) + (match.score.fullTime.away ?? 0);
  }, 0);

  return Math.round((total / finished.length) * 10) / 10;
}

export interface TopScoringTeam {
  name: string;
  crest: string | null;
  goals: number;
  teamId: number;
}

export async function getTopScoringTeams(limit = 8): Promise<TopScoringTeam[]> {
  const matches = await matchService.getAll();
  const finished = matches.filter((match) => match.status === "FINISHED");
  const map = new Map<number, TopScoringTeam>();

  for (const match of finished) {
    const home = map.get(match.homeTeam.id) ?? {
      name: match.homeTeam.name ?? "",
      crest: match.homeTeam.crest,
      goals: 0,
      teamId: match.homeTeam.id,
    };
    home.goals += match.score.fullTime.home ?? 0;
    map.set(match.homeTeam.id, home);

    const away = map.get(match.awayTeam.id) ?? {
      name: match.awayTeam.name ?? "",
      crest: match.awayTeam.crest,
      goals: 0,
      teamId: match.awayTeam.id,
    };
    away.goals += match.score.fullTime.away ?? 0;
    map.set(match.awayTeam.id, away);
  }

  return [...map.values()]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, limit);
}

export interface ResultsDistribution {
  homeWins: number;
  draws: number;
  awayWins: number;
  total: number;
}

export async function getResultsDistribution(): Promise<ResultsDistribution> {
  const matches = await matchService.getAll();
  const finished = matches.filter((match) => match.status === "FINISHED");

  const homeWins = finished.filter((match) => (match.score.fullTime.home ?? 0) > (match.score.fullTime.away ?? 0)).length;
  const draws = finished.filter((match) => match.score.fullTime.home === match.score.fullTime.away).length;
  const awayWins = finished.filter((match) => (match.score.fullTime.home ?? 0) < (match.score.fullTime.away ?? 0)).length;

  return {
    homeWins,
    draws,
    awayWins,
    total: finished.length,
  };
}

export interface UnbeatenTeam {
  id: number;
  name: string;
  crest: string | null;
}

export async function getUnbeatenTeams(): Promise<UnbeatenTeam[]> {
  const matches = await matchService.getAll();
  const finished = matches.filter((match) => match.status === "FINISHED");
  const losses = new Set<number>();

  for (const match of finished) {
    if ((match.score.fullTime.home ?? 0) < (match.score.fullTime.away ?? 0)) {
      losses.add(match.homeTeam.id);
    }

    if ((match.score.fullTime.home ?? 0) > (match.score.fullTime.away ?? 0)) {
      losses.add(match.awayTeam.id);
    }
  }

  const allTeamIds = [...new Set(finished.flatMap((match) => [match.homeTeam.id, match.awayTeam.id]))];

  return allTeamIds
    .filter((id) => !losses.has(id))
    .map((id) => {
      const match = finished.find((item) => item.homeTeam.id === id || item.awayTeam.id === id);
      const team = match?.homeTeam.id === id ? match.homeTeam : match?.awayTeam;

      return {
        id,
        name: team?.name ?? "",
        crest: team?.crest ?? null,
      };
    });
}
