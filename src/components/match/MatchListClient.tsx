"use client";

import { useCallback, useState, useMemo } from "react";
import { useSearch } from "@/hooks/useSearch";
import { SearchInput } from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import MatchCard from "@/components/match/MatchCard";
import type { FootballMatch } from "@/server/services/football/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

type StatusFilter = "ALL" | "LIVE" | "FINISHED" | "SCHEDULED";
type StageFilter = "ALL" | "GROUP" | "KNOCKOUT";

export function MatchListClient({ matches }: MatchListClientProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [stageFilter, setStageFilter] = useState<StageFilter>("ALL");

  const searchFields = useCallback((match: FootballMatch): string[] => {        
    return [
      ...getTeamAliases(match.homeTeam.name, match.homeTeam.tla),
      ...getTeamAliases(match.awayTeam.name, match.awayTeam.tla),
      match.stage ?? "",
      match.group ?? "",
    ];
  }, []);

  const { query, setQuery, filtered: textFiltered, hasQuery } = useSearch(matches, searchFields);

  const finalFiltered = useMemo(() => {
    return textFiltered.filter((match) => {
      // Status filter
      if (statusFilter === "LIVE" && !["IN_PLAY", "PAUSED"].includes(match.status)) return false;
      if (statusFilter === "FINISHED" && match.status !== "FINISHED") return false;
      if (statusFilter === "SCHEDULED" && !["SCHEDULED", "TIMED"].includes(match.status)) return false;

      // Stage filter
      if (stageFilter === "GROUP" && !match.stage?.includes("GROUP")) return false;
      if (stageFilter === "KNOCKOUT" && match.stage?.includes("GROUP")) return false;

      return true;
    });
  }, [textFiltered, statusFilter, stageFilter]);

  return (
    <div className="space-y-6">
      {/* Filters Container */}
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative z-10 w-full max-w-md">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Buscar equipo, grupo o fase..."
            resultCount={hasQuery || statusFilter !== "ALL" || stageFilter !== "ALL" ? finalFiltered.length : undefined}
          />
        </div>

        {/* Categories/Chips */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Segmented Control */}
          <div className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-1">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === "ALL" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter("LIVE")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === "LIVE" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              En Vivo
            </button>
            <button
              onClick={() => setStatusFilter("SCHEDULED")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === "SCHEDULED" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Programados
            </button>
            <button
              onClick={() => setStatusFilter("FINISHED")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === "FINISHED" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Finalizados
            </button>
          </div>

          {/* Stage Segmented Control */}
          <div className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-1 pl-1">
            <button
              onClick={() => setStageFilter("ALL")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                stageFilter === "ALL" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Todo
            </button>
            <button
              onClick={() => setStageFilter("GROUP")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                stageFilter === "GROUP" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Fase de Grupos
            </button>
            <button
              onClick={() => setStageFilter("KNOCKOUT")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                stageFilter === "KNOCKOUT" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Eliminatorias
            </button>
          </div>
        </div>
      </div>

      {finalFiltered.length === 0 ? (
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
        >
          <EmptyState
            message="No se encontraron partidos que coincidan con los filtros actuales"
            className="mt-8 border-dashed border-zinc-800 bg-zinc-900/20"
          />
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">  
          <AnimatePresence mode="popLayout">
            {finalFiltered.map((match, i) => (
              <MatchCard key={match.id} match={match} animationDelayMs={i * 25} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

