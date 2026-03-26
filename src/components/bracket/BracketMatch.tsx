import Link from "next/link";

import { LiveBadge } from "@/components/match/LiveBadge";
import { cn } from "@/lib/utils";
import type { FootballMatch } from "@/server/services/football/types";

interface BracketMatchProps {
  match: FootballMatch;
}

export default function BracketMatch({ match }: BracketMatchProps) {
  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;

  const isHomeWinner = match.status === "FINISHED" && (homeScore ?? 0) > (awayScore ?? 0);
  const isAwayWinner = match.status === "FINISHED" && (awayScore ?? 0) > (homeScore ?? 0);

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="w-[180px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors hover:border-white/20">
        <div className={cn("flex items-center justify-between border-b border-white/10 px-3 py-[9px]", isHomeWinner && "bg-white/[0.04]")}>
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={match.homeTeam.crest ?? "/placeholder-crest.svg"}
              alt={match.homeTeam.name ?? "Por definir"}
              className="w-4 h-4 rounded-[3px] shrink-0 object-contain"
              loading="lazy"
            />
            <span
              className={cn(
                "font-sans text-[12px] truncate",
                isHomeWinner ? "font-semibold text-[var(--text)]" : "text-[var(--text2)]",
              )}
            >
              {match.homeTeam.name && match.homeTeam.name !== "Por confirmar" ? (
                match.homeTeam.name
              ) : (
                <span className="inline-block h-[8px] w-16 rounded-full bg-white/10" />
              )}
            </span>
          </div>
          {match.status !== "SCHEDULED" && (
            <span className={cn("ml-2 shrink-0 font-display text-[17px] leading-none", isHomeWinner ? "text-[var(--text)]" : "text-[var(--text3)]")}>
              {homeScore ?? "-"}
            </span>
          )}
        </div>

        <div className={cn("flex items-center justify-between px-3 py-[9px]", isAwayWinner && "bg-white/[0.04]")}>
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={match.awayTeam.crest ?? "/placeholder-crest.svg"}
              alt={match.awayTeam.name ?? "Por definir"}
              className="w-4 h-4 rounded-[3px] shrink-0 object-contain"
              loading="lazy"
            />
            <span
              className={cn(
                "font-sans text-[12px] truncate",
                isAwayWinner ? "font-semibold text-[var(--text)]" : "text-[var(--text2)]",
              )}
            >
              {match.awayTeam.name && match.awayTeam.name !== "Por confirmar" ? (
                match.awayTeam.name
              ) : (
                <span className="inline-block h-[8px] w-16 rounded-full bg-white/10" />
              )}
            </span>
          </div>
          {match.status !== "SCHEDULED" && (
            <span className={cn("ml-2 shrink-0 font-display text-[17px] leading-none", isAwayWinner ? "text-[var(--text)]" : "text-[var(--text3)]")}>
              {awayScore ?? "-"}
            </span>
          )}
        </div>

        <div className="border-t border-white/10 bg-white/[0.03] px-3 py-[5px]">
          {match.status === "IN_PLAY" ? (
            <LiveBadge minute={match.minute} />
          ) : match.status === "FINISHED" ? (
            <span className="font-mono text-label text-[var(--text3)]">FIN</span>
          ) : (
            <span className="font-mono text-label text-[var(--text3)]">
              {new Intl.DateTimeFormat("es", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(match.utcDate))}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
