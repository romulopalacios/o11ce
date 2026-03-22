import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import StandingsTable from "@/components/groups/StandingsTable";
import MatchCard from "@/components/match/MatchCard";
import TeamProfile from "@/components/teams/TeamProfile";
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
    <main className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Perfil del equipo</h1>
      </header>
      <TeamProfile team={team} />

      <div className="mt-4">
        <Link
          href={`/compare?a=${parsedTeamId}`}
          className="font-mono text-[11px] text-[var(--text2)] hover:text-[var(--accent)] transition-colors"
        >
          comparar con otro equipo →
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-mono text-[10px] font-medium tracking-[.12em] uppercase text-[var(--text3)]">
          partidos en el torneo
        </h2>

        {filteredMatches.length > 0 ? (
          <div className="space-y-2">
            {filteredMatches.map((match, index) => (
              <MatchCard key={match.id} match={match} animationDelayMs={index * 60} />
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[var(--text2)]">sin partidos registrados</p>
        )}
      </section>

      {teamGroup ? (
        <section className="mt-8">
          <h2 className="mb-3 font-mono text-[10px] font-medium tracking-[.12em] uppercase text-[var(--text3)]">
            posicion en el grupo
          </h2>
          <StandingsTable standings={[teamGroup]} />
        </section>
      ) : null}
    </main>
  );
}
