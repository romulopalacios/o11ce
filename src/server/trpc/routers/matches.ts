import { z } from "zod";

import { bracketService } from "@/server/services/football/bracketService";
import * as matchService from "@/server/services/football/matchService";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";

const matchStatusFilterSchema = z.enum([
  "SCHEDULED",
  "TIMED",
  "IN_PLAY",
  "PAUSED",
  "FINISHED",
  "POSTPONED",
  "SUSPENDED",
  "CANCELLED",
]);

export const matchesRouter = createTRPCRouter({
  getUpcoming: publicProcedure
    .input(z.object({}).optional())
    .query(async () => {
      return matchService.getUpcoming();
    }),

  getLive: publicProcedure
    .input(z.object({}).optional())
    .query(async () => {
      return matchService.getLive();
    }),

  getRecent: publicProcedure
    .input(z.object({}).optional())
    .query(async () => {
      return matchService.getRecent();
    }),

  getAll: publicProcedure
    .input(
      z
        .object({
          status: matchStatusFilterSchema.optional(),
          group: z.string().min(1).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return matchService.getAll(input);
    }),

  getById: publicProcedure
    .input(z.object({ matchId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return matchService.getById(input.matchId);
    }),

  getBracket: publicProcedure
    .input(z.object({}).optional())
    .query(async () => {
      return bracketService.getBracket();
    }),
});
