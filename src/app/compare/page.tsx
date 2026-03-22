import Link from "next/link";
import { Suspense } from "react";

import { StatBar } from "@/components/compare/StatBar";
import MatchCard from "@/components/match/MatchCard";
import EmptyState from "@/components/ui/EmptyState";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
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

interface TeamsGridProps {
  selectedAId: number | null;
}

async function TeamsGrid({ selectedAId }: TeamsGridProps) {
  const allTeams = await teamService.getAll();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {allTeams.map((team) => (
        <Link
          key={team.id}
          href={!selectedAId ? `/compare?a=${team.id}` : `/compare?a=${selectedAId}&b=${team.id}`}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border bg-s1",
            "transition-all duration-150 hover:border-b2 hover:bg-s2",
            String(team.id) === String(selectedAId) ? "border-ac/50 bg-ac/10" : "border-b1",
          )}
        >
          <img
            src={team.crest ?? "/placeholder-crest.svg"}
            alt={team.name}
            className="w-6 h-6 rounded-[4px] border border-b1"
            loading="lazy"
          />
          <span className="text-[12px] text-t1 truncate">{team.name}</span>
        </Link>
      ))}
    </div>
  );
}

interface CompareContentProps {
  teamAId: number;
  teamBId: number;
}

async function CompareContent({ teamAId, teamBId }: CompareContentProps) {
  const data = await compareService.compareTeams(teamAId, teamBId);
  const { teamA, teamB, h2h } = data;

  return (
    <>
      <div className="mb-4">
        <Link
          href="/compare"
          className="font-mono text-[10px] tracking-[.1em] uppercase text-t3 transition-colors duration-150 hover:text-t2"
        >
          ← cambiar equipos
        </Link>
      </div>

      <div className="panel-compact p-3 sm:p-4 mb-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center gap-2 min-w-0">
            <img
              src={teamA.crest ?? "/placeholder-crest.svg"}
              alt={teamA.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-[8px] border border-b1"
              loading="lazy"
            />
            <span className="text-[12px] sm:text-[13px] font-medium text-center truncate max-w-[120px]">{teamA.name}</span>
            {teamA.position ? (
              <span className="font-mono text-[10px] text-t3 text-center tracking-[.08em]">
                {teamA.position.group} · #{teamA.position.position}
              </span>
            ) : null}
          </div>

          <span className="font-mono text-[10px] sm:text-[11px] tracking-[.12em] uppercase text-t3">vs</span>

          <div className="flex flex-col items-center gap-2 min-w-0">
            <img
              src={teamB.crest ?? "/placeholder-crest.svg"}
              alt={teamB.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-[8px] border border-b1"
              loading="lazy"
            />
            <span className="text-[12px] sm:text-[13px] font-medium text-center truncate max-w-[120px]">{teamB.name}</span>
            {teamB.position ? (
              <span className="font-mono text-[10px] text-t3 text-center tracking-[.08em]">
                {teamB.position.group} · #{teamB.position.position}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <SectionHeader title="estadisticas en el torneo" className="mb-4" />

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

      <div className="mb-8">
        <SectionHeader title="enfrentamientos directos" className="mb-3" />

        {h2h.length > 0 ? (
          h2h.map((match, index) => (
            <MatchCard key={match.id} match={match} animationDelayMs={index * 60} />
          ))
        ) : (
          <EmptyState
            message="sin enfrentamientos directos"
            description="no se han enfrentado en este torneo"
            className="border-dashed"
          />
        )}
      </div>

      <div className="text-center pt-4 border-t border-b1">
        <Link
          href="/compare"
          className="font-mono text-[10px] tracking-[.1em] uppercase text-t2 hover:text-ac transition-colors duration-150"
        >
          comparar otros equipos →
        </Link>
      </div>
    </>
  );
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const teamAId = parseTeamId(resolvedSearchParams?.a);
  const teamBId = parseTeamId(resolvedSearchParams?.b);

  return (
    <PageWrapper>
      <SectionHeader title="comparar" />

      <p className="mb-4 text-[13px] text-t2">
        Selecciona dos equipos para ver comparativa de rendimiento y enfrentamientos directos.
      </p>

        {!teamAId || !teamBId ? (
          <>
            <Suspense
              fallback={(
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-[6px]">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="h-[68px] bg-s1 rounded-lg border border-b1 animate-pulse" />
                  ))}
                </div>
              )}
            >
              <TeamsGrid selectedAId={teamAId} />
            </Suspense>
          </>
        ) : (
          <Suspense
            fallback={(
              <>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Skeleton height="h-[96px]" />
                  <Skeleton height="h-[24px]" className="self-center" />
                  <Skeleton height="h-[96px]" />
                </div>
                <Skeleton count={5} height="h-[44px]" />
              </>
            )}
          >
            <CompareContent teamAId={teamAId} teamBId={teamBId} />
          </Suspense>
        )}
    </PageWrapper>
  );
}
