import Link from "next/link";
import { cn } from "@/lib/utils";
import type { StandingGroup } from "@/server/services/football/types";

interface StandingsTableProps {
  standings: StandingGroup[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="space-y-8 stagger">
      {standings.map((group, groupIndex) => (
        <section key={`${group.group ?? "GROUP"}-${groupIndex}`}>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[.12em] text-neutral-400">
            {group.group ?? `Grupo ${groupIndex + 1}`}
          </p>

          <div className="rounded-3xl border border-[var(--b2)]/55 bg-[linear-gradient(125deg,rgba(58,168,255,.11),rgba(255,77,66,.08)_46%,rgba(9,16,31,.74))] p-3 sm:p-4">
            <div className="grid grid-cols-[24px_1fr_36px_42px_44px] gap-[6px] px-3 py-2.5 mb-2">
              {["", "equipo", "PJ", "DG", "PTS"].map((h, i) => (
                <span
                  key={i}
                  className={cn(
                    "font-mono text-label text-neutral-500 tracking-[.1em] uppercase",
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
                  className="relative mb-2 grid grid-cols-[24px_1fr_36px_42px_44px] items-center gap-[6px] rounded-2xl border border-[var(--b1)]/35 bg-[var(--brand-navy)]/55 px-3 py-2.5 transition-colors last:mb-0 hover:border-[var(--b2)]/70 hover:bg-[var(--brand-navy)]/75"
                >
                  {qualifies && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-win rounded-r-[2px]" />
                  )}

                  <span className={cn("font-display text-[17px] leading-none text-neutral-500", qualifies ? "opacity-100" : "opacity-60")}>
                    {i + 1}
                  </span>

                  <Link
                    href={`/teams/${entry.team.id}`}
                    className={cn(
                      "font-sans text-body truncate text-neutral-100 font-medium",
                      "hover:text-accent transition-colors duration-100",
                      !qualifies && "text-neutral-300",
                    )}
                  >
                    {entry.team.name ?? "—"}
                  </Link>

                  <span className="font-mono text-[11px] text-neutral-400 text-center">{entry.playedGames}</span>
                  <span className="font-mono text-[11px] text-neutral-400 text-center">
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
