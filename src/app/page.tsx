import type { Metadata } from "next";
import { Suspense } from "react";

import MatchCard from "@/components/match/MatchCard";
import TournamentBanner from "@/components/tournament/TournamentBanner";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import * as matchService from "@/server/services/football/matchService";
import * as tournamentService from "@/server/services/football/tournamentService";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Inicio | O11CE",
    description: "Dashboard editorial del Mundial 2026 con partidos en vivo y contexto del torneo.",
  };
}

async function LiveSection() {
  const liveMatches = await matchService.getLive();
  if (!liveMatches.length) {
    return null;
  }

  return (
    <section className="border-b border-b1">
      <div className="max-w-[660px] mx-auto px-6 py-7">
        <SectionHeader title="en vivo ahora" className="mb-3" />
        <MatchCard match={liveMatches[0]} />
      </div>
    </section>
  );
}

async function UpcomingSection() {
  const matches = await matchService.getUpcoming();

  return (
    <div>
      <SectionHeader
        title="próximos partidos"
        action={{ label: "ver todos", href: "/matches?status=SCHEDULED" }}
      />
      <div className="stagger">
        {matches.slice(0, 3).map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

async function RecentSection() {
  const matches = await matchService.getRecent();

  return (
    <div>
      <SectionHeader
        title="últimos resultados"
        action={{ label: "ver todos", href: "/matches?status=FINISHED" }}
      />
      <div className="stagger">
        {matches.slice(0, 3).map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

async function TournamentStats() {
  const context = await tournamentService.getTournamentContext();
  return <TournamentBanner {...context} />;
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <LiveSection />
      </Suspense>

      <PageWrapper className="space-y-8">
        <Suspense fallback={<div className="h-[64px] bg-s1 border border-b1 rounded-lg animate-pulse" />}>
          <TournamentStats />
        </Suspense>

        <Suspense fallback={<Skeleton count={3} height="h-[72px]" />}>
          <UpcomingSection />
        </Suspense>

        <Suspense fallback={<Skeleton count={3} height="h-[72px]" />}>
          <RecentSection />
        </Suspense>
      </PageWrapper>
    </>
  );
}
