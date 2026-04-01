import Link from "next/link";
import { cn } from "@/lib/utils";
import type { StandingGroup, StandingTableRow } from "@/server/services/football/types";

interface StandingsTableProps {
  standings: StandingGroup[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {standings.map((group, groupIndex) => {
        const groupName = group.group ?? `Grupo ${groupIndex + 1}`;
        // Normalize group name string by removing underscore when it comes from API
        const displayGroup = groupName.replace("_", " ");

        return (
          <section 
            key={`${groupName}-${groupIndex}`}
            className="flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40"
          >
            <header className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/80 px-5 py-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-100">
                {displayGroup}
              </h3>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/60 bg-zinc-900/20 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="px-5 py-3 font-medium w-8 text-center">#</th>
                    <th className="px-2 py-3 font-medium">Equipo</th>
                    <th className="px-2 py-3 text-center w-12 font-medium" title="Partidos Jugados">PJ</th>
                    <th className="px-2 py-3 text-center w-12 font-medium" title="Diferencia de Goles">DG</th>
                    <th className="px-5 py-3 text-right w-16 font-medium" title="Puntos">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {group.table?.map((entry: StandingTableRow, i: number) => {
                    const qualifies = i < 2; // Assuming top 2 qualify

                    return (
                      <tr
                        key={entry.team.id}
                        className={cn(
                          "group/row relative transition-colors hover:bg-zinc-800/30",
                          qualifies ? "text-zinc-100" : "text-zinc-400"
                        )}
                      >
                        <td className="px-5 py-3 text-center relative">
                          {qualifies && (
                            <div className="absolute left-0 top-0 h-full w-[3px] bg-blue-500" />
                          )}
                          <span className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold mx-auto",
                            qualifies ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-zinc-500"
                          )}>
                            {i + 1}
                          </span>
                        </td>
                        
                        <td className="px-2 py-3">
                          <Link
                            href={`/teams/${entry.team.id}`}
                            className={cn(
                              "block truncate font-medium hover:text-blue-400 transition-colors",
                              qualifies ? "text-zinc-100" : "text-zinc-300"
                            )}
                          >
                            {entry.team.name ?? "—"}
                          </Link>
                        </td>

                        <td className="px-2 py-3 text-center text-zinc-500">
                          {entry.playedGames}
                        </td>
                        
                        <td className="px-2 py-3 text-center text-zinc-500">
                          {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                        </td>

                        <td className={cn(
                          "px-5 py-3 text-right font-bold text-base",
                          qualifies ? "text-blue-400" : "text-zinc-300"
                        )}>
                          {entry.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}

