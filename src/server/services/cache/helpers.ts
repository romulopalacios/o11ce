import redis from "./redis";

export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number,
): Promise<T> {
  try {
    const cachedValue = await redis.get<T>(key);
    if (cachedValue !== null) {
      return cachedValue;
    }
  } catch {
    // Silent fallback: when Redis is unavailable, continue directly to fetcher.
  }

  const freshValue = await fetcher();

  try {
    await redis.set(key, freshValue, {
      ex: ttlSeconds,
    });
  } catch {
    // Silent fallback: return fresh data even if Redis cannot persist it.
  }

  return freshValue;
}
