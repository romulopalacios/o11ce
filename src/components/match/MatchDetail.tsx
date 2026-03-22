import EventTimeline from "@/components/match/EventTimeline";
import ScoreBoard from "@/components/match/ScoreBoard";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { MatchDetailResponse } from "@/server/services/football/types";

interface MatchPredictionSummary {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  wasCorrect: boolean | null;
  actualResult: string | null;
}

interface MatchDetailProps {
  match: MatchDetailResponse;
  prediction?: MatchPredictionSummary | null;
}

function formatMinute(minute: number, injuryTime?: number | null): string {
  if (injuryTime && injuryTime > 0) {
    return `${minute}+${injuryTime}'`;
  }

  return `${minute}'`;
}

function getPredictedResultLabel(prediction: MatchPredictionSummary): string {
  const probs = [
    { result: "HOME_WIN", prob: prediction.homeWinProb },
    { result: "DRAW", prob: prediction.drawProb },
    { result: "AWAY_WIN", prob: prediction.awayWinProb },
  ].sort((a, b) => b.prob - a.prob);

  const top = probs[0];
  if (!top) {
    return "Sin predicción";
  }

  if (top.result === "HOME_WIN") {
    return `Victoria local · ${Math.round(top.prob)}%`;
  }

  if (top.result === "AWAY_WIN") {
    return `Victoria visitante · ${Math.round(top.prob)}%`;
  }

  return `Empate · ${Math.round(top.prob)}%`;
}

function getActualResultLabel(actualResult: string | null): string {
  if (actualResult === "HOME_WIN") {
    return "Victoria local";
  }

  if (actualResult === "AWAY_WIN") {
    return "Victoria visitante";
  }

  if (actualResult === "DRAW") {
    return "Empate";
  }

  return "Sin resultado";
}

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    SCHEDULED: "Programado",
    IN_PLAY: "En juego",
    PAUSED: "Pausado",
    FINISHED: "Finalizado",
    POSTPONED: "Pospuesto",
    CANCELLED: "Cancelado",
  };

  return map[status] ?? status;
}

function formatStage(stage: string): string {
  const map: Record<string, string> = {
    GROUP_STAGE: "Fase de grupos",
    ROUND_OF_16: "Octavos de final",
    QUARTER_FINALS: "Cuartos de final",
    SEMI_FINALS: "Semifinales",
    THIRD_PLACE: "Tercer lugar",
    FINAL: "Final",
  };

  return map[stage] ?? stage;
}

export default function MatchDetail({ match, prediction }: MatchDetailProps) {
  return (
    <section className="space-y-4">
      <div>
        <ScoreBoard match={match} hasTimeline />
        <EventTimeline match={match} />
      </div>

      <div className="bg-surface border border-border rounded-md px-4 py-3 space-y-2">
        <span className="font-mono text-label tracking-[.1em] uppercase text-text3 block">
          información general
        </span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>
            <span className="font-mono text-label text-text3">estado</span>
            <p className="text-body text-text mt-[2px]">{formatStatus(match.status)}</p>
          </div>
          <div>
            <span className="font-mono text-label text-text3">fase</span>
            <p className="text-body text-text mt-[2px]">{formatStage(match.stage)}</p>
          </div>
          <div>
            <span className="font-mono text-label text-text3">grupo</span>
            <p className="text-body text-text mt-[2px]">{match.group ?? "—"}</p>
          </div>
          <div>
            <span className="font-mono text-label text-text3">fecha</span>
            <p className="text-body text-text mt-[2px]">
              {new Intl.DateTimeFormat("es", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(match.utcDate))}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-md px-4 py-3">
        <span className="font-mono text-label tracking-[.1em] uppercase text-text3 block mb-3">
          goles
        </span>
        {match.goals.length === 0 ? (
          <EmptyState message="sin goles registrados" />
        ) : (
          <ul className="space-y-2">
            {match.goals.map((goal, index) => (
              <li
                key={`${goal.team.id}-${goal.minute}-${index}`}
                className="flex items-center gap-3 py-1 border-b border-border last:border-0"
              >
                <span className="font-mono text-label text-text3 w-7 text-right shrink-0">
                  {formatMinute(goal.minute, goal.injuryTime)}
                </span>
                <span className="w-4 h-4 rounded-[3px] shrink-0 bg-[#22c55e15] text-[#22c55e] flex items-center justify-center text-[11px]">
                  ⚽
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-body text-text">{goal.scorer.name}</span>
                  <span className="text-caption text-text2 ml-2">{goal.team.name}</span>
                </div>
                {goal.type !== "REGULAR" && (
                  <span className="font-mono text-label text-text3 shrink-0">
                    {goal.type === "PENALTY" ? "pen." : "p.p."}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border border-border border-dashed rounded-md px-4 py-3">
        <p className="font-mono text-label text-text3 text-center">
          tarjetas y sustituciones no disponibles en el plan actual
        </p>
      </div>

      {match.status === "FINISHED" && prediction && (
        <div className="bg-surface border border-border rounded-md px-4 py-3">
          <span className="font-mono text-label tracking-[.1em] uppercase text-text3 block mb-3">
            predicción vs resultado
          </span>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-mono text-label text-text3 mb-1">predicción</p>
              <p className="font-mono text-caption text-text2">{getPredictedResultLabel(prediction)}</p>
            </div>

            {prediction.wasCorrect !== null && (
              <span
                className={cn(
                  "font-mono text-label font-medium",
                  "px-3 py-1 rounded-full shrink-0",
                  prediction.wasCorrect
                    ? "bg-win/10 text-win"
                    : "bg-loss/10 text-loss",
                )}
              >
                {prediction.wasCorrect ? "acertó" : "falló"}
              </span>
            )}

            <div className="text-right">
              <p className="font-mono text-label text-text3 mb-1">resultado</p>
              <p className="font-mono text-caption text-text2">
                {getActualResultLabel(prediction.actualResult)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}