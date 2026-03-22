import { NextResponse } from "next/server";

import { evaluatePendingPredictions } from "@/server/services/predictions/accuracyService";
import redis from "@/server/services/cache/redis";
import type { CompetitionMatchesResponse } from "@/server/services/football/types";

const LIVE_MATCHES_KEY = "o11ce:matches:IN_PLAY";

export async function GET(): Promise<Response> {
  const cachedLiveMatches = await redis.get<CompetitionMatchesResponse>(LIVE_MATCHES_KEY);

  const keysToDelete = new Set<string>([LIVE_MATCHES_KEY]);
  for (const match of cachedLiveMatches?.matches ?? []) {
    keysToDelete.add(`o11ce:match:${match.id}`);
  }

  await Promise.all(Array.from(keysToDelete).map(async (key) => {
    await redis.del(key);
  }));

  await evaluatePendingPredictions();

  return NextResponse.json({
    invalidatedKeys: Array.from(keysToDelete),
    invalidatedCount: keysToDelete.size,
  });
}
