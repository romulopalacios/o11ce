import Link from "next/link";
import { cn } from "@/lib/utils";
import type { FootballMatch as BracketMatchType } from "@/server/services/football/types";

export function BracketMatch({ match }: { match: BracketMatchType }) {
  const isFinished = match.status === "FINISHED";
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isScheduled = match.status === "TIMED" || match.status === "SCHEDULED";

  return (
    <Link
      href={`/matches/${match.id}`}
      className={cn(
        "group relative flex w-[240px] shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-800 transition-all duration-200",
        isLive ? "bg-zinc-900 border-zinc-700 hover:border-emerald-500/50" : "bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700"
      )}
    >
      {isLive && (
        <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 rounded-l-xl"></div>
      )}

      <div className="flex flex-col divide-y divide-zinc-800/60 p-1">
        {[{ team: match.homeTeam, score: match.score?.fullTime?.home, type: 'home' }, { team: match.awayTeam, score: match.score?.fullTime?.away, type: 'away' }].map(({ team, score, type }) => {
          const isWinner = isFinished && match.score?.winner === (type.toUpperCase());
          
          return (
            <div key={type} className="flex h-10 items-center justify-between px-3 relative">
              <div className="flex items-center gap-2 truncate">
                <span className={cn(
                  "truncate text-sm transition-colors",
                  isWinner ? "font-bold text-zinc-100" : "font-medium text-zinc-400 group-hover:text-zinc-300"
                )}>
                  {team.name ?? "Por Definir"}
                </span>
              </div>
              <span className={cn(
                "font-display text-sm",
                isWinner ? "font-bold text-zinc-100" : "font-medium text-zinc-500"
              )}>
                {score ?? "-"}
              </span>
            </div>
          );
        })}
      </div>
      
      {isLive && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 live-pulse"></span>
        </div>
      )}
    </Link>
  );
}

