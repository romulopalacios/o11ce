import type { Metadata } from "next";
import { Suspense } from "react";

import StandingsTable from "@/components/groups/StandingsTable";
import EmptyState from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
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
      <PageHero title="GRUPOS" subtitle="12 grupos · 48 selecciones" meta="Mundial 2026" />

      <PageWrapper>
        <section className="section-shell border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6">
          <Suspense
            fallback={(
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} height="h-[220px]" className="mb-0" />
                ))}
              </div>
            )}
          >
            <GroupsContent />
          </Suspense>
        </section>
      </PageWrapper>
    </>
  );
}
