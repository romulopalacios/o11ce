import { env } from "@/lib/env";
import { checkRateLimit } from "@/server/services/cache/rateLimitGuard";
import { z } from "zod";

import {
  CompetitionMatchesResponseSchema,
  CompetitionTeamsResponseSchema,
  MatchDetailResponseSchema,
  ScorersResponseSchema,
  StandingsResponseSchema,
  TeamDetailResponseSchema,
  type CompetitionMatchesResponse,
  type CompetitionTeamsResponse,
  type MatchDetailResponse,
  type ScorersResponse,
  type StandingsResponse,
  type TeamDetailResponse,
} from "./types";

export class FootballAPIError extends Error {
  public readonly status: number;
  public readonly endpoint: string;

  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = "FootballAPIError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

export class FootballAPIClient {
  private readonly baseUrl = "https://api.football-data.org/v4";

  private async request<T>(
    endpoint: string,
    schema: z.ZodType<T>,
    resource: string,
    revalidateSeconds?: number,
  ): Promise<T> {
    await checkRateLimit(resource);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "X-Auth-Token": env.FOOTBALL_DATA_API_KEY,
      },
      next: revalidateSeconds ? { revalidate: revalidateSeconds } : undefined,
    });

    if (response.status >= 400) {
      throw new FootballAPIError(
        `Football API request failed (${response.status})`,
        response.status,
        endpoint,
      );
    }

    const json: unknown = await response.json();
    return schema.parse(json);
  }

  public async getMatches(
    status?: "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELLED",
    revalidateSeconds?: number,
    resource = "matches",
  ): Promise<CompetitionMatchesResponse> {
    const params = new URLSearchParams();
    if (status) {
      params.set("status", status);
    }

    const endpoint = params.size > 0
      ? `/competitions/WC/matches?${params.toString()}`
      : "/competitions/WC/matches";

    return this.request(endpoint, CompetitionMatchesResponseSchema, resource, revalidateSeconds);
  }

  public async getMatch(id: number): Promise<MatchDetailResponse> {
    return this.request(`/matches/${id}`, MatchDetailResponseSchema, "matches");
  }

  public async getStandings(): Promise<StandingsResponse> {
    return this.request("/competitions/WC/standings", StandingsResponseSchema, "standings");
  }

  public async getScorers(): Promise<ScorersResponse> {
    return this.request("/competitions/WC/scorers", ScorersResponseSchema, "stats");
  }

  public async getTeams(): Promise<CompetitionTeamsResponse> {
    return this.request("/competitions/WC/teams", CompetitionTeamsResponseSchema, "teams");
  }

  public async getTeam(id: number): Promise<TeamDetailResponse> {
    return this.request(`/teams/${id}`, TeamDetailResponseSchema, "teams");
  }
}

export const footballAPIClient = new FootballAPIClient();
