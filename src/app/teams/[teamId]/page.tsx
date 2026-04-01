import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import StandingsTable from "@/components/groups/StandingsTable";
import MatchCard from "@/components/match/MatchCard";
import TeamProfile from "@/components/teams/TeamProfile";
import { PageHero } from "@/components/ui/PageHero";
import { PageWrapper } from "@/components/ui/PageWrapper";
import * as groupService from "@/server/services/football/groupService";
import * as matchService from "@/server/services/football/matchService";
import * as teamService from "@/server/services/football/teamService";

interface TeamPageProps {
  params: Promise<{ teamId: string }>;
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof TRPCError && error.code === "NOT_FOUND";
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { teamId } = await params;
  const parsedTeamId = Number(teamId);

  if (!Number.isInteger(parsedTeamId) || parsedTeamId <= 0) {
    return {
      title: "Equipo no encontrado | O11CE",
      description: "No se encontro el perfil del equipo solicitado.",
    };
  }

  let team;
  try {
    team = await teamService.getById(parsedTeamId);
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        title: "Equipo no encontrado | O11CE",
        description: "No se encontro el perfil del equipo solicitado.",
      };
    }

    throw error;
  }

  if (!team) {
    return {
      title: "Equipo no encontrado | O11CE",
      description: "No se encontro el perfil del equipo solicitado.",
    };
  }

  return {
    title: `${team.name} | O11CE`,
    description: `Perfil del equipo ${team.name} en O11CE.`,
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { teamId } = await params;
  const parsedTeamId = Number(teamId);

  if (!Number.isInteger(parsedTeamId) || parsedTeamId <= 0) {
    notFound();
  }

  let team;
  try {
    team = await teamService.getById(parsedTeamId);
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound();
    }

    throw error;
  }

  if (!team) {
    notFound();
  }

  const teamMatches = await matchService.getAll();
  const filteredMatches = teamMatches
    .filter((match) => match.homeTeam.id === parsedTeamId || match.awayTeam.id === parsedTeamId)
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

  const standings = await groupService.getStandings();
  const teamGroup = standings.find((group) => {
    return group.table.some((row) => row.team.id === parsedTeamId);
  });

  return (
    <>
      <PageHero title="PERFIL DEL EQUIPO" subtitle="detalle de selección" meta="Mundial 2026" />

      <PageWrapper>
        <section className="section-shell stack-5 p-5 sm:p-6 lg:p-7">
          <TeamProfile team={team} />

          <div>
            <Link
              href={`/compare?a=${parsedTeamId}`}
              className="rounded-md font-mono text-[11px] tracking-[.08em] text-[var(--text2)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-navy)]"
            >
              comparar con otro equipo →
            </Link>
          </div>

          <section className="rounded-2xl border border-[var(--b2)]/55 bg-[var(--brand-navy)]/55 p-4 sm:p-5">
            <h2 className="mb-4 font-mono text-[10px] font-medium tracking-[.12em] uppercase text-[var(--text3)]">
              partidos en el torneo
            </h2>

            {filteredMatches.length > 0 ? (
              <div className="space-y-3">
                {filteredMatches.map((match, index) => (
                  <MatchCard key={match.id} match={match} animationDelayMs={index * 60} />
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[var(--text2)]">sin partidos registrados</p>
            )}
          </section>

          {teamGroup ? (
            <section className="rounded-2xl border border-[var(--b2)]/55 bg-[var(--brand-navy)]/55 p-4 sm:p-5">
              <h2 className="mb-4 font-mono text-[10px] font-medium tracking-[.12em] uppercase text-[var(--text3)]">
                posicion en el grupo
              </h2>
              <StandingsTable standings={[teamGroup]} />
            </section>
          ) : null}
        </section>
      </PageWrapper>
    </>
  );
}
