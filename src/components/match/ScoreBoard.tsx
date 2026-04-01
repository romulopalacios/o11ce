import Link from "next/link";

import { cn } from "@/lib/utils";
import type { MatchDetailResponse } from "@/server/services/football/types";

import { LiveBadge } from "./LiveBadge";

interface ScoreBoardProps {
  match: MatchDetailResponse;
  hasTimeline?: boolean;
}

function formatMatchTime(utcDate: string): string {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(utcDate));
}

function formatStage(stage: string): string {
  const map: Record<string, string> = {
    GROUP_STAGE: "Grupos",
    ROUND_OF_16: "Octavos",
    QUARTER_FINALS: "Cuartos",
    SEMI_FINALS: "Semis",
    THIRD_PLACE: "3er lugar",
    FINAL: "Final",
  };

  return map[stage] ?? stage;
}

function fmtTime(utcDate: string) {
  return formatMatchTime(utcDate);
}

function fmtStage(stage: string) {
  return formatStage(stage);
}

export default function ScoreBoard({ match, hasTimeline = false }: ScoreBoardProps) {
  const showScore = match.status === "FINISHED" || match.status === "IN_PLAY" || match.status === "PAUSED";
  const homeWon = match.status === "FINISHED" && (match.score.fullTime.home ?? 0) > (match.score.fullTime.away ?? 0);
  const awayWon = match.status === "FINISHED" && (match.score.fullTime.away ?? 0) > (match.score.fullTime.home ?? 0);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-sm",
        hasTimeline && "rounded-b-none",
      )}
    >
      {/* Eyebrow */}
      <div className="px-6 pt-5 pb-0">
        <span className="font-mono text-label tracking-[.14em] uppercase text-zinc-500">
          {[match.stage && fmtStage(match.stage), match.group].filter(Boolean).join(" · ")}
        </span>
      </div>

      {/* Teams + score */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-6">
        {/* Home */}
        <Link
          href={`/teams/${match.homeTeam.id}`}
          onClick={(e) => e.stopPropagation()}
          className="group flex flex-col items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-[14px] border border bg-zinc-900 border-zinc-800 shadow-sm overflow-hidden flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-zinc-800 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <img
              src={match.homeTeam.crest ?? "/placeholder-crest.svg"}
              alt={match.homeTeam.name ?? ""}
              className="w-full h-full object-contain p-2"
            />
          </div>
          <span className="text-center font-sans text-body text-[12px] font-semibold uppercase tracking-[.03em] text-zinc-50 transition-colors group-hover:text-zinc-300">
            {match.homeTeam.name ?? "—"}
          </span>
          <span className="font-mono text-label tracking-[.12em] text-zinc-500">
            {match.homeTeam.tla ?? "—"}
          </span>
        </Link>

        {/* Score */}
        <div className="flex flex-col items-center gap-1 px-2">
          {showScore ? (
            <div className="flex items-center">
              <span
                className={cn(
                  "font-display leading-none tracking-[.02em]",
                  "text-[52px] sm:text-[64px]",
                  homeWon ? "text-zinc-50" : "text-zinc-500",
                )}
              >
                {match.score.fullTime.home ?? 0}
              </span>
              <span className="mx-2 font-display text-[28px] text-zinc-700">–</span>
              <span
                className={cn(
                  "font-display leading-none tracking-[.02em]",
                  "text-[52px] sm:text-[64px]",
                  awayWon ? "text-zinc-50" : "text-zinc-500",
                )}
              >
                {match.score.fullTime.away ?? 0}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="font-display text-[52px] leading-none tracking-[.04em] text-zinc-500 sm:text-[64px]">
                VS
              </span>
            </div>
          )}
          {showScore && match.score.halfTime?.home != null ? (
            <span className="font-mono text-label text-zinc-500">
              1T &nbsp;{match.score.halfTime.home}–{match.score.halfTime.away ?? 0}
            </span>
          ) : null}
        </div>

        {/* Away */}
        <Link
          href={`/teams/${match.awayTeam.id}`}
          onClick={(e) => e.stopPropagation()}
          className="group flex flex-col items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-[14px] border border bg-zinc-900 border-zinc-800 shadow-sm overflow-hidden flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-zinc-800 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <img
              src={match.awayTeam.crest ?? "/placeholder-crest.svg"}
              alt={match.awayTeam.name ?? ""}
              className="w-full h-full object-contain p-2"
            />
          </div>
          <span className="text-center font-sans text-body text-[12px] font-semibold uppercase tracking-[.03em] text-zinc-50 transition-colors group-hover:text-zinc-300">
            {match.awayTeam.name ?? "—"}
          </span>
          <span className="font-mono text-label tracking-[.12em] text-zinc-500">
            {match.awayTeam.tla ?? "—"}
          </span>
        </Link>
      </div>

      {/* Footer */}
      <div className="flex justify-center border-t border-zinc-800 px-6 py-3">
        {match.status === "IN_PLAY" ? (
          <LiveBadge minute={match.minute} />
        ) : match.status === "FINISHED" ? (
          <span className="font-mono text-label tracking-[.1em] uppercase text-zinc-500">
            Partido finalizado
          </span>
        ) : (
          <span className="font-mono text-label text-zinc-400">
            {fmtTime(match.utcDate)}
          </span>
        )}
      </div>
    </div>
  );
}

