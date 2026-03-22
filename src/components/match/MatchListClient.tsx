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
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="buscar equipo, grupo o fase..."
        resultCount={hasQuery ? filtered.length : undefined}
      />

      {filtered.length === 0 && hasQuery ? (
        <EmptyState message={`sin resultados para "${query}"`} className="mt-3" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 stagger">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
