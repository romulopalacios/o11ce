"use client";

import Link from "next/link";
import { useCallback } from "react";

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
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="buscar selección o país..."
        resultCount={hasQuery ? filtered.length : undefined}
      />

      {filtered.length === 0 && hasQuery ? (
        <EmptyState message={`sin resultados para "${query}"`} className="mt-3" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger">
          {filtered.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5",
                "bg-s1 border border-b1 rounded-[10px]",
                "hover:border-b2 hover:bg-s2 transition-colors duration-150",
              )}
            >
              <img
                src={team.crest ?? "/placeholder-crest.svg"}
                alt={team.name}
                className="w-8 h-8 rounded-[6px] border border-b1 shrink-0"
                loading="lazy"
              />
              <div className="min-w-0">
                <div className="text-[13px] text-t1 truncate">
                  {team.name}
                </div>
                <div className="font-mono text-[10px] text-t3 mt-[2px] tracking-[.08em] truncate uppercase">
                  {team.area?.name ?? team.tla}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
