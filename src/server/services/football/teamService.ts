import { TTL } from "@/lib/constants";
import { getOrSet } from "@/server/services/cache/helpers";
import { TRPCError } from "@trpc/server";

import { FootballAPIError, footballAPIClient } from "./client";
import type { CompetitionTeamsResponse, Team, TeamDetailResponse } from "./types";

function sortTeamsByName(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => {
    const nameA = a.name ?? "";
    const nameB = b.name ?? "";
    return nameA.localeCompare(nameB);
  });
}

export async function getAll(): Promise<Team[]> {
  const response = await getOrSet<CompetitionTeamsResponse>(
    "o11ce:teams:WC",
    () => footballAPIClient.getTeams(),
    TTL.TEAM_PROFILE,
  );

  const rawTeams = response?.teams ?? response;
  const teams = Array.isArray(rawTeams) ? rawTeams : [];

  return sortTeamsByName(teams);
}

export async function getById(teamId: number): Promise<TeamDetailResponse | null> {
  const key = `o11ce:team:${teamId}`;

  let team;
  try {
    team = await getOrSet<TeamDetailResponse>(
      key,
      () => footballAPIClient.getTeam(teamId),
      TTL.TEAM_PROFILE,
    );
  } catch (error) {
    if (error instanceof FootballAPIError && (error.status === 400 || error.status === 404)) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Team ${teamId} not found`,
      });
    }
    
    // Free Tier limits sometimes return 403 for specific team endpoints.
    // Fallback to getting it from the competition's team list, but without full squad.
    if (error instanceof FootballAPIError && error.status === 403) {
       console.warn(`[TeamService] 403 Forbidden for /teams/${teamId}. Falling back to team array filtering.`);
       const allTeams = await getAll();
       const matchedTeam = allTeams.find(t => t.id === teamId);
       
       if (!matchedTeam) {
         throw new TRPCError({
           code: "NOT_FOUND",
           message: `Team ${teamId} not found in fallback list`,
         });
       }

       return {
         ...matchedTeam,
         squad: [], // Free tier fallback doesn't map squad
       } as unknown as TeamDetailResponse;
    }

    throw error;
  }

  return team ?? null;
}
