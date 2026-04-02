import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { Scale } from "lucide-react";

import { CompareSelectorClient } from "@/components/compare/CompareSelectorClient";
import { StatBar } from "@/components/compare/StatBar";
import MatchCard from "@/components/match/MatchCard";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { compareService } from "@/server/services/football/compareService";     
import * as teamService from "@/server/services/football/teamService";

export const revalidate = 300;

interface ComparePageProps {
  searchParams?: Promise<{ a?: string; b?: string }>;
}

function parseTeamId(value?: string): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

interface CompareContentProps {
  teamAId: number;
  teamBId: number;
}

async function CompareContent({ teamAId, teamBId }: CompareContentProps) {      
  const data = await compareService.compareTeams(teamAId, teamBId);
  const { teamA, teamB, h2h } = data;

  return (
    <div className="space-y-8">
      <div className="relative rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-[50px]" />
        <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/10 blur-[50px]" />

        <div className="mb-8 flex justify-center relative">
          <span className="border-b border-zinc-700/50 pb-1.5 font-mono text-[10px] tracking-[0.2em] font-bold uppercase text-zinc-500">
            Duelo Directo
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6 relative">
          {/* Team A */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 drop-shadow-md">
              <Image
                src={teamA.crest ?? "/placeholder-crest.svg"}
                alt={teamA.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 64px, 80px"
              />
            </div>
            <span className="text-center text-sm font-bold text-zinc-100 sm:text-base">{teamA.name}</span>
            {teamA.position && (
              <span className="text-center font-mono text-[11px] font-bold tracking-widest text-emerald-500 uppercase">
                {teamA.position.group} · #{teamA.position.position}
              </span>
            )}
          </div>

          <span className="font-display text-3xl font-black text-zinc-600 sm:text-4xl">VS</span>

          {/* Team B */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 drop-shadow-md">
              <Image
                src={teamB.crest ?? "/placeholder-crest.svg"}
                alt={teamB.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 64px, 80px"
              />
            </div>
            <span className="text-center text-sm font-bold text-zinc-100 sm:text-base">{teamB.name}</span>
            {teamB.position && (
              <span className="text-center font-mono text-[11px] font-bold tracking-widest text-blue-500 uppercase">
                {teamB.position.group} · #{teamB.position.position}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-zinc-100 tracking-tight text-lg mb-2">Estadísticas en el Torneo</h3>

        {/* Display Racha Reciente (Form) */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Racha de A</span>
            <div className="flex gap-1">
              {teamA.stats.form.map((res, i) => (
                <span key={i} className={cn(
                  "flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold",
                  res === "W" ? "bg-emerald-500/20 text-emerald-400" : res === "D" ? "bg-zinc-500/20 text-zinc-400" : "bg-red-500/20 text-red-400"
                )}>{res === "W" ? "V" : res === "D" ? "E" : "D"}</span>
              ))}
              {teamA.stats.form.length === 0 && <span className="text-zinc-600 text-xs italic">Sin partidos</span>}
            </div>
          </div>
          
          <span className="text-xs font-bold uppercase text-zinc-600 tracking-widest">Formato</span>

          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Racha de B</span>
            <div className="flex gap-1 flex-row-reverse">
              {teamB.stats.form.map((res, i) => (
                <span key={i} className={cn(
                  "flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold",
                  res === "W" ? "bg-blue-500/20 text-blue-400" : res === "D" ? "bg-zinc-500/20 text-zinc-400" : "bg-red-500/20 text-red-400"
                )}>{res === "W" ? "V" : res === "D" ? "E" : "D"}</span>
              ))}
              {teamB.stats.form.length === 0 && <span className="text-zinc-600 text-xs italic">Sin partidos</span>}
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <StatBar label="puntos" valueA={teamA.stats.points} valueB={teamB.stats.points} />
          <StatBar label="victorias" valueA={teamA.stats.wins} valueB={teamB.stats.wins} />
          <StatBar label="goles a favor" valueA={teamA.stats.goalsFor} valueB={teamB.stats.goalsFor} />
          <StatBar
            label="goles en contra"
            valueA={teamA.stats.goalsAgainst}
            valueB={teamB.stats.goalsAgainst}
            higherIsBetter={false}
          />
          <StatBar label="diferencia" valueA={teamA.stats.goalDiff} valueB={teamB.stats.goalDiff} />
          <StatBar label="partidos" valueA={teamA.stats.played} valueB={teamB.stats.played} />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-bold text-zinc-100 tracking-tight text-lg mb-2">Enfrentamientos Directos</h3>

        {h2h.length > 0 ? (
          <div className="grid gap-3">
            {h2h.map((match, index) => (
              <MatchCard key={match.id} match={match} animationDelayMs={index * 60} />
            ))}
          </div>
        ) : (
          <EmptyState
            message="sin enfrentamientos directos"
            className="border-dashed"
          />
        )}
      </div>
    </div>
  );
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const teamAId = parseTeamId(resolvedSearchParams?.a);
  const teamBId = parseTeamId(resolvedSearchParams?.b);
  const allTeams = await teamService.getAll();

  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
        <header className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-blue-500">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">H2H Compare Arena</h1>
            <p className="text-sm text-zinc-400">Comparativa de rendimiento y encuentros previos</p>
          </div>
        </header>

        <CompareSelectorClient teams={allTeams} selectedAId={teamAId} selectedBId={teamBId} />

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-4 md:p-6 backdrop-blur-xl">
          {!teamAId || !teamBId ? (
            <EmptyState message="Selecciona dos equipos para ver la comparativa" />
          ) : (
            <Suspense
              fallback={(
                <div className="space-y-8">
                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 flex justify-between">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-10 w-10 self-center" />
                    <Skeleton className="h-20 w-20 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton count={5} height="h-14 rounded-2xl" />
                  </div>
                </div>
              )}
            >
              <CompareContent teamAId={teamAId} teamBId={teamBId} />
            </Suspense>
          )}
        </section>
      </div>
    </main>
  );
}

