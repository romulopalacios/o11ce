import type { Metadata } from "next";

import { TeamListClient } from "@/components/teams/TeamListClient";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import * as teamService from "@/server/services/football/teamService";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Selecciones | O11CE",
    description: "Lista de selecciones del Mundial 2026.",
  };
}

export default async function TeamsPage() {
  const allTeams = await teamService.getAll();

  return (
    <PageWrapper>
      <SectionHeader title="selecciones" />

      <section>
        <TeamListClient teams={allTeams} />
      </section>
    </PageWrapper>
  );
}
