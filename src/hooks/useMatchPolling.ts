"use client";

import { useEffect, useState } from "react";
import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";

interface UseMatchPollingOptions<TData> {
  matchId: number;
  status: string;
  fetcher: () => Promise<TData>;
}

export function useMatchPolling<TData>({
  matchId,
  status,
  fetcher,
}: UseMatchPollingOptions<TData>): SWRResponse<TData> {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof document === "undefined") {
      return true;
    }

    return document.visibilityState === "visible";
  });

  useEffect(() => {
    const onVisibilityChange = (): void => {
      const currentlyVisible = document.visibilityState === "visible";
      setIsVisible(currentlyVisible);
    };

    setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const config: SWRConfiguration<TData> = {
    refreshInterval: status === "IN_PLAY" && isVisible ? 30_000 : 0,
    revalidateOnFocus: status === "IN_PLAY",
  };

  const swr = useSWR<TData>(["match", matchId], fetcher, config);

  useEffect(() => {
    if (status !== "IN_PLAY") {
      return;
    }

    if (!isVisible) {
      return;
    }

    void swr.mutate();
  }, [isVisible, status, swr]);

  return swr;
}

export default useMatchPolling;
