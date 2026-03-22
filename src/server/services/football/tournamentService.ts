import * as matchService from "@/server/services/football/matchService";

interface TournamentContext {
  phase: string;
  matchesPlayed: number;
  totalGoals: number;
  daysToFinal: number;
}

function formatPhase(stage: string): string {
  const map: Record<string, string> = {
    GROUP_STAGE: "Fase de grupos",
    ROUND_OF_16: "Octavos de final",
    QUARTER_FINALS: "Cuartos de final",
    SEMI_FINALS: "Semifinales",
    FINAL: "Gran Final",
  };

  return map[stage] ?? stage;
}

export async function getTournamentContext(): Promise<TournamentContext> {
  const matches = await matchService.getAll();

  const played = matches.filter((match) => match.status === "FINISHED");
  const totalGoals = played.reduce((sum, match) => {
    return sum + (match.score.fullTime.home ?? 0) + (match.score.fullTime.away ?? 0);
  }, 0);

  const activeMatch = matches.find((match) => match.status === "IN_PLAY");
  const nextMatch = matches
    .filter((match) => match.status === "SCHEDULED")
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())[0];

  const currentPhase = activeMatch?.stage
    ?? nextMatch?.stage
    ?? played[played.length - 1]?.stage
    ?? "Mundial 2026";

  const finalDate = new Date("2026-07-14");
  const today = new Date();
  const daysToFinal = Math.max(
    0,
    Math.ceil((finalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return {
    phase: formatPhase(currentPhase),
    matchesPlayed: played.length,
    totalGoals,
    daysToFinal,
  };
}
