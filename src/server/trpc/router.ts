import { createTRPCRouter } from "@/server/trpc";
import { groupsRouter } from "@/server/trpc/routers/groups";
import { matchesRouter } from "@/server/trpc/routers/matches";
import { statsRouter } from "@/server/trpc/routers/stats";
import { teamsRouter } from "@/server/trpc/routers/teams";
import { quinielaRouter } from "@/server/trpc/routers/quiniela";

export const appRouter = createTRPCRouter({
  matches: matchesRouter,
  groups: groupsRouter,
  stats: statsRouter,
  teams: teamsRouter,
  quiniela: quinielaRouter,
});

export type AppRouter = typeof appRouter;
