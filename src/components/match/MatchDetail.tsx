import EventTimeline from "@/components/match/EventTimeline";
import { MatchCountdown } from "@/components/match/MatchCountdown";
import ScoreBoard from "@/components/match/ScoreBoard";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { MatchDetailResponse } from "@/server/services/football/types";
import { Target, Info, Timer, BrainCircuit, BarChart3 } from "lucide-react";

export interface MatchPredictionSummary {
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
    <section className="stack-5">
      <div className="relative z-10 w-full mb-8">
        <ScoreBoard match={match} hasTimeline={!isPre} />
        {isPre ? (
          <div className="relative mx-auto mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-6 shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Timer className="w-4 h-4 text-emerald-400" />
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                El partido comienza en
              </p>
            </div>
            <div className="relative z-20">
              <MatchCountdown utcDate={match.utcDate} />
            </div>
          </div>
        ) : (
          <EventTimeline match={match} />
        )}
      </div>

<div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
        <span className="block font-display text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 relative z-10">
          <Info className="inline-block w-4 h-4 mr-2 -mt-0.5" /> INFORMACIÓN GENERAL
        </span>
        <div className="grid grid-cols-2 gap-4 relative z-10 sm:grid-cols-4">
          <div className="rounded-xl bg-zinc-800/40 p-3 border border-zinc-700/50">
            <span className="block font-mono text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-1">estado</span>  
            <p className="text-sm font-semibold text-zinc-100">{formatStatus(match.status)}</p>
          </div>
          <div className="rounded-xl bg-zinc-800/40 p-3 border border-zinc-700/50">
            <span className="block font-mono text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-1">fase</span>    
            <p className="text-sm font-semibold text-zinc-100">{formatStage(match.stage)}</p>
          </div>
          <div className="rounded-xl bg-zinc-800/40 p-3 border border-zinc-700/50">
            <span className="block font-mono text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-1">grupo</span>   
            <p className="text-sm font-semibold text-zinc-100">{match.group ?? "—"}</p>
          </div>
          <div className="rounded-xl bg-zinc-800/40 p-3 border border-zinc-700/50">
            <span className="block font-mono text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-1">fecha</span>   
            <p className="text-sm font-semibold text-zinc-100">
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
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          <span className="mb-4 block font-display text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 relative z-10">
            <Target className="inline-block w-4 h-4 mr-2 -mt-0.5" /> GOLES
          </span>
          <div className="relative z-10">
            {match.goals.length === 0 ? (
              <EmptyState message="sin goles registrados" />
            ) : (
              <ul className="space-y-3">
                {match.goals.map((goal, index) => (
                  <li
                    key={`${goal.team.id}-${goal.minute}-${index}`}
                    className="flex items-center gap-4 rounded-xl bg-zinc-800/30 px-4 py-3 border border-zinc-800/60 transition-colors hover:bg-zinc-800/50"
                  >
                    <span className="w-10 shrink-0 text-center font-mono text-sm font-bold text-emerald-400">
                      {formatMinute(goal.minute, goal.injuryTime)}
                    </span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22c55e15] text-[16px] text-emerald-400 border border-emerald-500/20">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-zinc-100 truncate">{goal.scorer.name}</span>
                      <span className="block text-xs font-medium text-zinc-400 truncate">{goal.team.name}</span>
                    </div>
                    {goal.type !== "REGULAR" && (
                      <span className="shrink-0 rounded bg-zinc-800 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-700">
                        {goal.type === "PENALTY" ? "pen" : "p.p."}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {(isLive || isPost) && (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-5 py-4">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-zinc-600">
            tarjetas y sustituciones no disponibles
          </p>
        </div>
      )}

      {isPre && prediction && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none" />
          <span className="block font-display text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 relative z-10 mb-4">
            <BrainCircuit className="inline-block w-4 h-4 mr-2 -mt-0.5" /> PREDICCIÓN
          </span>

          <div className="relative z-10 rounded-xl bg-zinc-800/40 p-4 border border-zinc-700/50">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Resultado probable</p>
            <p className="text-sm font-semibold text-emerald-400">{getPredictedResultLabel(prediction)}</p>
          </div>
        </div>
      )}

      {isPost && prediction && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none" />
          <span className="block font-display text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 relative z-10 mb-4">
            <BarChart3 className="inline-block w-4 h-4 mr-2 -mt-0.5" /> PREDICCIÓN VS RESULTADO
          </span>

          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap rounded-xl bg-zinc-800/40 p-4 border border-zinc-700/50">   
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">MÁQUINA</p>
              <p className="text-sm font-semibold text-emerald-400">{getPredictedResultLabel(prediction)}</p>
            </div>

            {prediction.wasCorrect !== null && (
              <span
                className={cn(
                  "font-mono text-[11px] font-bold uppercase tracking-widest border",
                  "px-4 py-1.5 rounded-full shrink-0 shadow-sm",
                  prediction.wasCorrect
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-red-500/10 text-red-500 border-red-500/30",
                )}
              >
                {prediction.wasCorrect ? "ACERTÓ" : "FALLÓ"}
              </span>
            )}

            <div className="text-right">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">REALIDAD</p>
              <p className="text-sm font-semibold text-zinc-100">
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

