import BracketMatch from "@/components/bracket/BracketMatch";
import BaseSkeleton from "@/components/ui/base/BaseSkeleton";
import { formatStageName } from "@/server/services/football/bracketService";
import type { FootballMatch } from "@/server/services/football/types";

interface BracketColumnProps {
  stage: string;
  matches: FootballMatch[];
}

export function BracketColumn({ stage, matches }: BracketColumnProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="mb-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] tracking-[.1em] uppercase text-[var(--text3)]">
        {formatStageName(stage)}
      </span>

      <div className="flex flex-col gap-4 sm:gap-5 stagger">
        {matches.length > 0
          ? matches.map((match) => (
              <BracketMatch key={match.id} match={match} />
            ))
          : Array.from({ length: getExpectedMatches(stage) }).map((_, index) => (
              <BaseSkeleton
                key={index}
                className="h-[88px] w-[150px] border-dashed border-white/15 bg-white/[0.02] sm:w-[180px]"
              />
            ))}
      </div>
    </div>
  );
}

function getExpectedMatches(stage: string): number {
  const map: Record<string, number> = {
    ROUND_OF_16: 8,
    QUARTER_FINALS: 4,
    SEMI_FINALS: 2,
    THIRD_PLACE: 1,
    FINAL: 1,
  };

  return map[stage] ?? 1;
}
