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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {filtered.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5",
                "rounded-2xl border border-[var(--b2)]/55",
                "bg-[linear-gradient(126deg,rgba(58,168,255,.11),rgba(255,77,66,.08)_46%,rgba(8,16,31,.74))]",
                "transition-colors duration-150 hover:border-[var(--brand-cyan)]/75",
              )}
            >
              <img
                src={team.crest ?? "/placeholder-crest.svg"}
                alt={team.name}
                className="h-9 w-9 shrink-0 rounded-[8px] border border-[var(--b2)]/55"
                loading="lazy"
              />
              <div className="min-w-0">
                <div className="truncate text-[14px] font-medium text-[var(--text)]">
                  {team.name}
                </div>
                <div className="mt-[2px] truncate font-mono text-[10px] tracking-[.08em] uppercase text-[var(--text3)]">
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
