import type { Metadata } from "next";
import { Suspense } from "react";

import StandingsTable from "@/components/groups/StandingsTable";
import EmptyState from "@/components/ui/EmptyState";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { Skeleton } from "@/components/ui/Skeleton";
import * as groupService from "@/server/services/football/groupService";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Grupos | O11CE",
    description: "Tabla de posiciones de los grupos del Mundial.",
  };
}

async function GroupsContent() {
  const standings = await groupService.getStandings();

  return (
    <>
      {standings.length === 0 ? (
        <EmptyState
          message="sin datos disponibles"
          description="Todavia no hay informacion de grupos para mostrar."
        />
      ) : (
        <StandingsTable standings={standings} />
      )}
    </>
  );
}

export default function GroupsPage() {
  return (
    <>
      <div className="border-b border-b1">
        <div className="max-w-[660px] mx-auto px-6 py-7 flex items-end justify-between">
          <h1 className="font-display text-[48px] leading-none tracking-[.02em] text-t1">
            GRUPOS
          </h1>
          <div className="font-mono text-label text-t3 text-right leading-relaxed">
            Mundial 2026
            <br />
            <span className="text-t2">12 grupos · 48 selecciones</span>
          </div>
        </div>
      </div>

      <PageWrapper>
        <Suspense
          fallback={(
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height="h-[180px]" className="mb-0" />
              ))}
            </div>
          )}
        >
          <GroupsContent />
        </Suspense>
      </PageWrapper>
    </>
  );
}
