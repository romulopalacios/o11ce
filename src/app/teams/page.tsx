import type { Metadata } from "next";
import { footballAPIClient } from "@/server/services/football/client";
import { TeamListClient } from "@/components/teams/TeamListClient";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Equipos - O11CE",
  description: "Listado de equipos participantes en el torneo.",
};

export const revalidate = 86400;

export default async function TeamsPage() {
  const teamsData = await footballAPIClient.getTeams();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            Equipos Participantes
          </h1>
        </div>
        <p className="text-zinc-500 max-w-2xl text-lg">
          Navega entre todas las selecciones, descubre sus grupos y accede a su estadística detallada.
        </p>
      </header>

      <TeamListClient teams={teamsData?.teams || []} />
    </div>
  );
}

