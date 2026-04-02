"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { MatchCardScore, MatchCardStatus } from "@/lib/mock/tournamentDashboard";
import type { FootballMatch } from "@/server/services/football/types";

interface MatchCardProps {
  match?: FootballMatch;
  id?: number;
  homeTeam?: string;
  homeTeamCrest?: string;
  awayTeam?: string;
  awayTeamCrest?: string;
  status?: MatchCardStatus;
  score?: MatchCardScore | null;
  kickoffAt?: string;
  minute?: number;
  group?: string;
  href?: string;
  animationDelayMs?: number;
}


interface NormalizedMatchCardData {
  id: number;
  homeTeam: string;
  homeTeamCrest?: string;
  awayTeam: string;
  awayTeamCrest?: string;
  status: MatchCardStatus;
  score: MatchCardScore | null;
  kickoffAt: string;
  minute?: number;
  group?: string;
  href: string;
}

function normalizeMatchData(props: MatchCardProps): NormalizedMatchCardData {
  if (props.match) {
    let status: MatchCardStatus = "scheduled";
    if (props.match.status === "IN_PLAY" || props.match.status === "PAUSED") {
      status = "live";
    } else if (props.match.status === "FINISHED") {
      status = "finished";
    }

    let score: MatchCardScore | null = null;
    if (props.match.score?.fullTime?.home !== null && props.match.score?.fullTime?.away !== null) {
      score = {
        home: props.match.score.fullTime.home as number,
        away: props.match.score.fullTime.away as number,
      };
    }

    return {
      id: props.match.id,
      homeTeam: props.match.homeTeam.name ?? "TBD",
      homeTeamCrest: props.match.homeTeam.crest,
      awayTeam: props.match.awayTeam.name ?? "TBD",
      awayTeamCrest: props.match.awayTeam.crest,
      status,
      score,
      kickoffAt: props.match.utcDate,
      minute: props.match.minute ?? undefined,
      group: props.match.group ?? props.match.stage ?? undefined,
      href: `/matches/${props.match.id}`,
    };
  }

  return {
    id: props.id ?? 0,
    homeTeam: props.homeTeam ?? "TBD",
    homeTeamCrest: props.homeTeamCrest,
    awayTeam: props.awayTeam ?? "TBD",
    awayTeamCrest: props.awayTeamCrest,
    status: props.status ?? "scheduled",
    score: props.score ?? null,
    kickoffAt: props.kickoffAt ?? new Date().toISOString(),
    minute: props.minute,
    group: props.group,
    href: props.href ?? `/matches/${props.id ?? 0}`,
  };
}

function formatKickoff(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function MatchCard(props: MatchCardProps) {
  const data = normalizeMatchData(props);

  const statusLabel =
    data.status === "live"
      ? "En vivo"
      : data.status === "finished"
        ? "Finalizado"
        : "Programado";

  const isLive = data.status === "live";
  const MotionLink = motion.create(Link);

  return (
    <MotionLink
      layout
      href={data.href}
      data-testid={`match-card-${data.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        layout: { type: "spring", stiffness: 400, damping: 30 },
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay: Math.min((props.animationDelayMs || 0) / 1000, 0.5) 
      }}
      className={cn(
        "group relative block overflow-hidden rounded-xl border p-4 transition-colors",
        isLive ? "bg-zinc-900 border-zinc-700 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]"        
      )}
      aria-label={`Abrir partido ${data.homeTeam} vs ${data.awayTeam}`}
    >
      {isLive && (
        <motion.div 
           initial={{ height: 0 }}
           animate={{ height: "100%" }}
           className="absolute left-0 top-0 w-1 bg-emerald-500 rounded-l-xl" 
        />
      )}
      <article className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">{data.group ?? "Fase eliminatoria"}</span>
          </div>

          {isLive ? (
            <span
              data-testid={`match-live-badge-${data.id}`}
              className="inline-flex items-center gap-2 rounded px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 live-pulse shrink-0" />
              {data.minute ? `${data.minute}'` : "LIVE"}
            </span>
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {data.status === "finished" ? statusLabel : formatKickoff(data.kickoffAt)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="min-w-0 flex items-center justify-end gap-2 text-right">
            <p className="truncate text-sm font-bold text-zinc-100">{data.homeTeam}</p>
            {data.homeTeamCrest && (
               <img src={data.homeTeamCrest} alt={data.homeTeam} className="w-5 h-5 shrink-0 object-contain" loading="lazy" />
            )}
          </div>

          <div
            data-testid={`match-card-score-${data.id}`}
            className={cn(
              "flex min-w-[64px] items-center justify-center rounded-lg px-3 py-1.5 font-display text-xl leading-none font-bold",
              isLive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-950 text-zinc-100 border border-zinc-800"
            )}
          >
            {data.score ? `${data.score.home} - ${data.score.away}` : "vs"}
          </div>

          <div className="min-w-0 flex items-center justify-start gap-2 text-left">
            {data.awayTeamCrest && (
               <img src={data.awayTeamCrest} alt={data.awayTeam} className="w-5 h-5 shrink-0 object-contain" loading="lazy" />
            )}
            <p className="truncate text-sm font-bold text-zinc-100">{data.awayTeam}</p>
          </div>
        </div>
      </article>
    </MotionLink>
  );
}
