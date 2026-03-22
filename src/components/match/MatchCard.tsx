"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

import { LiveBadge } from "@/components/match/LiveBadge";
import { cn } from "@/lib/utils";
import type { FootballMatch } from "@/server/services/football/types";

interface MatchCardProps {
  match: FootballMatch;
  animationDelayMs?: number;
}

function fmtTime(utcDate: string) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(utcDate));
}

function fmtStage(stage: string) {
  const m: Record<string, string> = {
    GROUP_STAGE: "Grupos",
    ROUND_OF_16: "Octavos",
    QUARTER_FINALS: "Cuartos",
    SEMI_FINALS: "Semis",
    THIRD_PLACE: "3er lugar",
    FINAL: "Final",
  };
  return m[stage] ?? stage;
}

export default function MatchCard({ match, animationDelayMs = 0 }: MatchCardProps) {
  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;
  const homeWon = match.status === "FINISHED" && (homeScore ?? 0) > (awayScore ?? 0);
  const awayWon = match.status === "FINISHED" && (awayScore ?? 0) > (homeScore ?? 0);

  const style = {
    "--card-delay": `${animationDelayMs}ms`,
  } as CSSProperties;

  return (
    <Link href={`/matches/${match.id}`}>
      <article
        className={cn(
          "panel-compact",
          "px-3.5 py-3 cursor-pointer",
          "transition-all duration-150 group",
          "hover:border-b2 hover:bg-s2/90 hover:-translate-y-[1px]",
          match.status === "IN_PLAY" && "border-live/70 shadow-[0_0_0_1px_rgba(255,45,85,0.12)]",
          "animate-fade-up [animation-delay:var(--card-delay)]",
        )}
        style={style}
      >
        {/* Linea superior */}
        <div className="flex items-center justify-between mb-[10px]">
          <span className="font-mono text-[10px] text-t3 tracking-[.11em] uppercase truncate pr-3">
            {match.stage ? fmtStage(match.stage) : ""}
            {match.group ? ` · ${match.group}` : ""}
          </span>
          {match.status === "IN_PLAY" ? (
            <LiveBadge minute={match.minute} />
          ) : match.status === "FINISHED" ? (
            <span className="font-mono text-[9px] text-t3 tracking-[.12em] uppercase">FIN</span>
          ) : (
            <span className="font-mono text-[10px] text-t2 tracking-[.08em]">{fmtTime(match.utcDate)}</span>
          )}
        </div>

        {/* Equipos y score */}
        <div className="grid grid-cols-[1fr_76px_1fr] items-center gap-2">
          {/* Local */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={match.homeTeam.crest ?? "/placeholder-crest.svg"}
              alt=""
              className="w-[22px] h-[22px] rounded-[5px] shrink-0 border border-b1 bg-s3 object-contain"
              loading="lazy"
            />
            <span
              className={cn(
                "text-[13px] truncate max-w-[102px] sm:max-w-[130px]",
                homeWon && "text-t1 font-semibold",
                awayWon && "text-t3",
                match.status === "SCHEDULED" && "text-t2",
                !homeWon && !awayWon && match.status === "FINISHED" && "text-t1",
              )}
            >
              {match.homeTeam.name ?? "Por confirmar"}
            </span>
          </div>

          {/* Score */}
          {match.status === "SCHEDULED" ? (
            <span className="font-mono text-[11px] text-t3 text-center tracking-[.14em]">VS</span>
          ) : (
            <div className="flex items-center justify-center gap-[4px]">
              <span className={cn("font-display text-[28px] leading-none", homeWon ? "text-t1" : "text-t3")}>
                {homeScore ?? 0}
              </span>
              <span className="font-mono text-[10px] text-t3">-</span>
              <span className={cn("font-display text-[28px] leading-none", awayWon ? "text-t1" : "text-t3")}>
                {awayScore ?? 0}
              </span>
            </div>
          )}

          {/* Visitante */}
          <div className="flex items-center gap-2 min-w-0 flex-row-reverse text-right">
            <img
              src={match.awayTeam.crest ?? "/placeholder-crest.svg"}
              alt=""
              className="w-[22px] h-[22px] rounded-[5px] shrink-0 border border-b1 bg-s3 object-contain"
              loading="lazy"
            />
            <span
              className={cn(
                "text-[13px] truncate max-w-[102px] sm:max-w-[130px]",
                awayWon && "text-t1 font-semibold",
                homeWon && "text-t3",
                match.status === "SCHEDULED" && "text-t2",
                !homeWon && !awayWon && match.status === "FINISHED" && "text-t1",
              )}
            >
              {match.awayTeam.name ?? "Por confirmar"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
