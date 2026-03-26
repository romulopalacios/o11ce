"use client";

import { motion } from "framer-motion";
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
      <motion.article
        className={cn(
          "panel-compact",
          "cursor-pointer rounded-2xl border border-[var(--b2)]/60 px-4 py-4",
          "bg-[linear-gradient(125deg,rgba(58,168,255,.12),rgba(255,77,66,.08)_42%,rgba(10,18,34,.74))]",
          "transition-all duration-200 group",
          "hover:border-[var(--brand-cyan)]/80",
          match.status === "IN_PLAY" && "border-live/70 shadow-[0_0_0_1px_rgba(255,45,85,0.12)]",
          "animate-fade-up [animation-delay:var(--card-delay)]",
        )}
        style={style}
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
      >
        {/* Linea superior */}
        <div className="flex items-center justify-between mb-3">
            <span className="truncate pr-3 font-mono text-[10px] tracking-[.11em] uppercase text-[var(--text2)]">
            {match.stage ? fmtStage(match.stage) : ""}
            {match.group ? ` · ${match.group}` : ""}
          </span>
          {match.status === "IN_PLAY" ? (
            <LiveBadge minute={match.minute} />
          ) : match.status === "FINISHED" ? (
            <span className="font-mono text-[9px] text-neutral-500 tracking-[.12em] uppercase">FIN</span>
          ) : (
            <span className="font-mono text-[10px] text-neutral-400 tracking-[.08em]">{fmtTime(match.utcDate)}</span>
          )}
        </div>

        {/* Equipos y score */}
        <div className="grid grid-cols-[1fr_82px_1fr] items-center gap-2.5">
          {/* Local */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={match.homeTeam.crest ?? "/placeholder-crest.svg"}
              alt=""
              className="h-[26px] w-[26px] rounded-[7px] shrink-0 border border-white/10 bg-s3/70 p-[2px] object-contain"
              loading="lazy"
            />
            <span
              className={cn(
                "text-[13px] truncate max-w-[102px] sm:max-w-[130px]",
                homeWon && "text-t1 font-semibold",
                awayWon && "text-neutral-500",
                match.status === "SCHEDULED" && "text-neutral-200",
                !homeWon && !awayWon && match.status === "FINISHED" && "text-t1",
              )}
            >
              {match.homeTeam.name ?? "Por confirmar"}
            </span>
          </div>

          {/* Score */}
          {match.status === "SCHEDULED" ? (
            <div className="flex flex-col items-center gap-[2px]">
              <span className="font-display text-[18px] text-t1 leading-none">
                {new Intl.DateTimeFormat("es", {
                  day: "numeric",
                }).format(new Date(match.utcDate))}
              </span>
              <span className="font-mono text-label text-neutral-500 uppercase tracking-[.08em]">
                {new Intl.DateTimeFormat("es", {
                  month: "short",
                }).format(new Date(match.utcDate))}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-[4px]">
              <span className={cn("font-display text-[28px] leading-none", homeWon ? "text-t1" : "text-t3")}>
                {homeScore ?? 0}
              </span>
              <span className="font-mono text-[10px] text-neutral-600">-</span>
              <span className={cn("font-display text-[28px] leading-none", awayWon ? "text-t1" : "text-t3")}>
                {awayScore ?? 0}
              </span>
            </div>
          )}

          {/* Visitante */}
          <div className="flex items-center gap-2.5 min-w-0 flex-row-reverse text-right">
            <img
              src={match.awayTeam.crest ?? "/placeholder-crest.svg"}
              alt=""
              className="h-[26px] w-[26px] rounded-[7px] shrink-0 border border-white/10 bg-s3/70 p-[2px] object-contain"
              loading="lazy"
            />
            <span
              className={cn(
                "text-[13px] truncate max-w-[102px] sm:max-w-[130px]",
                awayWon && "text-t1 font-semibold",
                homeWon && "text-neutral-500",
                match.status === "SCHEDULED" && "text-neutral-200",
                !homeWon && !awayWon && match.status === "FINISHED" && "text-t1",
              )}
            >
              {match.awayTeam.name ?? "Por confirmar"}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
