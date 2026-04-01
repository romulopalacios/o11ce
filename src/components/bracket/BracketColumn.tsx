import { BracketMatch } from "@/components/bracket/BracketMatch";
import type { FootballMatch as BracketMatchType } from "@/server/services/football/types";

interface BracketColumnProps {
  stage: string;
  matches: BracketMatchType[];
}

export function BracketColumn({ stage, matches }: BracketColumnProps) {
  const STAGE_LABELS: Record<string, string> = {
    ROUND_OF_16: "OCTAVOS",
    QUARTER_FINALS: "CUARTOS",
    SEMI_FINALS: "SEMIFINALES",
    FINAL: "GRAN FINAL",
    THIRD_PLACE: "TERCER PUESTO",
  };

  const label = STAGE_LABELS[stage] ?? stage;

  return (
    <div className="flex flex-col gap-6 relative">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500 text-center">
        {label}
      </h3>

      <div className="flex flex-1 flex-col justify-around gap-6">
        {matches.map((match) => (
          <BracketMatch key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

