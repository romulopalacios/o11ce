import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/trpc/index";
import { db } from "@/server/db";

export const quinielaRouter = createTRPCRouter({
  savePrediction: publicProcedure
    .input(z.object({
      username: z.string().min(3),
      matchId: z.number(),
      predicted: z.enum(["HOME", "DRAW", "AWAY"]),
    }))
    .mutation(async ({ input }) => {
      // Upsert the user if it doesn't exist
      await db.quinielaUser.upsert({
        where: { username: input.username },
        update: {},
        create: { username: input.username },
      });

      // Upsert the prediction
      const prediction = await db.userPrediction.upsert({
        where: {
          username_matchId: {
            username: input.username,
            matchId: input.matchId,
          }
        },
        update: {
          predicted: input.predicted,
        },
        create: {
          username: input.username,
          matchId: input.matchId,
          predicted: input.predicted,
        }
      });

      return prediction;
    }),

  getUserPredictions: publicProcedure
    .input(z.object({
      username: z.string().optional(),
    }))
    .query(async ({ input }) => {
      if (!input.username) return [];
      return await db.userPrediction.findMany({
        where: { username: input.username },
      });
    }),

  getLeaderboard: publicProcedure
    .query(async () => {
      return await db.quinielaUser.findMany({
        orderBy: { score: 'desc' },
        take: 20,
      });
    }),
});
