import type { Redis } from "@upstash/redis";

import db from "@/server/db";
import cache from "@/server/services/cache/redis";

export interface TRPCContext {
  db: typeof db;
  cache: Redis;
}

export async function createTRPCContext(): Promise<TRPCContext> {
  return {
    db,
    cache,
  };
}
