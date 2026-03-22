import db from "@/server/db";

type MatchResult = "HOME_WIN" | "DRAW" | "AWAY_WIN";

function getActualResult(homeScore: number, awayScore: number): MatchResult {
  if (homeScore > awayScore) {
    return "HOME_WIN";
  }

  if (homeScore < awayScore) {
    return "AWAY_WIN";
  }

  return "DRAW";
}

function predictionWasCorrect(
  prediction: { homeWinProb: number; drawProb: number; awayWinProb: number },
  actualResult: string,
): boolean {
  const probs = [
    { result: "HOME_WIN", prob: prediction.homeWinProb },
    { result: "DRAW", prob: prediction.drawProb },
    { result: "AWAY_WIN", prob: prediction.awayWinProb },
  ];

  const predicted = probs.sort((a, b) => b.prob - a.prob)[0]?.result;
  return predicted === actualResult;
}

export async function evaluatePendingPredictions(): Promise<void> {
  const predictions = await db.prediction.findMany({
    where: { wasCorrect: null },
    include: { match: true },
  });

  for (const prediction of predictions) {
    if (prediction.match.status !== "FINISHED") {
      continue;
    }

    if (prediction.match.homeScore == null || prediction.match.awayScore == null) {
      continue;
    }

    const actualResult = getActualResult(prediction.match.homeScore, prediction.match.awayScore);
    const wasCorrect = predictionWasCorrect(prediction, actualResult);

    await db.prediction.update({
      where: { id: prediction.id },
      data: { wasCorrect, actualResult },
    });
  }
}

export interface AccuracySummary {
  correct: number;
  total: number;
  accuracy: number;
}

export async function getAccuracySummary(): Promise<AccuracySummary | null> {
  const evaluated = await db.prediction.findMany({
    where: { wasCorrect: { not: null } },
  });

  if (!evaluated.length) {
    return null;
  }

  const correct = evaluated.filter((prediction) => prediction.wasCorrect).length;
  const total = evaluated.length;
  const accuracy = Math.round((correct / total) * 100);

  return { correct, total, accuracy };
}
