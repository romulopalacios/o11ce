import Link from "next/link";
import { cn } from "@/lib/utils";
import type { StandingGroup } from "@/server/services/football/types";

interface StandingsTableProps {
  standings: StandingGroup[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="space-y-5 stagger">
      {standings.map((group, groupIndex) => (
        <section key={`${group.group ?? "GROUP"}-${groupIndex}`}>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[.08em] text-[var(--text3)]">
            {group.group ?? `Grupo ${groupIndex + 1}`}
          </p>

          <div className="bg-surface border border-border rounded-md overflow-hidden">
            <div className="grid grid-cols-[20px_1fr_28px_28px_36px] gap-[6px] px-[14px] py-[8px] border-b border-border">
              {["", "equipo", "PJ", "DG", "PTS"].map((h, i) => (
                <span
                  key={i}
                  className={cn(
                    "font-mono text-label text-text3 tracking-[.1em] uppercase",
                    i > 1 && "text-center",
                  )}
                >
                  {h}
                </span>
              ))}
            </div>

            {group.table.map((entry, i) => {
              const qualifies = i < 2;

              return (
                <div
                  key={entry.team.id}
                  className="grid grid-cols-[20px_1fr_28px_28px_36px] gap-[6px] px-[14px] py-[9px] items-center relative hover:bg-surface2 transition-colors"
                >
                  {qualifies && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-win rounded-r-[2px]" />
                  )}

                  <span className={cn("font-display text-[17px] leading-none", qualifies ? "text-text3" : "text-text3 opacity-50")}>
                    {i + 1}
                  </span>

                  <Link
                    href={`/teams/${entry.team.id}`}
                    className={cn(
                      "font-sans text-body truncate",
                      "hover:text-accent transition-colors duration-100",
                      qualifies ? "text-text font-medium" : "text-text2",
                    )}
                  >
                    {entry.team.name ?? "—"}
                  </Link>

                  <span className="font-mono text-[11px] text-text2 text-center">{entry.playedGames}</span>
                  <span className="font-mono text-[11px] text-text2 text-center">
                    {entry.goalDifference > 0 ? "+" : ""}
                    {entry.goalDifference}
                  </span>

                  <span
                    className={cn(
                      "text-center leading-none",
                      qualifies ? "font-display text-[18px] text-accent" : "font-mono text-[11px] text-text2",
                    )}
                  >
                    {entry.points}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
