"use client";

import { useCallback } from "react";
import { useSearch } from "@/hooks/useSearch";
import { SearchInput } from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import MatchCard from "@/components/match/MatchCard";
import type { FootballMatch } from "@/server/services/football/types";

interface MatchListClientProps {
  matches: FootballMatch[];
}

function getTeamAliases(name: string | undefined, tla: string | undefined): string[] {
  const normalizedTla = (tla ?? "").toUpperCase();
  const aliases: string[] = [];

  if (normalizedTla === "BRA") {
    aliases.push("brasil", "brazil");
  }
  if (normalizedTla === "ARG") {
    aliases.push("argentina");
  }
  if (name) {
    aliases.push(name);
  }
  if (tla) {
    aliases.push(tla);
  }

  return aliases;
}

export function MatchListClient({ matches }: MatchListClientProps) {
  const searchFields = useCallback((match: FootballMatch): string[] => {
    return [
      ...getTeamAliases(match.homeTeam.name, match.homeTeam.tla),
      ...getTeamAliases(match.awayTeam.name, match.awayTeam.tla),
      match.stage ?? "",
      match.group ?? "",
    ];
  }, []);

  const { query, setQuery, filtered, hasQuery } = useSearch(matches, searchFields);

  return (
    <div className="space-y-8">
      <div className="relative z-10 w-full max-w-md">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar equipo, grupo o fase..."
          resultCount={hasQuery ? filtered.length : undefined}
          
        />
      </div>

      {filtered.length === 0 && hasQuery ? (
        <EmptyState message={`Sin resultados para "${query}"`} className="mt-8 border-dashed border-zinc-800 bg-zinc-900/20" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

