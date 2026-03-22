import { z } from "zod";

import * as statsService from "@/server/services/football/statsService";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";

export const statsRouter = createTRPCRouter({
  getGoalsPerMatch: publicProcedure.query(async () => {
    return statsService.getGoalsPerMatch();
  }),

  getTopScoringTeams: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input }) => {
      return statsService.getTopScoringTeams(input.limit);
    }),

  getResultsDistribution: publicProcedure.query(async () => {
    return statsService.getResultsDistribution();
  }),

  getUnbeatenTeams: publicProcedure.query(async () => {
    return statsService.getUnbeatenTeams();
  }),
});
