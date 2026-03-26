import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { MatchListClient } from "@/components/match/MatchListClient";
import EmptyState from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import * as matchService from "@/server/services/football/matchService";

export const revalidate = 300;

interface MatchesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const statusOptions = ["SCHEDULED", "IN_PLAY", "FINISHED"] as const;

type MatchStatusFilter = (typeof statusOptions)[number];

function parseStatusFilter(value: string | string[] | undefined): MatchStatusFilter | undefined {
  if (!value || Array.isArray(value)) {
    return undefined;
  }

  if (statusOptions.includes(value as MatchStatusFilter)) {
    return value as MatchStatusFilter;
  }

  return undefined;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Partidos | O11CE",
    description: "Lista de partidos del Mundial con filtros por estado.",
  };
}

interface MatchesContentProps {
  status?: MatchStatusFilter;
}

async function MatchesContent({ status }: MatchesContentProps) {
  const allMatches = await matchService.getAll({ status });

  return (
    <>
      <section className="mb-4 sm:mb-5 flex flex-wrap gap-2">
        <Link
          href="/matches"
          className={cn(
            "font-mono text-[10px] tracking-[.1em] uppercase px-3 py-1.5",
            "rounded-full border border-neutral-800 bg-neutral-900/50 transition-colors duration-100",
            !status
              ? "border-accent text-accent bg-accent/10"
              : "text-text2 hover:border-neutral-700 hover:text-text",
          )}
        >
          todos
        </Link>
        {[
          { value: "SCHEDULED", label: "programados" },
          { value: "IN_PLAY", label: "en vivo" },
          { value: "FINISHED", label: "finalizados" },
        ].map(({ value, label }) => (
          <Link
            key={value}
            href={`/matches?status=${value}`}
            className={cn(
              "font-mono text-[10px] tracking-[.1em] uppercase px-3 py-1.5",
              "rounded-full border border-neutral-800 bg-neutral-900/50 transition-colors duration-100",
              status === value
                ? "border-accent text-accent bg-accent/10"
                : "text-text2 hover:border-neutral-700 hover:text-text",
            )}
          >
            {label}
          </Link>
        ))}
      </section>

      {allMatches.length === 0 ? (
        <EmptyState
          message="sin partidos para este filtro"
          description="No hay partidos para el filtro seleccionado."
        />
      ) : (
        <MatchListClient matches={allMatches} />
      )}
    </>
  );
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedStatus = parseStatusFilter(resolvedSearchParams?.status);

  return (
    <>
      <PageHero title="PARTIDOS" subtitle="fixture completo" meta="Mundial 2026" />

      <PageWrapper>
        <div className="section-shell border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6">

          <Suspense fallback={<Skeleton count={6} height="h-[82px]" />}>
            <MatchesContent status={selectedStatus} />
          </Suspense>
        </div>
      </PageWrapper>
    </>
  );
}
