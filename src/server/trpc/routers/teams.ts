import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { compareService } from "@/server/services/football/compareService";
import * as teamService from "@/server/services/football/teamService";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";

export const teamsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({}).optional())
    .query(async () => {
      return teamService.getAll();
    }),

  getById: publicProcedure
    .input(z.object({ teamId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const team = await teamService.getById(input.teamId);
      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Team ${input.teamId} not found`,
        });
      }

      return team;
    }),

  compare: publicProcedure
    .input(z.object({
      teamAId: z.number().positive(),
      teamBId: z.number().positive(),
    }))
    .query(async ({ input }) => {
      return compareService.compareTeams(input.teamAId, input.teamBId);
    }),
});
