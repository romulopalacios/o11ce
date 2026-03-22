import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { MatchListClient } from "@/components/match/MatchListClient";
import EmptyState from "@/components/ui/EmptyState";
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
            "rounded-full border transition-colors duration-100",
            !status
              ? "border-accent text-accent bg-accent/10"
              : "border-border text-text2 hover:border-border2 hover:text-text",
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
              "rounded-full border transition-colors duration-100",
              status === value
                ? "border-accent text-accent bg-accent/10"
                : "border-border text-text2 hover:border-border2 hover:text-text",
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
      <div className="border-b border-b1">
        <div className="max-w-[660px] mx-auto px-6 py-7 flex items-end justify-between">
          <h1 className="font-display text-[48px] leading-none tracking-[.02em] text-t1">
            PARTIDOS
          </h1>
          <div className="font-mono text-label text-t3 text-right leading-relaxed">
            Mundial 2026
            <br />
            <span className="text-t2">fixture completo</span>
          </div>
        </div>
      </div>

      <PageWrapper>
        <div className="mb-5 h-[40px] bg-s1 border border-b1 rounded-lg animate-pulse" />

        <Suspense fallback={<Skeleton count={6} height="h-[72px]" />}>
          <MatchesContent status={selectedStatus} />
        </Suspense>
      </PageWrapper>
    </>
  );
}
