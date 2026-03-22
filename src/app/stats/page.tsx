import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import EmptyState from "@/components/ui/EmptyState";
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

  const maxGoals = topScoringTeams[0]?.goals ?? 1;
  const matchesPlayed = resultsDistribution.total;
  const totalGoals = topScoringTeams.reduce((sum, team) => sum + team.goals, 0);

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

      <section className="mb-8">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="font-mono text-[18px] font-medium text-[var(--text)]">{goalsPerMatch}</div>
            <div className="mt-[2px] font-mono text-[10px] text-[var(--text3)]">goles por partido</div>
          </div>
          <div>
            <div className="font-mono text-[18px] font-medium text-[var(--text)]">{totalGoals}</div>
            <div className="mt-[2px] font-mono text-[10px] text-[var(--text3)]">goles totales</div>
          </div>
          <div>
            <div className="font-mono text-[18px] font-medium text-[var(--text)]">{matchesPlayed}</div>
            <div className="mt-[2px] font-mono text-[10px] text-[var(--text3)]">partidos jugados</div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <SectionHeader title="más goleadores" />
        <div className="stagger">
          {topScoringTeams.map((team) => (
            <Link
              key={team.teamId}
              href={`/teams/${team.teamId}`}
              className="flex items-center gap-3 py-2 hover:text-[var(--accent)] transition-colors group"
            >
              <img
                src={team.crest ?? "/placeholder-crest.svg"}
                alt={team.name || "Equipo"}
                className="w-5 h-5 rounded-[3px]"
                loading="lazy"
              />
              <span className="text-[12px] text-[var(--text)] flex-1 truncate">{team.name}</span>
              <div className="h-[3px] bg-[var(--border2)] rounded-full overflow-hidden w-[80px]">
                <div
                  className="h-full bg-[var(--accent)] rounded-full"
                  style={{ width: `${(team.goals / maxGoals) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[12px] text-[var(--text2)] w-6 text-right">{team.goals}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionHeader title="tipo de resultado" />
        <div className="grid grid-cols-3 gap-4">
          {distributionItems.map((item) => {
            const isHighest = item.value === highestDistribution;

            return (
              <div key={item.label}>
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

      <section>
        <SectionHeader title="aún invictos" />

        {unbeatenTeams.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {unbeatenTeams.map((team) => (
              <Link key={team.id} href={`/teams/${team.id}`} className="w-[72px]">
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
    </>
  );
}

export default function StatsPage() {
  return (
    <PageWrapper>
      <SectionHeader title="estadisticas" />

      <p className="mb-5 text-[13px] text-t2">
        Indicadores clave del torneo para lectura rapida y comparacion entre selecciones.
      </p>

        <Suspense
          fallback={(
            <>
              <div className="grid grid-cols-3 gap-[1px] bg-b1 border border-b1 rounded-lg overflow-hidden mb-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-s1 h-[88px] animate-pulse" />
                ))}
              </div>
              <Skeleton count={5} height="h-[44px]" />
            </>
          )}
        >
          <StatsContent />
        </Suspense>
    </PageWrapper>
  );
}
