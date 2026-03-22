import { createTRPCRouter } from "@/server/trpc";
import { groupsRouter } from "@/server/trpc/routers/groups";
import { matchesRouter } from "@/server/trpc/routers/matches";
import { statsRouter } from "@/server/trpc/routers/stats";
import { teamsRouter } from "@/server/trpc/routers/teams";

export const appRouter = createTRPCRouter({
  matches: matchesRouter,
  groups: groupsRouter,
  stats: statsRouter,
  teams: teamsRouter,
});

export type AppRouter = typeof appRouter;
