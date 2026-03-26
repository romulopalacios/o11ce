import Link from "next/link";
import { Suspense } from "react";

import { StatBar } from "@/components/compare/StatBar";
import MatchCard from "@/components/match/MatchCard";
import EmptyState from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {allTeams.map((team) => (
        <Link
          key={team.id}
          href={!selectedAId ? `/compare?a=${team.id}` : `/compare?a=${selectedAId}&b=${team.id}`}
          className={cn(
            "flex items-center gap-3 rounded-2xl border px-4 py-3",
            "bg-white/[0.03] transition-all duration-150 hover:border-white/20 hover:bg-white/[0.05]",
            String(team.id) === String(selectedAId) ? "border-ac/50 bg-ac/10" : "border-white/10",
          )}
        >
          <img
            src={team.crest ?? "/placeholder-crest.svg"}
            alt={team.name}
            className="h-7 w-7 rounded-[6px] border border-white/10"
            loading="lazy"
          />
          <span className="truncate text-[12px] text-[var(--text)]">{team.name}</span>
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
          className="font-mono text-[10px] tracking-[.1em] uppercase text-[var(--text3)] transition-colors duration-150 hover:text-[var(--text2)]"
        >
          ← cambiar equipos
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center gap-2 min-w-0">
            <img
              src={teamA.crest ?? "/placeholder-crest.svg"}
              alt={teamA.name}
              className="h-10 w-10 rounded-[8px] border border-white/10 sm:h-12 sm:w-12"
              loading="lazy"
            />
            <span className="max-w-[120px] truncate text-center text-[12px] font-medium text-[var(--text)] sm:text-[13px]">{teamA.name}</span>
            {teamA.position ? (
              <span className="text-center font-mono text-[10px] tracking-[.08em] text-[var(--text3)]">
                {teamA.position.group} · #{teamA.position.position}
              </span>
            ) : null}
          </div>

          <span className="font-mono text-[10px] tracking-[.12em] uppercase text-[var(--text3)] sm:text-[11px]">vs</span>

          <div className="flex flex-col items-center gap-2 min-w-0">
            <img
              src={teamB.crest ?? "/placeholder-crest.svg"}
              alt={teamB.name}
              className="h-10 w-10 rounded-[8px] border border-white/10 sm:h-12 sm:w-12"
              loading="lazy"
            />
            <span className="max-w-[120px] truncate text-center text-[12px] font-medium text-[var(--text)] sm:text-[13px]">{teamB.name}</span>
            {teamB.position ? (
              <span className="text-center font-mono text-[10px] tracking-[.08em] text-[var(--text3)]">
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

      <div className="border-t border-white/10 pt-5 text-center">
        <Link
          href="/compare"
          className="font-mono text-[10px] tracking-[.1em] uppercase text-[var(--text3)] transition-colors duration-150 hover:text-ac"
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
    <>
      <PageHero title="COMPARAR" subtitle="comparador de selecciones" meta="Mundial 2026" />

      <PageWrapper>
        <section className="section-shell border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6">
          <SectionHeader title="comparar" />

          <p className="mb-6 text-[13px] text-[var(--text2)]">
            Selecciona dos equipos para ver comparativa de rendimiento y enfrentamientos directos.
          </p>

        {!teamAId || !teamBId ? (
          <>
            <Suspense
              fallback={(
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="h-[74px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
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
                  <Skeleton height="h-[108px]" />
                  <Skeleton height="h-[24px]" className="self-center" />
                  <Skeleton height="h-[108px]" />
                </div>
                <Skeleton count={5} height="h-[52px]" />
              </>
            )}
          >
            <CompareContent teamAId={teamAId} teamBId={teamBId} />
          </Suspense>
        )}
        </section>
      </PageWrapper>
    </>
  );
}
