import { TTL } from "@/lib/constants";
import { getOrSet } from "@/server/services/cache/helpers";
import { TRPCError } from "@trpc/server";

import { footballAPIClient } from "./client";
import type { CompetitionMatchesResponse, FootballMatch, MatchDetailResponse } from "./types";

interface GetAllMatchesFilters {
  status?: "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELLED";
  group?: string;
}

function normalizeGroup(group?: string | null): string {
  return (group ?? "").trim().toUpperCase();
}

function buildAllMatchesCacheKey(filters?: GetAllMatchesFilters): string {
  if (!filters?.status && !filters?.group) {
    return "o11ce:matches:all";
  }

  const statusPart = filters.status ?? "all";
  const groupPart = normalizeGroup(filters.group) || "all";
  return `o11ce:matches:${statusPart}:${groupPart}`;
}

function sortByUtcDateAsc(matches: FootballMatch[]): FootballMatch[] {
  return [...matches].sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
}

async function getAllMatchesFromApi(): Promise<FootballMatch[]> {
  const response = await footballAPIClient.getMatches();
  const rawMatches = response?.matches ?? response;
  const allMatches = Array.isArray(rawMatches) ? rawMatches : [];

  return sortByUtcDateAsc(allMatches);
}

export async function getUpcoming(): Promise<FootballMatch[]> {
  const matches = await getAll();
  return matches
    .filter((match) => match.status === "SCHEDULED")
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    .slice(0, 10);
}

export async function getLive(): Promise<FootballMatch[]> {
  const matches = await getAll();
  return matches.filter((match) => match.status === "IN_PLAY");
}

export async function getRecent(): Promise<FootballMatch[]> {
  const matches = await getAll();
  return matches
    .filter((match) => match.status === "FINISHED")
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .slice(0, 10);
}

export async function getAll(filters?: GetAllMatchesFilters): Promise<FootballMatch[]> {
  const key = buildAllMatchesCacheKey(filters);

  const response = await getOrSet<CompetitionMatchesResponse | FootballMatch[]>(
    key,
    () => getAllMatchesFromApi(),
    TTL.UPCOMING_MATCHES,
  );

  const rawMatches = (response as CompetitionMatchesResponse)?.matches ?? response ?? [];
  const allMatches = Array.isArray(rawMatches) ? rawMatches : [];

  const filteredByStatus = filters?.status
    ? allMatches.filter((match) => match.status === filters.status)
    : allMatches;

  const normalizedGroup = normalizeGroup(filters?.group);
  const filteredByGroup = normalizedGroup
    ? filteredByStatus.filter((match) => normalizeGroup(match.group) === normalizedGroup)
    : filteredByStatus;

  return sortByUtcDateAsc(filteredByGroup);
}

export async function getById(matchId: number): Promise<MatchDetailResponse> {
  const allMatches = await getAll();
  const match = allMatches.find((item) => item.id === matchId);
  if (!match) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Match ${matchId} not found`,
    });
  }

  return match;
}
