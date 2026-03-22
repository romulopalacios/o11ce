"use client";

import { useEffect, useState } from "react";

import MatchDetail from "@/components/match/MatchDetail";
import useMatchPolling from "@/hooks/useMatchPolling";
import { MatchDetailResponseSchema, type MatchDetailResponse } from "@/server/services/football/types";

interface MatchPredictionSummary {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  wasCorrect: boolean | null;
  actualResult: string | null;
}

interface LiveMatchClientProps {
  initialMatch: MatchDetailResponse;
  matchId: number;
  prediction?: MatchPredictionSummary | null;
}

async function fetchLiveMatch(matchId: number): Promise<MatchDetailResponse> {
  const response = await fetch(`/api/matches/${matchId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch live match (${response.status})`);
  }

  const data: unknown = await response.json();
  return MatchDetailResponseSchema.parse(data);
}

export default function LiveMatchClient({ initialMatch, matchId, prediction }: LiveMatchClientProps) {
  const [liveStatus, setLiveStatus] = useState(initialMatch.status);

  const { data } = useMatchPolling<MatchDetailResponse>({
    matchId,
    status: liveStatus,
    fetcher: () => fetchLiveMatch(matchId),
  });

  const match = data ?? initialMatch;

  useEffect(() => {
    if (data?.status && data.status !== liveStatus) {
      setLiveStatus(data.status);
    }
  }, [data?.status, liveStatus]);

  return <MatchDetail match={match} prediction={prediction} />;
}
