import * as matchService from "@/server/services/football/matchService";
import type { FootballMatch } from "@/server/services/football/types";

export const eliminationStages = [
  "ROUND_OF_16",
  "QUARTER_FINALS",
  "SEMI_FINALS",
  "THIRD_PLACE",
  "FINAL",
] as const;

export type BracketStage = (typeof eliminationStages)[number];
export type BracketByStage = Record<BracketStage, FootballMatch[]>;

const eliminationStageSet = new Set<string>(eliminationStages);

export async function getBracket(): Promise<BracketByStage> {
  const allMatches = await matchService.getAll();

  const bracketMatches = allMatches.filter((match) => eliminationStageSet.has(match.stage));

  const grouped = eliminationStages.reduce<BracketByStage>((acc, stage) => {
    acc[stage] = bracketMatches
      .filter((match) => match.stage === stage)
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

    return acc;
  }, {
    ROUND_OF_16: [],
    QUARTER_FINALS: [],
    SEMI_FINALS: [],
    THIRD_PLACE: [],
    FINAL: [],
  });

  return grouped;
}

export function formatStageName(stage: string): string {
  const names: Record<string, string> = {
    ROUND_OF_16: "Octavos",
    QUARTER_FINALS: "Cuartos",
    SEMI_FINALS: "Semis",
    THIRD_PLACE: "Tercer lugar",
    FINAL: "Final",
  };

  return names[stage] ?? stage;
}

export const bracketService = {
  getBracket,
  formatStageName,
};
