import * as matchService from "@/server/services/football/matchService";

interface TournamentContext {
  phase: string;
  matchesPlayed: number;
  totalGoals: number;
  goalsPerMatch: string;
  daysToWorldCup: number;
  daysToStart: number;
  daysToFinal: number;
  worldCupStartIso: string;
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

  const worldCupStart = matches
    .map((match) => new Date(match.utcDate))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())[0] ?? new Date("2026-06-11");

  const finalDate = new Date("2026-07-14");
  const today = new Date();
  const daysToWorldCup = Math.max(
    0,
    Math.ceil((worldCupStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const daysToStart = Math.max(
    0,
    Math.ceil((worldCupStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const daysToFinal = Math.max(
    0,
    Math.ceil((finalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const goalsPerMatch = played.length > 0
    ? (totalGoals / played.length).toFixed(2)
    : "0.00";

  return {
    phase: formatPhase(currentPhase),
    matchesPlayed: played.length,
    totalGoals,
    goalsPerMatch,
    daysToWorldCup,
    daysToStart,
    daysToFinal,
    worldCupStartIso: worldCupStart.toISOString(),
  };
}
