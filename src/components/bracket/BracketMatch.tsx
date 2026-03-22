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
      <div className="w-[180px] bg-surface border border-border rounded-md overflow-hidden hover:border-border2 transition-colors">
        <div className={cn("flex items-center justify-between px-3 py-[9px]", "border-b border-border", isHomeWinner && "bg-surface2")}>
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
                isHomeWinner ? "text-text font-semibold" : "text-text2",
              )}
            >
              {match.homeTeam.name ?? "Por definir"}
            </span>
          </div>
          {match.status !== "SCHEDULED" && (
            <span className={cn("font-display text-[17px] leading-none ml-2 shrink-0", isHomeWinner ? "text-text" : "text-text3")}>
              {homeScore ?? "-"}
            </span>
          )}
        </div>

        <div className={cn("flex items-center justify-between px-3 py-[9px]", isAwayWinner && "bg-surface2")}>
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
                isAwayWinner ? "text-text font-semibold" : "text-text2",
              )}
            >
              {match.awayTeam.name ?? "Por definir"}
            </span>
          </div>
          {match.status !== "SCHEDULED" && (
            <span className={cn("font-display text-[17px] leading-none ml-2 shrink-0", isAwayWinner ? "text-text" : "text-text3")}>
              {awayScore ?? "-"}
            </span>
          )}
        </div>

        <div className="px-3 py-[5px] bg-bg border-t border-border">
          {match.status === "IN_PLAY" ? (
            <LiveBadge minute={match.minute} />
          ) : match.status === "FINISHED" ? (
            <span className="font-mono text-label text-text3">FIN</span>
          ) : (
            <span className="font-mono text-label text-text3">
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
