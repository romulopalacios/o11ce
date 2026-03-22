export interface TournamentAverages {
  goalsForPerMatch: number;
  goalsAgainstPerMatch: number;
  groupPoints: number;
}

export type RecentResult = "W" | "D" | "L";

export interface TeamStatsInput {
  goalsForPerMatch?: number | null;
  goalsAgainstPerMatch?: number | null;
  groupPoints?: number | null;
  last3Results?: RecentResult[] | null;
}

export interface PredictionProbabilities {
  homeWin: number;
  draw: number;
  awayWin: number;
}

const FACTOR_WEIGHTS = {
  attack: 0.3,
  defense: 0.3,
  points: 0.25,
  form: 0.15,
} as const;

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

function isValidMetric(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function resolveMetric(
  value: number | null | undefined,
  fallback: number,
): number {
  if (isValidMetric(value)) {
    return value;
  }

  return fallback;
}

function normalizeDiff(diff: number, scale: number): number {
  const safeScale = Math.max(0.0001, scale);
  return clamp(diff / safeScale, -1, 1);
}

function resultToPoints(result: RecentResult): number {
  if (result === "W") {
    return 3;
  }

  if (result === "D") {
    return 1;
  }

  return 0;
}

function resolveRecentFormPoints(
  recentResults: RecentResult[] | null | undefined,
  globalGroupPoints: number,
): number {
  if (Array.isArray(recentResults) && recentResults.length === 3) {
    return recentResults.reduce((total, result) => total + resultToPoints(result), 0);
  }

  // Fallback when data is insufficient: approximate recent form from global group points.
  return clamp(globalGroupPoints, 0, 9);
}

function toPercentagesWithExactHundred(home: number, draw: number, away: number): PredictionProbabilities {
  const raw = [home * 100, draw * 100, away * 100];
  const floors = raw.map((value) => Math.floor(value));
  const fractions = raw.map((value, index) => ({
    index,
    fraction: value - floors[index],
  }));

  let missingPoints = 100 - floors.reduce((sum, value) => sum + value, 0);

  fractions.sort((a, b) => b.fraction - a.fraction);

  let pointer = 0;
  while (missingPoints > 0) {
    floors[fractions[pointer % fractions.length].index] += 1;
    pointer += 1;
    missingPoints -= 1;
  }

  return {
    homeWin: floors[0],
    draw: floors[1],
    awayWin: floors[2],
  };
}

export function predictMatch(
  homeTeam: TeamStatsInput,
  awayTeam: TeamStatsInput,
  tournamentAverages: TournamentAverages,
): PredictionProbabilities {
  const homeGoalsFor = resolveMetric(homeTeam.goalsForPerMatch, tournamentAverages.goalsForPerMatch);
  const awayGoalsFor = resolveMetric(awayTeam.goalsForPerMatch, tournamentAverages.goalsForPerMatch);

  const homeGoalsAgainst = resolveMetric(homeTeam.goalsAgainstPerMatch, tournamentAverages.goalsAgainstPerMatch);
  const awayGoalsAgainst = resolveMetric(awayTeam.goalsAgainstPerMatch, tournamentAverages.goalsAgainstPerMatch);

  const homeGroupPoints = resolveMetric(homeTeam.groupPoints, tournamentAverages.groupPoints);
  const awayGroupPoints = resolveMetric(awayTeam.groupPoints, tournamentAverages.groupPoints);

  const homeFormPoints = resolveRecentFormPoints(homeTeam.last3Results, tournamentAverages.groupPoints);
  const awayFormPoints = resolveRecentFormPoints(awayTeam.last3Results, tournamentAverages.groupPoints);

  const attackComponent = normalizeDiff(
    homeGoalsFor - awayGoalsFor,
    Math.max(1, tournamentAverages.goalsForPerMatch * 2),
  );

  const defenseComponent = normalizeDiff(
    awayGoalsAgainst - homeGoalsAgainst,
    Math.max(1, tournamentAverages.goalsAgainstPerMatch * 2),
  );

  const pointsComponent = normalizeDiff(
    homeGroupPoints - awayGroupPoints,
    Math.max(3, tournamentAverages.groupPoints),
  );

  const formComponent = normalizeDiff(homeFormPoints - awayFormPoints, 9);

  const weightedAdvantage =
    FACTOR_WEIGHTS.attack * attackComponent +
    FACTOR_WEIGHTS.defense * defenseComponent +
    FACTOR_WEIGHTS.points * pointsComponent +
    FACTOR_WEIGHTS.form * formComponent;

  const drawProbability = clamp(0.32 - Math.abs(weightedAdvantage) * 0.18, 0.16, 0.34);
  const nonDrawProbability = 1 - drawProbability;

  const homeWinProbability = clamp(
    nonDrawProbability * (0.5 + weightedAdvantage / 2),
    0.01,
    0.98,
  );
  const awayWinProbability = clamp(1 - drawProbability - homeWinProbability, 0.01, 0.98);

  const normalizedTotal = homeWinProbability + drawProbability + awayWinProbability;

  const normalizedHome = homeWinProbability / normalizedTotal;
  const normalizedDraw = drawProbability / normalizedTotal;
  const normalizedAway = awayWinProbability / normalizedTotal;

  return toPercentagesWithExactHundred(normalizedHome, normalizedDraw, normalizedAway);
}
