import { NextResponse } from "next/server";
import { TRPCError } from "@trpc/server";

import * as matchService from "@/server/services/football/matchService";

interface RouteContext {
  params: Promise<{ matchId: string }>;
}

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { matchId } = await context.params;
  const parsedMatchId = Number(matchId);

  if (!Number.isInteger(parsedMatchId) || parsedMatchId <= 0) {
    return NextResponse.json({ message: "Invalid match id" }, { status: 400 });
  }

  let match;
  try {
    match = await matchService.getById(parsedMatchId);
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return NextResponse.json({ message: "Match not found" }, { status: 404 });
    }

    throw error;
  }

  return NextResponse.json(match);
}
