import { z } from "zod";

export const MatchStatusSchema = z.enum([
  "SCHEDULED",
  "TIMED",
  "IN_PLAY",
  "PAUSED",
  "FINISHED",
  "POSTPONED",
  "SUSPENDED",
  "CANCELLED",
]);

export const GoalTypeSchema = z.enum(["REGULAR", "OWN", "PENALTY"]);

export const CardTypeSchema = z.enum(["YELLOW_CARD", "RED_CARD", "YELLOW_RED_CARD"]);

export const TeamRefSchema = z
  .object({
    id: z.number().nullable().transform((value) => value ?? -1),
    name: z.string().nullable().transform((value) => value ?? "Por confirmar"),
    shortName: z.string().nullable().transform((value) => value ?? "Por confirmar"),
    tla: z.string().nullable().transform((value) => value ?? "TBD"),
    crest: z.string().nullable().transform((value) => value ?? "/placeholder-crest.svg"),
  })
  .passthrough();

export const ScoreValueSchema = z
  .object({
    home: z.number().nullable(),
    away: z.number().nullable(),
  })
  .passthrough();

export const ScoreSchema = z
  .object({
    winner: z.string().nullable().optional(),
    duration: z.string().optional(),
    fullTime: ScoreValueSchema,
    halfTime: ScoreValueSchema.optional(),
  })
  .passthrough();

export const GoalSchema = z
  .object({
    minute: z.number(),
    injuryTime: z.number().nullable().optional(),
    type: GoalTypeSchema.or(z.string()),
    team: TeamRefSchema,
    scorer: z
      .object({
        id: z.number().optional(),
        name: z.string(),
      })
      .passthrough(),
    assist: z
      .object({
        id: z.number().optional(),
        name: z.string(),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough();

export const BookingSchema = z
  .object({
    minute: z.number(),
    team: TeamRefSchema,
    player: z
      .object({
        id: z.number().optional(),
        name: z.string(),
      })
      .passthrough(),
    card: CardTypeSchema.or(z.string()),
  })
  .passthrough();

export const SubstitutionSchema = z
  .object({
    minute: z.number(),
    team: TeamRefSchema,
    playerOut: z
      .object({
        id: z.number().optional(),
        name: z.string(),
      })
      .passthrough(),
    playerIn: z
      .object({
        id: z.number().optional(),
        name: z.string(),
      })
      .passthrough(),
  })
  .passthrough();

export const FootballMatchSchema = z
  .object({
    id: z.number(),
    matchday: z.number().nullable(),
    status: MatchStatusSchema,
    stage: z.string(),
    group: z.string().nullable().optional(),
    utcDate: z.string(),
    minute: z.number().nullable().optional(),
    homeTeam: TeamRefSchema,
    awayTeam: TeamRefSchema,
    score: ScoreSchema,
    goals: z.array(GoalSchema).optional().default([]),
    bookings: z.array(BookingSchema).optional().default([]),
    substitutions: z.array(SubstitutionSchema).optional().default([]),
  })
  .passthrough();

export const CompetitionMatchesResponseSchema = z
  .object({
    filters: z.record(z.string(), z.unknown()).optional(),
    resultSet: z
      .object({
        count: z.number().optional(),
        first: z.string().optional(),
        last: z.string().optional(),
      })
      .passthrough()
      .optional(),
    competition: z
      .object({
        id: z.number(),
        code: z.string(),
        name: z.string(),
      })
      .passthrough()
      .optional(),
    matches: z.array(FootballMatchSchema),
  })
  .passthrough();

export const MatchDetailResponseSchema = FootballMatchSchema;

export const StandingTableRowSchema = z
  .object({
    position: z.number(),
    team: TeamRefSchema,
    playedGames: z.number(),
    won: z.number(),
    draw: z.number(),
    lost: z.number(),
    points: z.number(),
    goalsFor: z.number(),
    goalsAgainst: z.number(),
    goalDifference: z.number(),
  })
  .passthrough();

export const StandingGroupSchema = z
  .object({
    stage: z.string().optional(),
    type: z.string().optional(),
    group: z.string().nullable().optional(),
    table: z.array(StandingTableRowSchema),
  })
  .passthrough();

export const StandingsResponseSchema = z
  .object({
    standings: z.array(StandingGroupSchema),
  })
  .passthrough();

export const TeamSchema = z
  .object({
    id: z.number().nullable().transform((value) => value ?? -1),
    name: z.string().nullable().transform((value) => value ?? "Por confirmar"),
    shortName: z.string().nullable().transform((value) => value ?? "Por confirmar"),
    tla: z.string().nullable().transform((value) => value ?? "TBD"),
    crest: z.string().nullable().transform((value) => value ?? "/placeholder-crest.svg"),
    area: z
      .object({
        id: z.number().optional(),
        name: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export const CompetitionTeamsResponseSchema = z
  .object({
    teams: z.array(TeamSchema),
  })
  .passthrough();

export const TeamDetailResponseSchema = TeamSchema;

export const ScorerSchema = z
  .object({
    player: z
      .object({
        id: z.number().optional(),
        name: z.string(),
        nationality: z.string().optional(),
      })
      .passthrough(),
    team: TeamRefSchema,
    goals: z.number(),
    assists: z.number().optional(),
    penalties: z.number().optional(),
  })
  .passthrough();

export const ScorersResponseSchema = z
  .object({
    scorers: z.array(ScorerSchema),
  })
  .passthrough();

export type MatchStatus = z.infer<typeof MatchStatusSchema>;
export type GoalType = z.infer<typeof GoalTypeSchema>;
export type CardType = z.infer<typeof CardTypeSchema>;
export type TeamRef = z.infer<typeof TeamRefSchema>;
export type FootballMatch = z.infer<typeof FootballMatchSchema>;
export type CompetitionMatchesResponse = z.infer<typeof CompetitionMatchesResponseSchema>;
export type MatchDetailResponse = z.infer<typeof MatchDetailResponseSchema>;
export type StandingTableRow = z.infer<typeof StandingTableRowSchema>;
export type StandingGroup = z.infer<typeof StandingGroupSchema>;
export type StandingsResponse = z.infer<typeof StandingsResponseSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type CompetitionTeamsResponse = z.infer<typeof CompetitionTeamsResponseSchema>;
export type TeamDetailResponse = z.infer<typeof TeamDetailResponseSchema>;
export type Scorer = z.infer<typeof ScorerSchema>;
export type ScorersResponse = z.infer<typeof ScorersResponseSchema>;
