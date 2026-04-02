import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
          className="group flex flex-col items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/50 shadow-xl overflow-hidden transition-all group-hover:border-zinc-600 group-hover:bg-zinc-800/50 sm:h-32 sm:w-32">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <img
              src={match.homeTeam.crest ?? "/placeholder-crest.svg"}
              alt={match.homeTeam.name ?? ""}
              className="h-16 w-16 object-contain drop-shadow-md sm:h-20 sm:w-20 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-center font-display text-sm font-bold uppercase tracking-wider text-zinc-100 transition-colors group-hover:text-emerald-400 sm:text-base">
              {match.homeTeam.name ?? "—"}
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500 sm:text-sm">
              {match.homeTeam.tla ?? "—"}
            </span>
          </div>
        </Link>

        {/* Score */}
        <div className="flex flex-col items-center gap-1 px-2">
          {showScore ? (
            <div className="flex items-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={match.score.fullTime.home ?? 0}
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={cn(
                    "font-display leading-none tracking-[.02em]",
                    "text-[52px] sm:text-[64px]",
                    homeWon ? "text-zinc-50" : "text-zinc-500",
                  )}
                >
                  {match.score.fullTime.home ?? 0}
                </motion.span>
              </AnimatePresence>

              <span className="mx-2 font-display text-[28px] text-zinc-700">–</span>
              
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={match.score.fullTime.away ?? 0}
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={cn(
                    "font-display leading-none tracking-[.02em]",
                    "text-[52px] sm:text-[64px]",
                    awayWon ? "text-zinc-50" : "text-zinc-500",
                  )}
                >
                  {match.score.fullTime.away ?? 0}
                </motion.span>
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span className="bg-gradient-to-b from-zinc-400 to-zinc-600 bg-clip-text font-display text-[48px] font-black leading-none tracking-widest text-transparent sm:text-[64px] drop-shadow-sm">
                VS
              </span>
              <span className="font-mono text-[11px] font-semibold tracking-widest uppercase text-zinc-500">
                {formatMatchTime(match.utcDate)}
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
          className="group flex flex-col items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/50 shadow-xl overflow-hidden transition-all group-hover:border-zinc-600 group-hover:bg-zinc-800/50 sm:h-32 sm:w-32">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <img
              src={match.awayTeam.crest ?? "/placeholder-crest.svg"}
              alt={match.awayTeam.name ?? ""}
              className="h-16 w-16 object-contain drop-shadow-md sm:h-20 sm:w-20 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-center font-display text-sm font-bold uppercase tracking-wider text-zinc-100 transition-colors group-hover:text-emerald-400 sm:text-base">
              {match.awayTeam.name ?? "—"}
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500 sm:text-sm">
              {match.awayTeam.tla ?? "—"}
            </span>
          </div>
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


