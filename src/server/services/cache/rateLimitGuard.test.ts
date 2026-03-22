import { describe, expect, it } from "vitest";

import {
  checkRateLimit,
  guardFootballApiRateLimit,
  RATE_LIMIT,
  RateLimitError,
  type RateLimitRedisClient,
} from "./rateLimitGuard";

const RESOURCE = "matches";
const RESOURCE_KEY = `${RATE_LIMIT.KEY_PREFIX}:${RESOURCE}`;

interface MockRedisState {
  counts: Record<string, number>;
  expireCalls: Array<{ key: string; seconds: number }>;
}

function createMockRedis(initialCount = 0): { client: RateLimitRedisClient; state: MockRedisState } {
  const state: MockRedisState = {
    counts: {
      [RESOURCE_KEY]: initialCount,
    },
    expireCalls: [],
  };

  const client: RateLimitRedisClient = {
    get: async <T>(key: string): Promise<T | null> => {
      const value = state.counts[key];
      if (typeof value !== "number") {
        return null;
      }

      return value as T;
    },
    incr: async (key: string): Promise<number> => {
      const current = state.counts[key] ?? 0;
      const next = current + 1;
      state.counts[key] = next;
      return next;
    },
    expire: async (key: string, seconds: number): Promise<unknown> => {
      state.expireCalls.push({ key, seconds });
      return 1;
    },
  };

  return { client, state };
}

describe("guardFootballApiRateLimit", () => {
  it("incrementa el contador cuando esta por debajo del limite", async () => {
    const { client, state } = createMockRedis(0);

    await guardFootballApiRateLimit(RESOURCE, client);

    expect(state.counts[RESOURCE_KEY]).toBe(1);
  });

  it("configura expiracion de 60 segundos cuando inicia la ventana", async () => {
    const { client, state } = createMockRedis(0);

    await checkRateLimit(RESOURCE, client);

    expect(state.expireCalls).toHaveLength(1);
    expect(state.expireCalls[0]).toEqual({
      key: RESOURCE_KEY,
      seconds: RATE_LIMIT.WINDOW_SECONDS,
    });
  });

  it("lanza RateLimitError cuando count >= 10", async () => {
    const { client } = createMockRedis(10);

    await expect(checkRateLimit(RESOURCE, client)).rejects.toBeInstanceOf(RateLimitError);
  });
});
