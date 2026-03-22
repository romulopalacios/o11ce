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
  const homeWon = match.status === "FINISHED" && (match.score.fullTime.home ?? 0) > (match.score.fullTime.away ?? 0);
  const awayWon = match.status === "FINISHED" && (match.score.fullTime.away ?? 0) > (match.score.fullTime.home ?? 0);

  return (
    <div
      className={cn(
        "bg-s1 border border-b1 rounded-lg overflow-hidden",
        hasTimeline && "rounded-b-none",
      )}
    >
      {/* Eyebrow */}
      <div className="px-6 pt-5 pb-0">
        <span className="font-mono text-label text-t3 tracking-[.14em] uppercase">
          {[match.stage && fmtStage(match.stage), match.group].filter(Boolean).join(" · ")}
        </span>
      </div>

      {/* Teams + score */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-6">
        {/* Home */}
        <Link
          href={`/teams/${match.homeTeam.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-[14px] border border-b2 bg-s3 overflow-hidden flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-ac/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src={match.homeTeam.crest ?? "/placeholder-crest.svg"}
              alt={match.homeTeam.name ?? ""}
              className="w-full h-full object-contain p-2"
            />
          </div>
          <span className="font-sans text-body font-semibold text-t1 uppercase tracking-[.03em] text-center group-hover:text-ac transition-colors text-[12px]">
            {match.homeTeam.name ?? "—"}
          </span>
          <span className="font-mono text-label text-t3 tracking-[.12em]">
            {match.homeTeam.tla ?? "—"}
          </span>
        </Link>

        {/* Score */}
        <div className="flex flex-col items-center gap-1 px-2">
          <div className="flex items-center">
            <span
              className={cn(
                "font-display leading-none tracking-[.02em]",
                "text-[52px] sm:text-[64px]",
                homeWon ? "text-t1" : "text-t3",
              )}
            >
              {match.status === "SCHEDULED" ? "–" : (match.score.fullTime.home ?? 0)}
            </span>
            <span className="font-display text-[28px] text-b2 mx-2">–</span>
            <span
              className={cn(
                "font-display leading-none tracking-[.02em]",
                "text-[52px] sm:text-[64px]",
                awayWon ? "text-t1" : "text-t3",
              )}
            >
              {match.status === "SCHEDULED" ? "–" : (match.score.fullTime.away ?? 0)}
            </span>
          </div>
          {match.score.halfTime?.home != null && (
            <span className="font-mono text-label text-t3">
              1T &nbsp;{match.score.halfTime.home}–{match.score.halfTime.away ?? 0}
            </span>
          )}
        </div>

        {/* Away */}
        <Link
          href={`/teams/${match.awayTeam.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-[14px] border border-b2 bg-s3 overflow-hidden flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-ac/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src={match.awayTeam.crest ?? "/placeholder-crest.svg"}
              alt={match.awayTeam.name ?? ""}
              className="w-full h-full object-contain p-2"
            />
          </div>
          <span className="font-sans text-body font-semibold text-t1 uppercase tracking-[.03em] text-center group-hover:text-ac transition-colors text-[12px]">
            {match.awayTeam.name ?? "—"}
          </span>
          <span className="font-mono text-label text-t3 tracking-[.12em]">
            {match.awayTeam.tla ?? "—"}
          </span>
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-b1 px-6 py-3 flex justify-center">
        {match.status === "IN_PLAY" ? (
          <LiveBadge minute={match.minute} />
        ) : match.status === "FINISHED" ? (
          <span className="font-mono text-label text-t3 tracking-[.1em] uppercase">
            Partido finalizado
          </span>
        ) : (
          <span className="font-mono text-label text-t2">
            {fmtTime(match.utcDate)}
          </span>
        )}
      </div>
    </div>
  );
}
