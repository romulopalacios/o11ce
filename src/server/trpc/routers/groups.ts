import { TRPCError } from "@trpc/server";
import { z } from "zod";

import * as groupService from "@/server/services/football/groupService";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";

export const groupsRouter = createTRPCRouter({
  getStandings: publicProcedure
    .input(z.object({}).optional())
    .query(async () => {
      return groupService.getStandings();
    }),

  getByGroup: publicProcedure
    .input(z.object({ group: z.string().min(1) }))
    .query(async ({ input }) => {
      const group = await groupService.getByGroup(input.group);
      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Group ${input.group} not found`,
        });
      }

      return group;
    }),
});
