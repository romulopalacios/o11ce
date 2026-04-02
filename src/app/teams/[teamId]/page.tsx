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
      description: "No se encontró el perfil del equipo solicitado.",
    };
  }

  let team;
  try {
    team = await teamService.getById(parsedTeamId);
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        title: "Equipo no encontrado | O11CE",
        description: "No se encontró el perfil del equipo solicitado.",
      };
    }

    throw error;
  }

  if (!team) {
    return {
      title: "Equipo no encontrado | O11CE",
      description: "No se encontró el perfil del equipo solicitado.",
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
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
        <TeamProfile team={team} />

        <div className="flex flex-wrap gap-4">
          <Link
            href={`/compare?a=${parsedTeamId}`}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-500 border border-emerald-500/20 transition-colors hover:bg-emerald-500 hover:text-white"
          >
            Comparar con otro equipo
          </Link>
          <Link
            href="/teams"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Volver a Equipos
          </Link>
        </div>

        {teamGroup && (
          <section className="space-y-4">
            <h2 className="font-bold text-zinc-100 tracking-tight text-lg flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-blue-500" />
              Posición en el Grupo {(teamGroup.group?.replace("GROUP_", "") ?? "")}
            </h2>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-2 md:p-4 backdrop-blur-xl">
              <StandingsTable standings={[teamGroup]} />
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="font-bold text-zinc-100 tracking-tight text-lg flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-emerald-500" />
            Partidos en el Torneo
          </h2>
          
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-4 md:p-6 backdrop-blur-xl">
            {filteredMatches.length > 0 ? (
              <div className="grid gap-3">
                {filteredMatches.map((match, index) => (
                  <MatchCard key={match.id} match={match} animationDelayMs={index * 60} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 text-center">
                <p className="text-zinc-500 font-medium">No se encontraron partidos programados para este equipo.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
