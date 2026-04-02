"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { DashboardGroup } from "@/lib/mock/tournamentDashboard";

interface GroupsCarouselProps {
  groups: DashboardGroup[];
}

export default function GroupsCarousel({ groups }: GroupsCarouselProps) {
  if (!groups || groups.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-4 -mx-2 px-2 before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-16 before:bg-gradient-to-r before:from-zinc-950 before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-16 after:bg-gradient-to-l after:from-zinc-950 after:to-transparent">
      <div className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]">
        {[...groups, ...groups].map((group, index) => (
          <section
            key={`${group.name}-${index}`}
            className="w-[280px] md:w-[320px] shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]" 
            aria-labelledby={`group-${group.name}-${index}`}
          >
            <header className="mb-4 flex items-center justify-between border-b border-zinc-800/60 pb-2">
              <h3
                id={`group-${group.name}-${index}`}
                className="font-display text-sm font-bold uppercase tracking-wider text-zinc-100"
              >
              {group.name}
            </h3>
            <Link
              href={`/groups/${group.name.replace(' ', '_').toUpperCase()}`}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Ver detalles
            </Link>
          </header>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60 text-xs font-medium text-zinc-500">
                <th className="pb-2 font-normal">Equipo</th>
                <th className="pb-2 text-center w-8 font-normal" title="Partidos Jugados">
                  PJ
                </th>
                <th className="pb-2 text-center w-8 font-normal" title="Diferencia de Goles">
                  DG
                </th>
                <th className="pb-2 text-right w-8 font-normal" title="Puntos">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {group.standings.slice(0, 4).map((team, idx) => (
                <tr
                  key={team.teamId}
                  className={cn(
                    "group/row relative transition-colors hover:bg-zinc-800/20",
                    idx < 2 ? "font-semibold text-zinc-100" : "text-zinc-400"
                  )}
                >
                  <td className="py-2.5 max-w-[120px]">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-[10px]",
                          idx < 2 ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-zinc-800 text-zinc-500"
                        )}
                      >
                        {team.position}
                      </span>
                      {team.crestUrl && <img src={team.crestUrl} alt={team.teamName} className="h-4 w-4 shrink-0 object-contain rounded-sm" />}
                      <span className="truncate">{team.teamName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-center text-zinc-500">{team.played}</td>
                  <td className="py-2.5 text-center text-zinc-500">{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                  <td className={cn("py-2.5 text-right", idx < 2 ? "text-blue-400 font-bold" : "text-zinc-500")}>
                    {team.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        ))}
      </div>
    </div>
  );
}

