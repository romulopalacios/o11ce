import EventTimeline from "@/components/match/EventTimeline";
import { MatchCountdown } from "@/components/match/MatchCountdown";
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
  const isPre = ["TIMED", "SCHEDULED"].includes(match.status);
  const isLive = ["IN_PLAY", "PAUSED"].includes(match.status);
  const isPost = match.status === "FINISHED";

  return (
    <section className="space-y-5">
      <div>
        <ScoreBoard match={match} hasTimeline={!isPre} />
        {isPre ? (
          <div className="mt-1 rounded-b-2xl border border-t-0 border-white/10 bg-white/[0.03] px-5 py-4 text-center">
            <p className="mb-2 font-mono text-label tracking-[.1em] text-[var(--text3)]">el partido comienza en</p>
            <MatchCountdown utcDate={match.utcDate} />
          </div>
        ) : (
          <EventTimeline match={match} />
        )}
      </div>

      <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5 sm:py-5">
        <span className="block font-mono text-label tracking-[.1em] uppercase text-[var(--text3)]">
          información general
        </span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>
            <span className="font-mono text-label text-[var(--text3)]">estado</span>
            <p className="mt-[2px] text-body text-[var(--text)]">{formatStatus(match.status)}</p>
          </div>
          <div>
            <span className="font-mono text-label text-[var(--text3)]">fase</span>
            <p className="mt-[2px] text-body text-[var(--text)]">{formatStage(match.stage)}</p>
          </div>
          <div>
            <span className="font-mono text-label text-[var(--text3)]">grupo</span>
            <p className="mt-[2px] text-body text-[var(--text)]">{match.group ?? "—"}</p>
          </div>
          <div>
            <span className="font-mono text-label text-[var(--text3)]">fecha</span>
            <p className="mt-[2px] text-body text-[var(--text)]">
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

      {!isPre && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5 sm:py-5">
          <span className="mb-3 block font-mono text-label tracking-[.1em] uppercase text-[var(--text3)]">
            goles
          </span>
          {match.goals.length === 0 ? (
            <EmptyState message="sin goles registrados" />
          ) : (
            <ul className="space-y-2">
              {match.goals.map((goal, index) => (
                <li
                  key={`${goal.team.id}-${goal.minute}-${index}`}
                  className="flex items-center gap-3 border-b border-white/10 py-1.5 last:border-0"
                >
                  <span className="w-7 shrink-0 text-right font-mono text-label text-[var(--text3)]">
                    {formatMinute(goal.minute, goal.injuryTime)}
                  </span>
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#22c55e15] text-[11px] text-[#22c55e]">
                    ⚽
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-body text-[var(--text)]">{goal.scorer.name}</span>
                    <span className="ml-2 text-caption text-[var(--text2)]">{goal.team.name}</span>
                  </div>
                  {goal.type !== "REGULAR" && (
                    <span className="shrink-0 font-mono text-label text-[var(--text3)]">
                      {goal.type === "PENALTY" ? "pen." : "p.p."}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {(isLive || isPost) && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-3">
          <p className="text-center font-mono text-label text-[var(--text3)]">
            tarjetas y sustituciones no disponibles en el plan actual
          </p>
        </div>
      )}

      {isPre && prediction && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5 sm:py-5">
          <span className="mb-3 block font-mono text-label tracking-[.1em] uppercase text-[var(--text3)]">
            predicción
          </span>

          <div>
            <p className="mb-1 font-mono text-label text-[var(--text3)]">predicción</p>
            <p className="font-mono text-caption text-[var(--text2)]">{getPredictedResultLabel(prediction)}</p>
          </div>
        </div>
      )}

      {isPost && prediction && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5 sm:py-5">
          <span className="mb-3 block font-mono text-label tracking-[.1em] uppercase text-[var(--text3)]">
            predicción vs resultado
          </span>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="mb-1 font-mono text-label text-[var(--text3)]">predicción</p>
              <p className="font-mono text-caption text-[var(--text2)]">{getPredictedResultLabel(prediction)}</p>
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
              <p className="mb-1 font-mono text-label text-[var(--text3)]">resultado</p>
              <p className="font-mono text-caption text-[var(--text2)]">
                {getActualResultLabel(prediction.actualResult)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}