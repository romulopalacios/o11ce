import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import EmptyState from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import * as statsService from "@/server/services/football/statsService";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Estadisticas | O11CE",
    description: "Profundidad estadistica del torneo con tendencias y equipos destacados.",
  };
}

function formatPercent(value: number, total: number): string {
  if (total <= 0) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

async function StatsContent() {
  const [goalsPerMatch, topScoringTeams, resultsDistribution, unbeatenTeams] = await Promise.all([
    statsService.getGoalsPerMatch(),
    statsService.getTopScoringTeams(8),
    statsService.getResultsDistribution(),
    statsService.getUnbeatenTeams(),
  ]);

  const maxGoals = Math.max(topScoringTeams[0]?.goals ?? 0, 1);
  const matchesPlayed = resultsDistribution.total;
  const totalGoals = topScoringTeams.reduce((sum, team) => sum + team.goals, 0);
  const hasTopScorersData = topScoringTeams.length > 0 && topScoringTeams.some((team) => team.goals > 0);

  const distributionItems = [
    {
      value: resultsDistribution.homeWins,
      label: "victoria local",
    },
    {
      value: resultsDistribution.draws,
      label: "empate",
    },
    {
      value: resultsDistribution.awayWins,
      label: "victoria visitante",
    },
  ];
  const highestDistribution = Math.max(...distributionItems.map((item) => item.value), 0);

  return (
    <>
      <SectionHeader title="estadisticas" />

      {matchesPlayed === 0 && (
        <div className="mb-6 rounded-2xl border border-neutral-800 border-l-2 border-l-ac bg-neutral-900/50 px-6 py-4">
          <p className="font-mono text-label tracking-[.08em] text-t2">
            las estadísticas se actualizarán en tiempo real cuando comiencen los partidos · 11 jun 2026
          </p>
        </div>
      )}

      <section className="mb-9">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
            <div className="font-mono text-[18px] font-medium text-[var(--text)]">{goalsPerMatch}</div>
            <div className="mt-[2px] font-mono text-[10px] text-[var(--text3)]">goles por partido</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
            <div className="font-mono text-[18px] font-medium text-[var(--text)]">{totalGoals}</div>
            <div className="mt-[2px] font-mono text-[10px] text-[var(--text3)]">goles totales</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
            <div className="font-mono text-[18px] font-medium text-[var(--text)]">{matchesPlayed}</div>
            <div className="mt-[2px] font-mono text-[10px] text-[var(--text3)]">partidos jugados</div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader title="más goleadores" />
        {hasTopScorersData ? (
          <div className="stagger space-y-2 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-5">
            {topScoringTeams.map((team) => (
              <Link
                key={team.teamId}
                href={`/teams/${team.teamId}`}
                className="group flex items-center gap-3 py-2.5 transition-colors hover:text-[var(--accent)]"
              >
                <img
                  src={team.crest ?? "/placeholder-crest.svg"}
                  alt={team.name || "Equipo"}
                  className="h-5 w-5 rounded-[3px]"
                  loading="lazy"
                />
                <span className="flex-1 truncate text-[12px] text-[var(--text)]">{team.name}</span>
                <div className="h-[3px] w-[80px] overflow-hidden rounded-full bg-[var(--border2)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${(team.goals / maxGoals) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-[12px] text-[var(--text2)]">{team.goals}</span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            message="sin goles registrados aún"
            description="el primer partido es el 11 jun · México vs Sudáfrica"
          />
        )}
      </section>

      {resultsDistribution.total > 0 && (
        <section className="mb-10">
          <SectionHeader title="tipo de resultado" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {distributionItems.map((item) => {
              const isHighest = item.value === highestDistribution;

              return (
                <div key={item.label} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
                  <div className={`font-mono text-[32px] font-medium ${isHighest ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>
                    {item.value}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text3)] uppercase">{item.label}</div>
                  <div className="font-mono text-[11px] text-[var(--text2)]">
                    {formatPercent(item.value, resultsDistribution.total)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {matchesPlayed > 0 && (
        <section>
          <SectionHeader title="aún invictos" />

          {unbeatenTeams.length > 0 ? (
            <div className="flex flex-wrap gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
              {unbeatenTeams.map((team) => (
                <Link key={team.id} href={`/teams/${team.id}`} className="w-[84px]">
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={team.crest ?? "/placeholder-crest.svg"}
                      alt={team.name || "Equipo"}
                      className="w-8 h-8 rounded-[6px] border border-[var(--border)]"
                      loading="lazy"
                    />
                    <span className="text-center text-[11px] text-[var(--text2)] truncate w-full">{team.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="sin equipos invictos" description="todos los equipos han perdido al menos una vez" />
          )}
        </section>
      )}
    </>
  );
}

export default function StatsPage() {
  return (
    <>
      <PageHero title="ESTADISTICAS" subtitle="métricas de rendimiento" meta="Mundial 2026" />

      <PageWrapper>
        <section className="section-shell border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6">
          <SectionHeader title="estadisticas" />

          <p className="mb-6 text-[13px] text-[var(--text2)]">
            Indicadores clave del torneo para lectura rapida y comparacion entre selecciones.
          </p>

            <Suspense
              fallback={(
                <>
                  <div className="mb-6 grid grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-[100px] animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/70" />
                    ))}
                  </div>
                  <Skeleton count={5} height="h-[56px]" />
                </>
              )}
            >
              <StatsContent />
            </Suspense>
        </section>
      </PageWrapper>
    </>
  );
}
