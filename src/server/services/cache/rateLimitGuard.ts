const RATE_LIMIT_KEY_PREFIX = "o11ce:rate:football-api";
const RATE_LIMIT_MAX_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60;

export interface RateLimitRedisClient {
  get<T>(key: string): Promise<T | null>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
}

export class RateLimitError extends Error {
  public readonly key: string;
  public readonly count: number;
  public readonly limit: number;

  constructor(key: string, count: number, limit: number) {
    super(`Rate limit reached for ${key}: ${count}/${limit}`);
    this.name = "RateLimitError";
    this.key = key;
    this.count = count;
    this.limit = limit;
  }
}

function toRateLimitKey(resource: string): string {
  return `${RATE_LIMIT_KEY_PREFIX}:${resource}`;
}

async function getDefaultRedisClient(): Promise<RateLimitRedisClient> {
  const redisModule = await import("./redis");
  return redisModule.default as unknown as RateLimitRedisClient;
}

export async function checkRateLimit(
  resource: string,
  redisClient?: RateLimitRedisClient,
): Promise<void> {
  const client = redisClient ?? (await getDefaultRedisClient());
  const key = toRateLimitKey(resource);
  const currentCount = (await client.get<number>(key)) ?? 0;

  if (currentCount >= RATE_LIMIT_MAX_PER_MINUTE) {
    throw new RateLimitError(key, currentCount, RATE_LIMIT_MAX_PER_MINUTE);
  }

  const nextCount = await client.incr(key);

  if (nextCount === 1) {
    await client.expire(key, RATE_LIMIT_WINDOW_SECONDS);
  }
}

export async function guardFootballApiRateLimit(
  resource: string,
  redisClient?: RateLimitRedisClient,
): Promise<void> {
  await checkRateLimit(resource, redisClient);
}

export const RATE_LIMIT = {
  KEY_PREFIX: RATE_LIMIT_KEY_PREFIX,
  MAX_PER_MINUTE: RATE_LIMIT_MAX_PER_MINUTE,
  WINDOW_SECONDS: RATE_LIMIT_WINDOW_SECONDS,
} as const;
