"use client";

import Link from "next/link";
import { useCallback } from "react";
import { Users, LayoutGrid } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { SearchInput } from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { Team } from "@/server/services/football/types";

interface TeamListClientProps {
  teams: Team[];
}

function getTeamAliases(team: Team): string[] {
  const aliases = [
    team.name ?? "",
    team.tla ?? "",
    team.area?.name ?? "",
  ];

  if ((team.tla ?? "").toUpperCase() === "BRA") {
    aliases.push("brasil", "brazil");
  }
  if ((team.tla ?? "").toUpperCase() === "ARG") {
    aliases.push("argentina");
  }

  return aliases;
}

export function TeamListClient({ teams }: TeamListClientProps) {
  const searchFields = useCallback((team: Team): string[] => {
    return getTeamAliases(team);
  }, []);

  const { query, setQuery, filtered, hasQuery } = useSearch(teams, searchFields);

  return (
    <div className="space-y-8">
      <div className="relative z-10 w-full max-w-md">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar selección o país..."
          resultCount={hasQuery ? filtered.length : undefined}
          
        />
      </div>

      {filtered.length === 0 && hasQuery ? (
        <EmptyState message={`Sin resultados para "${query}"`} className="mt-8 border-dashed border-zinc-800 bg-zinc-900/20" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((team, idx) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5",
                "transition-all duration-300 hover:bg-zinc-900 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="relative h-14 w-14 shrink-0 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-inner group-hover:border-emerald-500/30 transition-colors">
                  <img
                    src={team.crest ?? "/placeholder-crest.svg"}
                    alt={team.name}
                    className="h-full w-full object-contain"
                    loading={idx < 8 ? "eager" : "lazy"}
                  />
                </div>
                <span className="flex h-6 items-center rounded-full bg-zinc-800/50 px-2.5 text-[10px] font-bold tracking-wider text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                  {team.tla ?? "TBD"}
                </span>
              </div>
              
              <div className="mt-auto">
                <h2 className="truncate font-display text-base font-bold text-zinc-100 group-hover:text-white">
                  {team.name}
                </h2>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                  <span className="truncate">{team.area?.name ?? "Zona desconocida"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

