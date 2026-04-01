import { cn } from "@/lib/utils";
import type { Scorer } from "@/server/services/football/types";

interface TopScorersProps {
  scorers: Scorer[];
}

export default function TopScorers({ scorers }: TopScorersProps) {
  if (!scorers || scorers.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500">
        No hay datos de goleadores disponibles.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <th className="px-6 py-4 font-medium w-16 text-center">#</th>
            <th className="px-6 py-4 font-medium">Jugador</th>
            <th className="px-6 py-4 font-medium hidden sm:table-cell">Selección</th>
            <th className="px-6 py-4 font-medium text-right">Goles</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/40">
          {scorers.map((scorer, index) => {
            const isTop = index === 0;
            return (
              <tr
                key={`${scorer.player.name}-${index}`}
                className="group transition-colors hover:bg-zinc-800/30"
              >
                <td className="px-6 py-4 text-center">
                  <span className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md font-bold mx-auto text-xs",
                    isTop ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-zinc-500 bg-zinc-800/30"
                  )}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-zinc-100 flex items-center gap-3">
                  <span className="truncate">{scorer.player.name}</span>
                </td>
                <td className="px-6 py-4 text-zinc-400 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    {scorer.team.tla && (
                      <span className="rounded bg-zinc-800/50 px-2 py-0.5 text-[10px] font-bold text-zinc-500">
                        {scorer.team.tla}
                      </span>
                    )}
                    <span className="truncate">{scorer.team.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={cn(
                    "font-display font-bold text-lg",
                    isTop ? "text-purple-400" : "text-zinc-300"
                  )}>
                    {scorer.goals}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
