import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import LiveMatchClient from "@/components/match/LiveMatchClient";
import { PageWrapper } from "@/components/ui/PageWrapper";
import db from "@/server/db";
import * as matchService from "@/server/services/football/matchService";

interface MatchDetailPageProps {
  params: Promise<{ matchId: string }>;
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof TRPCError && error.code === "NOT_FOUND";
}

export async function generateMetadata({ params }: MatchDetailPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const parsedMatchId = Number(matchId);

  if (!Number.isInteger(parsedMatchId) || parsedMatchId <= 0) {
    return {
      title: "Partido no encontrado | O11CE",
      description: "No se encontro el partido solicitado.",
    };
  }

  let match;
  try {
    match = await matchService.getById(parsedMatchId);
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        title: "Partido no encontrado | O11CE",
        description: "No se encontro el partido solicitado.",
      };
    }

    throw error;
  }

  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} | O11CE`,
    description: "Detalle del partido del Mundial con datos disponibles en el plan actual.",
  };
}

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { matchId } = await params;
  const parsedMatchId = Number(matchId);

  if (!Number.isInteger(parsedMatchId) || parsedMatchId <= 0) {
    notFound();
  }

  let match;
  try {
    match = await matchService.getById(parsedMatchId);
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound();
    }

    throw error;
  }

  const prediction = await db.prediction.findUnique({
    where: { matchId: parsedMatchId },
    select: {
      homeWinProb: true,
      drawProb: true,
      awayWinProb: true,
      wasCorrect: true,
      actualResult: true,
    },
  });

  return (
    <PageWrapper>
      <LiveMatchClient initialMatch={match} matchId={parsedMatchId} prediction={prediction} />
    </PageWrapper>
  );
}
