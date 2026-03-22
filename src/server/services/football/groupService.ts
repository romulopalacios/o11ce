import { TTL } from "@/lib/constants";
import { getOrSet } from "@/server/services/cache/helpers";

import { footballAPIClient } from "./client";
import type { StandingGroup, StandingsResponse } from "./types";

function normalizeGroup(group?: string | null): string {
  return (group ?? "").trim().toUpperCase();
}

export async function getStandings(): Promise<StandingGroup[]> {
  const response = await getOrSet<StandingsResponse>(
    "o11ce:standings:WC",
    () => footballAPIClient.getStandings(),
    TTL.STANDINGS,
  );

  const rawStandings = response?.standings ?? response;
  return Array.isArray(rawStandings) ? rawStandings : [];
}

export async function getByGroup(group: string): Promise<StandingGroup | null> {
  const standings = await getStandings();
  const normalized = normalizeGroup(group);

  const found = standings.find((standing) => normalizeGroup(standing.group) === normalized);
  return found ?? null;
}
