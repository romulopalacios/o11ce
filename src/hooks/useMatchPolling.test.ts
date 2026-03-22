// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useSWR from "swr";

import { useMatchPolling } from "./useMatchPolling";

vi.mock("swr", () => ({
  default: vi.fn(),
}));

interface MockMatchData {
  id: number;
}

function createFetcher(): () => Promise<MockMatchData> {
  return async () => ({ id: 1 });
}

describe("useMatchPolling", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // This cast is needed because useSWR is fully mocked by vi.mock at runtime.
    const mockedUseSWR = vi.mocked(useSWR);
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(async () => undefined),
    });

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
  });

  it("no hace polling cuando status es FINISHED", () => {
    renderHook(() =>
      useMatchPolling({
        matchId: 99,
        status: "FINISHED",
        fetcher: createFetcher(),
      }),
    );

    // This cast is needed because useSWR is fully mocked and we need to inspect call args.
    const mockedUseSWR = vi.mocked(useSWR);
    const swrCall = mockedUseSWR.mock.calls[0];

    expect(swrCall).toBeDefined();
    if (!swrCall) {
      return;
    }

    const config = swrCall[2];
    expect(config?.refreshInterval).toBe(0);
  });

  it("hace polling cuando status es IN_PLAY", () => {
    renderHook(() =>
      useMatchPolling({
        matchId: 100,
        status: "IN_PLAY",
        fetcher: createFetcher(),
      }),
    );

    // This cast is needed because useSWR is fully mocked and we need to inspect call args.
    const mockedUseSWR = vi.mocked(useSWR);
    const swrCall = mockedUseSWR.mock.calls[0];

    expect(swrCall).toBeDefined();
    if (!swrCall) {
      return;
    }

    const config = swrCall[2];
    expect(config?.refreshInterval).toBe(30_000);
  });

  it("revalida al volver a visible", () => {
    const mutateMock = vi.fn(async () => undefined);
    // This cast is needed because useSWR is fully mocked by vi.mock at runtime.
    const mockedUseSWR = vi.mocked(useSWR);
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: mutateMock,
    });

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });

    renderHook(() =>
      useMatchPolling({
        matchId: 101,
        status: "IN_PLAY",
        fetcher: createFetcher(),
      }),
    );

    expect(mutateMock).toHaveBeenCalledTimes(0);

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(mutateMock).toHaveBeenCalledTimes(1);
  });
});
