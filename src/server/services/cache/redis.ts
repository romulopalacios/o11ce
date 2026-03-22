import { Redis } from "@upstash/redis";

import { env } from "@/lib/env";

declare global {
  var redis: Redis | undefined;
}

const redisSingleton = (): Redis => {
  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
};

export const redis = globalThis.redis ?? redisSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.redis = redis;
}

export default redis;
